const fs = require('fs');
const path = require('path');

// Mapeo de nombres de carpetas problemáticas
const folderMappings = {
  '6 Viajes & Experiencias': '6-viajes-experiencias',
  'Cosméticos & Farmacia': 'cosmeticos-farmacia',
  'Electrodomésticos & Hogar': 'electrodomesticos-hogar',
  'Nueva carpeta': 'sneakers-zapatos',
  'Ropa accesorios deporte': 'ropa-accesorios-deporte',
  'Supermercado & Alimentación': 'supermercado-alimentacion',
  'Tecnología': 'tecnologia'
};

// Mapeo de nombres de archivos problemáticos
const fileMappings = {
  'banner cometicos.png': 'banner-cosmeticos.png',
  'banner pagina ELECTRODOMESTICOS (copy).png': 'banner-electrodomesticos.png',
  'banner ropa accesorios deporte.png': 'banner-ropa-deporte.png',
  'Banner sneakers.png': 'banner-sneakers.png',
  'Banner tecnología.png': 'banner-tecnologia.png',
  'Zapatos Vestir.png': 'zapatos-vestir.png'
};

function renameFilesAndFolders(basePath) {
  const items = fs.readdirSync(basePath);
  
  items.forEach(item => {
    const oldPath = path.join(basePath, item);
    const stat = fs.statSync(oldPath);
    
    if (stat.isDirectory()) {
      // Renombrar carpetas
      if (folderMappings[item]) {
        const newPath = path.join(basePath, folderMappings[item]);
        console.log(`Renombrando carpeta: ${item} -> ${folderMappings[item]}`);
        fs.renameSync(oldPath, newPath);
        renameFilesAndFolders(newPath); // Recursivo para subcarpetas
      } else {
        renameFilesAndFolders(oldPath); // Recursivo sin renombrar
      }
    } else {
      // Renombrar archivos
      if (fileMappings[item]) {
        const newPath = path.join(basePath, fileMappings[item]);
        console.log(`Renombrando archivo: ${item} -> ${fileMappings[item]}`);
        fs.renameSync(oldPath, newPath);
      }
    }
  });
}

// Ejecutar el script
const imagesPath = path.join(__dirname, 'public', 'Imagenes landing', 'imagens cada categoría');
console.log('Iniciando renombrado de archivos y carpetas...');
renameFilesAndFolders(imagesPath);
console.log('Renombrado completado!');
