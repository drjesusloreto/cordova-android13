const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

// 🛡️ LLAVE TÁCTICA: En producción, inyéctela vía variables de entorno (GitHub Secrets)
const LLAVE_MAESTRA = process.env.LLAVE_TACTICA || "Boveda_SaaS_Tactical_Key_2026"; 

// Directorio donde están los módulos que desea cifrar (ajuste según su estructura)
const DIRECTORIO_MODULOS = path.join(__dirname, '../www/modulos_sensibles');

function procesarDirectorio(directorio) {
    if (!fs.existsSync(directorio)) return;
    
    fs.readdirSync(directorio).forEach(archivo => {
        const rutaCompleta = path.join(directorio, archivo);
        
        if (fs.lstatSync(rutaCompleta).isDirectory()) {
            procesarDirectorio(rutaCompleta);
        } else if (rutaCompleta.endsWith('.js')) {
            const codigoPlano = fs.readFileSync(rutaCompleta, 'utf8');
            
            // Cifrado AES
            const codigoCifrado = CryptoJS.AES.encrypt(codigoPlano, LLAVE_MAESTRA).toString();
            
            // Guardar con nueva extensión .enc
            const rutaSalida = rutaCompleta.replace('.js', '.enc');
            fs.writeFileSync(rutaSalida, codigoCifrado);
            
            // Destruir el archivo original
            fs.unlinkSync(rutaCompleta);
            console.log(`🔒 Cifrado y destruido original: ${archivo}`);
        }
    });
}

console.log("Iniciando Operación Espejo (Cifrado de Módulos)...");
procesarDirectorio(DIRECTORIO_MODULOS);
console.log("✅ Cifrado completado.");