// Importamos la librería criptográfica. Asegúrese de que la ruta relativa sea correcta
// Si este worker está en www/js/, buscará en www/lib/
importScripts('../lib/crypto-js.min.js');

self.onmessage = function(evento) {
    const payload = evento.data;
    
    if (payload.accion === 'descifrar') {
        try {
            // Operación intensiva de CPU aislada del hilo principal
            const bytes = CryptoJS.AES.decrypt(payload.datosCifrados, payload.llave);
            const codigoPlano = bytes.toString(CryptoJS.enc.Utf8);
            
            if (!codigoPlano) {
                throw new Error("Integridad comprometida: La llave maestra no coincide.");
            }
            
            // Enviamos el código en texto plano de vuelta al Orquestador
            self.postMessage({ 
                estado: 'exito', 
                id: payload.id, 
                codigo: codigoPlano 
            });
            
        } catch (error) {
            self.postMessage({ 
                estado: 'error', 
                id: payload.id, 
                error: error.message 
            });
        }
    }
};