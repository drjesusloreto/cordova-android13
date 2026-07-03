// ==============================================================================
// 🛡️ NÚCLEO TÁCTICO ORQUESTADOR - SISTEMA MÉDICO (RADAR FORENSE ACTIVADO)
// ==============================================================================

window.onerror = function(msg, url, line, col, error) {
    let archivo = url ? url.substring(url.lastIndexOf('/') + 1) : "Script Interno";
    alert(`🔥 DETECCIÓN FORENSE:\n\nArchivo: ${archivo}\nLínea: ${line}\n\nError: ${msg}\n\nComandante, vaya a su editor de código y revise esa línea exacta.`);
    return true; 
};

window.addEventListener("unhandledrejection", function(e) {
    console.warn(`🔥 PROMESA RECHAZADA: ${e.reason}`);
});

window.moduloActualBaseURL = '';
window.historialNavegacion = []; 

document.addEventListener('deviceready', async () => {
	// CEDER EL CONTROL EN EL ARRANQUE MAESTRO
    if (localStorage.getItem('tactico_override_bd') === 'si') {
        let rutaBD = localStorage.getItem('ruta_fisica_BD');
        if (rutaBD) {
            let r = rutaBD.endsWith('/') ? rutaBD.slice(0, -1) : rutaBD;
            try {
                let code = await leerArchivoLocal(r + "/js/loader-mobile.js") || await leerArchivoLocal(r + "/js/loader-modile.js");
                if (code) {
                    console.warn("🛡️ Rindiendo control del anfitrión. El módulo BD asume el mando total.");
                    let s = document.createElement('script');
                    s.textContent = code;
                    document.body.appendChild(s);
                    return; // 🛑 CRÍTICO: El `return` mata el proceso del anfitrión.
                }
            } catch(e) {}
        }
    };
    const textoEstado = document.getElementById('estado-texto');
    
    try { await solicitarPermisosTacticos(); } catch (error) {
        document.body.innerHTML = `<h2 style="color:#f85149; text-align:center; margin-top:50px;">ACCESO DENEGADO</h2>`;
        return setTimeout(() => navigator.app.exitApp(), 4000);
    }

    if (window.device && window.device.isVirtual) return document.body.innerHTML = "<h2 style='text-align:center; margin-top:50px;'>Emulador Bloqueado</h2>";
    
    const isRooted = await new Promise(resolve => {
        if (window.IRoot) { IRoot.isRooted(r => resolve(r), () => resolve(false)); } else { resolve(false); }
    });
    if (isRooted) return ejecutarProtocoloDestruccionFisica('Dispositivo Comprometido');

    const hardwareUUID = window.device.uuid;
    const appConfig = { id_app: "APP_CARDIO_01", version: "1.0.5" }; 
    const tokenGuardado = localStorage.getItem('token_tactico') || '';

    if(textoEstado) textoEstado.innerText = "Inspeccionando bóveda local...";

    const modulosLocales = obtenerModulosLocales();
    const versionForense = modulosLocales.length === 0 ? "0.0.0" : appConfig.version;
	// 🛡️ NUEVO: LECTURA DEL MODO DE TRABAJO TÁCTICO
    const modoTrabajo = localStorage.getItem('modo_trabajo') || 'online';
    
    if (modoTrabajo === 'offline') {
        if(textoEstado) textoEstado.innerText = "Operación Sombra (Offline forzado)...";
        console.warn("🔌 Modo Offline activo por orden del usuario. Saltando conexión a la Comandancia.");
        return iniciarPanelDeControl(); // Salta directo al panel local
    };/*fin de Inyección*/

    if(textoEstado) textoEstado.innerText = "Conectando con la Comandancia...";

    try {
        const resValidacion = await fetch(`https://gloriadorada.com/ai/validar_acceso.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uuid: hardwareUUID, id_app: appConfig.id_app,
                nonce: Date.now().toString(), version: versionForense, token: tokenGuardado
            })
        });

        if (!resValidacion.ok) throw new Error(`HTTP ${resValidacion.status}`);
        const validacion = await resValidacion.json();

        if (validacion.token) localStorage.setItem('token_tactico', validacion.token);
        if (validacion.accion === 'wipe_rescate' || validacion.accion === 'wipe_total') return ejecutarProtocoloDestruccionFisica(validacion.motivo);
        if (validacion.accion === 'descargar_modulos' && validacion.paquetes && validacion.paquetes.length > 0) {
            if(textoEstado) textoEstado.innerText = "Sincronizando arsenal...";
            return orquestarSincronizacion(validacion.paquetes, textoEstado);
        }
        if (validacion.accion === 'ok' || validacion.acceso === true) return iniciarPanelDeControl();

        alert(validacion.error || validacion.motivo);
    } catch (error) {
        console.warn("Fallo de red. Operación Sombra (Offline).", error);
        iniciarPanelDeControl();
    }
}, false);

function obtenerModulosLocales() {
    let modulos = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith('ruta_fisica_')) {
            modulos.push({ nombre: key.replace('ruta_fisica_', ''), ruta: localStorage.getItem(key) });
        }
    }
    return modulos;
}

// ==============================================================================
// 🧠 DICCIONARIO SEMÁNTICO Y MOTOR DE BÚSQUEDA JERÁRQUICA
// ==============================================================================
window.JERARQUIA_MEDICA_DEFAULT = {
    "Medicina interna": {
        sinonimos: ["interna", "clinica medica", "medicina clinica", "internista", "medicina general"],
        subespecialidades: {
            "Cardiologia": {
                sinonimos: ["cardio", "corazon", "cardiovascular", "cardiaco", "heart", "arritmia", "infarto", "electro"],
                procedimientos: [
                    { nombre: "Evaluación Cardiovascular", sinonimos: ["evaluación cardíaca", "checkup cardiaco"] },
                    { nombre: "Interconsultas Cardiológicas", sinonimos: ["consulta cardio", "referencia cardiología"] },
                    { nombre: "Ecocardiograma", sinonimos: ["eco cardio", "ultrasonido cardíaco"] }
                ]
            },
            "Gastroenterologia": {
                sinonimos: ["gastro", "estomago", "digestivo", "gastrointestinal", "hepatico", "colon"],
                procedimientos: [
                    { nombre: "Endoscopía", sinonimos: ["endoscopia", "gastroscopia"] }
                ]
            }
        }
    },
    "Cirugia": {
        sinonimos: ["cirugía", "quirurgico", "cirujano", "surgery", "operatorio", "intervención"],
        subespecialidades: {
            "Cirugía General": {
                sinonimos: ["cirugia general", "cirugía abdominal", "laparoscopia"],
                procedimientos: [
                    { nombre: "Colecistectomía", sinonimos: ["vesícula", "extracción vesícula"] },
                    { nombre: "Hernioplastia", sinonimos: ["hernia", "reparación hernia"] }
                ]
            }
        }
    }
};

window.obtenerJerarquiaActiva = function() {
    try {
        let custom = localStorage.getItem('diccionario_semantico_custom');
        if (custom) return JSON.parse(custom);
    } catch(e) {}
    return window.JERARQUIA_MEDICA_DEFAULT;
};

class DetectorJerarquico {
    constructor(jerarquia) {
        this.jerarquia = jerarquia || {};
        this.construirIndices();
    }
    
    construirIndices() {
        this.indiceSinonimos = new Map(); 
        this.indiceProcedimientos = new Map(); 
        
        for (const [especialidad, data] of Object.entries(this.jerarquia)) {
            const espSinonimos = [especialidad, ...(data.sinonimos || [])];
            espSinonimos.forEach(sin => {
                const sinLower = sin.toLowerCase();
                if (!this.indiceSinonimos.has(sinLower)) this.indiceSinonimos.set(sinLower, []);
                this.indiceSinonimos.get(sinLower).push({ tipo: 'especialidad', nivel: 1, nombre: especialidad, data: data });
            });
            
            if(!data.subespecialidades) continue;
            for (const [subNombre, subData] of Object.entries(data.subespecialidades)) {
                const subSinonimos = [subNombre, ...(subData.sinonimos || [])];
                subSinonimos.forEach(sin => {
                    const sinLower = sin.toLowerCase();
                    if (!this.indiceSinonimos.has(sinLower)) this.indiceSinonimos.set(sinLower, []);
                    this.indiceSinonimos.get(sinLower).push({ tipo: 'subespecialidad', nivel: 2, nombre: subNombre, especialidadPadre: especialidad, data: subData });
                });
                
                if(!subData.procedimientos) continue;
                for (const proc of subData.procedimientos) {
                    const procSinonimos = [proc.nombre, ...(proc.sinonimos || [])];
                    procSinonimos.forEach(sin => {
                        const sinLower = sin.toLowerCase();
                        if (!this.indiceProcedimientos.has(sinLower)) this.indiceProcedimientos.set(sinLower, []);
                        this.indiceProcedimientos.get(sinLower).push({ nombre: proc.nombre, especialidad: especialidad, subespecialidad: subNombre });
                    });
                }
            }
        }
    }
    
    detectar(texto) {
        if (!texto) return { especialidades: new Map(), subespecialidades: new Map(), procedimientos: new Map() };
        const textoLower = texto.toLowerCase();
        const palabras = textoLower.split(/[\s,;:.!?()\[\]{}"'-]+/).filter(p => p.length > 2);
        
        const detecciones = { especialidades: new Map(), subespecialidades: new Map(), procedimientos: new Map() };
        
        for (const palabra of palabras) {
            for (let [clave, valores] of this.indiceSinonimos.entries()) {
                if (clave.includes(palabra) || palabra.includes(clave)) {
                    for (const match of valores) {
                        if (match.tipo === 'especialidad') detecciones.especialidades.set(match.nombre, match.data);
                        else if (match.tipo === 'subespecialidad') detecciones.subespecialidades.set(match.nombre, { especialidadPadre: match.especialidadPadre, data: match.data });
                    }
                }
            }
            for (let [clave, valores] of this.indiceProcedimientos.entries()) {
                if (clave.includes(palabra) || palabra.includes(clave)) {
                    for (const proc of valores) detecciones.procedimientos.set(proc.nombre, proc);
                }
            }
        }
        return detecciones;
    }
    
    obtenerModulosFiltrados(detecciones) {
        const modulosSet = new Map();
        for (const [espNombre, espData] of detecciones.especialidades) {
            if(!espData.subespecialidades) continue;
            for (const [subNombre, subData] of Object.entries(espData.subespecialidades)) {
                if(!subData.procedimientos) continue;
                for (const proc of subData.procedimientos) {
                    modulosSet.set(`${espNombre}|${subNombre}|${proc.nombre}`, { especialidad: espNombre, subespecialidad: subNombre, procedimiento: proc.nombre, nivelDeteccion: 'especialidad' });
                }
            }
        }
        for (const [subNombre, subInfo] of detecciones.subespecialidades) {
            if(!subInfo.data.procedimientos) continue;
            for (const proc of subInfo.data.procedimientos) {
                const key = `${subInfo.especialidadPadre}|${subNombre}|${proc.nombre}`;
                if (!modulosSet.has(key)) modulosSet.set(key, { especialidad: subInfo.especialidadPadre, subespecialidad: subNombre, procedimiento: proc.nombre, nivelDeteccion: 'subespecialidad' });
            }
        }
        for (const [procNombre, procInfo] of detecciones.procedimientos) {
            const key = `${procInfo.especialidad}|${procInfo.subespecialidad}|${procNombre}`;
            if (!modulosSet.has(key)) modulosSet.set(key, { especialidad: procInfo.especialidad, subespecialidad: procInfo.subespecialidad, procedimiento: procNombre, nivelDeteccion: 'procedimiento' });
        }
        return Array.from(modulosSet.values());
    }
}

// ==============================================================================
// 3. PANEL DE CONTROL ORQUESTADOR (EXTRACCIÓN JSON COMPLETA AÑADIDA)
// ==============================================================================
async function iniciarPanelDeControl() {       
    let modulosDisponibles = obtenerModulosLocales();
    if (modulosDisponibles.length === 0) return alert("⚠️ Terminal vacía. Conéctese a internet para descargar módulos.");

    // 🕵️ MODO FANTASMA: Ocultar estrictamente el módulo "BD" de la interfaz
    modulosDisponibles = modulosDisponibles.filter(m => m.nombre.toUpperCase() !== "BD");

    let rutaBD = localStorage.getItem('ruta_fisica_BD');
    let existeUpdateBD = false;
    let rutaUpdateJS = "";
    
    // ▼▼▼ LÓGICA DE EXTRACCIÓN FORENSE PREVIA ▼▼▼
    if (rutaBD) {
        // FALLBACK DE SEGURIDAD: Si Cordova no detecta el UUID, forzamos tu ID conocido
        let uuidDispositivo = (window.device && window.device.uuid) ? window.device.uuid : "e29197832058aab9";
        let rutaBDLimpia = rutaBD.endsWith('/') ? rutaBD.slice(0, -1) : rutaBD;
        let configPath = rutaBDLimpia + "/config/" + uuidDispositivo + ".json";
        let configFallbackPath = rutaBDLimpia + "/config/todos.json";

        try {
            let configJsonStr = null;
            try {
                configJsonStr = await leerArchivoLocal(configPath);
            } catch (e) {
                // Si falla el archivo por UUID, tomamos el mando con el archivo global
                configJsonStr = await leerArchivoLocal(configFallbackPath);
            }

            if (configJsonStr && configJsonStr.trim() !== '') {
                let configDevice = JSON.parse(configJsonStr);
                
                // 🛡️ ESCUDO DE FILTROS: Aplicar o purgar
                if (configDevice.mod) {
                    if (Array.isArray(configDevice.mod.incluir) && configDevice.mod.incluir.length > 0) {
                        localStorage.setItem('filtro_lista_blanca', configDevice.mod.incluir.join(',\n'));
                    } else {
                        localStorage.removeItem('filtro_lista_blanca');
                    }
                    
                    if (Array.isArray(configDevice.mod.excluir) && configDevice.mod.excluir.length > 0) {
                        localStorage.setItem('filtro_lista_negra', configDevice.mod.excluir.join(',\n'));
                    } else {
                        localStorage.removeItem('filtro_lista_negra');
                    }
                } else {
                    localStorage.removeItem('filtro_lista_blanca');
                    localStorage.removeItem('filtro_lista_negra');
                }

                // 👇👇👇 CORRECCIÓN: EXTRACCIÓN DE PARÁMETROS TÁCTICOS DE LA INTERFAZ 👇👇👇
                let valConexion = configDevice.conexion !== undefined ? configDevice.conexion : "online";
                let valActualizacion = configDevice.actualizacion !== undefined ? configDevice.actualizacion : "no";
                // Soporte para "purgar" (del JSON de muestra) o "pulgar" (del código heredado)
                let valPulgar = configDevice.purgar !== undefined ? String(configDevice.purgar).toLowerCase() : 
                                (configDevice.pulgar !== undefined ? String(configDevice.pulgar).toLowerCase() : "false");

                localStorage.setItem('tactico_conexion', valConexion);
                localStorage.setItem('tactico_actualizacion', valActualizacion);
                localStorage.setItem('tactico_pulgar', valPulgar);
                // 👆👆👆 FIN CORRECCIÓN 👆👆👆
            }
        } catch(e) {
            console.warn(`Silencio de radio: No se encontró config/${uuidDispositivo}.json ni todos.json`);
        }
    }
    // ▲▲▲ FIN DE NUEVA LÓGICA ▲▲▲

    // 🔍 AUDITORÍA FORENSE: Detectar si existe el script de actualización dentro de BD
    if (rutaBD) {
        if (rutaBD.endsWith('/')) rutaBD = rutaBD.slice(0, -1);
        let checkRutas = [rutaBD + "/js/loader-mobile.js", rutaBD + "/js/loader-modile.js"];
        for (let ruta of checkRutas) {
            try {
                let checkFile = await leerArchivoLocal(ruta);
                if (checkFile && checkFile.length > 0) { existeUpdateBD = true; rutaUpdateJS = ruta; break; }
            } catch(e) {}
        }
    }

    document.body.style.backgroundColor = "#0b0f19";
    document.body.style.display = "block";
    document.body.style.alignItems = "initial";
    document.body.style.height = "100vh";
    document.body.style.overflow = "auto";
    document.body.className = "";

    if (!document.getElementById('orquestador-styles')) {
        const style = document.createElement('style');
        style.id = 'orquestador-styles';
        style.innerHTML = `
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', system-ui, sans-serif; }
            .med-header { background: rgba(18, 25, 45, 0.96); backdrop-filter: blur(14px); border-bottom: 1px solid rgba(72, 187, 255, 0.3); padding: 0.75rem 1.5rem; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 1100; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4); min-height: 70px; }
            .header-left, .header-right { flex: 0 0 auto; min-width: 48px; }
            .header-center { flex: 1; display: flex; justify-content: center; text-align: center; padding: 0 12px; }
            .burger-menu { background: none; border: none; font-size: 1.9rem; cursor: pointer; color: #7fdbff; padding: 8px; border-radius: 12px; }
            .service-title { font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #c0e0ff, #7aa9ff); -webkit-background-clip: text; color: transparent; white-space: nowrap; }
            .user-icon { background: #1f2a44; border-radius: 40px; padding: 6px 14px; font-weight: 600; color: #b9e2ff; display: flex; align-items: center; gap: 8px; border: 1px solid #3d5a80; }
            .side-nav { position: fixed; top: 0; left: -450px; width: 450px; height: 100vh; background: linear-gradient(145deg, #0a0f1c, #0f172ad9); backdrop-filter: blur(24px); border-right: 1px solid #2c3e66; z-index: 1200; transition: left 0.3s; padding: 1.5rem; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
            .side-nav.open { left: 0; }
            .menu-section-title { color: #9bc2ff; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; border-left: 3px solid #3b82f6; padding-left: 12px; }
            .search-input, select { width: 100%; padding: 12px 16px; background: #1e2a3e; border: 1px solid #3b5a7a; color: #eef2ff; border-radius: 16px; font-size: 0.95rem; outline: none; margin-bottom: 10px; resize: vertical; }
            textarea.search-input { min-height: 60px; max-height: 150px; }
            .detection-panel { background: #0a0f1c; border-radius: 16px; padding: 12px; margin-top: 12px; max-height: 300px; overflow-y: auto; }
            .purge-menu-btn { width: 100%; padding: 14px; background: #b91c1c; color: white; border: none; border-radius: 40px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 20px;}
            .nav-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); z-index: 1150; display: none; }
            .nav-overlay.active { display: block; }
            .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; padding: 2rem; max-width: 1600px; margin: 0 auto; }
            .med-card { background: linear-gradient(145deg, #111c2e, #0a1220); border-radius: 28px; border: 1px solid rgba(72, 187, 255, 0.25); padding: 1.5rem; cursor: pointer; transition: transform 0.2s; }
            .med-card:active { transform: scale(0.98); border-color: #3b82f6; }
            .card-title { font-size: 1.2rem; font-weight: 700; color: #c9e9ff; margin-bottom: 8px; word-break: break-word; }
            .card-sub { font-size: 0.8rem; color: #8aaee0; margin-top: 8px; }
            .badge-serv { background: #1e3a5f; border-radius: 50px; font-size: 0.7rem; padding: 4px 12px; display: inline-block; color: #bbd6ff;}
            .badge-sub { background: #2c5282; border-radius: 50px; font-size: 0.65rem; padding: 3px 10px; display: inline-block; margin-left: 8px; color: #bbd6ff;}
            .empty-message { text-align: center; padding: 3rem; color: #bbd4ff; font-size: 1.2rem; background: #0b0f1955; border-radius: 48px; margin: 2rem; grid-column: 1 / -1; }
            .result-stats { text-align: center; color: #7aa9ff; font-size: 0.85rem; margin: 0 1rem 1rem 1rem; padding: 8px; background: rgba(58, 110, 165, 0.2); border-radius: 40px; }
            @media (max-width: 640px) { .cards-grid { grid-template-columns: 1fr; padding: 1rem; } .side-nav { width: 320px; left: -320px; } .service-title { font-size: 1.1rem; } }
        `;
        document.head.appendChild(style);
    }

    // 🛡️ MOTOR DE DECISIÓN VISUAL
    let tacticoConexion = localStorage.getItem('tactico_conexion') || 'online';
    let tacticoActualizacion = localStorage.getItem('tactico_actualizacion') || 'no';
    let tacticoPulgar = localStorage.getItem('tactico_pulgar') || 'false';

    let displayConexion = (tacticoConexion === 'online') ? 'none' : 'block';
    let displayActualizacion = (tacticoActualizacion === 'si') ? 'none' : 'block';
    let displayPulgar = (tacticoPulgar === 'false') ? 'none' : 'block';

    let htmlUpdateOverride = "";
    if (existeUpdateBD) {
        let estadoSi = localStorage.getItem('tactico_override_bd') === 'si' ? 'selected' : '';
        let estadoNo = localStorage.getItem('tactico_override_bd') !== 'si' ? 'selected' : '';
        htmlUpdateOverride = `
            <div class="menu-section" style="display: ${displayActualizacion};">
                <div class="menu-section-title" style="color:#f59e0b; border-left-color:#f59e0b;">🔄 NÚCLEO BD DETECTADO</div>
                <label style="color:#bbd6ff; font-size:0.8rem; display:block; margin-bottom:5px;">Aplicar actualización:</label>
                <select id="updateOverrideSelect" class="search-input" style="color:#f59e0b; font-weight:bold; border-color:#f59e0b55;">
                    <option value="no" ${estadoNo}>❌ No</option>
                    <option value="si" ${estadoSi}>✅ Sí (Tomar Control)</option>
                </select>
            </div>
        `;
    }

    let modoTrabajoActual = localStorage.getItem('modo_trabajo') || 'online';
    let selOnline = modoTrabajoActual === 'online' ? 'selected' : '';
    let selOffline = modoTrabajoActual === 'offline' ? 'selected' : '';
    
    let htmlModoTrabajo = `
        <div class="menu-section" style="display: ${displayConexion};">
            <div class="menu-section-title" style="color:#10b981; border-left-color:#10b981;">📡 MODO DE CONEXIÓN</div>
            <label style="color:#bbd6ff; font-size:0.8rem; display:block; margin-bottom:5px;">Protocolo de Red:</label>
            <select id="modoTrabajoSelect" class="search-input" style="color:#10b981; font-weight:bold; border-color:#10b98155;">
                <option value="online" ${selOnline}>🌐 Online (por Dios)</option>
                <option value="offline" ${selOffline}>🔌 Offline (para Dios)</option>
            </select>
        </div>
    `;

    document.body.innerHTML = `
        <header class="med-header">
            <div class="header-left"><button class="burger-menu" id="burgerBtn">☰</button></div>
            <div class="header-center"><div class="service-title" id="dynamicServiceTitle">HCD ICU · Orquestador</div></div>
            <div class="header-right"><div class="user-icon">👤 <span>IA</span></div></div>
        </header>

        <div class="side-nav" id="sideNav">
            ${htmlUpdateOverride}
            ${htmlModoTrabajo}
            <div class="menu-section">
                <div class="menu-section-title">🔍 BÚSQUEDA INTELIGENTE</div>
                <input type="text" id="semanticSearchInput" class="search-input" placeholder="Ej: cardiología, cirugía, módulo exacto...">
                <div class="detection-panel" id="hierarchyDetections">
                    <div style="color: #6c8db0; font-size: 0.75rem;">📝 Escribe para detectar especialidades o buscar en directorios locales...</div>
                </div>
            </div>
            <div class="menu-section">
                <div class="menu-section-title">📋 FILTRO MANUAL</div>
                <select id="serviceSelectFilter">
                    <option value="Todos">🌐 Todos los servicios / locales</option>
                    <option value="Medicina interna">🫀 Medicina interna</option>
                    <option value="Cirugia">🔪 Cirugía</option>
                    <option value="Obstetricia">🤰 Obstetricia</option>
                    <option value="Pediatria">🍼 Pediatría</option>
                    <option value="Traumatologia">🦴 Traumatología</option>
                    <option value="Directorio Base">📂 Módulos no indexados</option>
                </select>
            </div>
            <div class="menu-section">
                <div class="menu-section-title">✅ LISTA BLANCA (INCLUIR)</div>
                <textarea readonly id="includeTerms" class="search-input" rows="2" placeholder="Forzar visualización (separado por comas/saltos)"></textarea>
            </div>
            <div class="menu-section">
                <div class="menu-section-title" style="border-left-color: #b91c1c;">🚫 LISTA NEGRA (EXCLUIR)</div>
                <textarea readonly id="excludeTerms" class="search-input" rows="2" placeholder="Ocultar estrictamente (separado por comas/saltos)"></textarea>
            </div>
            <div class="menu-section" style="margin-top:auto; display: ${displayPulgar};">
                <button id="purgeMenuButton" class="purge-menu-btn">🧹 PURGAR TERMINAL</button>
            </div>
        </div>
        <div class="nav-overlay" id="navOverlay"></div>

        <div id="cardsContainer" class="cards-grid"></div>
        <div id="resultStats" class="result-stats"></div>
    `;

    document.getElementById('excludeTerms').value = localStorage.getItem('filtro_lista_negra') || '';
    document.getElementById('includeTerms').value = localStorage.getItem('filtro_lista_blanca') || '';

    const selectOverride = document.getElementById('updateOverrideSelect');
    if (selectOverride) {
        selectOverride.addEventListener('change', (e) => {
            localStorage.setItem('tactico_override_bd', e.target.value);
            if (e.target.value === 'si') alert("⚠️ Alerta de Seguridad: El script de BD tomará el control absoluto de los módulos en el próximo despliegue.");
        });
    }

    const selectModoTrabajoElem = document.getElementById('modoTrabajoSelect');
    if (selectModoTrabajoElem) {
        selectModoTrabajoElem.addEventListener('change', (e) => {
            localStorage.setItem('modo_trabajo', e.target.value);
            if (e.target.value === 'offline') {
                alert("🔌 Operación Sombra activada. La terminal operará de forma aislada a partir del próximo inicio.");
            } else {
                alert("🌐 Conexión restaurada. La terminal verificará su estado con la Comandancia en el próximo inicio.");
            }
        });
    }

    const jerarquiaActiva = window.obtenerJerarquiaActiva();
    const detector = new DetectorJerarquico(jerarquiaActiva);

    let modulosEnriquecidos = modulosDisponibles.map(mod => {
        let nombreLimpio = mod.nombre.replace(/_/g, ' ');
        let deteccion = detector.detectar(nombreLimpio);
        let metadata = { especialidad: "Directorio Base", subespecialidad: "Local", nombreDisplay: mod.nombre, esDiccionario: false };

        if (deteccion.procedimientos.size > 0) {
            let proc = Array.from(deteccion.procedimientos.values())[0];
            metadata = { especialidad: proc.especialidad, subespecialidad: proc.subespecialidad, nombreDisplay: proc.nombre, esDiccionario: true };
        } else if (deteccion.subespecialidades.size > 0) {
            let sub = Array.from(deteccion.subespecialidades.entries())[0];
            metadata = { especialidad: sub[1].especialidadPadre, subespecialidad: sub[0], nombreDisplay: nombreLimpio, esDiccionario: true };
        } else if (deteccion.especialidades.size > 0) {
            let esp = Array.from(deteccion.especialidades.keys())[0];
            metadata = { especialidad: esp, subespecialidad: "General", nombreDisplay: nombreLimpio, esDiccionario: true };
        }
        return { ...mod, ...metadata };
    });

    function renderizarModulos(textoBusqueda = "", filtroEspecialidad = "Todos") {
        let resultados = modulosEnriquecidos;
        let excludeVal = document.getElementById('excludeTerms').value.toLowerCase();
        let includeVal = document.getElementById('includeTerms').value.toLowerCase();

        localStorage.setItem('filtro_lista_negra', excludeVal);
        localStorage.setItem('filtro_lista_blanca', includeVal);

        let excludeTerms = excludeVal.split(/[\n,]+/).map(t => t.trim()).filter(t => t);
        let includeTerms = includeVal.split(/[\n,]+/).map(t => t.trim()).filter(t => t);

        if (textoBusqueda.trim() !== "") {
            let detecciones = detector.detectar(textoBusqueda);
            
            const containerDet = document.getElementById('hierarchyDetections');
            if (detecciones.especialidades.size > 0 || detecciones.subespecialidades.size > 0 || detecciones.procedimientos.size > 0) {
                containerDet.innerHTML = `<div style="color: #7aa9ff; font-size: 0.75rem;">📊 Detección Semántica Activa</div>`;
            } else {
                containerDet.innerHTML = `<div style="color: #6c8db0; font-size: 0.75rem;">Buscando directamente en directorios locales...</div>`;
            }

            let permitidosSemanticos = detector.obtenerModulosFiltrados(detecciones).map(m => m.procedimiento.toLowerCase());

            resultados = resultados.filter(m => {
                let matchSemantico = permitidosSemanticos.includes(m.nombreDisplay.toLowerCase()) || permitidosSemanticos.includes(m.nombre.toLowerCase());
                let matchLiteral = m.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) || m.nombreDisplay.toLowerCase().includes(textoBusqueda.toLowerCase());
                return matchSemantico || matchLiteral;
            });
        } else {
            document.getElementById('hierarchyDetections').innerHTML = '<div style="color: #6c8db0; font-size: 0.75rem;">📝 Escribe para detectar especialidades o buscar en directorios locales...</div>';
        }

        if (filtroEspecialidad !== "Todos") resultados = resultados.filter(m => m.especialidad === filtroEspecialidad);

        if (includeTerms.length > 0) {
            resultados = resultados.filter(m => {
                let cadenaDatos = (m.nombre + " " + m.nombreDisplay + " " + m.especialidad + " " + m.subespecialidad).toLowerCase();
                return includeTerms.some(term => cadenaDatos.includes(term));
            });
        }

        if (excludeTerms.length > 0) {
            resultados = resultados.filter(m => {
                let cadenaDatos = (m.nombre + " " + m.nombreDisplay + " " + m.especialidad + " " + m.subespecialidad).toLowerCase();
                return !excludeTerms.some(term => cadenaDatos.includes(term));
            });
        }

        const container = document.getElementById('cardsContainer');
        if (resultados.length === 0) {
            container.innerHTML = `<div class="empty-message">🔍 No se encontraron módulos compatibles.<br><br><small style="color:#6c8db0">Revise los parámetros tácticos activos.</small></div>`;
            document.getElementById('resultStats').innerHTML = `📊 0 resultados`;
            return;
        }

        let cardsHtml = "";
        resultados.forEach(mod => {
            let icon = mod.esDiccionario ? '⚕️' : '📦';
            let badgeHtml = mod.esDiccionario
                ? `<span class="badge-serv">🏥 ${mod.especialidad}</span><span class="badge-sub">📁 ${mod.subespecialidad}</span>`
                : `<span class="badge-serv" style="background:#4a5568;">📁 Módulo Base (No indexado)</span>`;

            cardsHtml += `
                <div class="med-card" onclick="window.iniciarModulo('${mod.nombre}')">
                    <div class="card-title">${icon} ${mod.nombreDisplay}</div>
                    <div>${badgeHtml}</div>
                    <div class="card-sub" style="font-family:monospace; margin-top:12px;">ID: ${mod.nombre}</div>
                </div>
            `;
        });
        container.innerHTML = cardsHtml;
        document.getElementById('resultStats').innerHTML = `📊 ${resultados.length} módulos detectados listos para despliegue`;
    }

    const triggerUpdate = () => renderizarModulos(document.getElementById('semanticSearchInput').value, document.getElementById('serviceSelectFilter').value);
    
    document.getElementById('semanticSearchInput').addEventListener('input', triggerUpdate);
    document.getElementById('serviceSelectFilter').addEventListener('change', triggerUpdate);
    document.getElementById('excludeTerms').addEventListener('input', triggerUpdate);
    document.getElementById('includeTerms').addEventListener('input', triggerUpdate);
    
    document.getElementById('burgerBtn').addEventListener('click', () => {
        document.getElementById('sideNav').classList.add('open');
        document.getElementById('navOverlay').classList.add('active');
    });
    document.getElementById('navOverlay').addEventListener('click', () => {
        document.getElementById('sideNav').classList.remove('open');
        document.getElementById('navOverlay').classList.remove('active');
    });
    
    const purgeButtonElem = document.getElementById('purgeMenuButton');
    if (purgeButtonElem) {
        purgeButtonElem.addEventListener('click', () => ejecutarProtocoloDestruccionFisica('Purga Manual'));
    }

    renderizarModulos();
};

// 🛠️ CORRECCIÓN APLICADA: Evaluación de punto de entrada post-resolución de subcarpeta
async function iniciarModulo(nombreModulo) {
    let rutaBase = cordova.file.dataDirectory + nombreModulo;
    document.body.innerHTML = `<div style="color:#00ffcc; font-family:monospace; font-size: 1.2rem; font-weight:bold; display:flex; justify-content:center; align-items:center; height:100vh; background:#0b0f19;"><h3>Escaneando núcleo de ${nombreModulo}...</h3></div>`;
    
    try {
        const entradas = await obtenerEntradasDeCarpeta(rutaBase);
        let tieneAppHtml = entradas.some(e => e.name === 'app.html');
        let tieneIndexHtml = entradas.some(e => e.name === 'index.html');
        let indexName = tieneAppHtml ? 'app.html' : (tieneIndexHtml ? 'index.html' : null);
        
        if (!indexName) {
            let subcarpetas = entradas.filter(e => e.isDirectory);
            if (subcarpetas.length === 1) {
                rutaBase = rutaBase + "/" + subcarpetas[0].name;
                // Re-escaneo de subcarpeta para asegurar la existencia del index real
                const subEntradas = await obtenerEntradasDeCarpeta(rutaBase);
                if (subEntradas.some(e => e.name === 'app.html')) indexName = 'app.html';
                else if (subEntradas.some(e => e.name === 'index.html')) indexName = 'index.html';
                else throw new Error("Estructura corrupta");
            } else {
                alert(`❌ ERROR: No existe app.html ni index.html y la estructura está corrupta.`);
                return iniciarPanelDeControl();
            }
        }
        
        window.moduloActualBaseURL = rutaBase;
        window.historialNavegacion = []; 
        setTimeout(() => navegarA(indexName), 300);
        
    } catch (error) {
        alert("Falla estructural: No se pudo leer la memoria del módulo.");
        iniciarPanelDeControl();
    }
}

// ==============================================================================
// 4. MOTOR DE NAVEGACIÓN Y EXTRACCIÓN (FORENSE JSON)
// ==============================================================================
async function navegarA(archivoHTML) {
    let base = window.moduloActualBaseURL || "";
    if (base.endsWith('/')) base = base.slice(0, -1);
    
    let rutaCompleta = base ? base + "/" + archivoHTML : archivoHTML;
    let contenidoHTML = "";

    try {
        contenidoHTML = await leerArchivoLocal(rutaCompleta);
    } catch (e) {
        console.warn(`[Auditoría] No se halló en la raíz. Iniciando escaneo profundo para ${archivoHTML}...`);
        
        let subcarpetasComunes = ['dist', 'www', 'public', 'build', 'src'];
        let encontrado = false;
        
        for (let sub of subcarpetasComunes) {
            try {
                let rutaAlterna = base + "/" + sub + "/" + archivoHTML;
                contenidoHTML = await leerArchivoLocal(rutaAlterna);
                if (contenidoHTML) {
                    rutaCompleta = rutaAlterna; 
                    base = base + "/" + sub;    
                    window.moduloActualBaseURL = base; 
                    encontrado = true;
                    console.log(`[Escudo] Archivo localizado en subdirectorio: /${sub}/`);
                    break;
                }
            } catch(err) {}
        }

        if (!encontrado) {
            throw new Error(`Fallo estructural crítico: ${archivoHTML} no existe en este módulo.`);
        }
    }

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(contenidoHTML, "text/html");

        document.querySelectorAll('.dinamico-modulo').forEach(e => e.remove());

        // FALLBACK DE SEGURIDAD: ID Forzado si no lo encuentra Cordova
        let uuidDispositivo = (window.device && window.device.uuid) ? window.device.uuid : "e29197832058aab9";
        let rutaBD = localStorage.getItem('ruta_fisica_BD');
        
        if (rutaBD && (archivoHTML === 'index.html' || archivoHTML === 'app.html')) {
            if (rutaBD.endsWith('/')) rutaBD = rutaBD.slice(0, -1);
            
            try {
                let configPath = rutaBD + "/config/" + uuidDispositivo + ".json";
                let configFallbackPath = rutaBD + "/config/todos.json";
                let configJsonStr = null;

                try {
                    configJsonStr = await leerArchivoLocal(configPath);
                } catch (e) {
                    // Si falla el archivo por UUID, tomamos el mando con el archivo global
                    configJsonStr = await leerArchivoLocal(configFallbackPath);
                }
                
                // INICIO DEL BLOQUE SEGURO TRY
                if (configJsonStr && configJsonStr.trim() !== '') {
                    let configDevice = JSON.parse(configJsonStr);
                    console.log(`📝 Análisis forense de JSON completado.`);
                    
                    if (configDevice.mod) {
                        
                        if (Array.isArray(configDevice.mod.incluir) && configDevice.mod.incluir.length > 0) {
                            let textoIn = configDevice.mod.incluir.join(',\n');
                            localStorage.setItem('filtro_lista_blanca', textoIn);
                            let inputIn = document.getElementById('includeTerms');
                            if(inputIn) inputIn.value = textoIn;
                        } else {
                            localStorage.removeItem('filtro_lista_blanca');
                            let inputIn = document.getElementById('includeTerms');
                            if(inputIn) inputIn.value = '';
                        }

                        if (Array.isArray(configDevice.mod.excluir) && configDevice.mod.excluir.length > 0) {
                            let textoEx = configDevice.mod.excluir.join(',\n');
                            localStorage.setItem('filtro_lista_negra', textoEx);
                            let inputEx = document.getElementById('excludeTerms');
                            if(inputEx) inputEx.value = textoEx;
                        } else {
                            localStorage.removeItem('filtro_lista_negra');
                            let inputEx = document.getElementById('excludeTerms');
                            if(inputEx) inputEx.value = '';
                        }

                    } else {
                        localStorage.removeItem('filtro_lista_blanca');
                        localStorage.removeItem('filtro_lista_negra');
                        let inT = document.getElementById('includeTerms');
                        let exT = document.getElementById('excludeTerms');
                        if(inT) inT.value = '';
                        if(exT) exT.value = '';
                    }
                    
                    let valConexion = configDevice.conexion !== undefined ? configDevice.conexion : "online";
                    let valActualizacion = configDevice.actualizacion !== undefined ? configDevice.actualizacion : "no";
                    let valPulgar = configDevice.pulgar !== undefined ? String(configDevice.pulgar).toLowerCase() : "false";

                    localStorage.setItem('tactico_conexion', valConexion);
                    localStorage.setItem('tactico_actualizacion', valActualizacion);
                    localStorage.setItem('tactico_pulgar', valPulgar);
                    
                    if (typeof window.renderizarModulos === 'function' && document.getElementById('cardsContainer')) {
                        window.renderizarModulos();
                    }
                    
                    if (Array.isArray(configDevice.css)) {
                        for (let cssFile of configDevice.css) {
                            let cContent = await leerArchivoLocal(rutaBD + "/" + cssFile);
                            if (cContent) {
                                let sEl = doc.createElement('style');
                                sEl.className = 'dinamico-modulo override-css-bd';
                                sEl.innerHTML = cContent;
                                doc.head.appendChild(sEl);
                            }
                        }
                    }
                    
                    if (Array.isArray(configDevice.js)) {
                        for (let i = 0; i < configDevice.js.length; i++) {
                            let jsFile = configDevice.js[i];
                            if (jsFile.includes('loader-mobile.js') || jsFile.includes('loader-modile.js')) continue;
                            
                            let jContent = await leerArchivoLocal(rutaBD + "/" + jsFile);
                            if (jContent) {
                                let sriEsperado = (configDevice.sri && configDevice.sri[i]) ? configDevice.sri[i] : null;
                                let sriValido = true;
                                
                                if (sriEsperado && window.crypto && window.crypto.subtle) {
                                    try {
                                        let partes = sriEsperado.split('-');
                                        let alg = partes.length > 1 ? partes[0].toUpperCase() : 'SHA-256';
                                        if(alg !== 'SHA-256' && alg !== 'SHA-384' && alg !== 'SHA-512') alg = 'SHA-256';
                                        
                                        let buffer = new TextEncoder().encode(jContent);
                                        let hashBuf = await crypto.subtle.digest(alg, buffer);
                                        let hashArr = Array.from(new Uint8Array(hashBuf));
                                        let hashB64 = btoa(String.fromCharCode.apply(null, hashArr));
                                        
                                        if (hashB64 !== partes[1]) {
                                            console.error(`🛡️ SRI INVÁLIDO detectado en ${jsFile}. Inyección abortada por seguridad.`);
                                            sriValido = false;
                                        }
                                    } catch(e) {}
                                }
                                
                                if (sriValido) {
                                    let scEl = doc.createElement('script');
                                    scEl.className = 'dinamico-modulo override-js-bd';
                                    scEl.textContent = jContent;
                                    doc.head.appendChild(scEl);
                                }
                            }
                        }
                    }
                } // CIERRE DEL IF PRINCIPAL
            } catch(e) {
                console.warn("Falla controlada de lectura de configuraciones.", e);
            } // CIERRE PERFECTO DEL TRY JSON
        }

        const cssAInyectar = [];
        doc.querySelectorAll('link[rel="stylesheet"], style').forEach(css => {
            let href = css.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('data:')) cssAInyectar.push({ tipo: 'link', src: href });
            else if (!href) cssAInyectar.push({ tipo: 'style', content: css.innerHTML });
            css.remove();
        });

        doc.querySelectorAll('[src], source, track').forEach(el => {
            let val = el.getAttribute('src');
            if (val && !val.startsWith('http') && !val.startsWith('data:') && !val.startsWith('blob:') && !val.startsWith('file:')) {
                el.setAttribute('src', base + "/" + val);
            }
        });
        
        doc.querySelectorAll('use[href]').forEach(el => {
            let val = el.getAttribute('href');
            if (val && !val.startsWith('http') && !val.startsWith('data:') && !val.startsWith('#')) el.setAttribute('href', base + "/" + val);
        });

        doc.querySelectorAll('a').forEach(a => {
            let val = a.getAttribute('href');
            if (!val || val.startsWith('javascript:') || val === '#') return;
            const extDoc = ['.pdf', '.docx', '.xlsx', '.pptx', '.doc', '.xls', '.ppt'];
            let esDoc = extDoc.some(ext => val.toLowerCase().endsWith(ext));

            a.onclick = (e) => {
                e.preventDefault();
                if (esDoc) window.postMessage({ accion: 'abrirDocumento', url: val }, '*');
                else if (val.startsWith('http')) {
                    if (window.cordova && cordova.InAppBrowser) cordova.InAppBrowser.open(val, '_system');
                    else window.open(val, '_system');
                } else if (val.endsWith('.html')) {
                    if (!window.historialNavegacion) window.historialNavegacion = [];
                    window.historialNavegacion.push(archivoHTML); 
                    navegarA(val.split('/').pop()); 
                }
            };
        });

        const scriptsAInyectar = [];
        doc.querySelectorAll('script').forEach(script => {
            let tipoAttr = script.getAttribute('type');
            let isExecutable = !tipoAttr || tipoAttr.toLowerCase().includes('javascript') || tipoAttr.toLowerCase() === 'module';
            if (!isExecutable) return; 
            let srcVal = script.getAttribute('src');
            if (srcVal && srcVal.includes('cordova.js')) { script.remove(); return; }
            let atributosExtras = Array.from(script.attributes).filter(a => a.name !== 'src').map(attr => ({ name: attr.name, value: attr.value }));
            
            if (srcVal) scriptsAInyectar.push({ tipo: 'externo', src: srcVal, attrs: atributosExtras });
            else scriptsAInyectar.push({ tipo: 'inline', content: script.textContent, attrs: atributosExtras });
            script.remove(); 
        });

        document.body.style.display = "block";           
        document.body.style.backgroundColor = "#ffffff"; 
        document.body.style.height = "auto";
        document.body.style.color = "#000000";
        document.body.className = doc.body.className || "hospital-ui"; 
        document.body.innerHTML = doc.body.innerHTML;    

        for (let css of cssAInyectar) {
            try {
                let styleEl = document.createElement('style');
                styleEl.className = 'dinamico-modulo';
                if (css.tipo === 'link') {
                    let rutaSeguraCSS = css.src.startsWith('file://') ? css.src : base + "/" + css.src;
                    let cssContent = await leerArchivoLocal(rutaSeguraCSS);
                    let cssBaseDir = rutaSeguraCSS.substring(0, rutaSeguraCSS.lastIndexOf('/'));
                    const regexURLs = /url\(\s*['"]?(?!data:|http:|https:)([^'"\)]+)['"]?\s*\)/ig;
                    let urlsEncontradas = [...cssContent.matchAll(regexURLs)];
                    for (let match of urlsEncontradas) {
                        let rutaLimpia = match[1].match(/([^?#]+)([?#].*)?/)[1]; 
                        let partesBase = cssBaseDir.split('/');
                        let partesRel = rutaLimpia.split('/');
                        for (let p of partesRel) {
                            if (p === '.' || p === '') continue;
                            if (p === '..') partesBase.pop(); else partesBase.push(p);
                        }
                        let rutaAbsoluta = partesBase.join('/');
                        try {
                            let dataBase64 = await leerArchivoComoBase64(rutaAbsoluta);
                            cssContent = cssContent.split(match[0]).join(`url('${dataBase64}')`);
                        } catch(e) { cssContent = cssContent.split(match[0]).join(`url('${rutaAbsoluta}')`); }
                    }
                    styleEl.innerHTML = cssContent;
                } else {
                    styleEl.innerHTML = css.content;
                }
                document.head.appendChild(styleEl);
            } catch (err) {}
        }

        for (let s of scriptsAInyectar) {
            try {
                let sEl = document.createElement('script');
                sEl.className = 'dinamico-modulo';
                s.attrs.forEach(attr => sEl.setAttribute(attr.name, attr.value));
                
                if (s.tipo === 'externo') {
                    if (s.src.startsWith('http')) {
                        await new Promise((res) => { sEl.src = s.src; sEl.onload = res; sEl.onerror = res; document.body.appendChild(sEl); });
                        continue;
                    }
                    let rutaSeguraScript = s.src.startsWith('file://') ? s.src : base + "/" + s.src;
                    const jsContent = await leerArchivoLocal(rutaSeguraScript);
                    
                    if (!/^\s*(<html|<!DOCTYPE|<body|<div|<span|<p|<\?xml)/i.test(jsContent)) {
                        sEl.textContent = jsContent;
                        document.body.appendChild(sEl);
                    }
                } else {
                    sEl.textContent = s.content; 
                    document.body.appendChild(sEl);
                }
            } catch (err) {}
        }

        document.dispatchEvent(new Event('ModuloCargado'));
        window.dispatchEvent(new CustomEvent('vistaCargada', { detail: { ruta: archivoHTML } }));

    } catch (error) {
        document.body.innerHTML = `
            <div style="padding:2rem; text-align:center; font-family:sans-serif; color:#333;">
                <h2 style="color:#e74c3c;">Error de Navegación</h2>
                <p>No se pudo cargar: <strong>${archivoHTML}</strong></p>
                <button onclick="window.historialNavegacion && window.historialNavegacion.length>0 ? window.navegarA(window.historialNavegacion.pop()) : alert('Sin historial')" 
                        style="padding:10px 20px; background:#3498db; color:white; border:none; border-radius:5px; cursor:pointer;">
                    Volver Atrás
                </button>
            </div>`;
    }
};

document.addEventListener("backbutton", (e) => {
    e.preventDefault();
    retrocederNavegacion();
}, false);

window.addEventListener('message', function(event) {
    if (!event.data || typeof event.data !== 'object' || !event.data.accion) return;
    try {
        const accion = event.data.accion;
        const url = event.data.url ? String(event.data.url).trim() : "";

        if (accion === 'abrirExterno') {
            if (!url.startsWith('http://') && !url.startsWith('https://')) return console.error("🛡️ [Auditoría] URL no segura bloqueada.");
            if (window.cordova && cordova.InAppBrowser) cordova.InAppBrowser.open(url, '_system');
            else window.open(url, '_system');
        } 
        else if (accion === 'navegarInterno') {
            if (!url) return;
            let paginaActual = window.historialNavegacion[window.historialNavegacion.length - 1] || 'app.html';
            if (paginaActual !== url) window.historialNavegacion.push(paginaActual);
            let archivoDestino = url.split(/[?#]/)[0].split('/').pop(); 
            if (archivoDestino.endsWith('.html') && typeof window.navegarA === 'function') window.navegarA(archivoDestino);
        }
        else if (accion === 'imprimir') {
            if (window.cordova && cordova.plugins && cordova.plugins.printer) {
                let htmlParaImprimir = event.data.contenido ? String(event.data.contenido) : window.prepararHTMLImpresion(document);
                cordova.plugins.printer.print(htmlParaImprimir, { name: 'Reporte_Medico', duplex: 'long' }, () => console.log('🖨️ Impresión lista'));
            }
        }
        else if (accion === 'abrirDocumento') {
            if (!url) return;
            let rutaAbsoluta = url.startsWith('file://') ? url : window.moduloActualBaseURL + "/" + url;
            if (window.cordova && cordova.plugins && cordova.plugins.fileOpener2) {
                let urlLower = url.toLowerCase();
                let mimeType = 'application/pdf';
                if (urlLower.endsWith('.xlsx') || urlLower.endsWith('.xls')) mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                else if (urlLower.endsWith('.docx') || urlLower.endsWith('.doc')) mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                else if (urlLower.endsWith('.pptx') || urlLower.endsWith('.ppt')) mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
                
                cordova.plugins.fileOpener2.open(rutaAbsoluta, mimeType, {
                    error: e => console.error('Falla al abrir documento:', e),
                    success: () => console.log('Documento abierto')
                });
            }
        }
    } catch (errorTelemetria) { console.error("💥 Falla en telemetría:", errorTelemetria); }
});

window.prepararHTMLImpresion = function(doc) {
    doc.querySelectorAll('input, textarea, select').forEach(el => {
        if (el.type === 'checkbox' || el.type === 'radio') {
            if (el.checked) el.setAttribute('checked', 'checked');
            else el.removeAttribute('checked');
        } else if (el.tagName === 'OPTION') {
            if (el.selected) el.setAttribute('selected', 'selected');
            else el.removeAttribute('selected');
        } else {
            el.setAttribute('value', el.value || '');
            if (el.tagName === 'TEXTAREA') el.innerHTML = el.value || '';
        }
    });
    return doc.documentElement.outerHTML;
};

window.print = function() {
    let htmlPuro = window.prepararHTMLImpresion(document);
    window.postMessage({ accion: 'imprimir', contenido: htmlPuro }, '*');
};

function obtenerEntradasDeCarpeta(pathAbsoluto) {
    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(pathAbsoluto, function(dirEntry) {
            let directoryReader = dirEntry.createReader();
            directoryReader.readEntries(function(entries) { resolve(entries); }, reject);
        }, reject);
    });
}

function leerArchivoLocal(pathAbsoluto) {
    return new Promise((resolve, reject) => {
        if (pathAbsoluto.startsWith('http://') || pathAbsoluto.startsWith('https://') || pathAbsoluto.startsWith('data:')) {
            return resolve(''); 
        }
        window.resolveLocalFileSystemURL(pathAbsoluto, (entry) => {
            if (!entry.isFile) {
                console.warn(`[Auditoría] Intento de leer un directorio como archivo: ${pathAbsoluto}`);
                return resolve('');
            }
            entry.file((file) => {
                let reader = new FileReader();
                reader.onload = function() { resolve(this.result); };
                reader.onerror = function() { reject(new Error("Error leyendo memoria física")); };
                reader.readAsText(file);
            }, (err) => reject(new Error(`Fallo de lectura interna (Cód: ${err.code})`)));
        }, (err) => reject(new Error(`Archivo físico no encontrado: ${pathAbsoluto}`)));
    });
}

function leerArchivoComoBase64(pathAbsoluto) {
    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(pathAbsoluto, (fileEntry) => {
            fileEntry.file((file) => {
                let reader = new FileReader();
                reader.onload = function() { resolve(this.result); }; 
                reader.onerror = function() { reject(new Error("Error leyendo base64")); };
                reader.readAsDataURL(file); 
            }, reject);
        }, reject);
    });
}

function orquestarSincronizacion(paquetes, uiElement) {
    let completados = 0;
    for (let i = 0; i < paquetes.length; i++) {
        let paquete = paquetes[i];
        
        var sync = ContentSync.sync({ src: paquete.url, id: paquete.nombre, type: 'replace', copyCordova: false });
        
        sync.on('progress', (data) => { 
            if(uiElement) uiElement.innerText = `Sincronizando ${paquete.nombre}: ${data.progress}%`; 
        });
        
        sync.on('complete', (data) => {
            let rutaSegura = data.localPath;
            if (!rutaSegura.startsWith('file://') && !rutaSegura.startsWith('cdvfile://')) {
                rutaSegura = 'file://' + (rutaSegura.startsWith('/') ? '' : '/') + rutaSegura;
            }
            
            localStorage.setItem(`ruta_fisica_${paquete.nombre}`, rutaSegura);
            
            completados++;
            if (completados === paquetes.length) {
                if(uiElement) uiElement.innerText = "Sincronización completada. Iniciando terminal...";
                setTimeout(() => iniciarPanelDeControl(), 500);
            }
        });
        
        sync.on('error', (e) => {
            alert(`Falla de descarga en módulo: ${paquete.nombre}\nRevise su conexión a internet.`); 
            completados++;
            if (completados === paquetes.length) iniciarPanelDeControl();
        });
    }
}

function ejecutarProtocoloDestruccionFisica(motivo) {
    localStorage.clear(); 
    if (window.caches) caches.keys().then(names => { for (let n of names) caches.delete(n); });
    alert("☢️ PROTOCOLO WIPE EJECUTADO ☢️\n\nMotivo: " + motivo);
    if (navigator.app && navigator.app.exitApp) navigator.app.exitApp(); else window.close();
}

function solicitarPermisosTacticos() {
    return new Promise((resolve, reject) => {
        if (!cordova.plugins || !cordova.plugins.permissions) return resolve(); 
        const p = cordova.plugins.permissions;
        p.requestPermissions([p.CAMERA, p.ACCESS_FINE_LOCATION, p.WRITE_EXTERNAL_STORAGE, p.READ_EXTERNAL_STORAGE], 
            (status) => status.hasPermission ? resolve() : reject("Denegado"), reject);
    });
}

function retrocederNavegacion() {
    if (window.jQuery && window.jQuery('.modal.show').length > 0) {
        window.jQuery('.modal.show').modal('hide');
        return;
    }
    if (window.historialNavegacion.length > 0) {
        navegarA(window.historialNavegacion.pop());
    } else {
        if (confirm("¿Desea abandonar el módulo y volver al Panel Médico Maestro?")) {
            window.location.reload();
        }
    }
}

window.abandonarModulo = function() {
    if (window.jQuery && window.jQuery('.modal.show').length > 0) {
        window.jQuery('.modal.show').modal('hide');
    }
    if (confirm("¿Desea abandonar el módulo actual y volver al Panel Médico Maestro?")) {
        window.location.reload();
    }
};
window.abandonarmodulo = window.abandonarModulo;

const observadorDominio = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { 
                    if (node.tagName === 'IFRAME') procesarIframeDetectado(node);
                    node.querySelectorAll('iframe').forEach(iframe => procesarIframeDetectado(iframe));
                }
            });
        }
        else if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
            if (mutation.target.tagName === 'IFRAME') procesarIframeDetectado(mutation.target);
        }
    });
});

document.addEventListener('deviceready', () => {
    observadorDominio.observe(document.body, { 
        childList: true, 
        subtree: true, 
        attributes: true, 
        attributeFilter: ['src'] 
    });
});

async function procesarIframeDetectado(iframe) {
    let src = iframe.getAttribute('src');
    
    if (iframe.getAttribute('data-blindado') === src || !src || src === 'about:blank' || src.startsWith('javascript:')) return;
    if (src.startsWith('http://') || src.startsWith('https://')) return; 

    iframe.setAttribute('data-blindado', src); 
    iframe.removeAttribute('src'); 
    
    iframe.setAttribute('allow', 'geolocation; camera; microphone');

    let base = window.moduloActualBaseURL;
    if (base.endsWith('/')) base = base.slice(0, -1);

    let rutaCompleta;
    if (src.startsWith('file://') || src.startsWith('cdvfile://')) {
        rutaCompleta = src;
    } else {
        let srcLimpio = src.startsWith('/') ? src.substring(1) : (src.startsWith('./') ? src.substring(2) : src);
        rutaCompleta = base + "/" + srcLimpio;
    }

    try {
        iframe.srcdoc = `<div style="font-family:sans-serif; text-align:center; padding:20px; font-weight:bold; color:#2c3e50;">Desplegando módulo seguro...</div>`;
        
        const contenidoHTML = await leerArchivoLocal(rutaCompleta);
        const parser = new DOMParser();
        const doc = parser.parseFromString(contenidoHTML, "text/html");

        const cssAInyectar = [];
        doc.querySelectorAll('link[rel="stylesheet"], style').forEach(css => {
            let href = css.getAttribute('href');
            if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                cssAInyectar.push({ tipo: 'externo', src: href });
            } else if (href && !href.startsWith('data:')) {
                cssAInyectar.push({ tipo: 'link', src: href });
            } else if (!href) {
                cssAInyectar.push({ tipo: 'style', content: css.innerHTML });
            }
            css.remove();
        });

        for (let css of cssAInyectar) {
            if (css.tipo === 'externo') {
                let linkEl = doc.createElement('link');
                linkEl.rel = 'stylesheet'; linkEl.href = css.src;
                doc.head.appendChild(linkEl);
            } else {
                let styleEl = doc.createElement('style');
                if (css.tipo === 'link') {
                    let rutaSeguraCSS = css.src.startsWith('file://') ? css.src : base + "/" + css.src;
                    let cssContent = await leerArchivoLocal(rutaSeguraCSS);
                    if (cssContent) {
                        let cssBaseDir = rutaSeguraCSS.substring(0, rutaSeguraCSS.lastIndexOf('/'));
                        const regexURLs = /url\(\s*['"]?(?!data:|http:|https:)([^'"\)]+)['"]?\s*\)/ig;
                        let urlsEncontradas = [...cssContent.matchAll(regexURLs)];
                        for (let match of urlsEncontradas) {
                            let rel = match[1];
                            let limpia = rel.match(/([^?#]+)/)[1];
                            let pBase = cssBaseDir.split('/'), pRel = limpia.split('/');
                            for (let p of pRel) {
                                if (p === '.' || p === '') continue;
                                if (p === '..') pBase.pop(); else pBase.push(p);
                            }
                            let abs = pBase.join('/');
                            try {
                                let b64 = await leerArchivoComoBase64(abs);
                                cssContent = cssContent.split(match[0]).join(`url('${b64}')`);
                            } catch(e) { }
                        }
                    }
                    styleEl.innerHTML = cssContent;
                } else {
                    styleEl.innerHTML = css.content;
                }
                doc.head.appendChild(styleEl);
            }
        }

        doc.querySelectorAll('[src], source, track').forEach(el => {
            let val = el.getAttribute('src');
            if (val && !val.startsWith('http') && !val.startsWith('data:') && !val.startsWith('blob:') && !val.startsWith('file:')) {
                el.setAttribute('src', base + "/" + val);
            }
        });
        
        doc.querySelectorAll('use[href]').forEach(el => {
            let val = el.getAttribute('href');
            if (val && !val.startsWith('http') && !val.startsWith('data:') && !val.startsWith('#')) {
                el.setAttribute('href', base + "/" + val);
            }
        });

        const scriptsAInyectar = [];
        doc.querySelectorAll('script').forEach(s => {
            let sVal = s.getAttribute('src');
            if (sVal && !sVal.includes('cordova.js')) { scriptsAInyectar.push({src: sVal}); } 
            else if (!sVal) { scriptsAInyectar.push({inline: s.textContent}); }
            s.remove();
        });

        for (let s of scriptsAInyectar) {
            try {
                let sEl = doc.createElement('script');
                if (s.inline) { sEl.text = s.inline; } 
                else if (s.src.startsWith('http')) { sEl.src = s.src; } 
                else {
                    let rScript = s.src.startsWith('file://') ? s.src : base + "/" + s.src;
                    sEl.text = await leerArchivoLocal(rScript);
                }
                doc.body.appendChild(sEl);
            } catch(e) { console.warn(`Omisión script iframe: ${s.src}`); }
        }

        let secuestro = doc.createElement('script');
        secuestro.text = `
            document.addEventListener('DOMContentLoaded', function() {
                var e = document.createEvent('Events');
                e.initEvent('deviceready', true, false);
                document.dispatchEvent(e);
            });

            window.irA = function(url) {
                if (window.parent && typeof window.parent.cargarModulo === 'function') {
                    let botones = window.parent.document.querySelectorAll('.menu-item');
                    let btn = Array.from(botones).find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes(url));
                    if(btn) btn.click();
                    else window.parent.document.getElementById('app-frame').setAttribute('src', url);
                } else {
                    window.parent.postMessage({ accion: 'navegarInterno', url: url }, '*');
                }
            };

            document.addEventListener('click', function(e) {
                let a = e.target.closest('a');
                if (!a) return;
                let href = a.getAttribute('href');
                if (!href || href.startsWith('javascript:') || href === '#') return;
                e.preventDefault(); e.stopPropagation(); 
                
                const extensionesDoc = ['.pdf', '.docx', '.xlsx', '.pptx', '.doc', '.xls', '.ppt'];
                let esDocumento = extensionesDoc.some(ext => href.toLowerCase().endsWith(ext));
                
                if (esDocumento) window.parent.postMessage({ accion: 'abrirDocumento', url: href }, '*');
                else window.parent.postMessage({ accion: href.startsWith('http') ? 'abrirExterno' : 'navegarInterno', url: href }, '*');
            }, true);

            window.open = function(url) {
                if(url && url !== '') {
                    const exts = ['.pdf', '.docx', '.xlsx', '.pptx', '.doc', '.xls', '.ppt'];
                    let isDoc = exts.some(ext => url.toLowerCase().endsWith(ext));
                    window.parent.postMessage({ accion: isDoc ? 'abrirDocumento' : (url.startsWith('http') ? 'abrirExterno' : 'navegarInterno'), url: url }, '*');
                }
            };

            window.print = function() {
                document.querySelectorAll('input, textarea, select').forEach(el => {
                    if (el.type === 'checkbox' || el.type === 'radio') {
                        if (el.checked) el.setAttribute('checked', 'checked');
                        else el.removeAttribute('checked');
                    } else if (el.tagName === 'OPTION') {
                        if (el.selected) el.setAttribute('selected', 'selected');
                        else el.removeAttribute('selected');
                    } else {
                        el.setAttribute('value', el.value || '');
                        if (el.tagName === 'TEXTAREA') el.innerHTML = el.value || '';
                    }
                });
                window.parent.postMessage({ accion: 'imprimir', contenido: document.documentElement.outerHTML }, '*');
            };

            Object.defineProperty(window, 'location', { set: function(url) { window.irA(url); } });
        `;
        doc.body.appendChild(secuestro);
        iframe.srcdoc = doc.documentElement.outerHTML;

    } catch (error) {
        console.error("Falla en blindaje de iframe:", error);
        iframe.srcdoc = `<div style="color:red; text-align:center; padding:20px;">Error 404: Módulo Inaccesible<br><small>${rutaCompleta}</small></div>`;
    }
};

window.leerDataLocal = async function(rutaRelativa) {
    try {
        let base = window.moduloActualBaseURL;
        if (base.endsWith('/')) base = base.slice(0, -1);
        let rutaFisica = rutaRelativa.startsWith('file://') ? rutaRelativa : base + "/" + rutaRelativa;
        return await leerArchivoLocal(rutaFisica);
    } catch (error) {
        return null;
    }
};

window.crearWorkerSeguro = async function(rutaRelativaWorker) {
    try {
        let base = window.moduloActualBaseURL;
        if (base.endsWith('/')) base = base.slice(0, -1);
        let rutaFisica = rutaRelativaWorker.startsWith('file://') ? rutaRelativaWorker : base + "/" + rutaRelativaWorker;
        let codigoJS = await leerArchivoLocal(rutaFisica);
        let blob = new Blob([codigoJS], { type: 'application/javascript' });
        return new Worker(URL.createObjectURL(blob));
    } catch (error) {
        return null;
    }
};

window.importarArchivoExterno = function(extensiones, callback) {
    let inputFalso = document.createElement('input');
    inputFalso.type = 'file';
    if (extensiones) inputFalso.accept = extensiones; 
    inputFalso.onchange = function(evento) {
        let archivo = evento.target.files[0];
        if (!archivo) return callback(null, "Operación cancelada");
        let reader = new FileReader();
        reader.onload = function(e) { callback(e.target.result, null, archivo.name); };
        reader.onerror = function() { callback(null, "Error al extraer"); };

        let extsBinarias = ['.pdf', '.png', '.jpg', '.jpeg', '.woff'];
        if (extsBinarias.some(ext => archivo.name.toLowerCase().endsWith(ext))) reader.readAsDataURL(archivo);
        else reader.readAsText(archivo);
    };
    inputFalso.click();
};

window.guardarArchivoExterno = function(nombreArchivo, contenidoString) {
    return new Promise((resolve, reject) => {
        if (!window.cordova) return reject(new Error("Móvil requerido."));
        let directorioPublico = cordova.file.externalRootDirectory + "Download/";
        let nombreSubcarpeta = "OmniEngine_Exports";
        window.resolveLocalFileSystemURL(directorioPublico, function(dirEntry) {
            dirEntry.getDirectory(nombreSubcarpeta, { create: true }, function(subDirEntry) {
                subDirEntry.getFile(nombreArchivo, { create: true, exclusive: false }, function(fileEntry) {
                    fileEntry.createWriter(function(fileWriter) {
                        fileWriter.onwriteend = function() { resolve(fileEntry.nativeURL); };
                        let tipoMime = nombreArchivo.endsWith('.json') ? 'application/json' : (nombreArchivo.endsWith('.csv') ? 'text/csv' : 'text/plain');
                        fileWriter.write(new Blob([contenidoString], { type: tipoMime }));
                    }, reject);
                }, reject);
            }, reject);
        }, reject);
    });
};

window.eliminarArchivoExterno = function(rutaAbsolutaExterna) {
    return new Promise((resolve, reject) => {
        if (rutaAbsolutaExterna.startsWith('http')) return reject(new Error("Acción inválida."));
        window.resolveLocalFileSystemURL(rutaAbsolutaExterna, function(fileEntry) {
            fileEntry.remove(function() { resolve(true); }, reject);
        }, reject);
    });
};

window.guardarDataLocal = function(rutaRelativa, contenidoString) {
    return new Promise((resolve, reject) => {
        let base = window.moduloActualBaseURL;
        if (base.endsWith('/')) base = base.slice(0, -1);
        let partes = rutaRelativa.split('/');
        let nombreArchivo = partes.pop(); 
        let rutaDirectorio = base + (partes.length > 0 ? "/" + partes.join('/') : "");

        window.resolveLocalFileSystemURL(rutaDirectorio, function(dirEntry) {
            dirEntry.getFile(nombreArchivo, { create: true, exclusive: false }, function(fileEntry) {
                fileEntry.createWriter(function(fileWriter) {
                    fileWriter.truncate(0);
                    fileWriter.onwriteend = function() {
                        fileWriter.onwriteend = function() { resolve(true); };
                        fileWriter.write(new Blob([contenidoString], { type: 'application/json' }));
                    };
                }, reject);
            }, reject);
        }, reject);
    });
};

window.eliminarArchivoLocal = function(rutaRelativa) {
    return new Promise((resolve, reject) => {
        let base = window.moduloActualBaseURL;
        if (base.endsWith('/')) base = base.slice(0, -1);
        let rutaFisica = rutaRelativa.startsWith('file://') ? rutaRelativa : base + "/" + rutaRelativa;
        window.resolveLocalFileSystemURL(rutaFisica, function(fileEntry) {
            fileEntry.remove(function() { resolve(true); }, reject);
        }, (err) => resolve(true));
    });
};

window.MotorDatos = {
    _cacheColecciones: {},
    _indices: {},

    prepararColeccion: async function(rutaRelativa, camposAIndexar = ['id']) {
        let data = await this._obtenerColeccion(rutaRelativa);
        
        if (!this._indices[rutaRelativa]) this._indices[rutaRelativa] = {};
        
        camposAIndexar.forEach(campo => {
            this._indices[rutaRelativa][campo] = {};
            for (let i = 0; i < data.length; i++) {
                let valorCampo = data[i][campo];
                if (valorCampo) {
                    this._indices[rutaRelativa][campo][valorCampo] = i; 
                }
            }
        });
        console.log(`[MotorDatos] Colección ${rutaRelativa} indexada en RAM.`);
    },

    buscarExacto: async function(rutaRelativa, campo, valorExacto) {
        if (!this._indices[rutaRelativa] || !this._indices[rutaRelativa][campo]) {
            await this.prepararColeccion(rutaRelativa, [campo]);
        }
        
        let posicion = this._indices[rutaRelativa][campo][valorExacto];
        if (posicion !== undefined) {
            let data = await this._obtenerColeccion(rutaRelativa);
            return data[posicion];
        }
        return null;
    },

    searchFuzzy: async function(rutaRelativa, terminoBusqueda, camposABuscar) {
        let data = await this._obtenerColeccion(rutaRelativa);
        if (!data || data.length === 0 || !terminoBusqueda) return data || [];

        let terminos = terminoBusqueda.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').split(/\s+/);
        let regexString = "^" + terminos.map(t => `(?=.*${t})`).join('') + ".*$";
        let regexFuzzy = new RegExp(regexString, 'i');

        return data.filter(registro => {
            let textoRegistro = camposABuscar.map(campo => registro[campo] || '').join(' ');
            return regexFuzzy.test(textoRegistro);
        });
    },

    create: async function(rutaRelativa, nuevoRegistro) {
        let data = await this._obtenerColeccion(rutaRelativa);
        
        if (!nuevoRegistro.id) nuevoRegistro.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        
        data.push(nuevoRegistro); 
        let nuevaPosicion = data.length - 1;

        if (this._indices[rutaRelativa]) {
            for (let campoIndexado in this._indices[rutaRelativa]) {
                let valor = nuevoRegistro[campoIndexado];
                if (valor) this._indices[rutaRelativa][campoIndexado][valor] = nuevaPosicion;
            }
        }

        await window.guardarDataLocal(rutaRelativa, JSON.stringify(data));
        return nuevoRegistro;
    },

    update: async function(rutaRelativa, idRegistro, datosNuevos, upsert = false) {
        let data = await this._obtenerColeccion(rutaRelativa);
        
        let posicion = -1;
        if (this._indices[rutaRelativa] && this._indices[rutaRelativa]['id']) {
            posicion = this._indices[rutaRelativa]['id'][idRegistro] ?? -1;
        } else {
            posicion = data.findIndex(item => item.id === idRegistro);
        }
        
        if (posicion !== -1) {
            let registroViejo = { ...data[posicion] };
            data[posicion] = { ...data[posicion], ...datosNuevos };

            if (this._indices[rutaRelativa]) {
                for (let campoIndexado in this._indices[rutaRelativa]) {
                    let valorViejo = registroViejo[campoIndexado];
                    let valorNuevo = data[posicion][campoIndexado];
                    if (valorViejo !== valorNuevo) {
                        if (valorViejo) delete this._indices[rutaRelativa][campoIndexado][valorViejo];
                        if (valorNuevo) this._indices[rutaRelativa][campoIndexado][valorNuevo] = posicion;
                    }
                }
            }

            await window.guardarDataLocal(rutaRelativa, JSON.stringify(data));
            return data[posicion];
        } else if (upsert) {
            return await this.create(rutaRelativa, { id: idRegistro, ...datosNuevos });
        }
        return null;
    },

    delete: async function(rutaRelativa, idRegistro) {
        let data = await this._obtenerColeccion(rutaRelativa);
        
        let posicion = (this._indices[rutaRelativa] && this._indices[rutaRelativa]['id']) 
            ? this._indices[rutaRelativa]['id'][idRegistro] 
            : data.findIndex(item => item.id === idRegistro);

        if (posicion !== undefined && posicion !== -1) {
            data.splice(posicion, 1);
            
            delete this._cacheColecciones[rutaRelativa];
            delete this._indices[rutaRelativa];

            this._cacheColecciones[rutaRelativa] = data;
            
            await window.guardarDataLocal(rutaRelativa, JSON.stringify(data));
            return true;
        }
        return false; 
    },

    _obtenerColeccion: async function(rutaRelativa) {
        if (this._cacheColecciones[rutaRelativa]) {
            return this._cacheColecciones[rutaRelativa];
        }

        let contenido = await window.leerDataLocal(rutaRelativa);
        let resultado = [];
        if (contenido) {
            try { resultado = JSON.parse(contenido); } 
            catch (e) { console.error("Error parseando JSON de la BD.", e); }
        }
        
        this._cacheColecciones[rutaRelativa] = resultado;
        return resultado;
    }
};
var LLAVE_MAESTRA = "__LLAVE_TACTICA__";
window.inyectarModuloCifrado = function(rutaArchivoCifrado, LLAVE_MAESTRA) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(`[Orquestador] Solicitando descifrado de: ${rutaArchivoCifrado}`);
            
            // 1. Leer el archivo encriptado (.enc) físicamente
            const datosCifrados = await window.leerDataLocal(rutaArchivoCifrado);
            if (!datosCifrados) throw new Error("Archivo encriptado no encontrado.");

            // 2. Levantar el Worker Seguro
            const worker = await window.crearWorkerSeguro('js/worker-descifrador.js');
            if (!worker) throw new Error("Fallo al inicializar el entorno seguro (Worker).");

            // 3. Escuchar la respuesta del hilo en la sombra
            worker.onmessage = function(e) {
                if (e.data.estado === 'exito') {
                    // Inyectar el código descifrado directamente en la memoria del navegador
                    let scriptElement = document.createElement('script');
                    scriptElement.className = 'dinamico-modulo modulo-blindado';
                    scriptElement.textContent = e.data.codigo;
                    document.body.appendChild(scriptElement);
                    
                    console.log(`[Orquestador] 🛡️ Módulo inyectado exitosamente.`);
                    worker.terminate(); // Purgar el worker de la RAM
                    resolve(true);
                } else {
                    console.error("[Orquestador] 💥 Fallo de descifrado:", e.data.error);
                    worker.terminate();
                    reject(e.data.error);
                }
            };

            worker.onerror = function(err) {
                worker.terminate();
                reject("Error interno en el hilo del Worker.");
            };

            // 4. Ordenar la ejecución táctica
            worker.postMessage({
                accion: 'descifrar',
                id: rutaArchivoCifrado,
                datosCifrados: datosCifrados,
                llave: llaveTactica
            });

        } catch (error) {
            console.error(`[Orquestador] Error al procesar ${rutaArchivoCifrado}:`, error);
            reject(error);
        }
    });
};
