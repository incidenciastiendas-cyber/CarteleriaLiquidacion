// cenefas-app.js - lógica para cenefas promocionales
const cenefas = [
  {
    tipo: 'NxN',
    tipoOferta: '3X2',
    descripcionOferta: 'LLEVÁ 3 PAGÁ 2',
    fechaDesde: '26/11',
    fechaHasta: '02/12',
    objetoOferta: 'CERVEZAS QUILMES 1L',

    legal1: 'EL DESCUENTO SE HARÁ EFECTIVO EN LÍNEA DE CAJAS Y SE APLICARÁ SOBRE EL PRECIO UNITARIO',
    legal2: 'PROMOCIÓN VÁLIDA DESDE EL DÍA 26/11/2025 HASTA EL DÍA 02/12/2025. PARA MÁS INFORMACIÓN Y CONDICIONES O LIMITACIONES APLICABLES CONSULTE EN MASONLINE.COM.AR/LEGALES. DORINKA SRL 30-67813830-0.'
  },
  {
    tipo: 'MC',
    tipoOferta: '80%MC',
    descripcionOferta: 'DE DESCUENTO',
    fechaDesde: '20/11',
    fechaHasta: '26/11',
    objetoOferta: 'GAZEBOS, PÉRGOLAS, REPOSERAS DE JARDÍN, MESAS Y SILLAS DE JARDÍN',
    aclaracion: '(NO INCLUYE MUEBLES PLÁSTICOS NI MUEBLES DE PLAYAS)',
    legal1: 'EL DESCUENTO SE HARÁ EFECTIVO EN LÍNEA DE CAJAS Y SE APLICARÁ SOBRE EL PRECIO UNITARIO',
    legal2: 'PRIMERA UNIDAD A PRECIO DE LISTA. PROMOCIÓN VÁLIDA DEL 20/11/2025 HASTA EL DÍA 26/11/2025. PROMOCIÓN VÁLIDA DEL DÍA 20/11/2025 HASTA EL DÍA 26/11/2025. PARA MÁS INFORMACIÓN Y CONDICIONES O LIMITACIONES APLICABLES CONSULTE EN MASONLINE.COM.AR/LEGALES. DORINKA SRL 30-67813830-0. WWW.MASCLUB.COM.AR.'
  },
  {
    tipo: 'DESC-CUOTAS-MC',
    tipoOferta: '30%+6QMC',
    descripcionOferta: '',
    fechaDesde: '20/11',
    fechaHasta: '30/11',
    objetoOferta: 'SMART TV SAMSUNG 55 PULGADAS 4K UHD',
    aclaracion: '',
    legal1: 'EL DESCUENTO SE HARÁ EFECTIVO EN LÍNEA DE CAJAS Y SE APLICARÁ SOBRE EL PRECIO UNITARIO',
    legal2: 'PRIMERA UNIDAD A PRECIO DE LISTA. PROMOCIÓN VÁLIDA DEL 20/11/2025 HASTA EL DÍA 30/11/2025. PARA MÁS INFORMACIÓN Y CONDICIONES O LIMITACIONES APLICABLES CONSULTE EN MASONLINE.COM.AR/LEGALES. DORINKA SRL 30-67813830-0. WWW.MASCLUB.COM.AR.'
  },
];

const sample = {
    tipo: 'NxNMC2',
    tipoOferta: '3X2o4X2MC',
    descripcionOferta: 'LLEVÁ 3 PAGÁ 2 + LLEVÁ 4 PAGÁ 2',
    fechaDesde: '24/11',
    fechaHasta: '30/11',
    objetoOferta: 'ARTÍCULOS DE LIBRERÍA Y PAPELERÍA',
    aclaracion: '',
    legal1: 'EL DESCUENTO SE HARÁ EFECTIVO EN LÍNEA DE CAJAS Y SE APLICARÁ SOBRE EL PRECIO UNITARIO',
    legal2: 'PROMOCIÓN VÁLIDA DEL DÍA 24/11/2025 HASTA EL DÍA 30/11/2025. PARA MÁS INFORMACIÓN Y CONDICIONES O LIMITACIONES APLICABLES CONSULTE EN MASONLINE.COM.AR/LEGALES. DORINKA SRL 30-67813830-0. WWW.MASCLUB.COM.AR.'
 
};

