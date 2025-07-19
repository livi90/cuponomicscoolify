"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function StorageTest() {
  const [productImage, setProductImage] = useState("")
  const [storeImage, setStoreImage] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [publicImage, setPublicImage] = useState("")

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Prueba de almacenamiento</CardTitle>
        <CardDescription>Prueba la funcionalidad de carga de imágenes en diferentes buckets</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="products">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="stores">Tiendas</TabsTrigger>
            <TabsTrigger value="profiles">Perfiles</TabsTrigger>
            <TabsTrigger value="public">Público</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ImageUpload value={productImage} onChange={setProductImage} bucket="products" label="Imagen de producto" />
          </TabsContent>

          <TabsContent value="stores">
            <ImageUpload value={storeImage} onChange={setStoreImage} bucket="stores" label="Logo de tienda" />
          </TabsContent>

          <TabsContent value="profiles">
            <ImageUpload value={profileImage} onChange={setProfileImage} bucket="profiles" label="Foto de perfil" />
          </TabsContent>

          <TabsContent value="public">
            <ImageUpload value={publicImage} onChange={setPublicImage} bucket="public" label="Imagen pública" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
