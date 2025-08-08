import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidad | Cuponomics",
  description: "Política de privacidad y protección de datos de Cuponomics",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidad</h1>
        
        <div className="text-sm text-gray-500 mb-8">
          <strong>Fecha de última actualización:</strong> 05 de julio de 2025
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Información General</h2>
          <p className="mb-4">
            En Cuponomics, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos tu información personal cuando utilizas nuestra plataforma.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Responsable del tratamiento:</strong></p>
            <p className="text-sm">• Nombre: Cuponomics</p>
            <p className="text-sm">• Email: hello@cuponomics.app</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Información que Recopilamos</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">2.1 Información que proporcionas directamente</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Información de registro (nombre, email, contraseña)</li>
                <li>Información del perfil (nombre de usuario, foto de perfil)</li>
                <li>Información de la tienda (para merchants)</li>
                <li>Comunicaciones con nuestro equipo de soporte</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">2.2 Información recopilada automáticamente</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Datos de navegación y uso de la plataforma</li>
                <li>Información del dispositivo y navegador</li>
                <li>Dirección IP y ubicación aproximada</li>
                <li>Cookies y tecnologías similares</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Finalidad del Tratamiento</h2>
          <p className="mb-4">Utilizamos tu información para:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Proporcionar y mejorar nuestros servicios</li>
            <li>Personalizar tu experiencia en la plataforma</li>
            <li>Procesar transacciones y gestionar comisiones</li>
            <li>Enviar comunicaciones importantes sobre el servicio</li>
            <li>Cumplir con obligaciones legales y fiscales</li>
            <li>Prevenir fraudes y garantizar la seguridad</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Base Legal</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">4.1 Consentimiento</h3>
              <p>Para el envío de comunicaciones comerciales y el uso de cookies no esenciales.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">4.2 Ejecución del contrato</h3>
              <p>Para proporcionar los servicios solicitados y gestionar tu cuenta.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">4.3 Interés legítimo</h3>
              <p>Para mejorar nuestros servicios, prevenir fraudes y garantizar la seguridad.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">4.4 Cumplimiento legal</h3>
              <p>Para cumplir con obligaciones fiscales y legales aplicables.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Compartir Información</h2>
          <p className="mb-4">No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto en los siguientes casos:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Proveedores de servicios:</strong> Para procesar pagos (Stripe) y análisis web</li>
            <li><strong>Cumplimiento legal:</strong> Cuando sea requerido por ley o autoridades competentes</li>
            <li><strong>Protección de derechos:</strong> Para proteger nuestros derechos y la seguridad de otros usuarios</li>
            <li><strong>Con tu consentimiento:</strong> En casos específicos con tu autorización explícita</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Retención de Datos</h2>
          <p className="mb-4">Conservamos tu información personal durante el tiempo necesario para:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Proporcionar nuestros servicios</li>
            <li>Cumplir con obligaciones legales</li>
            <li>Resolver disputas</li>
            <li>Hacer cumplir nuestros acuerdos</li>
          </ul>
          <p className="mt-4">Los datos se eliminan de forma segura cuando ya no son necesarios.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Tus Derechos</h2>
          <p className="mb-4">Tienes los siguientes derechos sobre tus datos personales:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Acceso</h3>
              <p className="text-sm">Solicitar información sobre qué datos tenemos sobre ti</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Rectificación</h3>
              <p className="text-sm">Corregir datos inexactos o incompletos</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Eliminación</h3>
              <p className="text-sm">Solicitar la eliminación de tus datos personales</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Portabilidad</h3>
              <p className="text-sm">Recibir tus datos en formato estructurado</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Limitación</h3>
              <p className="text-sm">Limitar el procesamiento de tus datos</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Oposición</h3>
              <p className="text-sm">Oponerte al procesamiento de tus datos</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Seguridad</h2>
          <p className="mb-4">Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Encriptación de datos en tránsito y en reposo</li>
            <li>Acceso restringido a datos personales</li>
            <li>Monitoreo regular de seguridad</li>
            <li>Copias de seguridad seguras</li>
            <li>Formación del personal en protección de datos</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Cookies</h2>
          <p className="mb-4">Utilizamos cookies y tecnologías similares para:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Recordar tus preferencias</li>
            <li>Analizar el uso de la plataforma</li>
            <li>Mejorar nuestros servicios</li>
            <li>Personalizar el contenido</li>
          </ul>
          <p className="mt-4">Puedes gestionar las cookies desde la configuración de tu navegador.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Menores de Edad</h2>
          <p className="mb-4">
            Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente información personal de menores de edad. Si eres padre o tutor y crees que tu hijo nos ha proporcionado información personal, contáctanos inmediatamente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Cambios en esta Política</h2>
          <p className="mb-4">
            Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cambios significativos por email o mediante un aviso en la plataforma. Te recomendamos revisar esta política periódicamente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contacto</h2>
          <p className="mb-4">Para ejercer tus derechos o realizar consultas sobre esta política:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Email:</strong> hello@cuponomics.app</p>
            <p className="text-sm"><strong>Asunto:</strong> Política de Privacidad</p>
          </div>
        </section>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-8">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Esta política cumple con el Reglamento General de Protección de Datos (RGPD) y otras normativas de protección de datos aplicables.
          </p>
        </div>
      </div>
    </div>
  )
} 