// Detectar automáticamente el tipo de oferta según el contenido de tipoOferta
function detectarTipo(tipoOferta) {
  if (!tipoOferta) return 'NxN';
  const texto = tipoOferta.toUpperCase().trim();
  
  // PRECIO: contiene $ o números con decimales/puntos
  if (texto.includes('$') || /^\d{1,3}(\.\d{3})*$/.test(texto.replace(/\$/g, ''))) {
    return 'PRECIO';
  }
  
  // DESC-CUOTAS-MC: formato x%+NMC (ej: "30%+6QMC")
  if (/\d+%\+\d+Q?MC$/i.test(texto)) {
    return 'DESC-CUOTAS-MC';
  }
  
  // DESC-CUOTAS: contiene % Y un número seguido (ej: "30%+4")
  if (texto.includes('%') && texto.includes('+')) {
    return 'DESC-CUOTAS';
  }
  
  // MC2: formato x%ox%MC (ej: 30%o35%MC)
  if (/\d+%[oO]\d+%MC$/i.test(texto)) {
    return 'MC2';
  }
  
  // NxNMC2: formato NxNozxNMC (ej: 3X2o4X2MC)
  if (/\d+[xX]\d+[oO]\d+[xX]\d+MC$/i.test(texto)) {
    return 'NxNMC2';
  }
  
  // DESC2-MC: formato x%2MC (ej: 30%2MC - descuento en segunda unidad MasClub)
  if (/\d+%2MC$/i.test(texto)) {
    return 'DESC2-MC';
  }
  
  // MC: formato x%MC (ej: 80%MC)
  if (/\d+%MC$/i.test(texto)) {
    return 'MC';
  }
  
  // DESC2: contiene "2" seguido de % o palabra SEGUNDA/2° (ej: "30%2", "SEGUNDA")
  if (texto.includes('%') && (/\d+%2/i.test(texto) || texto.includes('SEGUNDA') || texto.includes('2°'))) {
    return 'DESC2';
  }
  
  // DESC1: contiene solo %
  if (texto.includes('%')) {
    return 'DESC1';
  }
  
  // NQ: contiene CUOTAS, Q al final con números, o solo un número (ej: "6Q", "6", "CUOTAS")
  if (texto.includes('CUOTAS') || /^\d{1,2}Q?$/i.test(texto)) {
    return 'NQ';
  }
  
  // NxN: contiene x (ej: 2x1, 3x2)
  if (texto.includes('X') || /\d+x\d+/i.test(texto)) {
    return 'NxN';
  }
  
  return 'NxN';  // default
}

