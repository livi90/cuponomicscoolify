import { createClient } from "@/lib/supabase/server"

export default async function DebugStoresPage() {
  const supabase = await createClient()

  // Obtener el usuario actual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  // Obtener el perfil del usuario
  let profile = null
  let profileError = null
  if (user) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
    profileError = error
  }

  // Intentar obtener TODAS las tiendas (sin filtros) para ver qué hay
  const { data: allStores, error: allStoresError } = await supabase.from("stores").select("*").order("created_at")

  // Intentar obtener tiendas del usuario usando user_id
  let userStoresByUserId = null
  let userStoresByUserIdError = null
  if (user) {
    const { data, error } = await supabase.from("stores").select("*").eq("user_id", user.id).order("created_at")
    userStoresByUserId = data
    userStoresByUserIdError = error
  }

  // Intentar obtener tiendas del usuario usando owner_id
  let userStoresByOwnerId = null
  let userStoresByOwnerIdError = null
  if (user) {
    const { data, error } = await supabase.from("stores").select("*").eq("owner_id", user.id).order("created_at")
    userStoresByOwnerId = data
    userStoresByOwnerIdError = error
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Debug: Información de Tiendas</h1>

      {/* Información del Usuario */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">👤 Usuario Actual</h2>
        {userError ? (
          <p className="text-red-600">Error: {userError.message}</p>
        ) : user ? (
          <div className="space-y-1">
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Creado:</strong> {user.created_at}
            </p>
          </div>
        ) : (
          <p className="text-red-600">No hay usuario autenticado</p>
        )}
      </div>

      {/* Información del Perfil */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">📋 Perfil del Usuario</h2>
        {profileError ? (
          <p className="text-red-600">Error: {profileError.message}</p>
        ) : profile ? (
          <div className="space-y-1">
            <p>
              <strong>ID:</strong> {profile.id}
            </p>
            <p>
              <strong>Rol:</strong> {profile.role}
            </p>
            <p>
              <strong>Nombre:</strong> {profile.full_name || "No definido"}
            </p>
          </div>
        ) : (
          <p className="text-gray-600">No se encontró perfil</p>
        )}
      </div>

      {/* Todas las Tiendas */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">🏪 Todas las Tiendas en la Base de Datos</h2>
        {allStoresError ? (
          <p className="text-red-600">Error: {allStoresError.message}</p>
        ) : allStores && allStores.length > 0 ? (
          <div className="space-y-2">
            <p>
              <strong>Total de tiendas:</strong> {allStores.length}
            </p>
            {allStores.map((store, index) => (
              <div key={store.id} className="bg-white p-2 rounded border">
                <p>
                  <strong>
                    #{index + 1} - {store.name}
                  </strong>
                </p>
                <p>ID: {store.id}</p>
                <p>User ID: {store.user_id}</p>
                <p>Owner ID: {store.owner_id}</p>
                <p>Activa: {store.is_active ? "Sí" : "No"}</p>
                <p>Creada: {store.created_at}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No hay tiendas en la base de datos</p>
        )}
      </div>

      {/* Tiendas por user_id */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">🔍 Tiendas por user_id</h2>
        {userStoresByUserIdError ? (
          <p className="text-red-600">Error: {userStoresByUserIdError.message}</p>
        ) : userStoresByUserId && userStoresByUserId.length > 0 ? (
          <div className="space-y-2">
            <p>
              <strong>Tiendas encontradas:</strong> {userStoresByUserId.length}
            </p>
            {userStoresByUserId.map((store, index) => (
              <div key={store.id} className="bg-white p-2 rounded border">
                <p>
                  <strong>{store.name}</strong>
                </p>
                <p>ID: {store.id}</p>
                <p>Activa: {store.is_active ? "Sí" : "No"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No se encontraron tiendas usando user_id</p>
        )}
      </div>

      {/* Tiendas por owner_id */}
      <div className="bg-orange-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">🔍 Tiendas por owner_id</h2>
        {userStoresByOwnerIdError ? (
          <p className="text-red-600">Error: {userStoresByOwnerIdError.message}</p>
        ) : userStoresByOwnerId && userStoresByOwnerId.length > 0 ? (
          <div className="space-y-2">
            <p>
              <strong>Tiendas encontradas:</strong> {userStoresByOwnerId.length}
            </p>
            {userStoresByOwnerId.map((store, index) => (
              <div key={store.id} className="bg-white p-2 rounded border">
                <p>
                  <strong>{store.name}</strong>
                </p>
                <p>ID: {store.id}</p>
                <p>Activa: {store.is_active ? "Sí" : "No"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No se encontraron tiendas usando owner_id</p>
        )}
      </div>
    </div>
  )
}
