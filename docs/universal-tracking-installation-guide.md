# 🚀 Guía de Instalación - Sistema Universal de Tracking

## 📋 Índice
1. [Introducción](#introducción)
2. [Instalación Rápida (5 minutos)](#instalación-rápida-5-minutos)
3. [Instalación por Plataforma](#instalación-por-plataforma)
4. [Verificación](#verificación)
5. [Solución de Problemas](#solución-de-problemas)
6. [Soporte](#soporte)

## 🎯 Introducción

El **Sistema Universal de Tracking** es nuestra solución más avanzada para monitorear conversiones. **¡Es súper fácil de instalar!** Solo necesitas copiar y pegar una línea de código.

### ✨ ¿Por qué es tan fácil?
- 🔍 **Detección Automática** - Detecta tu plataforma automáticamente
- 🛡️ **Protección contra Fraude** - Incluida automáticamente
- 📊 **Fingerprinting Avanzado** - Mejor precisión automática
- ⚡ **Una sola línea** - Solo copiar y pegar

## 🚀 Instalación Rápida (5 minutos)

### 📝 **Paso 1: Obtener tu código**
1. Ve a tu **Dashboard de Cuponomics**
2. Navega a **"Tracking Universal"**
3. Selecciona tu tienda
4. **Copia el código** que aparece en el recuadro

### 📋 **Paso 2: Instalar en tu sitio**
**¡Solo necesitas copiar y pegar!** Elige tu plataforma:

---

## 🛍️ **Shopify** (Más Fácil)

### ⚡ **Método Rápido (Recomendado)**
1. **Abre tu Admin de Shopify**
2. Ve a **"Online Store" > "Themes"**
3. Haz click en **"Actions" > "Edit code"**
4. En el panel izquierdo, busca **"Layout"** y abre **"theme.liquid"**
5. **Busca** `</head>` (usa Ctrl+F)
6. **Pega tu código ANTES** de `</head>`
7. **Guarda** (Ctrl+S)

![Shopify Installation](https://via.placeholder.com/600x300/4F46E5/FFFFFF?text=Shopify+Installation+Guide)

### 🎯 **¿Dónde exactamente?**
```html
<!-- Busca esto en tu theme.liquid -->
<head>
  <!-- ... otros códigos ... -->
  
  <!-- PEGA TU CÓDIGO AQUÍ -->
  <script>
    window.cuponomicsConfig = {
      pixel_id: "TU_PIXEL_ID",
      store_id: "TU_STORE_ID"
    };
  </script>
  <script src="https://cdn.cuponomics.app/universal-tracking.js" async></script>
  
</head>  <!-- ← TU CÓDIGO VA ANTES DE ESTA LÍNEA -->
```

---

## 🛒 **WooCommerce** (WordPress)

### ⚡ **Método Rápido**
1. **Abre tu WordPress Admin**
2. Ve a **"Appearance" > "Theme Editor"**
3. En el panel derecho, selecciona **"functions.php"**
4. **Pega tu código al FINAL** del archivo
5. **Guarda** (Ctrl+S)

### 🎯 **Código para pegar:**
```php
// Cuponomics Universal Tracking
function add_cuponomics_tracking() {
    ?>
    <script>
      window.cuponomicsConfig = {
        pixel_id: "TU_PIXEL_ID",
        store_id: "TU_STORE_ID"
      };
    </script>
    <script src="https://cdn.cuponomics.app/universal-tracking.js" async></script>
    <?php
}
add_action('wp_head', 'add_cuponomics_tracking');
```

---

## 🌐 **Sitio Web Personalizado**

### ⚡ **Método Rápido**
1. **Abre tu editor de código** (VS Code, Sublime, etc.)
2. Busca el archivo **"index.html"** o **"header.php"**
3. **Busca** `</head>` (Ctrl+F)
4. **Pega tu código ANTES** de `</head>`
5. **Guarda** y sube a tu servidor

### 🎯 **Código para pegar:**
```html
<!-- Cuponomics Universal Tracking -->
<script>
  window.cuponomicsConfig = {
    pixel_id: "TU_PIXEL_ID",
    store_id: "TU_STORE_ID"
  };
</script>
<script src="https://cdn.cuponomics.app/universal-tracking.js" async></script>
```

---

## 🏗️ **Otras Plataformas**

### **Magento**
1. Ve a **"Content" > "Design" > "Configuration"**
2. Edita tu tema
3. En **"HTML Head"**, pega tu código

### **PrestaShop**
1. Ve a **"Modules" > "Module Manager"**
2. Busca tu tema
3. En **"Header Hook"**, pega tu código

### **BigCommerce**
1. Ve a **"Storefront" > "Script Manager"**
2. Crea nuevo script
3. Pega tu código

---

## ✅ **Verificación (2 minutos)**

### 🔍 **Paso 1: Verificar instalación**
1. **Abre tu sitio web**
2. **Presiona F12** (herramientas de desarrollador)
3. Ve a la pestaña **"Console"**
4. **Busca** este mensaje:
   ```
   Cuponomics Universal Tracking initialized
   ```

### 📊 **Paso 2: Verificar en Dashboard**
1. Ve a tu **Dashboard de Cuponomics**
2. Navega a **"Tracking Universal"**
3. **Verifica** que aparece "Script Activo"

### 🧪 **Paso 3: Probar conversión**
1. **Simula una compra** en tu tienda
2. **Completa el proceso** hasta la confirmación
3. **Verifica** en el dashboard que aparece la conversión

---

## 🔧 **Solución de Problemas**

### ❌ **No aparece el mensaje en consola**
**Solución:**
1. Verifica que pegaste el código en `<head>`
2. Limpia la caché de tu navegador (Ctrl+Shift+R)
3. Verifica que no hay errores en la consola

### ❌ **No se detectan conversiones**
**Solución:**
1. Verifica que el script está en TODAS las páginas
2. Asegúrate de que la página de confirmación tiene el script
3. Espera 5-10 minutos para que aparezcan los datos

### ❌ **Error en la consola**
**Solución:**
1. Verifica que `pixel_id` y `store_id` están correctos
2. Asegúrate de que no hay conflictos con otros scripts
3. Contacta soporte si persiste

---

## 🆘 **Soporte**

### 📧 **¿Necesitas ayuda?**
- **Email**: soporte@cuponomics.app
- **Horario**: Lunes a Viernes, 9:00 - 18:00 GMT-5
- **Respuesta**: Máximo 2 horas

### 📞 **Contacto Directo**
Si tienes problemas:
1. **Toma una captura** de la consola (F12)
2. **Incluye** la URL de tu sitio
3. **Describe** qué paso exactamente
4. **Envía** a soporte@cuponomics.app

### 🎥 **Video Tutorial**
Próximamente: Video paso a paso para cada plataforma

---

## 🎉 **¡Listo!**

Una vez instalado, tu tienda tendrá:
- ✅ **Tracking automático** de conversiones
- ✅ **Detección de fraude** en tiempo real
- ✅ **Analytics avanzados** automáticos
- ✅ **Soporte técnico** completo

**¡El Sistema Universal de Tracking funcionará automáticamente!** 🚀

---

## 📋 **Checklist de Instalación**

- [ ] Copié el código del dashboard
- [ ] Lo pegué en `<head>` de mi sitio
- [ ] Guardé los cambios
- [ ] Verifiqué en la consola (F12)
- [ ] Probé una conversión
- [ ] Verifiqué en el dashboard

**¡Si completaste todos los pasos, tu instalación está lista!** ✅ 