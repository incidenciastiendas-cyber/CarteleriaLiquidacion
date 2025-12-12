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
    tipo: 'PRECIO',
    tipoOferta: '$3999',
    descripcionOferta: '',
    fechaDesde: '27/11',
    fechaHasta: '03/12',
    objetoOferta: 'WHISKY JOHNNIE WALKER RED LABEL 750ML',

    legal1: 'EL DESCUENTO SE HARÁ EFECTIVO EN LÍNEA DE CAJAS Y SE APLICARÁ SOBRE EL PRECIO UNITARIO',
    legal2: 'PROMOCIÓN VÁLIDA DESDE EL DÍA 27/11/2025 HASTA EL DÍA 03/12/2025. PARA MÁS INFORMACIÓN Y CONDICIONES O LIMITACIONES APLICABLES CONSULTE EN MASONLINE.COM.AR/LEGALES. DORINKA SRL 30-67813830-0.'
  },
  {
    tipo: 'DESC1',
    tipoOferta: '40%',
    descripcionOferta: 'DE DESCUENTO',
    fechaDesde: '28/11',
    fechaHasta: '04/12',
    objetoOferta: 'VINOS NORTON RESERVA 750ML',

    legal1: 'EL DESCUENTO SE HARÁ EFECTIVO EN LÍNEA DE CAJAS Y SE APLICARÁ SOBRE EL PRECIO UNITARIO',
    legal2: 'PROMOCIÓN VÁLIDA DESDE EL DÍA 28/11/2025 HASTA EL DÍA 04/12/2025. PARA MÁS INFORMACIÓN Y CONDICIONES O LIMITACIONES APLICABLES CONSULTE EN MASONLINE.COM.AR/LEGALES. DORINKA SRL 30-67813830-0.'
  },
  {
    tipo: 'DESC2',
    tipoOferta: '30%2',
    descripcionOferta: 'EN LA SEGUNDA UNIDAD',
    fechaDesde: '29/11',
    fechaHasta: '05/12',
    objetoOferta: 'ACEITE COCINERO 1.5L',

    legal1: 'EL DESCUENTO SE HARÁ EFECTIVO EN LÍNEA DE CAJAS Y SE APLICARÁ SOBRE EL PRECIO UNITARIO',
    legal2: 'PROMOCIÓN VÁLIDA DESDE EL DÍA 29/11/2025 HASTA EL DÍA 05/12/2025. PARA MÁS INFORMACIÓN Y CONDICIONES O LIMITACIONES APLICABLES CONSULTE EN MASONLINE.COM.AR/LEGALES. DORINKA SRL 30-67813830-0.'
  },
  {
    tipo: 'NQ',
    tipoOferta: '6Q',
    descripcionOferta: 'CUOTAS SIN INTERÉS',
    fechaDesde: '30/11',
    fechaHasta: '06/12',
    objetoOferta: 'SMART TV SAMSUNG 50 PULGADAS 4K',

    legal1: 'EL DESCUENTO SE HARÁ EFECTIVO EN LÍNEA DE CAJAS Y SE APLICARÁ SOBRE EL PRECIO UNITARIO',
    legal2: 'PROMOCIÓN VÁLIDA DESDE EL DÍA 30/11/2025 HASTA EL DÍA 06/12/2025. PARA MÁS INFORMACIÓN Y CONDICIONES O LIMITACIONES APLICABLES CONSULTE EN MASONLINE.COM.AR/LEGALES. DORINKA SRL 30-67813830-0.'
  },
  {
    tipo: 'DESC-CUOTAS',
    tipoOferta: '30%+4Q',
    descripcionOferta: 'DESCUENTO + CUOTAS',
    fechaDesde: '01/12',
    fechaHasta: '07/12',
    objetoOferta: 'HELADERA PHILCO 364L NO FROST',

    legal1: 'EL DESCUENTO SE HARÁ EFECTIVO EN LÍNEA DE CAJAS Y SE APLICARÁ SOBRE EL PRECIO UNITARIO',
    legal2: 'PROMOCIÓN VÁLIDA DESDE EL DÍA 01/12/2025 HASTA EL DÍA 07/12/2025. PARA MÁS INFORMACIÓN Y CONDICIONES O LIMITACIONES APLICABLES CONSULTE EN MASONLINE.COM.AR/LEGALES. DORINKA SRL 30-67813830-0.'
  }
];

