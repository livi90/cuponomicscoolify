export interface EcommercePlatform {
  id: string
  name: string
  description: string
  instructions: string[]
  additionalNotes?: string[]
}

export const ECOMMERCE_PLATFORMS: EcommercePlatform[] = [
  {
    id: "shopify",
    name: "Shopify",
    description: "Instalación recomendada para tiendas en Shopify usando Web Pixels.",
    instructions: [
      "Copia el código del script que se muestra.",
      "En tu panel de Shopify, ve a 'Configuración' en la esquina inferior izquierda.",
      "En el menú lateral, haz clic en 'Eventos de cliente'.",
      "Haz clic en el botón 'Añadir píxel personalizado'.",
      "Dale un nombre a tu píxel, por ejemplo, 'Cuponomics Tracking'.",
      "Pega el código completo en el campo de código.",
      "Haz clic en 'Guardar' y luego asegúrate de hacer clic en 'Conectar' en la esquina superior derecha.",
    ],
    additionalNotes: [
      "Este método es el recomendado oficialmente por Shopify para el seguimiento de conversiones.",
      "El script se ejecuta en un entorno seguro que no puede afectar el rendimiento de tu checkout.",
      "El seguimiento de la conversión se activará automáticamente cada vez que un cliente complete una compra.",
    ],
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "Tienda en WordPress con WooCommerce",
    instructions: [
      "Accede al panel de administración de WordPress",
      "Ve a 'Apariencia' > 'Editor de temas'",
      "Abre el archivo 'functions.php' de tu tema activo",
      "Pega el código al final del archivo",
      "Guarda los cambios",
    ],
    additionalNotes: [
      "Alternativamente, puedes usar un plugin como 'Insert Headers and Footers'",
      "Haz una copia de seguridad antes de editar archivos del tema",
      "Si actualizas el tema, deberás volver a agregar el código",
    ],
  },
  {
    id: "magento",
    name: "Magento",
    description: "Tienda en Magento",
    instructions: [
      "Accede al panel de administración de Magento",
      "Ve a 'Contenido' > 'Configuración' > 'HTML Head'",
      "Pega el código en el campo 'Scripts y hojas de estilo'",
      "Guarda la configuración",
      "Limpia la caché desde 'Sistema' > 'Gestión de caché'",
    ],
    additionalNotes: [
      "El script se aplicará a todas las páginas de la tienda",
      "Asegúrate de limpiar la caché después de los cambios",
    ],
  },
  {
    id: "prestashop",
    name: "PrestaShop",
    description: "Tienda en PrestaShop",
    instructions: [
      "Ve al panel de administración de PrestaShop",
      "Navega a 'Módulos' > 'Gestión de módulos'",
      "Busca e instala el módulo 'Custom Code'",
      "Configura el módulo y pega el código",
      "Activa el módulo para aplicar los cambios",
    ],
  },
  {
    id: "bigcommerce",
    name: "BigCommerce",
    description: "Tienda en BigCommerce",
    instructions: [
      "Accede a tu panel de control de BigCommerce",
      "Ve a 'Storefront' > 'Script Manager'",
      "Haz clic en 'Create a Script'",
      "Selecciona 'Footer' como ubicación",
      "Pega el código y guarda",
    ],
  },
  {
    id: "opencart",
    name: "OpenCart",
    description: "Tienda en OpenCart",
    instructions: [
      "Accede al panel de administración de OpenCart",
      "Ve a 'Sistema' > 'Configuración'",
      "Edita tu tienda",
      "En la pestaña 'Servidor', busca 'Google Analytics'",
      "Pega el código en el campo correspondiente",
    ],
  },
  {
    id: "custom",
    name: "Sitio Web Personalizado",
    description: "Sitio web desarrollado a medida",
    instructions: [
      "Abre el archivo HTML de tu página de checkout/confirmación",
      "Pega el código antes de la etiqueta </body>",
      "Sube el archivo modificado a tu servidor",
      "Verifica que el script se carga correctamente",
    ],
    additionalNotes: [
      "Si usas un CMS personalizado, contacta a tu desarrollador",
      "El script debe ejecutarse después de completar una compra",
    ],
  },
]

