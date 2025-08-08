"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, ExternalLink } from "lucide-react"

interface TermsOfServiceModalProps {
  children: React.ReactNode
  variant?: "button" | "link"
}

export function TermsOfServiceModal({ children, variant = "link" }: TermsOfServiceModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "button" ? (
          <Button variant="outline" size="sm" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            Ver Términos
          </Button>
        ) : (
          <button className="text-orange-600 hover:text-orange-700 text-xs underline flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Términos de Uso
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Términos de Uso de Cuponomics
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
                Bienvenido a Cuponomics, una aplicación web y extensión de Chrome que proporciona ofertas, cupones y descuentos. Al utilizar nuestros servicios, aceptas estar sujeto a estos Términos de Uso.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm"><strong>Datos del titular:</strong></p>
                <p className="text-sm">• Nombre: Cuponomics</p>
                <p className="text-sm">• Email de contacto: hello@cuponomics.app</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. DESCRIPCIÓN DEL SERVICIO</h3>
              <p className="text-gray-700 mb-2">
                Cuponomics es una plataforma que:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Recopila y comparte ofertas, cupones y descuentos de diversos comerciantes</li>
                <li>Proporciona enlaces a ofertas de terceros</li>
                <li>Ofrece una extensión de navegador para facilitar el acceso a cupones</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. PROGRAMAS DE AFILIACIÓN</h3>
              <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                <p className="text-sm font-semibold text-orange-800 mb-2">DIVULGACIÓN IMPORTANTE:</p>
                <p className="text-sm text-orange-700">
                  Algunos cupones, ofertas y enlaces presentes en nuestra plataforma están vinculados a programas de afiliación. Esto significa que podemos recibir una comisión cuando realizas una compra a través de nuestros enlaces afiliados.
                </p>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
                <li>Esta monetización nos permite mantener el servicio gratuito para todos los usuarios</li>
                <li>Los precios de los productos no se ven afectados por el uso de nuestros enlaces</li>
                <li>Mantenemos transparencia total sobre nuestras relaciones comerciales</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. CONDICIONES DE USO</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">4.1 Uso Permitido</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Utilizar el servicio para fines personales y no comerciales</li>
                    <li>Acceder a ofertas y cupones disponibles públicamente</li>
                    <li>Instalar y usar la extensión de Chrome conforme a su funcionalidad</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">4.2 Uso Prohibido</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Utilizar el servicio para actividades ilegales o fraudulentas</li>
                    <li>Intentar acceder a áreas restringidas de la plataforma</li>
                    <li>Realizar ingeniería inversa del software</li>
                    <li>Utilizar bots o scripts automatizados sin autorización</li>
                    <li>Revender o redistribuir nuestro contenido sin permiso</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. RECOPILACIÓN Y TRATAMIENTO DE DATOS</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">5.1 Información que recopilamos</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Datos de navegación y uso de la plataforma</li>
                    <li>Métricas de conversión y efectividad de ofertas</li>
                    <li>Información técnica del dispositivo y navegador</li>
                    <li>Cookies y tecnologías similares</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">5.2 Finalidad del tratamiento</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Medir métricas de conversión y rendimiento</li>
                    <li>Mejorar la experiencia del usuario</li>
                    <li>Personalizar el contenido mostrado</li>
                    <li>Cumplir con obligaciones legales y fiscales</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">6. LIMITACIÓN DE RESPONSABILIDAD</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">6.1 Disponibilidad de ofertas</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>No garantizamos la disponibilidad permanente de ofertas</li>
                    <li>Los comerciantes pueden modificar o cancelar ofertas sin previo aviso</li>
                    <li>No somos responsables de disputas con comerciantes terceros</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">6.2 Exactitud de la información</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-xs">
                    <li>Nos esforzamos por mantener información actualizada</li>
                    <li>No garantizamos la exactitud absoluta de todas las ofertas</li>
                    <li>Los usuarios deben verificar términos y condiciones en el sitio del comerciante</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">7. PROPIEDAD INTELECTUAL</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Todos los derechos de propiedad intelectual de Cuponomics nos pertenecen</li>
                <li>Los usuarios no pueden reproducir, distribuir o modificar nuestro contenido</li>
                <li>Respetamos los derechos de propiedad intelectual de terceros</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">8. TERMINACIÓN DEL SERVICIO</h3>
              <p className="text-gray-700 mb-2">
                Podemos suspender o terminar el acceso al servicio:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Por violación de estos términos</li>
                <li>Por actividades fraudulentas o ilegales</li>
                <li>Por razones técnicas o comerciales</li>
                <li>Sin previo aviso en casos graves</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">9. MODIFICACIONES</h3>
              <p className="text-gray-700">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor tras su publicación en la plataforma. El uso continuado del servicio implica la aceptación de los términos modificados.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">10. LEGISLACIÓN APLICABLE</h3>
              <p className="text-gray-700">
                Estos términos se rigen por la legislación española. Para cualquier disputa, se someterán a la jurisdicción de los tribunales españoles.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">11. CONTACTO</h3>
              <p className="text-gray-700">
                Para cualquier consulta sobre estos términos:
              </p>
              <p className="text-gray-700 font-medium">Email: hello@cuponomics.app</p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">12. DISPOSICIONES ADICIONALES</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">12.1 Menores de edad</h4>
                  <p className="text-gray-700 text-xs">
                    El servicio está dirigido a mayores de 18 años. Los menores de edad deben contar con supervisión parental.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">12.2 Separabilidad</h4>
                  <p className="text-gray-700 text-xs">
                    Si alguna disposición de estos términos fuera inválida, el resto mantendrá su validez.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">12.3 Idioma</h4>
                  <p className="text-gray-700 text-xs">
                    En caso de conflicto entre versiones en diferentes idiomas, prevalecerá la versión en español.
                  </p>
                </div>
              </div>
            </section>

            <div className="bg-gray-50 p-4 rounded-lg border mt-6">
              <p className="text-sm font-semibold text-center text-gray-800">
                Al utilizar Cuponomics, confirmas que has leído, entendido y aceptado estos Términos de Uso en su totalidad.
              </p>
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