const sample = {
  tipo: 'NxN',  // NxN, PRECIO, X%1, X%2, NQ, X%1+NQ
  tipoOferta: '2X1',
  descripcionOferta: 'LLEVÁ 2, PAGÁ 1',
  fechaDesde: '25/11',
  fechaHasta: '01/12',
  objetoOferta: 'ADORNOS PARA ÁRBOL, LUCES Y DECO NAVIDEÑA',


  legal1: 'EL DESCUENTO SE HARÁ EFECTIVO EN LÍNEA DE CAJAS Y SE APLICARÁ SOBRE EL PRECIO UNITARIO',
  legal2: 'PROMOCIÓN VÁLIDA DESDE EL 25/11/17 HASTA HASTA EL 01/12/2025. SUJETA A DISPONIBILIDAD Y CONDICIONES DE PROMOCIONES APLICABLES CONSULTE EN NUESTRO LOCAL. ESPACIO 25-8130 REC-G'
};

// Detectar automáticamente el tipo de oferta según el contenido de tipoOferta
function detectarTipo(tipoOferta) {
  if (!tipoOferta) return 'NxN';
  const texto = tipoOferta.toUpperCase().trim();
  
  // PRECIO: contiene $ o números con decimales/puntos
  if (texto.includes('$') || /^\d{1,3}(\.\d{3})*$/.test(texto.replace(/\$/g, ''))) {
    return 'PRECIO';
  }
  
  // DESC-CUOTAS: contiene % Y un número seguido (ej: "30%+4")
  if (texto.includes('%') && texto.includes('+')) {
    return 'DESC-CUOTAS';
  }
  
  // DESC2: contiene "2" o "SEGUNDA" o "2°" con %
  if (texto.includes('%') && (texto.includes('2') || texto.includes('SEGUNDA') || texto.includes('2°'))) {
    return 'DESC2';
  }
  
  // DESC1: contiene solo %
  if (texto.includes('%')) {
    return 'DESC1';
  }
  
  // NQ: contiene CUOTAS o solo un número (ej: "6")
  if (texto.includes('CUOTAS') || /^\d{1,2}$/.test(texto)) {
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
      // Formato: "2x1" con x pequeña
      const partes = tipoOferta.match(/(\d+)(x)(\d+)/i);
      if (partes) {
        return `<div class="oferta-principal oferta-nxn">
                  <span class="numero">${partes[1]}</span><span class="x-pequena">x</span><span class="numero">${partes[3]}</span>
                </div>
                <div class="oferta-descripcion">${descripcion.toUpperCase()}</div>`;
      }
      return `<div class="oferta-principal">${tipoOferta}</div>
              <div class="oferta-descripcion">${descripcion.toUpperCase()}</div>`;
    
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
      const match = tipoOferta.match(/(\d+)%\+(\d+)/);
      if (match) {
        const pct = match[1];
        const nCuotas = match[2];
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
      <td><input data-idx="${idx}" data-field="tipoOferta" value="${c.tipoOferta || ''}" placeholder="2x1, $3999, 40%, etc"></td>
      <td><input data-idx="${idx}" data-field="descripcionOferta" value="${c.descripcionOferta || ''}" placeholder="Opcional"></td>
      <td><input data-idx="${idx}" data-field="fechaDesde" value="${c.fechaDesde || ''}" placeholder="25/11"></td>
      <td><input data-idx="${idx}" data-field="fechaHasta" value="${c.fechaHasta || ''}" placeholder="01/12"></td>
      <td><input data-idx="${idx}" data-field="objetoOferta" value="${c.objetoOferta || ''}" placeholder="Descripción del producto"></td>
      <td><input data-idx="${idx}" data-field="aclaracionObjeto" value="${c.aclaracionObjeto || ''}" placeholder="Opcional"></td>
      <td><input data-idx="${idx}" data-field="aclaracion" value="${c.aclaracion || ''}" placeholder="COMBINALO COMO QUIERAS"></td>
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
    descripcionOferta: '',
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
    if(!Number.isNaN(idx) && field) cenefas[idx][field] = t.value;
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
    const rows = results.data.map(r=>({
      id: Date.now().toString()+Math.random().toString(36).slice(2,6),
      tipo: '',  // se detecta automáticamente
      tipoOferta: r['SKU']||r['Tipo Oferta']||r['TipoOferta']||'',
      descripcionOferta: r['Descripcion Oferta']||r['Descripción Oferta']||'',
      fechaDesde: r['Desde']||r['Fecha Desde']||'',
      fechaHasta: r['Hasta']||r['Fecha Hasta']||'',
      objetoOferta: r['Objeto Oferta']||r['Objeto']||'',
      aclaracionObjeto: r['Aclaracion Objeto']||r['Aclaración Objeto']||'',
      aclaracion: r['Aclaracion']||r['Aclaración']||'',
      legal1: r['Legal 1']||r['Legal1']||'',
      legal2: r['Legal 2']||r['Legal2']||''
    }));
    cenefas.push(...rows);
    renderTable();
  }});
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
    const svgShape = `
      <svg class="oferta-shape" width="281" height="172" viewBox="0 0 281 172" preserveAspectRatio="none" style="position: absolute; top: 0; left: 0; width: 281px; height: 172px; z-index: 1;">
        <polygon points="0,0 239,0 281,86 239,172 0,172" fill="#000000" />
      </svg>
    `;
    
    container.innerHTML = `
      <div class="row row-cenefas">
        <div class="a5-horizontal">
          <div class="cenefa-body">
            <div class="oferta-box tipo-${tipoDetectado}">
              ${svgShape}
              <div class="oferta-content">
                ${ofertaHTML}
                <div class="oferta-vigencia">DEL ${escapeHtml(c.fechaDesde||'')} AL ${escapeHtml(c.fechaHasta||'')}</div>
              </div>
            </div>
            <div class="contenido-derecha">
              <div class="objeto-oferta">${escapeHtml(c.objetoOferta||'').toUpperCase()}</div>
              ${c.aclaracionObjeto ? `<div class="aclaracion-objeto">${escapeHtml(c.aclaracionObjeto)}</div>` : ''}
              ${c.aclaracion ? `<div class="${aclaracionClass}">${escapeHtml(c.aclaracion).toUpperCase()}</div>` : ''}
            </div>
            <div class="footer-legal">
              <div class="legal1">${escapeHtml(c.legal1||'')}</div>
              <div class="legal2">${escapeHtml(c.legal2||'')}</div>
            </div>
          </div>
        </div>
        <div class="a5-horizontal">
          <div class="cenefa-body">
            <div class="oferta-box tipo-${tipoDetectado}">
              ${svgShape}
              <div class="oferta-content">
                ${ofertaHTML}
                <div class="oferta-vigencia">DEL ${escapeHtml(c.fechaDesde||'')} AL ${escapeHtml(c.fechaHasta||'')}</div>
              </div>
            </div>
            <div class="contenido-derecha">
              <div class="objeto-oferta">${escapeHtml(c.objetoOferta||'').toUpperCase()}</div>
              ${c.aclaracionObjeto ? `<div class="aclaracion-objeto">${escapeHtml(c.aclaracionObjeto)}</div>` : ''}
              ${c.aclaracion ? `<div class="${aclaracionClass}">${escapeHtml(c.aclaracion).toUpperCase()}</div>` : ''}
            </div>
            <div class="footer-legal">
              <div class="legal1">${escapeHtml(c.legal1||'')}</div>
              <div class="legal2">${escapeHtml(c.legal2||'')}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    list.appendChild(container);

    // Add download toolbar for this sheet
    const toolbar = document.createElement('div');
    toolbar.className = 'download-toolbar';

    const btnA4 = document.createElement('button'); 
    btnA4.className = 'btn-download btn-primary-download';
    btnA4.innerHTML = '📄 Descargar A4 Completo';
    
    const btnIndividual = document.createElement('button'); 
    btnIndividual.className = 'btn-download btn-secondary-download';
    btnIndividual.innerHTML = '🏷️ Solo Primera Cenefa';

    toolbar.appendChild(btnA4);
    toolbar.appendChild(btnIndividual);

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

    btnIndividual.addEventListener('click', ()=>{
      const tempContainer = document.createElement('div');
      tempContainer.className = 'sheet-a4';
      const firstCenefa = container.querySelector('.a5-horizontal');
      if(firstCenefa) {
        const clonedCenefa = firstCenefa.cloneNode(true);
        const row = document.createElement('div');
        row.className = 'row row-cenefas';
        row.appendChild(clonedCenefa);
        tempContainer.appendChild(row);
        list.appendChild(tempContainer);
        downloadAsA4PDF(tempContainer, `cenefa_individual_${c.tipoOferta||'promo'}_${idx}.pdf`);
        setTimeout(() => list.removeChild(tempContainer), 1000);
      }
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
      
      // Tomar solo la primera cenefa A5 del sheet
      const cenefaElement = sheet.querySelector('.a5-horizontal');
      
      if(!cenefaElement) {
        console.error(`No se encontró cenefa A5 en sheet ${index}`);
        continue;
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await html2canvas(cenefaElement, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 595,
        height: 420,
        windowWidth: 595,
        windowHeight: 420,
        logging: false
      });
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [420, 595],
        compress: true
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, 595, 420);
      
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
  const headers = 'SKU,Objeto Oferta,Aclaracion,Desde,Hasta,Departamento';
  const instrucciones = `
