export interface UniversalTrackingConfig {
  storeId: string
  pixelId: string
  apiUrl: string
  enableAdvancedFingerprinting?: boolean
  enableCanvasFingerprint?: boolean
  enableWebGLFingerprint?: boolean
  enableFontDetection?: boolean
  respectDNT?: boolean
  scriptTimeout?: number
  maxRetryAttempts?: number
}

export interface FingerprintData {
  userAgent: string
  screenResolution: string
  colorDepth: number
  timezone: string
  language: string
  platform: string
  canvasFingerprint?: string
  webglFingerprint?: string
  fontList?: string[]
  pluginList?: string[]
  touchSupport: boolean
  cookieEnabled: boolean
  doNotTrack: boolean
  fingerprintHash: string
}

export interface EcommercePlatform {
  id: string
  name: string
  detectionMethods: string[]
  conversionTriggers: string[]
  dataExtractors: Record<string, string>
}

export const UNIVERSAL_ECOMMERCE_PLATFORMS: EcommercePlatform[] = [
  {
    id: "shopify",
    name: "Shopify",
    detectionMethods: [
      "window.Shopify",
      "document.querySelector('[data-shopify]')",
      "window.location.hostname.includes('myshopify.com')"
    ],
    conversionTriggers: [
      "checkout_completed",
      "order_completed",
      "/thank_you",
      "/orders/"
    ],
    dataExtractors: {
      orderId: "Shopify.checkout?.order_id || Shopify.checkout?.id",
      total: "Shopify.checkout?.total_price / 100",
      currency: "Shopify.checkout?.currency",
      couponCode: "Shopify.checkout?.discount?.code"
    }
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    detectionMethods: [
      "document.body.classList.contains('woocommerce')",
      "window.wc_add_to_cart_params",
      "document.querySelector('.woocommerce')"
    ],
    conversionTriggers: [
      "woocommerce_order_received",
      "/order-received/",
      ".woocommerce-order-received"
    ],
    dataExtractors: {
      orderId: "document.querySelector('.woocommerce-order-overview__order strong')?.textContent",
      total: "document.querySelector('.woocommerce-Price-amount')?.textContent.replace(/[^0-9.]/g, '')",
      currency: "document.querySelector('.woocommerce-Price-currencySymbol')?.textContent"
    }
  },
  {
    id: "magento",
    name: "Magento",
    detectionMethods: [
      "window.Mage",
      "window.checkoutConfig",
      "document.querySelector('[data-mage-init]')"
    ],
    conversionTriggers: [
      "/checkout/onepage/success/",
      "checkout_success"
    ],
    dataExtractors: {
      orderId: "window.checkoutConfig?.quoteData?.entity_id",
      total: "window.checkoutConfig?.quoteData?.grand_total",
      currency: "window.checkoutConfig?.quoteData?.quote_currency_code"
    }
  },
  {
    id: "prestashop",
    name: "PrestaShop",
    detectionMethods: [
      "window.prestashop",
      "document.querySelector('[data-prestashop]')",
      "window.location.href.includes('prestashop')"
    ],
    conversionTriggers: [
      "/order-confirmation",
      "order_confirmation"
    ],
    dataExtractors: {
      orderId: "document.querySelector('#order-reference')?.textContent",
      total: "document.querySelector('.total-price')?.textContent.replace(/[^0-9.,]/g, '')"
    }
  },
  {
    id: "bigcommerce",
    name: "BigCommerce",
    detectionMethods: [
      "window.bigcommerce",
      "window.BCData",
      "document.querySelector('[data-bc]')"
    ],
    conversionTriggers: [
      "/checkout/order-confirmation",
      "order_confirmation"
    ],
    dataExtractors: {
      orderId: "window.BCData?.order_id",
      total: "window.BCData?.order_total",
      currency: "window.BCData?.currency"
    }
  },
  {
    id: "opencart",
    name: "OpenCart",
    detectionMethods: [
      "window.opencart",
      "document.querySelector('[data-opencart]')"
    ],
    conversionTriggers: [
      "/index.php?route=checkout/success",
      "checkout_success"
    ],
    dataExtractors: {
      orderId: "document.querySelector('#order-id')?.textContent",
      total: "document.querySelector('.total')?.textContent"
    }
  },
  {
    id: "custom",
    name: "Sitio Personalizado",
    detectionMethods: [
      "window.location.pathname.includes('/success')",
      "window.location.pathname.includes('/confirmation')",
      "window.location.pathname.includes('/thank-you')"
    ],
    conversionTriggers: [
      "/success",
      "/confirmation", 
      "/thank-you",
      "/order-complete"
    ],
    dataExtractors: {
      orderId: "document.querySelector('[data-order-id]')?.textContent || 'ORDER-' + Date.now()",
      total: "document.querySelector('[data-order-total]')?.textContent || '0'"
    }
  }
]

