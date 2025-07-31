import { redirect } from "next/navigation";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { cookies } from "next/headers";

type PageView = {
  path: string;
  country: string;
  created_at: string;
};

function groupBy(arr: PageView[], key: keyof PageView) {
  return arr.reduce((acc: Record<string, number>, item: PageView) => {
    const k = item[key] || 'Desconocido';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

function groupByDay(arr: PageView[]) {
  return arr.reduce((acc: Record<string, number>, item: PageView) => {
    const date = item.created_at?.slice(0, 10) || 'Desconocido';
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
}

async function getAnalytics(supabase: any, { from, to, page }: { from?: string; to?: string; page?: string }) {
  let query = supabase
    .from('page_views')
    .select('path, country, created_at', { count: 'exact' });
  if (from) query = query.gte('created_at', from);
  if (to) query = query.lte('created_at', to + 'T23:59:59');
  if (page) query = query.eq('path', page);
  const { data: all, count: total } = await query;
  const byPage = groupBy((all as PageView[]) || [], 'path');
  const byCountry = groupBy((all as PageView[]) || [], 'country');
  const byDay = groupByDay((all as PageView[]) || []);
  return { total, byPage, byCountry, byDay };
}

export default async function AdminAnalyticsPage({ searchParams }: { searchParams?: Promise<{ from?: string; to?: string; page?: string }> }) {
  // Protección de ruta solo para admins
  const cookieStore = cookies();
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/dashboard/admin/analytics");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  // Filtros
  const resolvedSearchParams = await searchParams;
  const from = resolvedSearchParams?.from;
  const to = resolvedSearchParams?.to;
  const pageFilter = resolvedSearchParams?.page;

  // Obtener analytics con filtros
  const { total, byPage, byCountry, byDay } = await getAnalytics(supabase, { from, to, page: pageFilter });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Analytics de visitas</h1>
      {/* Filtros */}
      <form className="mb-6 flex gap-4" method="get">
        <div>
          <label className="block text-sm">Desde</label>
          <input type="date" name="from" defaultValue={from} className="border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm">Hasta</label>
          <input type="date" name="to" defaultValue={to} className="border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm">Página</label>
          <input type="text" name="page" placeholder="/ruta" defaultValue={pageFilter} className="border rounded px-2 py-1" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded self-end">Filtrar</button>
      </form>
      {/* ... tablas de analytics ... */}
      <div className="mb-6">Total de visitas: <b>{total}</b></div>
      <h2 className="font-semibold mt-4 mb-2">Visitas por página</h2>
      <table className="mb-4"><tbody>
        {Object.entries(byPage).map(([path, count]) => (
          <tr key={String(path)}><td>{String(path)}</td><td>{Number(count)}</td></tr>
        ))}
      </tbody></table>
      <h2 className="font-semibold mt-4 mb-2">Visitas por país</h2>
      <table className="mb-4"><tbody>
        {Object.entries(byCountry).map(([country, count]) => (
          <tr key={String(country)}><td>{String(country)}</td><td>{Number(count)}</td></tr>
        ))}
      </tbody></table>
      <h2 className="font-semibold mt-4 mb-2">Visitas por día</h2>
      <table><tbody>
        {Object.entries(byDay).map(([date, count]) => (
          <tr key={String(date)}><td>{String(date)}</td><td>{Number(count)}</td></tr>
        ))}
      </tbody></table>
    </div>
  );
}