// Generar HTML específico para cada tipo de oferta
function generarOfertaHTML(c, tipo) {
  const tipoOferta = escapeHtml(c.tipoOferta || '');
  const descripcion = escapeHtml(c.descripcionOferta || '');
  
  switch(tipo) {
    case 'NxN':
      // Formato: "2X1" con X mayúscula - genera automáticamente "LLEVÁ 2 PAGÁ 1"
      const matchNxN = tipoOferta.match(/(\d+)[xX](\d+)/);
      if (matchNxN) {
        const numLleva = matchNxN[1];
        const numPaga = matchNxN[2];
        return `<div class="oferta-nxn">
                  <span class="numero">${numLleva}</span><span class="x-pequena">X</span><span class="numero">${numPaga}</span>
                </div>
                <div class="oferta-descripcion">LLEVÁ ${numLleva} PAGÁ ${numPaga}</div>`;
      }
      return `<div class="oferta-principal">${tipoOferta}</div>`;
    
    case 'PRECIO':
      // Formato: "$3.999" con $ pequeño
      const precio = tipoOferta.replace('$', '');
      return `<div class="oferta-principal oferta-precio">
                <span class="signo-peso">$</span><span class="numero-precio">${precio}</span>
              </div>`;
    
    case 'DESC1':
      // Formato: "40%" con % pequeño alineado abajo
      const descuento = tipoOferta.replace('%', '');
      return `<div class="oferta-principal oferta-descuento">
                <span class="numero-descuento">${descuento}</span><span class="simbolo-porcentaje">%</span>
              </div>
              <div class="oferta-descripcion">DE DESCUENTO</div>`;
    
    case 'DESC2':
      // Formato: columnas "30% | DESCUENTO EN LA SEGUNDA UNIDAD"
      const desc2 = tipoOferta.replace(/%/g, '').replace(/2/g, '').trim();
      return `<div class="oferta-dos-columnas">
                <div class="col-numero">
                  <span class="numero-grande">${desc2}</span>
                </div>
                <div class="col-derecha">
                  <div class="simbolo-arriba">%</div>
                  <div class="texto-columna">DESCUENTO EN<br>LA SEGUNDA<br>UNIDAD</div>
                </div>
              </div>`;
    
    case 'NQ':
      // Formato: columnas "6 | CUOTAS SIN INTERÉS"
      const cuotas = tipoOferta.replace(/[^\d]/g, '');
      return `<div class="oferta-cuotas">
                <div class="col-numero-cuotas">
                  <span class="numero-cuotas">${cuotas}</span>
                </div>
                <div class="col-texto-cuotas">
                  <div class="texto-cuotas">CUOTAS<br>SIN INTERÉS</div>
                </div>
              </div>`;
    
    case 'DESC-CUOTAS':
      // Formato: dos filas "30% + 4" y "DE DESCUENTO | CUOTAS SIN INTERÉS"
      const matchDescCuotas = tipoOferta.match(/(\d+)%\+(\d+)/);
      if (matchDescCuotas) {
        const pct = matchDescCuotas[1];
        const nCuotas = matchDescCuotas[2];
        return `<div class="oferta-combinada">
                  <div class="fila-numeros">
                    <span class="numero-combo">${pct}</span><span class="simbolo-pequeno">%</span>
                    <span class="signo-mas">+</span>
                    <span class="numero-combo">${nCuotas}</span>
                  </div>
                  <div class="fila-textos">
                    <span class="texto-izq">DE DESCUENTO</span>
                    <span class="texto-der">CUOTAS<br><span class="sin-interes">SIN INTERÉS</span></span>
                  </div>
                </div>`;
      }
      return `<div class="oferta-principal">${tipoOferta}</div>`;
    
    case 'DESC-CUOTAS-MC':
      // Formato: 30%+6QMC - Descuento + Cuotas con Más Club (igual a DESC-CUOTAS pero con fondo azul)
      const matchDescCuotasMC = tipoOferta.match(/(\d+)%\+(\d+)Q?MC/i);
      if (matchDescCuotasMC) {
        const pct = matchDescCuotasMC[1];
        const nCuotas = matchDescCuotasMC[2];
        return `<div class="oferta-combinada">
                  <div class="fila-numeros">
                    <span class="numero-combo">${pct}</span><span class="simbolo-pequeno">%</span>
                    <span class="signo-mas">+</span>
                    <span class="numero-combo">${nCuotas}</span>
                  </div>
                  <div class="fila-textos">
                    <span class="texto-izq">DE DESCUENTO</span>
                    <span class="texto-der">CUOTAS<br><span class="sin-interes">SIN INTERÉS</span></span>
                  </div>
                </div>`;
      }
      return `<div class="oferta-principal">${tipoOferta}</div>`;
    
    case 'MC':
      // Formato: 80%MC con banner superior Más Club (banner fuera de oferta-content)
      const descMC = tipoOferta.match(/(\d+)%MC/i);
      if (descMC) {
        const pct = descMC[1];
        const descTexto = descripcion || 'DE DESCUENTO';
        return `<div class="mc-numero">${pct}<span class="mc-simbolo">%</span></div>
                <div class="mc-descripcion">${descTexto.toUpperCase()}</div>`;
      }
      return `<div class="oferta-principal">${tipoOferta}</div>`;
    
    case 'DESC2-MC':
      // Formato: 30%2MC - Descuento en segunda unidad con MasClub (replica DESC2, banner fuera)
      const descMC2Seg = tipoOferta.match(/(\d+)%2MC/i);
      if (descMC2Seg) {
        const pct = descMC2Seg[1];
        return `<div class="oferta-dos-columnas">
                  <div class="col-numero">
                    <span class="numero-grande">${pct}</span>
                  </div>
                  <div class="col-derecha">
                    <div class="simbolo-arriba">%</div>
                    <div class="texto-columna">DESCUENTO EN<br>LA SEGUNDA<br>UNIDAD</div>
                  </div>
                </div>`;
      }
      return `<div class="oferta-principal">${tipoOferta}</div>`;
    
    case 'NxNMC':
      // Formato: "2X1MC" con banner MasClub - genera automáticamente "LLEVÁ 2 PAGÁ 1"
      const matchNxNMC = tipoOferta.match(/(\d+)[xX](\d+)MC/i);
      if (matchNxNMC) {
        const numLleva = matchNxNMC[1];
        const numPaga = matchNxNMC[2];
        return `<div class="oferta-nxn">
                  <span class="numero">${numLleva}</span><span class="x-pequena">X</span><span class="numero">${numPaga}</span>
                </div>
                <div class="oferta-descripcion">LLEVÁ ${numLleva} PAGÁ ${numPaga}</div>`;
      }
      return `<div class="oferta-principal">${tipoOferta}</div>`;
    
    case 'MC2':
      // Formato: 30%o35%MC - Doble descuento con Más Club
      const descMC2 = tipoOferta.match(/(\d+)%[oO](\d+)%MC/i);
      if (descMC2) {
        const pct1 = descMC2[1];
        const pct2 = descMC2[2];
        // Vigencia se pasa como variable separada, no dentro del HTML de oferta
        return `<div class="mc2-dcto1">
                  <div class="mc2-numero1">${pct1}<span class="mc2-simbolo1">%</span></div>
                  <div class="mc2-texto1">
                    <div class="mc2-texto1-linea1">CON TODOS</div>
                    <div class="mc2-texto1-linea2">LOS MEDIOS DE PAGO</div>
                  </div>
                </div>
                <div class="mc2-separador">DESCUENTOS NO ACUMULABLES</div>
                <div class="mc2-dcto2">
                  <div class="mc2-numero2">${pct2}<span class="mc2-simbolo2">%</span></div>
                  <div class="mc2-texto2">
                    <span class="mc2-exclusivo">EXCLUSIVO</span>
                    <img src="assets/logos/masclub.png" alt="Más club" class="mc2-logo">
                  </div>
                </div>`;
      }
      return `<div class="oferta-principal">${tipoOferta}</div>`;
    
    case 'NxNMC2':
      // Formato: 3X2o4X2MC - NxN general + NxN MasClub (replica MC2 con NxN)
      const descNxNMC2 = tipoOferta.match(/(\d+)[xX](\d+)[oO](\d+)[xX](\d+)MC/i);
      if (descNxNMC2) {
        const num1 = descNxNMC2[1];
        const paga1 = descNxNMC2[2];
        const num2 = descNxNMC2[3];
        const paga2 = descNxNMC2[4];
        return `<div class="mc2-dcto1">
                  <div class="mc2-numero1">${num1}X${paga1}</div>
                  <div class="mc2-texto1">
                    <div class="mc2-texto1-linea1">CON TODOS</div>
                    <div class="mc2-texto1-linea2">LOS MEDIOS DE PAGO</div>
                  </div>
                </div>
                <div class="mc2-separador">DESCUENTOS NO ACUMULABLES</div>
                <div class="mc2-dcto2">
                  <div class="mc2-numero2">${num2}X${paga2}</div>
                  <div class="mc2-texto2">
                    <span class="mc2-exclusivo">EXCLUSIVO</span>
                    <img src="assets/logos/masclub.png" alt="Más club" class="mc2-logo">
                  </div>
                </div>`;
      }
      return `<div class="oferta-principal">${tipoOferta}</div>`;
    
    default:
      return `<div class="oferta-principal">${tipoOferta}</div>
              <div class="oferta-descripcion">${descripcion}</div>`;
  }
}

