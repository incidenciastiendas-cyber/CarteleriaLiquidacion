// cenefas-app.js - lógica para cenefas promocionales
const cenefas = [];

const sample = {
  tipoOferta: '2x1',
  descripcionOferta: 'LLEVÁ 2, PAGÁ 1',
  fechaDesde: '25/11',
  fechaHasta: '01/12',
  objetoOferta: 'ADORNOS PARA ÁRBOL, LUCES Y DECO NAVIDEÑA',
  aclaracionObjeto: '',
  aclaracion: 'COMBINALO COMO QUIERAS',
  legal1: 'EL DESCUENTO SE HARÁ EFECTIVO EN LÍNEA DE CAJAS Y SE APLICARÁ SOBRE EL PRECIO UNITARIO',
  legal2: 'PROMOCIÓN VÁLIDA DESDE EL 25/11/17 HASTA HASTA EL 01/12/2025. SUJETA A DISPONIBILIDAD Y CONDICIONES DE PROMOCIONES APLICABLES CONSULTE EN NUESTRO LOCAL. ESPACIO 25-8130 REC-G'
};

function $(sel){return document.querySelector(sel)}
function $all(sel){return Array.from(document.querySelectorAll(sel))}

function renderTable(){
  const tbody = $('#cenefas-body');
  tbody.innerHTML = '';
  cenefas.forEach((c, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" data-idx="${idx}" class="sel"></td>
      <td><input data-idx="${idx}" data-field="tipoOferta" value="${c.tipoOferta || ''}" placeholder="2x1"></td>
      <td><input data-idx="${idx}" data-field="descripcionOferta" value="${c.descripcionOferta || ''}" placeholder="LLEVÁ 2, PAGÁ 1"></td>
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
      tipoOferta: r['Tipo Oferta']||r['TipoOferta']||'',
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
    
    // Determinar si la aclaración debe tener el badge rojo
    const isCombinaloText = c.aclaracion && c.aclaracion.toLowerCase().includes('combin');
    const aclaracionClass = isCombinaloText ? 'badge-aclaracion' : 'texto-aclaracion';
    
    container.innerHTML = `
      <div class="row row-cenefas">
        <div class="a5-horizontal">
          <div class="cenefa-body">
            <div class="oferta-box">
              <div class="oferta-principal">${escapeHtml(c.tipoOferta||'2x1')}</div>
              <div class="oferta-descripcion">${escapeHtml(c.descripcionOferta||'LLEVÁ 2, PAGÁ 1')}</div>
              <div class="oferta-vigencia">DEL ${escapeHtml(c.fechaDesde||'')} AL ${escapeHtml(c.fechaHasta||'')}</div>
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
            <div class="oferta-box">
              <div class="oferta-principal">${escapeHtml(c.tipoOferta||'2x1')}</div>
              <div class="oferta-descripcion">${escapeHtml(c.descripcionOferta||'LLEVÁ 2, PAGÁ 1')}</div>
              <div class="oferta-vigencia">DEL ${escapeHtml(c.fechaDesde||'')} AL ${escapeHtml(c.fechaHasta||'')}</div>
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
  const headers = 'SKU,Objeto Oferta,Aclaración,Desde,Hasta,Departamento';
  const blob = new Blob([headers], {type: 'text/csv;charset=utf-8;'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'template_cenefas.csv';
  link.click();
}
