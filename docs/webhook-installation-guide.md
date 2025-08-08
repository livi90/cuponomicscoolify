# 🚀 Guía de Instalación - Sistema de Webhooks

## 📋 Índice
1. [Introducción](#introducción)
2. [Ventajas de los Webhooks](#ventajas-de-los-webhooks)
3. [Instalación por Plataforma](#instalación-por-plataforma)
4. [Verificación](#verificación)
5. [Solución de Problemas](#solución-de-problemas)
6. [Soporte](#soporte)

## 🎯 Introducción

El **Sistema de Webhooks** es la forma más simple y confiable de tracking. **¡No necesitas instalar código en tu tienda!** La plataforma envía los datos automáticamente cuando se completa una venta.

### ✨ ¿Por qué Webhooks?
- 🔄 **Automático** - No necesitas código
- 🛡️ **Confiable** - 100% de precisión
- 📊 **Completo** - Todos los datos de la venta
- ⚡ **Rápido** - Funciona inmediatamente

## 🏆 Ventajas de los Webhooks

### ✅ **vs Scripts de Tracking:**
- **Sin instalación** - Configuración automática
- **Sin mantenimiento** - Funciona siempre
- **Sin conflictos** - No interfiere con otros scripts
- **Sin bloqueadores** - No depende del navegador

### ✅ **Datos Capturados:**
- ✅ **ID de orden** - Identificación única
- ✅ **Valor total** - Monto de la venta
- ✅ **Cupones usados** - Códigos aplicados
- ✅ **Productos** - IDs y nombres
- ✅ **Cliente** - Email y datos
- ✅ **UTMs** - Parámetros de tracking
- ✅ **Fingerprint** - Identificación única (si está disponible)

---

## 🛍️ **Shopify** (Más Fácil)

### ⚡ **Instalación Automática (Recomendado)**
1. **Abre tu Admin de Shopify**
2. Ve a **"Settings" > "Notifications"**
3. Busca **"Webhooks"** en el menú lateral
4. Haz click en **"Create webhook"**
5. **Configura:**
   - **Event**: `Order creation` y `Order payment`
   - **Format**: `JSON`
   - **URL**: `https://cuponomics.app/api/webhooks/shopify`
6. Haz click en **"Save webhook"**

### 🎯 **Configuración Detallada:**
```
Event: Order creation
Format: JSON
URL: https://cuponomics.app/api/webhooks/shopify
Version: 2023-10
```

### 📋 **Verificar Instalación:**
1. Ve a **"Settings" > "Notifications" > "Webhooks"**
2. Verifica que aparece tu webhook activo
3. Haz click en **"Send test notification"**
4. Verifica en tu dashboard de Cuponomics

---

## 🛒 **WooCommerce** (WordPress)

### ⚡ **Instalación Automática**
1. **Abre tu WordPress Admin**
2. Ve a **"WooCommerce" > "Settings"**
3. Haz click en **"Advanced" > "Webhooks"**
4. Haz click en **"Add webhook"**
5. **Configura:**
   - **Name**: `Cuponomics Tracking`
   - **Topic**: `Order created` y `Order updated`
   - **Delivery URL**: `https://cuponomics.app/api/webhooks/woocommerce`
   - **Status**: `Active`
6. Haz click en **"Save webhook"**

### 🎯 **Configuración Detallada:**
```
Name: Cuponomics Tracking
Topic: Order created, Order updated
Delivery URL: https://cuponomics.app/api/webhooks/woocommerce
Status: Active
Version: v3
```

### 📋 **Verificar Instalación:**
1. Ve a **"WooCommerce" > "Settings" > "Advanced" > "Webhooks"**
2. Verifica que el webhook está "Active"
3. Haz click en **"Send test"**
4. Verifica en tu dashboard de Cuponomics

---

## 🏗️ **Magento**

### ⚡ **Instalación Automática**
1. **Abre tu Admin de Magento**
2. Ve a **"System" > "Integrations"**
3. Haz click en **"Add New Integration"**
4. **Configura:**
   - **Name**: `Cuponomics Webhook`
   - **API**: `REST`
   - **Resource Access**: `All`
5. Haz click en **"Save"**
6. **Configura el webhook:**
   - **Event**: `sales_order_place_after`
   - **URL**: `https://cuponomics.app/api/webhooks/magento`
   - **Method**: `POST`

### 🎯 **Configuración Detallada:**
```
Integration Name: Cuponomics Webhook
Event: sales_order_place_after
URL: https://cuponomics.app/api/webhooks/magento
Method: POST
Format: JSON
```

---

## 🛍️ **PrestaShop**

### ⚡ **Instalación Automática**
1. **Abre tu Admin de PrestaShop**
2. Ve a **"Advanced Parameters" > "Web Service"**
3. Haz click en **"Add new web service"**
4. **Configura:**
   - **Web service name**: `Cuponomics`
   - **Key**: Generar automáticamente
   - **Status**: `Enabled`
5. **Configura el webhook:**
   - **Event**: `actionValidateOrder`
   - **URL**: `https://cuponomics.app/api/webhooks/prestashop`

### 🎯 **Configuración Detallada:**
```
Web Service Name: Cuponomics
Event: actionValidateOrder
URL: https://cuponomics.app/api/webhooks/prestashop
Method: POST
```

---

## 🌐 **Otras Plataformas**

### **BigCommerce**
1. Ve a **"Settings" > "API" > "Webhooks"**
2. Crea webhook para **"Order Created"**
3. URL: `https://cuponomics.app/api/webhooks/bigcommerce`

### **OpenCart**
1. Ve a **"System" > "Users" > "API"**
2. Crea nueva API key
3. Configura webhook para **"Order Created"**

### **Sitios Personalizados**
1. **Contacta soporte** para configuración personalizada
2. Te ayudaremos a configurar el webhook específico

---

## ✅ **Verificación (2 minutos)**

### 🔍 **Paso 1: Verificar en la Plataforma**
1. **Abre tu plataforma** (Shopify/WooCommerce/etc.)
2. **Ve a la sección de webhooks**
3. **Verifica** que aparece el webhook activo
4. **Confirma** que la URL es correcta

### 📊 **Paso 2: Verificar en Dashboard**
1. **Ve a tu Dashboard de Cuponomics**
2. **Navega a "Tracking"**
3. **Verifica** que aparece "Webhook Activo"
4. **Revisa** las estadísticas de conversiones

### 🧪 **Paso 3: Probar Conversión**
1. **Haz una compra de prueba** en tu tienda
2. **Completa el proceso** hasta la confirmación
3. **Espera 1-2 minutos**
4. **Verifica** que aparece en el dashboard

---

## 🔧 **Solución de Problemas**

### ❌ **Webhook no aparece en dashboard**
**Solución:**
1. Verifica que la URL es exactamente: `https://cuponomics.app/api/webhooks/[plataforma]`
2. Asegúrate de que el webhook está "Active"
3. Verifica que no hay errores en la configuración

### ❌ **No se detectan conversiones**
**Solución:**
1. Verifica que el webhook está configurado para "Order Created"
2. Asegúrate de que la tienda está registrada en Cuponomics
3. Contacta soporte si persiste

### ❌ **Error en la configuración**
**Solución:**
1. Verifica que tienes permisos de administrador
2. Asegúrate de que la plataforma soporta webhooks
3. Contacta soporte para ayuda específica

---

## 🆘 **Soporte**

### 📧 **¿Necesitas ayuda?**
- **Email**: soporte@cuponomics.app
- **Horario**: Lunes a Viernes, 9:00 - 18:00 GMT-5
- **Respuesta**: Máximo 2 horas

### 📞 **Contacto Directo**
Si tienes problemas:
1. **Toma una captura** de la configuración del webhook
2. **Incluye** la URL de tu tienda
3. **Describe** qué paso exactamente
4. **Envía** a soporte@cuponomics.app

### 🎥 **Video Tutorial**
Próximamente: Video paso a paso para cada plataforma

---

## 🎉 **¡Listo!**

Una vez configurado el webhook, tu tienda tendrá:
- ✅ **Tracking automático** de todas las ventas
- ✅ **Datos completos** sin instalación
- ✅ **Atribución precisa** de conversiones
- ✅ **Analytics en tiempo real**

**¡El Sistema de Webhooks funcionará automáticamente!** 🚀

---

## 📋 **Checklist de Instalación**

- [ ] Configuré el webhook en mi plataforma
- [ ] La URL es correcta
- [ ] El webhook está activo
- [ ] Hice una compra de prueba
- [ ] Verifiqué en el dashboard
- [ ] Las conversiones aparecen correctamente

**¡Si completaste todos los pasos, tu webhook está funcionando!** ✅

---

## 🔄 **Sistema Híbrido**

### **¿Cuándo usar Webhooks vs Scripts?**

**Webhooks (Recomendado):**
- ✅ Tiendas grandes (Shopify, WooCommerce)
- ✅ Cuando quieres simplicidad
- ✅ Para máxima confiabilidad

**Scripts (Complementario):**
- ✅ Tiendas pequeñas sin webhooks
- ✅ Casos específicos que requieren más control
- ✅ Para capturar datos adicionales

**¡Puedes usar ambos sistemas al mismo tiempo!** 🎯