# INSTRUCCIONES PARA CENEFAS PROMOCIONALES
# ==========================================
# 
# FORMATOS SOPORTADOS (se detectan automáticamente según el campo "SKU"):
# 
# 1. NxN - Ej: 2x1, 3x2
#    SKU: escribir "2x1" o "3x2"
#    Objeto Oferta: "LLEVÁ 2, PAGÁ 1"
#    Formato: Números grandes con "x" pequeña entre ellos
# 
# 2. PRECIO - Precio simple
#    SKU: escribir "$3999" o "3.999"
#    Objeto Oferta: (vacío o texto descriptivo)
#    Formato: Símbolo $ pequeño, números grandes
# 
# 3. X%1 - Descuento unitario
#    SKU: escribir "40%"
#    Objeto Oferta: "DE DESCUENTO"
#    Formato: Número grande + símbolo % pequeño alineado base inferior
# 
# 4. X%2 - Descuento en segunda unidad
#    SKU: escribir "30%2" o "30% 2DA"
#    Objeto Oferta: (auto se genera "DESCUENTO EN LA SEGUNDA UNIDAD")
#    Formato: Dos columnas - número con % | texto a la izquierda
# 
# 5. NQ - Cuotas sin interés
#    SKU: escribir "6" (solo el número)
#    Objeto Oferta: "CUOTAS SIN INTERÉS"
#    Formato: Dos columnas - número gigante | texto
# 
# 6. X%1+NQ - Descuento + cuotas
#    SKU: escribir "30%+4"
#    Objeto Oferta: "DE DESCUENTO" (se complementa automáticamente)
#    Formato: Fila 1: "30% + 4" / Fila 2: "DE DESCUENTO | CUOTAS SIN INTERÉS"
# 
# CAMPOS:
# - SKU: código de oferta (ver formatos arriba)
# - Objeto Oferta: descripción del producto/oferta
# - Aclaracion: texto opcional (ej: "COMBINALO COMO QUIERAS")
# - Desde/Hasta: fechas de vigencia (formato: 25/11)
# - Departamento: número de departamento
# 
# NOTA: La vigencia siempre aparece al pie del área negra
`;
  const ejemplos = `
2x1,ADORNOS PARA ÁRBOL LUCES Y DECO NAVIDEÑA,COMBINALO COMO QUIERAS,25/11,01/12,35
$3999,HELADERA GAFA,,08/12,23/01,35
40%,MUEBLES DE JARDÍN,,15/12,31/12,40
30%2,ACCESORIOS PILETA,,01/12,15/12,45
6,ELECTRODOMÉSTICOS SELECCIONADOS,,10/12,20/12,35
30%+4,CONJUNTOS DE LIVING,,12/12,25/12,40
`;
  
  const contenido = instrucciones + '\n' + headers + ejemplos;
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
