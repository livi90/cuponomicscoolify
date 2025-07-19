import { StorageTest } from "@/components/storage-test"

export default function TestStoragePage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Prueba de almacenamiento en Supabase</h1>
      <StorageTest />
    </div>
  )
}
