import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Cookies | Cuponomics",
  description: "Política de cookies y tecnologías de seguimiento de Cuponomics",
}

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-8">Política de Cookies</h1>
        
        <div className="text-sm text-gray-500 mb-8">
          <strong>Fecha de última actualización:</strong> 05 de julio de 2025
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. ¿Qué son las Cookies?</h2>
          <p className="mb-4">
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Estas cookies nos ayudan a mejorar tu experiencia, recordar tus preferencias y analizar cómo utilizas nuestra plataforma.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Tipos de Cookies que Utilizamos</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-3">2.1 Cookies Esenciales</h3>
              <p className="mb-2">Estas cookies son necesarias para el funcionamiento básico de la plataforma:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Autenticación:</strong> Para mantener tu sesión activa</li>
                <li><strong>Seguridad:</strong> Para proteger contra ataques y fraudes</li>
                <li><strong>Funcionalidad:</strong> Para recordar tus preferencias básicas</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">No puedes desactivar estas cookies sin afectar la funcionalidad del sitio.</p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3">2.2 Cookies de Rendimiento</h3>
              <p className="mb-2">Nos ayudan a entender cómo utilizas la plataforma:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Google Analytics:</strong> Para analizar el tráfico y uso del sitio</li>
                <li><strong>Métricas internas:</strong> Para medir la efectividad de ofertas y cupones</li>
                <li><strong>Optimización:</strong> Para mejorar la velocidad y rendimiento</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3">2.3 Cookies de Funcionalidad</h3>
              <p className="mb-2">Mejoran tu experiencia recordando tus preferencias:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Idioma:</strong> Para recordar tu idioma preferido</li>
                <li><strong>Tema:</strong> Para recordar si prefieres modo claro u oscuro</li>
                <li><strong>Filtros:</strong> Para recordar tus filtros de búsqueda</li>
                <li><strong>Favoritos:</strong> Para recordar tus cupones favoritos</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3">2.4 Cookies de Marketing</h3>
              <p className="mb-2">Se utilizan para mostrar contenido relevante:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Publicidad:</strong> Para mostrar ofertas relevantes</li>
                <li><strong>Retargeting:</strong> Para recordar productos que te interesan</li>
                <li><strong>Redes sociales:</strong> Para integración con plataformas sociales</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Cookies de Terceros</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">3.1 Google Analytics</h3>
              <p className="text-sm mb-2">Utilizamos Google Analytics para analizar el uso de nuestra plataforma:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Páginas más visitadas</li>
                <li>Tiempo de permanencia</li>
                <li>Fuentes de tráfico</li>
                <li>Comportamiento del usuario</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">3.2 Stripe</h3>
              <p className="text-sm mb-2">Para procesar pagos de comisiones a merchants:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Seguridad en transacciones</li>
                <li>Prevención de fraudes</li>
                <li>Gestión de pagos</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">3.3 Redes Sociales</h3>
              <p className="text-sm mb-2">Para compartir contenido y conectar con redes sociales:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Botones de compartir</li>
                <li>Inicio de sesión social</li>
                <li>Integración de feeds</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Duración de las Cookies</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">4.1 Cookies de Sesión</h3>
              <p className="text-sm">Se eliminan automáticamente cuando cierras el navegador.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">4.2 Cookies Persistentes</h3>
              <p className="text-sm">Permanecen en tu dispositivo hasta que las elimines o expiren:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li><strong>Preferencias:</strong> Hasta 1 año</li>
                <li><strong>Analytics:</strong> Hasta 2 años</li>
                <li><strong>Marketing:</strong> Hasta 90 días</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Gestión de Cookies</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">5.1 Configuración del Navegador</h3>
              <p className="text-sm mb-2">Puedes gestionar las cookies desde la configuración de tu navegador:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
                <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
                <li><strong>Edge:</strong> Configuración → Cookies y permisos del sitio</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">5.2 Panel de Control</h3>
              <p className="text-sm">Próximamente implementaremos un panel de control de cookies en nuestra plataforma para que puedas gestionar tus preferencias de forma más fácil.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Efectos de Desactivar Cookies</h2>
          <p className="mb-4">Si desactivas ciertas cookies, algunas funcionalidades pueden no funcionar correctamente:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Es posible que tengas que volver a iniciar sesión en cada visita</li>
            <li>No podremos recordar tus preferencias de idioma o tema</li>
            <li>Algunas ofertas personalizadas pueden no mostrarse</li>
            <li>Las métricas de rendimiento pueden verse afectadas</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Actualizaciones de esta Política</h2>
          <p className="mb-4">
            Esta Política de Cookies puede actualizarse ocasionalmente para reflejar cambios en nuestras prácticas o por razones legales. Te notificaremos sobre cambios significativos mediante un aviso en la plataforma.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contacto</h2>
          <p className="mb-4">Para consultas sobre esta Política de Cookies:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Email:</strong> cuponomicsuppor@gmail.com</p>
            <p className="text-sm"><strong>Asunto:</strong> Política de Cookies</p>
          </div>
        </section>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-8">
          <p className="text-sm text-green-800">
            <strong>Consejo:</strong> Te recomendamos mantener habilitadas las cookies esenciales para disfrutar de la mejor experiencia en Cuponomics.
          </p>
        </div>
      </div>
    </div>
  )
} 