export class TrackingScriptGenerator {
  static generateScript(storeId: string, pixelId: string, platform: string): string {
    const apiUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || "https://cuponomics.app";
    if (platform === "shopify") {
      // Usar el nuevo método de Shopify Web Pixels
      return `
// --- Cuponomics Shopify Web Pixel ---
// Instrucciones:
// 1. En tu panel de Shopify, ve a "Configuración" > "Eventos de cliente".
// 2. Haz clic en "Añadir píxel personalizado".
// 3. Dale un nombre (ej. "Cuponomics Tracking") y pega TODO este código.
// 4. Haz clic en "Guardar" y luego en "Conectar".

analytics.subscribe('checkout_completed', (event) => {
  const { checkout } = event.data;

  // Extraer el código del cupón de los descuentos aplicados
  const discountCode = checkout.discountApplications
    ?.find(app => app.type === 'DISCOUNT_CODE')
    ?.title;

  const orderData = {
    pixel_id: '${pixelId}',
    order_id: checkout.order.id,
    conversion_value: parseFloat(checkout.totalPrice.amount),
    currency: checkout.totalPrice.currencyCode,
    coupon_code: discountCode || null,
    customer_id: checkout.order.customer.id || null,
    product_ids: checkout.lineItems.map(item => item.variant.product.id),
    product_names: checkout.lineItems.map(item => item.variant.title),
    platform: "shopify"
  };

  // Enviar los datos a tu API
  fetch('${apiUrl}/api/tracking/conversion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
    keepalive: true, // Importante para que la petición no se cancele
  }).catch(error => {
    // No hacer nada en caso de error para no afectar la tienda
  });
});
`.trim()
    }

    // --- Método tradicional para otras plataformas ---
    const baseScript = `
<!-- Cuponomics Tracking Script -->
<script type="text/javascript">
(function() {
  // Configuración del tracking
  var cuponomicsConfig = {
    pixelId: '${pixelId}',
    storeId: '${storeId}',
    platform: '${platform}',
    apiUrl: '${apiUrl}/api/tracking'
  };

  // Función para enviar conversión
  function sendConversion(orderData) {
    fetch(cuponomicsConfig.apiUrl + '/conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pixel_id: cuponomicsConfig.pixelId,
        order_id: orderData.orderId,
        conversion_value: orderData.total,
        currency: orderData.currency,
        coupon_code: orderData.couponCode,
        product_ids: orderData.productIds || [],
        product_names: orderData.productNames || [],
        platform: cuponomicsConfig.platform,
        utm_source: getUrlParameter('utm_source'),
        utm_medium: getUrlParameter('utm_medium'),
        utm_campaign: getUrlParameter('utm_campaign'),
        referrer: document.referrer
      })
    }).catch(function(error) {
      console.log('Cuponomics tracking error:', error);
    });
  }

  // Función para obtener parámetros URL
  function getUrlParameter(name) {
    name = name.replace(/[\\[]/, '\\\\[').replace(/[\\]]/, '\\\\]');
    var regex = new RegExp('[\\\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\\+/g, ' '));
  }

  // Auto-detección de conversión según la plataforma
  ${TrackingScriptGenerator.getPlatformSpecificCode(platform)}

  // Ping para verificar que el script está funcionando
  fetch(cuponomicsConfig.apiUrl + '/ping', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pixel_id: cuponomicsConfig.pixelId,
      store_id: cuponomicsConfig.storeId,
      platform: cuponomicsConfig.platform,
      url: window.location.href
    })
  }).catch(function(error) {
    console.log('Cuponomics ping error:', error);
  });

})();
</script>
<!-- End Cuponomics Tracking Script -->`

    return baseScript.trim()
  }

  private static getPlatformSpecificCode(platform: string): string {
    switch (platform) {
      case "shopify":
        return `
  // Lógica de Shopify (obsoleta, manejada por Web Pixel)
  if (window.location.pathname.includes('/thank_you') || window.location.pathname.includes('/orders/')) {
    if (typeof Shopify !== 'undefined' && Shopify.checkout) {
      sendConversion({
        total: Shopify.checkout.total_price / 100,
        orderId: Shopify.checkout.order_id || Shopify.checkout.id,
        couponCode: Shopify.checkout.discount ? Shopify.checkout.discount.code : null
      });
    }
  }`;

      case "woocommerce":
        return `
  // WooCommerce - Detectar en página de confirmación
  if (document.body.classList.contains('woocommerce-order-received')) {
    var orderTotal = document.querySelector('.woocommerce-Price-amount');
    var orderNumber = document.querySelector('.woocommerce-order-overview__order.order strong');
    
    if (orderTotal && orderNumber) {
      sendConversion({
        total: parseFloat(orderTotal.textContent.replace(/[^0-9.]/g, '')),
        orderId: orderNumber.textContent,
        couponCode: null // WooCommerce requiere configuración adicional para cupones
      });
    }
  }`

      case "magento":
        return `
  // Magento - Detectar en página de éxito
  if (window.location.pathname.includes('/checkout/onepage/success/')) {
    // Magento requiere configuración específica del tema
    setTimeout(function() {
      var orderData = window.checkoutConfig || {};
      if (orderData.quoteData) {
        sendConversion({
          total: orderData.quoteData.grand_total,
          orderId: orderData.quoteData.entity_id,
          couponCode: orderData.quoteData.coupon_code
        });
      }
    }, 1000);
  }`

      default:
        return `
  // Configuración personalizada - Debes llamar manualmente a sendConversion()
  // Ejemplo de uso:
  // sendConversion({
  //   total: 99.99,
  //   orderId: 'ORDER-123',
  //   couponCode: 'DESCUENTO10'
  // });
  
  // Para sitios personalizados, detecta tu página de confirmación
  if (window.location.pathname.includes('/success') || 
      window.location.pathname.includes('/confirmation') ||
      window.location.pathname.includes('/thank-you')) {
    
    // Personaliza esta sección según tu sitio
    console.log('Cuponomics: Página de confirmación detectada. Configura sendConversion() con los datos de tu pedido.');
  }`
    }
  }
}