function $(sel){return document.querySelector(sel)}
function $all(sel){return Array.from(document.querySelectorAll(sel))}

function renderTable(){
  const tbody = $('#cenefas-body');
  tbody.innerHTML = '';
  cenefas.forEach((c, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" data-idx="${idx}" class="sel"></td>
      <td><input data-idx="${idx}" data-field="tipoOferta" value="${c.tipoOferta || ''}" placeholder="2X1, $3999, 40%, 2X1MC, etc"></td>
      <td><input data-idx="${idx}" data-field="fechaDesde" value="${c.fechaDesde || ''}" placeholder="25/11"></td>
      <td><input data-idx="${idx}" data-field="fechaHasta" value="${c.fechaHasta || ''}" placeholder="01/12"></td>
      <td><input data-idx="${idx}" data-field="objetoOferta" value="${c.objetoOferta || ''}" placeholder="Título de la acción"></td>
      <td><input data-idx="${idx}" data-field="aclaracionObjeto" value="${c.aclaracionObjeto || ''}" placeholder="Incluye/Excluye"></td>
      <td><input data-idx="${idx}" data-field="aclaracion" value="${c.aclaracion || ''}" placeholder="Aclaración 2"></td>
      <td><input data-idx="${idx}" data-field="legal1" value="${c.legal1 || ''}" placeholder="Texto legal principal"></td>
      <td><input data-idx="${idx}" data-field="legal2" value="${c.legal2 || ''}" placeholder="Texto legal secundario"></td>
      <td><button data-idx="${idx}" class="btn-del">Eliminar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function addEmpty(){
  cenefas.push({
    id: Date.now().toString(),
    tipo: 'NxN',
    tipoOferta: '',
    fechaDesde: '',
    fechaHasta: '',
    objetoOferta: '',
    aclaracionObjeto: '',
    aclaracion: '',
    legal1: '',
    legal2: ''
  });
  renderTable();
}

function deleteSelected(){
  const checks = $all('.sel').filter(i=>i.checked);
  const idxs = checks.map(c=>parseInt(c.dataset.idx,10));
  for(let i=idxs.length-1;i>=0;i--) cenefas.splice(idxs[i],1);
  renderTable();
}

function bindTableEvents(){
  $('#cenefas-body').addEventListener('input', (e)=>{
    const t = e.target;
    const idx = parseInt(t.dataset.idx,10);
    const field = t.dataset.field;
    if(!Number.isNaN(idx) && field) {
      let value = t.value;
      
      // Formatear automáticamente fechas a dd/mm
      if (field === 'fechaDesde' || field === 'fechaHasta') {
        value = formatearFecha(value);
        t.value = value; // Actualizar el input con el formato correcto
      }
      
      cenefas[idx][field] = value;
    }
  });
  $('#cenefas-body').addEventListener('click', (e)=>{
    if(e.target.classList.contains('btn-del')){
      const idx = parseInt(e.target.dataset.idx,10);
      cenefas.splice(idx,1); renderTable();
    }
  });
}

function importCSV(file){
  Papa.parse(file, {header:true, skipEmptyLines:true, complete:function(results){
    const rows = [];
    
    results.data.forEach((r, idx) => {
      let tipoAccion = r['Tipo Accion']||r['Tipo Acción']||r['SKU']||r['Tipo Oferta']||'';
      let desde = r['Desde']||r['Fecha Desde']||'';
      let hasta = r['Hasta']||r['Fecha Hasta']||'';
      
      // Corregir Tipo Acción: si tiene solo números, agregar %
      if (tipoAccion && /^\d+$/.test(tipoAccion.trim())) {
        tipoAccion = tipoAccion.trim() + '%';
      }
      
      // Formatear fecha "Desde" a dd/mm
      desde = formatearFecha(desde);
      
      // Formatear fecha "Hasta" a dd/mm
      hasta = formatearFecha(hasta);
      
      rows.push({
        id: Date.now().toString()+Math.random().toString(36).slice(2,6),
        tipo: '',  // se detecta automáticamente
        tipoOferta: tipoAccion,
        fechaDesde: desde,
        fechaHasta: hasta,
        objetoOferta: r['Titulo Accion']||r['Título Acción']||r['Objeto Oferta']||r['Objeto']||'',
        aclaracionObjeto: r['Incluye/Excluye']||r['Aclaracion 1']||r['Aclaración 1']||r['Aclaracion Objeto']||r['Aclaración Objeto']||'',
        aclaracion: r['Aclaracion 2']||r['Aclaración 2']||r['Aclaracion']||r['Aclaración']||'',
        legal1: r['Legal 1']||r['Legal1']||'',
        legal2: r['Legal 2']||r['Legal2']||''
      });
    });
    
    cenefas.push(...rows);
    renderTable();
    alert(`✅ Se importaron ${rows.length} cenefa(s) correctamente.`);
  }});
}

function formatearFecha(fecha) {
  if (!fecha) return '';
  
  // Quitar espacios
  fecha = fecha.trim();
  
  // Si ya está en formato dd/mm o dd/mm/aaaa, devolverla tal cual
  if (/^\d{1,2}\/\d{1,2}(\/\d{4})?$/.test(fecha)) {
    return fecha;
  }
  
  // Intentar detectar y convertir otros formatos comunes
  
  // Formato: aaaa-mm-dd o aaaa/mm/dd
  let match = fecha.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
  if (match) {
    return `${match[3]}/${match[2]}`;
  }
  
  // Formato: dd-mm-aaaa o dd-mm
  match = fecha.match(/^(\d{1,2})-(\d{1,2})(-\d{4})?$/);
  if (match) {
    return `${match[1]}/${match[2]}`;
  }
  
  // Formato: mm/dd/aaaa (solo si el día > 12, sabemos que está invertido)
  match = fecha.match(/^(\d{1,2})\/(\d{1,2})(\/\d{4})?$/);
  if (match && parseInt(match[1]) > 12) {
    return `${match[2]}/${match[1]}`;
  }
  
  // Si no se pudo parsear, devolver original
  return fecha;
}

function extraerDiaMes(fecha) {
  if (!fecha) return '';
  
  // Aplicar formateo primero
  fecha = formatearFecha(fecha);
  
  // Si tiene formato dd/mm/aaaa, extraer solo dd/mm
  const match = fecha.match(/^(\d{1,2}\/\d{1,2})(\/\d{4})?$/);
  if (match) {
    return match[1]; // Retorna solo dd/mm
  }
  
  return fecha;
}

function renderPreview(){
  const list = $('#preview-list'); list.innerHTML='';
  cenefas.forEach((c, idx)=>{
    const container = document.createElement('div'); 
    container.className='sheet-a4';
    
    // Detectar tipo automáticamente
    const tipoDetectado = c.tipo || detectarTipo(c.tipoOferta);
    
    // Determinar si la aclaración debe tener el badge rojo
    const isCombinaloText = c.aclaracion && c.aclaracion.toLowerCase().includes('combin');
    const aclaracionClass = isCombinaloText ? 'badge-aclaracion' : 'texto-aclaracion';
    
    // Generar HTML del área de oferta según el tipo
    const ofertaHTML = generarOfertaHTML(c, tipoDetectado);
    
    // SVG para la forma de flecha (se renderiza en PDF)
    // Para MC, DESC2-MC, NxNMC y DESC-CUOTAS-MC: flecha derecha azul #2B3689
    // Para MC2 y NxNMC2: SVG personalizado con fondos incluidos
    const svgShape = (tipoDetectado === 'MC2' || tipoDetectado === 'NxNMC2') ? `
      <svg class="oferta-shape" width="281" height="172" viewBox="0 0 281 172" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 0; left: 0; width: 281px; height: 172px; z-index: 1;">
        <path d="M253.764 1L279.953 85.0029L253.759 171H1V1H253.764Z" fill="#ffffff" stroke="black" stroke-width="2"/>
        <path d="M254.5 172L279 91H0V172H254.5Z" fill="#2B3689"/>
        <path d="M281 85.1463L279.007 79H0V100H276.516L281 85.1463Z" fill="#0B0B0B"/>
        <path d="M259 20L1 18" stroke="black" stroke-width="2"/>
      </svg>
    ` : (tipoDetectado === 'MC' || tipoDetectado === 'DESC2-MC' || tipoDetectado === 'NxNMC' || tipoDetectado === 'DESC-CUOTAS-MC') ? `
      <svg class="oferta-shape" width="281" height="172" viewBox="0 0 281 172" preserveAspectRatio="none" style="position: absolute; top: 0; right: 0; width: 281px; height: 172px; z-index: 1;">
        <polygon points="0,0 239,0 281,86 239,172 0,172" fill="#2B3689" />
      </svg>
    ` : `
      <svg class="oferta-shape" width="281" height="172" viewBox="0 0 281 172" preserveAspectRatio="none" style="position: absolute; top: 0; left: 0; width: 281px; height: 172px; z-index: 1;">
        <polygon points="0,0 239,0 281,86 239,172 0,172" fill="#000000" />
      </svg>
    `;
    
    // Para MC2 y NxNMC2, la vigencia va arriba dentro del oferta-content
    // Para MC, DESC2-MC, NxNMC y DESC-CUOTAS-MC, la vigencia va dentro del cuadro abajo
    // Extraer solo dd/mm (sin año) para vigencia
    const fechaDesdeFormatted = extraerDiaMes(c.fechaDesde||'');
    const fechaHastaFormatted = extraerDiaMes(c.fechaHasta||'');
    
    const vigenciaEnOferta = (tipoDetectado === 'MC2' || tipoDetectado === 'NxNMC2') 
      ? `<div class="mc2-vigencia">DEL ${escapeHtml(fechaDesdeFormatted)} AL ${escapeHtml(fechaHastaFormatted)}</div>`
      : (tipoDetectado === 'MC' || tipoDetectado === 'DESC2-MC' || tipoDetectado === 'NxNMC' || tipoDetectado === 'DESC-CUOTAS-MC')
      ? `<div class="oferta-vigencia mc-vigencia">DEL ${escapeHtml(fechaDesdeFormatted)} AL ${escapeHtml(fechaHastaFormatted)}</div>` 
      : `<div class="oferta-vigencia">DEL ${escapeHtml(fechaDesdeFormatted)} AL ${escapeHtml(fechaHastaFormatted)}</div>`;
    
    const vigenciaEnFooter = '';
    
    // Para MC, DESC2-MC, NxNMC y DESC-CUOTAS-MC: objeto oferta va a la izquierda (parte blanca), NO dentro del cuadro
    // MC2 usa contenido-derecha normal (sin -mc)
    // Agregar clase específica para contenido-derecha según el tipo
    const contenidoDerechaClass = (tipoDetectado === 'MC' || tipoDetectado === 'DESC2-MC' || tipoDetectado === 'NxNMC' || tipoDetectado === 'DESC-CUOTAS-MC') 
      ? 'contenido-derecha-mc' 
      : 'contenido-derecha';
    
    const objetoOfertaHTML = `<div class="objeto-oferta">${escapeHtml(c.objetoOferta||'').toUpperCase()}</div>
              ${c.aclaracionObjeto ? `<div class="aclaracion-objeto">${escapeHtml(c.aclaracionObjeto)}</div>` : ''}
              ${c.aclaracion ? `<div class="${aclaracionClass}">${escapeHtml(c.aclaracion).toUpperCase()}</div>` : ''}`;
    
    // Banner MasClub para MC, DESC2-MC, NxNMC y DESC-CUOTAS-MC (fuera de oferta-content pero dentro de cenefa-body)
    const bannerMC = (tipoDetectado === 'MC' || tipoDetectado === 'DESC2-MC' || tipoDetectado === 'NxNMC' || tipoDetectado === 'DESC-CUOTAS-MC') 
      ? `<div class="mc-banner">
           <span class="mc-exclusivo">EXCLUSIVO</span>
           <img src="assets/logos/masclub.png" alt="Más club" class="mc-logo-banner">
         </div>`
      : '';
    
    container.innerHTML = `
      <div class="row row-cenefas">
        <div class="a5-horizontal">
          <div class="cenefa-body">
            ${bannerMC}
            <div class="oferta-box tipo-${tipoDetectado}">
              ${svgShape}
              <div class="oferta-content">
                ${vigenciaEnOferta}
                ${ofertaHTML}
              </div>
            </div>
            <div class="${contenidoDerechaClass}">
              ${objetoOfertaHTML}
            </div>
            ${vigenciaEnFooter}
            <div class="footer-legal">
              <div class="legal1">${escapeHtml(c.legal1||'')}</div>
              <div class="legal2">${escapeHtml(c.legal2||'')}</div>
            </div>
          </div>
        </div>
        <div class="a5-horizontal">
          <div class="cenefa-body">
            ${bannerMC}
            <div class="oferta-box tipo-${tipoDetectado}">
              ${svgShape}
              <div class="oferta-content">
                ${vigenciaEnOferta}
                ${ofertaHTML}
              </div>
            </div>
            <div class="${contenidoDerechaClass}">
              ${objetoOfertaHTML}
            </div>
            ${vigenciaEnFooter}
            <div class="footer-legal">
              <div class="legal1">${escapeHtml(c.legal1||'')}</div>
              <div class="legal2">${escapeHtml(c.legal2||'')}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    list.appendChild(container);
    
    // Ajustar tamaño de fuente del objeto-oferta dinámicamente
    setTimeout(() => {
      const objetoOfertaElements = container.querySelectorAll('.objeto-oferta');
      objetoOfertaElements.forEach(element => {
        const texto = element.textContent || '';
        const longitud = texto.length;
        
        // Calcular tamaño de fuente basado en longitud del texto
        // Máximo 34px (textos cortos <= 30 caracteres)
        // Mínimo 20px (textos largos >= 80 caracteres)
        let fontSize;
        if (longitud <= 30) {
          fontSize = 34;
        } else if (longitud >= 80) {
          fontSize = 20;
        } else {
          // Interpolación lineal entre 30-80 caracteres -> 34-20px
          fontSize = 34 - ((longitud - 30) / (80 - 30)) * (34 - 20);
          fontSize = Math.round(fontSize);
        }
        
        element.style.fontSize = `${fontSize}px`;
      });
    }, 10);

    // Add download toolbar for this sheet
    const toolbar = document.createElement('div');
    toolbar.className = 'download-toolbar';

    const btnA4 = document.createElement('button'); 
    btnA4.className = 'btn-download btn-primary-download';
    btnA4.innerHTML = '📄 Descargar A4 Completo';

    toolbar.appendChild(btnA4);

    list.insertBefore(toolbar, container);

    // Download helper
    function downloadAsA4PDF(element, filename){
      element.setAttribute('data-print-target', 'true');
      const originalTitle = document.title;
      document.title = filename.replace('.pdf', '');
      window.print();
      setTimeout(() => {
        element.removeAttribute('data-print-target');
        document.title = originalTitle;
      }, 100);
    }

    btnA4.addEventListener('click', ()=>{
      downloadAsA4PDF(container, `cenefa_${c.tipoOferta||'promo'}_${idx}.pdf`);
    });
  });
}

function escapeHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

// Init
document.addEventListener('DOMContentLoaded', ()=>{
  cenefas.push(sample);
  renderTable(); 
  bindTableEvents();

  $('#btn-add').addEventListener('click', ()=>{ addEmpty(); });
  $('#btn-delete-selected').addEventListener('click', ()=>{ deleteSelected(); });
  $('#btn-preview').addEventListener('click', ()=>{ $('#preview-section').classList.toggle('hidden'); renderPreview(); });
  $('#btn-print-all').addEventListener('click', ()=>{ printAllSheets(); });
  $('#btn-download-selected').addEventListener('click', ()=>{ downloadSelectedPDFs(); });

  $('#btn-import').addEventListener('click', ()=>{
    const f = $('#file-csv').files[0]; 
    if(!f){alert('Selecioná un CSV');return;} 
    importCSV(f);
  });

  $('#btn-download-template').addEventListener('click', ()=>{ downloadTemplate(); });

  $('#select-all').addEventListener('change', (e)=>{
    const v = e.target.checked; 
    $all('.sel').forEach(ch=>ch.checked=v);
  });
});

// Download all sheets as a single multi-page PDF
// Sanitizar nombre de archivo
function sanitizeFilename(filename) {
  return filename
    .replace(/[<>:"/\\|?*]/g, '-')  // Caracteres no permitidos
    .replace(/\s+/g, '_')            // Espacios a guiones bajos
    .replace(/_{2,}/g, '_')          // Múltiples guiones bajos a uno
    .replace(/^[_-]+|[_-]+$/g, '')   // Limpiar bordes
    .substring(0, 200);              // Límite de longitud
}

// Descargar cenefas seleccionadas individualmente
async function downloadSelectedPDFs() {
  const checkboxes = $all('tbody input[type="checkbox"]:checked');
  
  if(checkboxes.length === 0) {
    alert('Selecciona al menos una cenefa para descargar.');
    return;
  }
  
  if(!confirm(`¿Descargar ${checkboxes.length} PDF(s) individuales?\nSe descargarán uno por uno con el formato: tipoOferta-objetoOferta.pdf`)) {
    return;
  }
  
  const btn = $('#btn-download-selected');
  const originalText = btn.textContent;
  const { jsPDF } = window.jspdf;
  
  try {
    btn.disabled = true;
    
    for(let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i];
      const index = parseInt(checkbox.dataset.idx);
      const cenefa = cenefas[index];
      
      btn.textContent = `⏳ Descargando ${i + 1}/${checkboxes.length}...`;
      
      // Buscar el sheet-a4 que contiene esta cenefa
      const sheets = $all('.sheet-a4');
      const sheet = sheets[index];
      
      if(!sheet) {
        console.error(`No se encontró sheet para índice ${index}`);
        continue;
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
        const canvas = await html2canvas(sheet, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
          width: 595,
          height: 842,
          windowWidth: 595,
          windowHeight: 842,
        logging: false
      });
      
      const pdf = new jsPDF({
          orientation: 'portrait',
        unit: 'px',
          format: [595, 842],
        compress: true
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, 595, 842);
      
      // Generar nombre de archivo: tipoOferta-objetoOferta.pdf
      const tipoSanitized = sanitizeFilename(cenefa.tipoOferta);
      const objetoSanitized = sanitizeFilename(cenefa.objetoOferta);
      const filename = `${tipoSanitized}-${objetoSanitized}.pdf`;
      
      pdf.save(filename);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    btn.textContent = originalText;
    btn.disabled = false;
    alert(`✅ Se descargaron ${checkboxes.length} PDF(s) individuales.`);
    
  } catch(error) {
    console.error('Error generando PDFs:', error);
    alert('Error al generar los PDFs. Por favor intenta nuevamente.');
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

async function printAllSheets() {
  const sheets = $all('.sheet-a4');
  if(sheets.length === 0) {
    alert('No hay cenefas para imprimir. Genera la vista previa primero.');
    return;
  }
  
  if(!confirm(`¿Descargar ${sheets.length} cenefa(s) en un solo PDF?`)) {
    return;
  }
  
  const btn = $('#btn-print-all');
  const originalText = btn.textContent;
  const { jsPDF } = window.jspdf;
  
  try {
    btn.textContent = `⏳ Generando PDF...`;
    btn.disabled = true;
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [595, 842],
      compress: true
    });
    
    for(let i = 0; i < sheets.length; i++) {
      btn.textContent = `⏳ Procesando ${i + 1}/${sheets.length}...`;
      
      const sheet = sheets[i];
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const canvas = await html2canvas(sheet, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 595,
        height: 842,
        windowWidth: 595,
        windowHeight: 842,
        logging: false
      });
      
      if(i > 0) {
        pdf.addPage([595, 842], 'portrait');
      }
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, 595, 842);
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'');
    pdf.save(`cenefas_${timestamp}.pdf`);
    
    btn.textContent = originalText;
    btn.disabled = false;
    alert(`✅ Se descargó el PDF con ${sheets.length} cenefa(s).`);
    
  } catch(error) {
    console.error('Error generando PDF:', error);
    alert('Error al generar el PDF. Por favor intenta nuevamente.');
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

function downloadTemplate(){
  const headers = 'Tipo Acción,Desde,Hasta,Título Acción,Incluye/Excluye,Aclaración 2,Legal 1,Legal 2';
  const contenido = '\uFEFF' + headers;  // UTF-8 BOM para Excel
  const blob = new Blob([contenido], {type: 'text/csv;charset=utf-8;'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'template_cenefas.csv';
  link.click();
}

// Modal de Ayuda
document.addEventListener('DOMContentLoaded', ()=>{
  const modal = $('#modal-ayuda');
  const btnAyuda = $('#btn-ayuda');
  const closeBtn = $('.close-ayuda');

  btnAyuda.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