export class UniversalTrackingScript {
  private static generateFingerprint(): FingerprintData {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // Datos básicos del navegador
    const userAgent = navigator.userAgent
    const screenResolution = `${screen.width}x${screen.height}`
    const colorDepth = screen.colorDepth
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const language = navigator.language
    const platform = navigator.platform
    
    // Fingerprinting avanzado
    let canvasFingerprint = ''
    if (ctx) {
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillText('Cuponomics Universal Tracking 🎯', 2, 2)
      canvasFingerprint = canvas.toDataURL()
    }
    
    // WebGL fingerprint
    let webglFingerprint = ''
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          webglFingerprint = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        }
      }
    } catch (e) {
      // WebGL no disponible
    }
    
    // Detección de fuentes
    const fontList = this.detectAvailableFonts()
    
    // Lista de plugins
    const pluginList = Array.from(navigator.plugins).map(p => p.name)
    
    // Datos de comportamiento
    const touchSupport = 'ontouchstart' in window
    const cookieEnabled = navigator.cookieEnabled
    const doNotTrack = navigator.doNotTrack === '1'
    
    // Generar hash del fingerprint
    const fingerprintString = [
      userAgent,
      screenResolution,
      timezone,
      language,
      platform,
      canvasFingerprint,
      webglFingerprint,
      fontList.join(','),
      pluginList.join(','),
      touchSupport.toString(),
      cookieEnabled.toString()
    ].join('|')
    
    const fingerprintHash = this.simpleHash(fingerprintString)
    
    return {
      userAgent,
      screenResolution,
      colorDepth,
      timezone,
      language,
      platform,
      canvasFingerprint,
      webglFingerprint,
      fontList,
      pluginList,
      touchSupport,
      cookieEnabled,
      doNotTrack,
      fingerprintHash
    }
  }
  
  private static detectAvailableFonts(): string[] {
    const baseFonts = ['monospace', 'sans-serif', 'serif']
    const testString = 'mmmmmmmmmmlli'
    const testSize = '72px'
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    if (!context) return []
    
    const baseFontWidths: number[] = []
    baseFonts.forEach(baseFont => {
      context.font = `${testSize} ${baseFont}`
      baseFontWidths.push(context.measureText(testString).width)
    })
    
    const fonts = [
      'Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New',
      'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
      'Trebuchet MS', 'Arial Black', 'Impact', 'Lucida Console',
      'Tahoma', 'Geneva', 'Lucida Sans Unicode', 'Franklin Gothic Medium',
      'Arial Narrow', 'Brush Script MT', 'Lucida Sans', 'Gill Sans',
      'Century Gothic', 'Candara', 'Calibri', 'Segoe UI', 'Corbel',
      'Myriad Pro', 'Futura', 'Optima', 'Baskerville', 'Didot',
      'Hoefler Text', 'Bodoni MT', 'Rockwell', 'Frutiger', 'Univers'
    ]
    
    const availableFonts: string[] = []
    
    fonts.forEach(font => {
      let detected = false
      for (let i = 0; i < baseFonts.length; i++) {
        context.font = `${testSize} ${font}, ${baseFonts[i]}`
        const width = context.measureText(testString).width
        if (width !== baseFontWidths[i]) {
          detected = true
          break
        }
      }
      if (detected) {
        availableFonts.push(font)
      }
    })
    
    return availableFonts
  }
  
  private static simpleHash(str: string): string {
    let hash = 0
    if (str.length === 0) return hash.toString()
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36)
  }
  
  private static detectPlatform(): EcommercePlatform {
    for (const platform of UNIVERSAL_ECOMMERCE_PLATFORMS) {
      for (const method of platform.detectionMethods) {
        try {
          if (eval(method)) {
            return platform
          }
        } catch (e) {
          // Continuar con el siguiente método
        }
      }
    }
    return UNIVERSAL_ECOMMERCE_PLATFORMS.find(p => p.id === 'custom')!
  }
  
  private static extractOrderData(platform: EcommercePlatform): any {
    const data: any = {}
    
    try {
      for (const [key, extractor] of Object.entries(platform.dataExtractors)) {
        const value = eval(extractor)
        if (value !== undefined && value !== null) {
          data[key] = value
        }
      }
    } catch (e) {
      console.log('Error extracting order data:', e)
    }
    
    return data
  }
  
  private static async sendTrackingData(endpoint: string, data: any, retries = 3): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          keepalive: true
        })
        
        if (response.ok) {
          return true
        }
      } catch (e) {
        console.log(`Tracking request failed (attempt ${i + 1}/${retries}):`, e)
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
    }
    return false
  }
  
  static generateScript(config: UniversalTrackingConfig): string {
    const {
      storeId,
      pixelId,
      apiUrl,
      enableAdvancedFingerprinting = true,
      enableCanvasFingerprint = true,
      enableWebGLFingerprint = true,
      enableFontDetection = true,
      respectDNT = true,
      scriptTimeout = 5000,
      maxRetryAttempts = 3
    } = config
    
    return `
<!-- Cuponomics Universal Tracking Script v1.0.0 -->
<script type="text/javascript">
(function() {
  'use strict';
  
  // Configuración del tracking
  const CUPONOMICS_CONFIG = {
    storeId: '${storeId}',
    pixelId: '${pixelId}',
    apiUrl: '${apiUrl}',
    enableAdvancedFingerprinting: ${enableAdvancedFingerprinting},
    enableCanvasFingerprint: ${enableCanvasFingerprint},
    enableWebGLFingerprint: ${enableWebGLFingerprint},
    enableFontDetection: ${enableFontDetection},
    respectDNT: ${respectDNT},
    scriptTimeout: ${scriptTimeout},
    maxRetryAttempts: ${maxRetryAttempts}
  };
  
  // Verificar DNT si está habilitado
  if (CUPONOMICS_CONFIG.respectDNT && navigator.doNotTrack === '1') {
    return;
  }
  
  // Detectar plataforma automáticamente
  const UNIVERSAL_ECOMMERCE_PLATFORMS = ${JSON.stringify(UNIVERSAL_ECOMMERCE_PLATFORMS)};
  
  function detectPlatform() {
    for (const platform of UNIVERSAL_ECOMMERCE_PLATFORMS) {
      for (const method of platform.detectionMethods) {
        try {
          if (eval(method)) {
            return platform;
          }
        } catch (e) {
          // Continuar con el siguiente método
        }
      }
    }
    return UNIVERSAL_ECOMMERCE_PLATFORMS.find(p => p.id === 'custom');
  }
  
  // Generar fingerprint avanzado
  function generateFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Datos básicos
    const userAgent = navigator.userAgent;
    const screenResolution = screen.width + 'x' + screen.height;
    const colorDepth = screen.colorDepth;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    const platform = navigator.platform;
    
    // Fingerprinting avanzado
    let canvasFingerprint = '';
    if (ctx && CUPONOMICS_CONFIG.enableCanvasFingerprint) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Cuponomics Universal Tracking 🎯', 2, 2);
      canvasFingerprint = canvas.toDataURL();
    }
    
    // WebGL fingerprint
    let webglFingerprint = '';
    if (CUPONOMICS_CONFIG.enableWebGLFingerprint) {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            webglFingerprint = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          }
        }
      } catch (e) {
        // WebGL no disponible
      }
    }
    
    // Detección de fuentes
    let fontList = [];
    if (CUPONOMICS_CONFIG.enableFontDetection) {
      fontList = detectAvailableFonts();
    }
    
    // Lista de plugins
    const pluginList = Array.from(navigator.plugins).map(p => p.name);
    
    // Datos de comportamiento
    const touchSupport = 'ontouchstart' in window;
    const cookieEnabled = navigator.cookieEnabled;
    const doNotTrack = navigator.doNotTrack === '1';
    
    // Generar hash del fingerprint
    const fingerprintString = [
      userAgent, screenResolution, timezone, language, platform,
      canvasFingerprint, webglFingerprint, fontList.join(','),
      pluginList.join(','), touchSupport.toString(), cookieEnabled.toString()
    ].join('|');
    
    const fingerprintHash = simpleHash(fingerprintString);
    
    return {
      userAgent, screenResolution, colorDepth, timezone, language, platform,
      canvasFingerprint, webglFingerprint, fontList, pluginList,
      touchSupport, cookieEnabled, doNotTrack, fingerprintHash
    };
  }
  
  function detectAvailableFonts() {
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) return [];
    
    const baseFontWidths = [];
    baseFonts.forEach(baseFont => {
      context.font = testSize + ' ' + baseFont;
      baseFontWidths.push(context.measureText(testString).width);
    });
    
    const fonts = [
      'Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New',
      'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
      'Trebuchet MS', 'Arial Black', 'Impact', 'Lucida Console',
      'Tahoma', 'Geneva', 'Lucida Sans Unicode', 'Franklin Gothic Medium'
    ];
    
    const availableFonts = [];
    
    fonts.forEach(font => {
      let detected = false;
      for (let i = 0; i < baseFonts.length; i++) {
        context.font = testSize + ' ' + font + ', ' + baseFonts[i];
        const width = context.measureText(testString).width;
        if (width !== baseFontWidths[i]) {
          detected = true;
          break;
        }
      }
      if (detected) {
        availableFonts.push(font);
      }
    });
    
    return availableFonts;
  }
  
  function simpleHash(str) {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
  
  // Extraer datos de la orden según la plataforma
  function extractOrderData(platform) {
    const data = {};
    
    try {
      for (const [key, extractor] of Object.entries(platform.dataExtractors)) {
        const value = eval(extractor);
        if (value !== undefined && value !== null) {
          data[key] = value;
        }
      }
    } catch (e) {
      console.log('Error extracting order data:', e);
    }
    
    return data;
  }
  
  // Enviar datos de tracking con reintentos
  async function sendTrackingData(endpoint, data, retries = CUPONOMICS_CONFIG.maxRetryAttempts) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          keepalive: true
        });
        
        if (response.ok) {
          return true;
        }
      } catch (e) {
        console.log('Cuponomics tracking request failed (attempt ' + (i + 1) + '/' + retries + '):', e);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
    return false;
  }
  
  // Función para obtener parámetros URL
  function getUrlParameter(name) {
    name = name.replace(/[\\[]/, '\\\\[').replace(/[\\]]/, '\\\\]');
    const regex = new RegExp('[\\\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\\+/g, ' '));
  }
  
  // Registrar llegada desde cuponomics
  async function trackArrival() {
    const platform = detectPlatform();
    const fingerprint = generateFingerprint();
    
    const arrivalData = {
      store_id: CUPONOMICS_CONFIG.storeId,
      pixel_id: CUPONOMICS_CONFIG.pixelId,
      platform: platform.id,
      fingerprint: fingerprint,
      utm_source: getUrlParameter('utm_source'),
      utm_medium: getUrlParameter('utm_medium'),
      utm_campaign: getUrlParameter('utm_campaign'),
      utm_content: getUrlParameter('utm_content'),
      utm_term: getUrlParameter('utm_term'),
      referrer: document.referrer,
      landing_page: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    await sendTrackingData(CUPONOMICS_CONFIG.apiUrl + '/tracking/universal/arrival', arrivalData);
  }
  
  // Registrar conversión
  async function trackConversion(orderData) {
    const platform = detectPlatform();
    const fingerprint = generateFingerprint();
    
    const conversionData = {
      store_id: CUPONOMICS_CONFIG.storeId,
      pixel_id: CUPONOMICS_CONFIG.pixelId,
      platform: platform.id,
      fingerprint: fingerprint,
      order_id: orderData.orderId,
      conversion_value: orderData.total,
      currency: orderData.currency || 'EUR',
      coupon_code: orderData.couponCode,
      product_ids: orderData.productIds || [],
      product_names: orderData.productNames || [],
      utm_source: getUrlParameter('utm_source'),
      utm_medium: getUrlParameter('utm_medium'),
      utm_campaign: getUrlParameter('utm_campaign'),
      utm_content: getUrlParameter('utm_content'),
      utm_term: getUrlParameter('utm_term'),
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    };
    
    await sendTrackingData(CUPONOMICS_CONFIG.apiUrl + '/tracking/universal/conversion', conversionData);
  }
  
  // Detectar conversión automáticamente
  function detectConversion() {
    const platform = detectPlatform();
    
    for (const trigger of platform.conversionTriggers) {
      if (window.location.pathname.includes(trigger) || 
          document.body.classList.contains(trigger) ||
          window.location.href.includes(trigger)) {
        
        const orderData = extractOrderData(platform);
        if (orderData.orderId || orderData.total) {
          trackConversion(orderData);
          return true;
        }
      }
    }
    
    return false;
  }
  
  // Enviar ping de health
  async function sendHealthPing() {
    const platform = detectPlatform();
    const fingerprint = generateFingerprint();
    
    const healthData = {
      store_id: CUPONOMICS_CONFIG.storeId,
      pixel_id: CUPONOMICS_CONFIG.pixelId,
      platform: platform.id,
      fingerprint: fingerprint,
      page_url: window.location.href,
      script_version: '1.0.0',
      timestamp: new Date().toISOString()
    };
    
    await sendTrackingData(CUPONOMICS_CONFIG.apiUrl + '/tracking/universal/health', healthData);
  }
  
  // Inicializar tracking
  function initTracking() {
    // Registrar llegada si viene de cuponomics
    if (getUrlParameter('utm_source') === 'cuponomics' || 
        document.referrer.includes('cuponomics.app')) {
      trackArrival();
    }
    
    // Detectar conversión en carga de página
    if (!detectConversion()) {
      // Si no se detectó conversión, configurar listener para cambios de URL
      let currentUrl = window.location.href;
      const observer = new MutationObserver(() => {
        if (window.location.href !== currentUrl) {
          currentUrl = window.location.href;
          setTimeout(detectConversion, 1000);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
    
    // Enviar ping de health
    sendHealthPing();
    
    // Enviar ping cada 5 minutos
    setInterval(sendHealthPing, 5 * 60 * 1000);
  }
  
  // Exponer funciones globalmente
  window.cuponomicsUniversalTrack = {
    trackArrival,
    trackConversion,
    detectConversion,
    sendHealthPing,
    config: CUPONOMICS_CONFIG
  };
  
  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
  } else {
    initTracking();
  }
  
  // Timeout de seguridad
  setTimeout(() => {
    console.log('Cuponomics Universal Tracking initialized');
  }, CUPONOMICS_CONFIG.scriptTimeout);
  
})();
</script>
<!-- End Cuponomics Universal Tracking Script -->
`.trim()
  }
  
  static generateInstallationInstructions(platform: string): string[] {
    const instructions: Record<string, string[]> = {
      shopify: [
        "En tu panel de Shopify, ve a 'Configuración' en la esquina inferior izquierda",
        "En el menú lateral, haz clic en 'Eventos de cliente'",
        "Haz clic en el botón 'Añadir píxel personalizado'",
        "Dale un nombre a tu píxel, por ejemplo, 'Cuponomics Universal Tracking'",
        "Pega el código completo en el campo de código",
        "Haz clic en 'Guardar' y luego asegúrate de hacer clic en 'Conectar' en la esquina superior derecha"
      ],
      woocommerce: [
        "Accede al panel de administración de WordPress",
        "Ve a 'Apariencia' > 'Editor de temas'",
        "Abre el archivo 'functions.php' de tu tema activo",
        "Pega el código al final del archivo",
        "Guarda los cambios"
      ],
      magento: [
        "Accede al panel de administración de Magento",
        "Ve a 'Contenido' > 'Configuración' > 'HTML Head'",
        "Pega el código en el campo 'Scripts y hojas de estilo'",
        "Guarda la configuración",
        "Limpia la caché desde 'Sistema' > 'Gestión de caché'"
      ],
      prestashop: [
        "Ve al panel de administración de PrestaShop",
        "Navega a 'Módulos' > 'Gestión de módulos'",
        "Busca e instala el módulo 'Custom Code'",
        "Configura el módulo y pega el código",
        "Activa el módulo para aplicar los cambios"
      ],
      bigcommerce: [
        "Accede a tu panel de control de BigCommerce",
        "Ve a 'Storefront' > 'Script Manager'",
        "Haz clic en 'Create a Script'",
        "Selecciona 'Footer' como ubicación",
        "Pega el código y guarda"
      ],
      opencart: [
        "Accede al panel de administración de OpenCart",
        "Ve a 'Sistema' > 'Configuración'",
        "Edita tu tienda",
        "En la pestaña 'Servidor', busca 'Google Analytics'",
        "Pega el código en el campo correspondiente"
      ],
      custom: [
        "Abre el archivo HTML de tu página principal (index.html)",
        "Busca la etiqueta de cierre </head>",
        "Pega el código justo antes de </head>",
        "Guarda el archivo y sube los cambios a tu servidor",
        "Alternativamente, puedes usar un plugin de gestión de scripts si tu CMS lo soporta"
      ]
    }
    
    return instructions[platform] || instructions.custom
  }
} 