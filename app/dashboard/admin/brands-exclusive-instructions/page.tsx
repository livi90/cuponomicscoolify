import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const unifiedScript = `<script>
(function() {
  // 1. Guardar UTM en cookie
  var utmParams = ["utm_source", "utm_medium", "utm_campaign"];
  var urlParams = new URLSearchParams(window.location.search);
  utmParams.forEach(function(param) {
    var value = urlParams.get(param);
    if (value) {
      document.cookie = param + "=" + encodeURIComponent(value) + "; path=/; max-age=" + (60*60*24*7);
    }
  });

  // 2. Función para leer cookie
  function getCookie(name) {
    return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
  }

  // 3. Función para enviar venta a Cuponomics (llamar tras la compra)
  window.sendCuponomicsSale = function({store_id, order_id, total, currency, customer_email, product_ids, product_names}) {
    var utm_source = getCookie('utm_source') || '';
    var utm_campaign = getCookie('utm_campaign') || '';
    fetch('https://cuponomics.app/api/webhooks/generic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        store_id,
        order_id,
        total,
        currency: currency || 'EUR',
        customer_email,
        utm_source,
        utm_campaign,
        coupon_code: null,
        product_ids: product_ids || [],
        product_names: product_names || [],
        platform: 'webhook-generic'
      })
    });
  }
})();
</script>`

const cookieReadExamples = `// PHP
$_COOKIE['utm_source'];

// Node/Express
req.cookies.utm_source;

// Python/Flask
request.cookies.get('utm_source')

// JavaScript (frontend)
function getCookie(name) {
  return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
}
var utmSource = getCookie('utm_source');
`

const webhookExample = `POST https://cuponomics.app/api/webhooks/generic
Content-Type: application/json

{
  "store_id": "ID_DE_TIENDA",
  "order_id": "12345",
  "total": 99.99,
  "currency": "EUR",
  "customer_email": "cliente@email.com",
  "utm_source": "cuponomics",
  "utm_campaign": "oferta40",
  "coupon_code": null,
  "product_ids": ["prod1", "prod2"],
  "product_names": ["Producto 1", "Producto 2"],
  "platform": "webhook-generic"
}`

function CopyButton(props: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      size="sm"
      className="ml-2"
      onClick={() => {
        navigator.clipboard.writeText(props.value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? "¡Copiado!" : "Copiar"}
    </Button>
  )
}

export default function BrandsExclusiveInstructionsPage() {
  const contentRef = useRef<HTMLDivElement>(null)

  const handleDownloadPDF = async () => {
    // Solo carga las librerías si se hace clic
    const jsPDF = (await import("jspdf")).jsPDF
    const html2canvas = (await import("html2canvas")).default
    const content = contentRef.current
    if (!content) return
    // Renderizar a canvas
    const canvas = await html2canvas(content, { scale: 2, backgroundColor: "#fff" })
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" })
    // Logo
    const logo = new Image()
    logo.src = "/images/Cuponomics-logo.png"
    await new Promise((res) => { logo.onload = res })
    pdf.addImage(logo, "PNG", 220, 24, 150, 50)
    // Imagen de instrucciones
    pdf.addImage(imgData, "PNG", 40, 90, 515, 700, undefined, "FAST")
    // Pie de página
    pdf.setFontSize(12)
    pdf.setTextColor("#ff6600")
    pdf.text("cuponomics.app", 260, 810)
    pdf.save("Instrucciones-Cuponomics.pdf")
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="flex items-center justify-between mb-6">
        <img src="/images/Cuponomics-logo.png" alt="Cuponomics Logo" className="h-12 mx-auto" style={{ display: "block" }} />
        <Button onClick={handleDownloadPDF} className="bg-orange-500 hover:bg-orange-600 text-white">Descargar PDF</Button>
      </div>
      <div ref={contentRef} style={{ background: "#fff", color: "#222", borderRadius: 12, padding: 24 }}>
        <h1 className="text-3xl font-bold mb-6 text-orange-600 text-center">Instrucciones para integración de tracking</h1>
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-orange-700">1. Instala este bloque en tu web</h2>
          <p className="mb-2 text-gray-700">Pega este código en el <b>&lt;head&gt;</b> o antes de <b>&lt;/body&gt;</b> en todas las páginas de tu web. Incluye el guardado de UTM y la función para enviar ventas automáticamente:</p>
          <div className="relative">
            <Textarea value={unifiedScript} readOnly rows={unifiedScript.split('\n').length} className="font-mono text-xs" />
            <CopyButton value={unifiedScript} />
          </div>
          <p className="mt-2 text-gray-600 text-sm">Cuando ocurra una venta, llama a <b>window.sendCuponomicsSale({...})</b> con los datos de la compra.</p>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-orange-700">2. Leer el valor UTM en el backend</h2>
          <p className="mb-2 text-gray-700">Ejemplos para leer la cookie <b>utm_source</b> en distintos lenguajes:</p>
          <div className="relative">
            <Textarea value={cookieReadExamples} readOnly rows={cookieReadExamples.split('\n').length} className="font-mono text-xs" />
            <CopyButton value={cookieReadExamples} />
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-orange-700">3. Enviar ventas a Cuponomics (webhook)</h2>
          <p className="mb-2 text-gray-700">Si prefieres hacerlo manualmente, haz una petición <b>POST</b> al endpoint:</p>
          <div className="mb-2"><b>https://cuponomics.app/api/webhooks/generic</b></div>
          <p className="mb-2 text-gray-700">Ejemplo de payload:</p>
          <div className="relative">
            <Textarea value={webhookExample} readOnly rows={webhookExample.split('\n').length} className="font-mono text-xs" />
            <CopyButton value={webhookExample} />
          </div>
          <p className="mt-2 text-gray-600 text-sm">Puedes automatizar este envío desde tu backend tras cada compra, o usar la función incluida en el script anterior.</p>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-orange-700">¿Dudas?</h2>
          <p className="text-gray-700">Contacta a soporte de Cuponomics para ayuda personalizada con la integración.</p>
        </section>
      </div>
    </div>
  )
}
// NOTA: Para que la descarga de PDF funcione, instala las dependencias:
// npm install jspdf html2canvas 