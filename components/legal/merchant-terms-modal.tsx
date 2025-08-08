"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Store, AlertTriangle } from "lucide-react"

interface MerchantTermsModalProps {
  children: React.ReactNode
  variant?: "button" | "link"
}

export function MerchantTermsModal({ children, variant = "link" }: MerchantTermsModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "button" ? (
          <Button variant="outline" size="sm" className="text-xs">
            <Store className="h-3 w-3 mr-1" />
            Ver Términos Merchant
          </Button>
        ) : (
          <button className="text-orange-600 hover:text-orange-700 text-xs underline flex items-center gap-1">
            <Store className="h-3 w-3" />
            Términos para Merchants
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Términos de Uso para Merchants - Cuponomics
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <div className="text-xs text-gray-500 mb-4">
              <strong>Fecha de última actualización:</strong> 05 de julio de 2025
            </div>

            <section>
              <h3 className="font-semibold text-base mb-2">1. INFORMACIÓN GENERAL</h3>
              <p className="text-gray-700 mb-2">
                Estos términos rigen específicamente la relación con usuarios que operan como "Merchants" en la plataforma Cuponomics, quienes tienen la capacidad de crear tiendas, agregar ofertas, acceder a métricas y gestionar comisiones.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm"><strong>Datos del titular:</strong></p>
                <p className="text-sm">• Nombre: Cuponomics</p>
                <p className="text-sm">• Email de contacto: hello@cuponomics.app</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. DEFINICIÓN DE MERCHANT</h3>
              <p className="text-gray-700 mb-2">
                Un "Merchant" es un usuario comercial que:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Crea y gestiona una tienda virtual en nuestra plataforma</li>
                <li>Publica ofertas, cupones y promociones</li>
                <li>Accede a métricas y estadísticas de rendimiento</li>
                <li>Participa en el programa de comisiones de la plataforma</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. REGISTRO Y VERIFICACIÓN</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">3.1 Requisitos de registro</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Proporcionar información básica del negocio</li>
                    <li>Verificar identidad mediante email y datos de contacto</li>
                    <li>Aceptar estos términos específicos para merchants</li>
                    <li>Cumplir con todos los requisitos legales aplicables</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">3.2 Documentación requerida</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Información básica del negocio (nombre, descripción, categoría)</li>
                    <li>Datos de contacto actualizados</li>
                    <li>Configuración de cuenta Stripe para procesamiento de pagos</li>
                    <li><strong>Nos reservamos el derecho a solicitar documentación adicional</strong> (registro mercantil, licencias comerciales, identificación fiscal, etc.) cuando sea requerido</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. FUNCIONALIDADES DISPONIBLES</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">4.1 Funcionalidades gratuitas</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Creación de tienda básica</li>
                    <li>Publicación de hasta 20 productos en oferta</li>
                    <li>Acceso a métricas básicas de rendimiento</li>
                    <li>Gestión de cupones y promociones</li>
                    <li>Panel de control merchant</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">4.2 Funcionalidades de suscripción</h4>
                  <p className="text-gray-700 text-xs mb-2">
                    Tras superar los 20 productos en oferta activos, se requerirá una suscripción que incluirá:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Productos ilimitados en oferta</li>
                    <li>Métricas avanzadas y reportes detallados</li>
                    <li>Herramientas de promoción premium</li>
                    <li>Soporte prioritario</li>
                    <li>Funcionalidades adicionales que se desarrollen</li>
                  </ul>
                  <p className="text-gray-700 text-xs mt-2">
                    <strong>Precio de suscripción:</strong> El valor será determinado por la plataforma y comunicado oportunamente.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. SISTEMA DE COMISIONES</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">5.1 Comisión estándar</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li><strong>Comisión base:</strong> 5% del valor de cada venta generada a través de nuestra plataforma</li>
                    <li>Las comisiones se calculan sobre el precio final pagado por el consumidor</li>
                    <li>Incluye todas las ventas rastreables mediante nuestros sistemas</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">5.2 Comisiones especiales (superiores al 5%)</h4>
                  <p className="text-gray-700 text-xs mb-2">
                    La comisión podrá incrementarse en los siguientes casos:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li><strong>Productos de alto valor:</strong> Artículos con valor superior a [cantidad], donde se aplicará un 7%</li>
                    <li><strong>Categorías premium:</strong> Productos de lujo, electrónicos de gama alta, joyería (8%)</li>
                    <li><strong>Promociones especiales:</strong> Durante campañas específicas acordadas (6-10%)</li>
                    <li><strong>Servicios digitales:</strong> Software, suscripciones, cursos online (7%)</li>
                    <li><strong>Productos con márgenes altos:</strong> Artículos con margen superior al 50% (6-8%)</li>
                    <li><strong>Temporadas especiales:</strong> Black Friday, Navidad, rebajas (7%)</li>
                    <li><strong>Merchants nuevos:</strong> Comisión promocional del 6% durante los primeros 3 meses</li>
                    <li><strong>Volumen bajo:</strong> Merchants con menos de 10 ventas mensuales (7%)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">5.3 Procesamiento de pagos</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Los pagos de comisiones se procesan a través de Stripe</li>
                    <li>Las comisiones se deducen automáticamente de las ventas procesadas</li>
                    <li>Stripe maneja el cumplimiento fiscal y la documentación requerida</li>
                    <li>Los merchants deben mantener una cuenta Stripe activa y en regla</li>
                    <li>Frecuencia de pago según la configuración de Stripe del merchant</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">6. OBLIGACIONES DEL MERCHANT</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">6.1 Contenido y ofertas</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Garantizar la veracidad y legalidad de todas las ofertas</li>
                    <li>Mantener actualizados precios y disponibilidad</li>
                    <li>Cumplir con los términos de las promociones publicadas</li>
                    <li>Proporcionar información clara sobre productos y servicios</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">6.2 Cumplimiento legal</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Cumplir con toda la normativa de protección al consumidor</li>
                    <li>Mantener cuenta Stripe activa y cumplir con sus términos</li>
                    <li>Respetar las políticas de devolución y garantía</li>
                    <li>Cumplir con la normativa de protección de datos</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">6.3 Calidad del servicio</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Mantener estándares de calidad en atención al cliente</li>
                    <li>Procesar pedidos en tiempos razonables</li>
                    <li>Resolver disputas de manera profesional</li>
                    <li>Mantener comunicación fluida con la plataforma</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">7. MÉTRICAS Y REPORTES</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">7.1 Métricas disponibles</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Número de visitas y clicks</li>
                    <li>Conversiones y ventas generadas</li>
                    <li>Ingresos y comisiones pendientes</li>
                    <li>Rendimiento por producto/oferta</li>
                    <li>Estadísticas de audiencia</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">7.2 Acceso a datos</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Panel de control en tiempo real</li>
                    <li>Reportes mensuales detallados</li>
                    <li>Exportación de datos (funcionalidad premium)</li>
                    <li>Análisis comparativo (suscripción requerida)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">8. USO DE MARCAS, LOGOS Y DISTINTIVOS</h3>
              <p className="text-gray-700 mb-2">
                Al utilizar la plataforma Cuponomics, el Merchant autoriza expresamente a Cuponomics a mostrar, reproducir y utilizar los nombres comerciales, marcas, logotipos, imágenes y demás distintivos asociados a su tienda o negocio, con el único fin de promocionar, identificar y dar visibilidad a sus ofertas, cupones y productos dentro de la plataforma y en acciones de marketing relacionadas.
              </p>
              <p className="text-gray-700 mb-2">
                El Merchant declara ser titular legítimo de los derechos sobre dichos distintivos y asume toda responsabilidad frente a cualquier reclamación, conflicto o consecuencia derivada de su uso autorizado en la plataforma. Cuponomics no será responsable por el uso de marcas o elementos proporcionados por el Merchant que infrinjan derechos de terceros.
              </p>
              <p className="text-gray-700 mb-2">
                El uso de la plataforma implica la aceptación automática de esta autorización, sin que sea necesario un consentimiento adicional.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">8. POLÍTICA DE CONTENIDO</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">8.1 Contenido prohibido</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Productos ilegales o no autorizados</li>
                    <li>Contenido engañoso o fraudulento</li>
                    <li>Ofertas que no puedan cumplirse</li>
                    <li>Material que infrinja derechos de autor</li>
                    <li>Productos peligrosos o restringidos</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">8.2 Moderación</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Nos reservamos el derecho de revisar y moderar contenido</li>
                    <li>Podemos rechazar o eliminar ofertas que no cumplan estándares</li>
                    <li>Suspensión temporal o permanente por violaciones graves</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">9. TERMINACIÓN Y SUSPENSIÓN</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">9.1 Causas de terminación</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Incumplimiento de estos términos</li>
                    <li>Actividades fraudulentas o ilegales</li>
                    <li>Suspensión o cierre de cuenta Stripe</li>
                    <li>Violación de políticas de contenido</li>
                    <li>Negativa a proporcionar documentación adicional cuando sea requerida</li>
                    <li>Decisión comercial unilateral</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">9.2 Efectos de la terminación</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Cesación inmediata de servicios</li>
                    <li>Liquidación de comisiones pendientes</li>
                    <li>Eliminación de contenido de la plataforma</li>
                    <li>Conservación de datos según obligaciones legales</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">10. MODIFICACIONES DE TÉRMINOS</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">10.1 Derecho a modificar</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Nos reservamos el derecho de modificar estos términos</li>
                    <li>Cambios en comisiones, precios de suscripción y funcionalidades</li>
                    <li>Modificaciones en requisitos de documentación y verificación</li>
                    <li>Ajustes por requerimientos legales, normativos o comerciales</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">10.2 Notificación de cambios</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li><strong>Aviso previo:</strong> Mínimo 30 días antes de la entrada en vigor</li>
                    <li>Notificación por email y panel de merchant</li>
                    <li>Publicación en la plataforma con destacado</li>
                    <li>Derecho a terminar la relación si no se acepta la modificación</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">11. LIMITACIÓN DE RESPONSABILIDAD</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">11.1 Disponibilidad del servicio</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>No garantizamos disponibilidad 24/7 del servicio</li>
                    <li>Mantenimientos programados serán notificados</li>
                    <li>No nos responsabilizamos por pérdidas durante interrupciones</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">11.2 Rendimiento de ventas</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>No garantizamos volumen específico de ventas</li>
                    <li>Los resultados dependen de múltiples factores</li>
                    <li>No asumimos responsabilidad por expectativas no cumplidas</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">12. PROPIEDAD INTELECTUAL</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">12.1 Licencia de uso</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Los merchants otorgan licencia para usar su contenido en la plataforma</li>
                    <li>Derecho a mostrar logos, imágenes y descripciones</li>
                    <li>Uso limitado a la operación de la plataforma</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">12.2 Protección de marca</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Respeto mutuo de marcas registradas</li>
                    <li>Prohibición de uso no autorizado de marcas</li>
                    <li>Notificación inmediata de infracciones</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">13. PROTECCIÓN DE DATOS</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">13.1 Datos del merchant</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Tratamiento conforme al RGPD</li>
                    <li>Uso limitado a la operación comercial</li>
                    <li>Derecho a acceso, rectificación y eliminación</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">13.2 Datos de clientes</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Responsabilidad compartida en el tratamiento</li>
                    <li>Cumplimiento de normativas de protección de datos</li>
                    <li>Medidas de seguridad apropiadas</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">14. RESOLUCIÓN DE DISPUTAS</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">14.1 Procedimiento</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Notificación por escrito de la disputa</li>
                    <li>Período de negociación de 30 días</li>
                    <li>Mediación antes de procedimientos legales</li>
                    <li>Jurisdicción de tribunales españoles</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">14.2 Legislación aplicable</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Normativa española para relaciones comerciales</li>
                    <li>Legislación europea cuando sea aplicable</li>
                    <li>Tratados internacionales de comercio electrónico</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">15. CONTACTO Y SOPORTE</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">15.1 Merchant Support</h4>
                  <p className="text-gray-700 text-xs">Email: hello@cuponomics.app</p>
                  <p className="text-gray-700 text-xs">Para consultas generales y soporte técnico</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">15.2 Departamento Financiero</h4>
                  <p className="text-gray-700 text-xs">Email: hello@cuponomics.app</p>
                  <p className="text-gray-700 text-xs">Para consultas sobre comisiones y pagos</p>
                </div>
              </div>
            </section>

            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mt-6">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-semibold text-center text-orange-800">
                  Al registrarse como Merchant en Cuponomics, confirma que ha leído, entendido y aceptado estos Términos de Uso específicos para Merchants en su totalidad.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 