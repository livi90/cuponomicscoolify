import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export function BannerAd({ position = "top", interval = 6000 }: { position?: string, interval?: number }) {
  const [banners, setBanners] = useState<any[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    async function fetchBanners() {
      const supabase = createClient()
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .eq("position", position)
        .lte("start_date", now)
        .gte("end_date", now)
        .order("created_at", { ascending: false })
      if (!error && data && data.length > 0) setBanners(data)
    }
    fetchBanners()
  }, [position])

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, interval)
    return () => clearInterval(timer)
  }, [banners, interval])

  if (!banners.length) return null
  const banner = banners[current]

  return (
    <div className="w-full flex justify-center my-6 relative transition-all duration-500">
      <Link href={banner.link_url || "#"} target="_blank" rel="noopener" className="group w-full max-w-3xl">
        <div className="relative rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition-all flex items-center max-w-3xl mx-auto">
          <Image
            src={banner.image_url}
            alt={banner.title || "Publicidad"}
            width={600}
            height={120}
            className="object-contain w-full h-28"
            priority
          />
          {banner.title && (
            <span className="absolute bottom-2 left-4 bg-white/80 text-orange-700 font-bold px-3 py-1 rounded shadow text-sm group-hover:bg-orange-50 transition">
              {banner.title}
            </span>
          )}
        </div>
      </Link>
      {banners.length > 1 && (
        <div className="absolute right-4 bottom-2 flex gap-1">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`inline-block w-2 h-2 rounded-full ${i === current ? 'bg-orange-500' : 'bg-orange-200'} transition`}
            />
          ))}
        </div>
      )}
    </div>
  )
} 