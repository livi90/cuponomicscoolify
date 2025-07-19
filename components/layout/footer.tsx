import Link from "next/link"
import { TermsOfServiceModal } from "@/components/legal/terms-of-service-modal"
import { MerchantTermsModal } from "@/components/legal/merchant-terms-modal"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/images/cuponomics-logo.png"
                alt="Cuponomics Logo"
                className="h-12"
                style={{ display: "block" }}
              />
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Cuponomics te ayuda a ahorrar mientras compras en línea. Compara precios, encuentra cupones y ahorra dinero automáticamente.
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:cuponomicsuppor@gmail.com"
                className="text-gray-300 hover:text-white text-sm"
              >
                cuponomicsuppor@gmail.com
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/buscar-ofertas" className="text-gray-300 hover:text-white transition-colors">
                  Buscar Ofertas
                </Link>
              </li>
              <li>
                <Link href="/productos-en-oferta" className="text-gray-300 hover:text-white transition-colors">
                  Productos en Oferta
                </Link>
              </li>
              <li>
                <Link href="/calificar-cupones" className="text-gray-300 hover:text-white transition-colors">
                  Calificar Cupones
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <TermsOfServiceModal variant="link">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    Términos de Uso
                  </span>
                </TermsOfServiceModal>
              </li>
              <li>
                <MerchantTermsModal variant="link">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    Términos para Merchants
                  </span>
                </MerchantTermsModal>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Cuponomics. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-xs">
                Hecho con ❤️ para ayudarte a ahorrar
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 