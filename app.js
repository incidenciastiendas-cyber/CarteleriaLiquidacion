// app.js - lógica para la versión estática de Cartelería Masiva
const products = [];

const sample = {
  nIncidencia: 'C-1003-4',
  sku: '4030300303',
  descripcion: 'Heladera Gafa',
  razonRebaja: 'Daño en puerta frontal',
  departamento: '35',
  ean: '7796962000419',
  precioAnterior: '15000',
  precioActual: '10500',
  precioUnidad: '10500',
  desde: '8/12/2025',
  hasta: '23/1/2026',
  precioSinImpuesto: '',
  nNegociacion: '113434242454',
  nroSerie: 'xxxxxxxxxx'
};
// add industria field to sample
sample.industria = 'Industria Argentina';


function $(sel){return document.querySelector(sel)}
function $all(sel){return Array.from(document.querySelectorAll(sel))}

function renderTable(){
  const tbody = $('#products-body');
  tbody.innerHTML = '';
  products.forEach((p, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" data-idx="${idx}" class="sel"></td>
      <td><input data-idx="${idx}" data-field="nIncidencia" value="${p.nIncidencia || ''}"></td>
      <td><input data-idx="${idx}" data-field="sku" value="${p.sku || ''}"></td>
      <td><input data-idx="${idx}" data-field="descripcion" value="${p.descripcion || ''}"></td>
      <td><input data-idx="${idx}" data-field="razonRebaja" value="${p.razonRebaja || ''}"></td>
      <td><input data-idx="${idx}" data-field="departamento" value="${p.departamento || ''}"></td>
      <td><input data-idx="${idx}" data-field="ean" value="${p.ean || ''}"></td>
      <td><input data-idx="${idx}" data-field="precioAnterior" value="${p.precioAnterior || ''}"></td>
      <td><input data-idx="${idx}" data-field="precioActual" value="${p.precioActual || ''}"></td>
      <td><input data-idx="${idx}" data-field="desde" value="${p.desde || ''}"></td>
      <td><input data-idx="${idx}" data-field="hasta" value="${p.hasta || ''}"></td>
      <td><input data-idx="${idx}" data-field="nNegociacion" value="${p.nNegociacion || ''}"></td>
      <td><input data-idx="${idx}" data-field="nroSerie" value="${p.nroSerie || ''}"></td>
      <td><input data-idx="${idx}" data-field="industria" value="${p.industria || ''}"></td>
      <td><button data-idx="${idx}" class="btn-del">Eliminar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function addEmpty(){
  products.push({
    id: Date.now().toString(),
    nIncidencia: '', sku:'', descripcion:'', razonRebaja:'', departamento:'', ean:'', precioAnterior:'', precioActual:'', precioUnidad:'', desde:'', hasta:'', precioSinImpuesto:'', nNegociacion:'', nroSerie:''
  });
  renderTable();
}

function deleteSelected(){
  const checks = $all('.sel').filter(i=>i.checked);
  const idxs = checks.map(c=>parseInt(c.dataset.idx,10));
  for(let i=idxs.length-1;i>=0;i--) products.splice(idxs[i],1);
  renderTable();
}

function bindTableEvents(){
  $('#products-body').addEventListener('input', (e)=>{
    const t = e.target;
    const idx = parseInt(t.dataset.idx,10);
    const field = t.dataset.field;
    if(!Number.isNaN(idx) && field) products[idx][field] = t.value;
  });
  $('#products-body').addEventListener('click', (e)=>{
    if(e.target.classList.contains('btn-del')){
      const idx = parseInt(e.target.dataset.idx,10);
      products.splice(idx,1); renderTable();
    }
  });
}

function importCSV(file){
  Papa.parse(file, {header:true, skipEmptyLines:true, complete:function(results){
    const rows = results.data.map(r=>({
      id: Date.now().toString()+Math.random().toString(36).slice(2,6),
      nIncidencia: r['N Incidencia']||r['N° Incidencia']||r['N Incidencia']||'',
      sku: r['SKU']||'', descripcion: r['Descripción']||r['Descripcion']||'',
      razonRebaja: r['Razon de rebaja']||r['Razón de rebaja']||r['Razon de rebaja']||'',
      departamento: r['Departamento']||'', ean: r['EAN / UPC']||r['EAN/UPC']||r['EAN']||'',
      precioAnterior: r['Precio anterior']||'', precioActual: r['Precio actual']||'', desde: r['Desde']||'', hasta: r['Hasta']||'', nNegociacion: r['N Negociacion']||r['N° Negociación']||'', nroSerie: r['Nro Serie']||'', industria: r['Industria']||r['Industria Argentina']||''
    }));
    products.push(...rows);
    renderTable();
  }});
}

function renderPreview(){
  const list = $('#preview-list'); list.innerHTML='';
  products.forEach((p, idx)=>{
    const container = document.createElement('div'); container.className='sheet-a4';
    // Build inner HTML duplicating the HojaA4 layout: two A6 and two obleas
    // prepare formatted prices
    const precioAct = formatMoneyParts(p.precioUnidad||p.precioActual||'0');
    const precioAnt = formatMoneyParts(p.precioAnterior||'0');

    container.innerHTML = `
      <div class="row row-carteles">
        <div class="a6">
          <div class="titulo">${escapeHtml((p.descripcion||'').toUpperCase())}</div>
          <div class="precio-actual"><span class="sig">$</span><span class="entero">${precioAct.entero}</span><span class="dec">${precioAct.dec}</span></div>
          <div class="precio-anterior"><span class="val"><span class="sig">$</span>${precioAnt.entero}<sup>${precioAnt.dec}</sup></span></div>
          <div class="cu-text">C/U</div>
          <div class="liquidacion-text">Producto sin cambio ni devolución</div>
          <div class="origen-text">Origen: ${escapeHtml(p.industria||'Argentina')}</div>
          <div class="precio-unidad">
            <div class="label">Precio por unidad</div>
            <div class="value"><span class="sig">$</span>${precioAct.entero}<sup>${precioAct.dec}</sup></div>
          </div>
          <svg class="barcode-svg" id="barcode-a6-${idx}"></svg>
          <div class="vigencia">vigencia: del ${p.desde||''} al ${p.hasta||''}</div>
          <div class="dpto-sku">DPTO ${p.departamento||''} - SKU ${p.sku||''}</div>
          <div class="bottom-info">
            <div>CASO: ${escapeHtml(p.nIncidencia||'')}</div>
            <div>NEGOCIACIÓN: ${escapeHtml(p.nNegociacion||'')}</div>
          </div>
        </div>
        <div class="a6">
          <div class="titulo">${escapeHtml((p.descripcion||'').toUpperCase())}</div>
          <div class="precio-actual"><span class="sig">$</span><span class="entero">${precioAct.entero}</span><span class="dec">${precioAct.dec}</span></div>
          <div class="precio-anterior"><span class="val"><span class="sig">$</span>${precioAnt.entero}<sup>${precioAnt.dec}</sup></span></div>
          <div class="cu-text">C/U</div>
          <div class="liquidacion-text">Producto sin cambio ni devolución</div>
          <div class="origen-text">Origen: ${escapeHtml(p.industria||'Argentina')}</div>
          <div class="precio-unidad">
            <div class="label">Precio por unidad</div>
            <div class="value"><span class="sig">$</span>${precioAct.entero}<sup>${precioAct.dec}</sup></div>
          </div>
          <svg class="barcode-svg" id="barcode-a6b-${idx}"></svg>
          <div class="vigencia">vigencia: del ${p.desde||''} al ${p.hasta||''}</div>
          <div class="dpto-sku">DPTO ${p.departamento||''} - SKU ${p.sku||''}</div>
          <div class="bottom-info">
            <div>CASO: ${escapeHtml(p.nIncidencia||'')}</div>
            <div>NEGOCIACIÓN: ${escapeHtml(p.nNegociacion||'')}</div>
          </div>
        </div>
      </div>
      <div class="row row-obleas">
        <div class="oblea">
          <div class="oblea-title">${escapeHtml((p.descripcion||'').toUpperCase().slice(0,30))}</div>
          <div class="oblea-sku">SKU  ${escapeHtml(p.sku||'')}</div>
          <div class="oblea-divider"></div>
          <div class="oblea-serie">Nro de serie: ${escapeHtml(p.nroSerie||'xxxxxxxxxx')}</div>
          <svg class="oblea-barcode" id="barcode-obl-a-${idx}" jsbarcode-format="ean13"></svg>
          <div class="oblea-producto-text">Producto sin cambio ni devolución</div>
          <div class="oblea-razon">${escapeHtml(p.razonRebaja||'')}</div>
          <div class="oblea-fecha">${escapeHtml(p.desde||'')}</div>
          <div class="oblea-caso">CASO: ${escapeHtml(p.nIncidencia||'')}</div>
        </div>
        <div class="oblea">
          <div class="oblea-title">${escapeHtml((p.descripcion||'').toUpperCase().slice(0,30))}</div>
          <div class="oblea-sku">SKU  ${escapeHtml(p.sku||'')}</div>
          <div class="oblea-divider"></div>
          <div class="oblea-serie">Nro de serie: ${escapeHtml(p.nroSerie||'xxxxxxxxxx')}</div>
          <svg class="oblea-barcode" id="barcode-obl-b-${idx}" jsbarcode-format="ean13"></svg>
          <div class="oblea-producto-text">Producto sin cambio ni devolución</div>
          <div class="oblea-razon">${escapeHtml(p.razonRebaja||'')}</div>
          <div class="oblea-fecha">${escapeHtml(p.desde||'')}</div>
          <div class="oblea-caso">CASO: ${escapeHtml(p.nIncidencia||'')}</div>
        </div>
      </div>
    `;
    list.appendChild(container);

    // Render barcodes using JsBarcode (force EAN13)
    try{
      const raw = (p.ean||p.sku||'').toString().trim();
      const digits = raw.replace(/\D/g,'');
      
      if(digits.length === 0) {
        throw new Error('No hay código EAN/SKU');
      }
      
      // Try to generate valid EAN13
      let eanCode = digits;
      
      if(digits.length < 12) {
        // Pad with zeros to make it 12 digits (JsBarcode will add check digit)
        eanCode = digits.padStart(12, '0');
      } else if(digits.length === 12) {
        // JsBarcode will calculate and add check digit
        eanCode = digits;
      } else if(digits.length === 13) {
        // Already has 13 digits, use as is
        eanCode = digits;
      } else {
        // Too long, truncate to 12 digits
        eanCode = digits.substring(0, 12);
      }
      
      // Try to render barcode
      JsBarcode(`#barcode-a6-${idx}`, eanCode, {
        format: 'ean13', 
        width: 1.2, 
        height: 40, 
        displayValue: true, 
        fontSize: 10, 
        margin: 0,
        valid: function(valid) {
          if(!valid) {
            console.warn('Invalid EAN13 for A6:', eanCode);
          }
        }
      });
      
      JsBarcode(`#barcode-a6b-${idx}`, eanCode, {
        format: 'ean13', 
        width: 1.2, 
        height: 40, 
        displayValue: true, 
        fontSize: 10, 
        margin: 0
      });
      
      JsBarcode(`#barcode-obl-a-${idx}`, eanCode, {
        format: 'ean13', 
        width: 1.0, 
        height: 30, 
        displayValue: true, 
        fontSize: 8, 
        margin: 0
      });
      
      JsBarcode(`#barcode-obl-b-${idx}`, eanCode, {
        format: 'ean13', 
        width: 1.0, 
        height: 30, 
        displayValue: true, 
        fontSize: 8, 
        margin: 0
      });
      
    }catch(e){
      console.error('Barcode error:', e.message, 'for product:', p);
      // Show error in barcodes
      const ids = [`#barcode-a6-${idx}`, `#barcode-a6b-${idx}`, `#barcode-obl-a-${idx}`, `#barcode-obl-b-${idx}`];
      ids.forEach(id=>{
        const el = container.querySelector(id);
        if(el) {
          el.innerHTML = `<text x="50" y="25" style="font-size:9px;fill:#b00;text-anchor:middle">Sin código de barras</text>`;
        }
      });
    }

    // Add download toolbar for this sheet
    const toolbar = document.createElement('div');
    toolbar.className = 'download-toolbar';

    const btnA4 = document.createElement('button'); 
    btnA4.className = 'btn-download btn-primary-download';
    btnA4.innerHTML = '📄 Descargar A4 Completo';
    
    const btnCarteles = document.createElement('button'); 
    btnCarteles.className = 'btn-download btn-secondary-download';
    btnCarteles.innerHTML = '🏷️ Solo Carteles A4';
    
    const btnObleas = document.createElement('button'); 
    btnObleas.className = 'btn-download btn-secondary-download';
    btnObleas.innerHTML = '🏷️ Solo Obleas A4';

    toolbar.appendChild(btnA4);
    toolbar.appendChild(btnCarteles);
    toolbar.appendChild(btnObleas);

    // Insert toolbar before container
    list.insertBefore(toolbar, container);

    // Download helper - Use browser print for better quality and SVG support
    function downloadAsA4PDF(element, filename){
      // Mark element for printing
      element.setAttribute('data-print-target', 'true');
      
      // Set document title for PDF filename
      const originalTitle = document.title;
      document.title = filename.replace('.pdf', '');
      
      // Trigger print
      window.print();
      
      // Restore after print
      setTimeout(() => {
        element.removeAttribute('data-print-target');
        document.title = originalTitle;
      }, 100);
    }

    // Descargar A4 completo (2 carteles + 2 obleas)
    btnA4.addEventListener('click', ()=>{
      downloadAsA4PDF(container, `${(p.nIncidencia||p.sku||'producto')}_A4_Completo.pdf`);
    });

    // Descargar solo carteles en A4
    btnCarteles.addEventListener('click', ()=>{
      const tempContainer = document.createElement('div');
      tempContainer.className = 'sheet-a4';
      const cartelesRow = container.querySelector('.row');
      if(cartelesRow) {
        const clonedRow = cartelesRow.cloneNode(true);
        tempContainer.appendChild(clonedRow);
        // Re-render barcodes in cloned elements
        const clonedSvgs = clonedRow.querySelectorAll('svg[id*="barcode"]');
        clonedSvgs.forEach((svg, i) => {
          const originalId = svg.id;
          const match = originalId.match(/barcode-a6b?-(\d+)/);
          if(match) {
            const idx = match[1];
            const eanCode = (p.ean||p.sku||'').toString().replace(/\D/g,'');
            if(eanCode.length >= 12) {
              JsBarcode(svg, eanCode.length === 12 ? eanCode : eanCode.substring(0, 12), {
                format: 'ean13', width: 1.2, height: 40, displayValue: true, fontSize: 10, margin: 0
              });
            }
          }
        });
        list.appendChild(tempContainer);
        downloadAsA4PDF(tempContainer, `${(p.nIncidencia||p.sku||'producto')}_Carteles_A4.pdf`);
        setTimeout(() => list.removeChild(tempContainer), 1000);
      }
    });

    // Descargar solo obleas en A4
    btnObleas.addEventListener('click', ()=>{
      const tempContainer = document.createElement('div');
      tempContainer.className = 'sheet-a4';
      const rows = container.querySelectorAll('.row');
      if(rows[1]) {
        const clonedRow = rows[1].cloneNode(true);
        tempContainer.appendChild(clonedRow);
        // Re-render barcodes in cloned elements
        const clonedSvgs = clonedRow.querySelectorAll('svg[id*="barcode"]');
        clonedSvgs.forEach(svg => {
          const eanCode = (p.ean||p.sku||'').toString().replace(/\D/g,'');
          if(eanCode.length >= 12) {
            JsBarcode(svg, eanCode.length === 12 ? eanCode : eanCode.substring(0, 12), {
              format: 'ean13', width: 1.0, height: 30, displayValue: true, fontSize: 8, margin: 0
            });
          }
        });
        list.appendChild(tempContainer);
        downloadAsA4PDF(tempContainer, `${(p.nIncidencia||p.sku||'producto')}_Obleas_A4.pdf`);
        setTimeout(() => list.removeChild(tempContainer), 1000);
      }
    });
  });
}

function formatMoneyParts(v){
  const n = parseFloat(String(v).replace(/\./g,'').replace(',', '.')) || 0;
  const entero = Math.floor(n).toLocaleString('es-AR').replace(/,/g,'.');
  const dec = (Math.round((n - Math.floor(n))*100)).toString().padStart(2,'0');
  return { entero, dec };
}

// backward-compatible wrapper returning string
function formatMoney(v){
  const p = formatMoneyParts(v);
  return `${p.entero},${p.dec}`;
}

function escapeHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

// Init
document.addEventListener('DOMContentLoaded', ()=>{
  products.push(sample);
  renderTable(); bindTableEvents();

  $('#btn-add').addEventListener('click', ()=>{ addEmpty(); });
  $('#btn-delete-selected').addEventListener('click', ()=>{ deleteSelected(); });
  $('#btn-preview').addEventListener('click', ()=>{ $('#preview-section').classList.toggle('hidden'); renderPreview(); });
  $('#btn-print-all').addEventListener('click', ()=>{ printAllSheets(); });

  $('#btn-import').addEventListener('click', ()=>{
    const f = $('#file-csv').files[0]; if(!f){alert('Seleccioná un CSV');return;} importCSV(f);
  });

  $('#select-all').addEventListener('change', (e)=>{
    const v = e.target.checked; $all('.sel').forEach(ch=>ch.checked=v);
  });
});

// Download all sheets as a single multi-page PDF
async function printAllSheets() {
  const sheets = $all('.sheet-a4');
  if(sheets.length === 0) {
    alert('No hay carteles para imprimir. Genera la vista previa primero.');
    return;
  }
  
  if(!confirm(`¿Descargar ${sheets.length} cartel(es) en un solo PDF?`)) {
    return;
  }
  
  const btn = $('#btn-print-all');
  const originalText = btn.textContent;
  const { jsPDF } = window.jspdf;
  
  try {
    btn.textContent = `⏳ Generando PDF...`;
    btn.disabled = true;
    
    // Create PDF with exact dimensions (595x842px)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [595, 842],
      compress: true
    });
    
    for(let i = 0; i < sheets.length; i++) {
      btn.textContent = `⏳ Procesando ${i + 1}/${sheets.length}...`;
      
      const sheet = sheets[i];
      
      // Capture the sheet exactly as displayed (595x842px)
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
      
      // Add new page for sheets after the first one
      if(i > 0) {
        pdf.addPage([595, 842], 'portrait');
      }
      
      // Add the canvas image to PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, 595, 842);
      
      // Small delay to avoid blocking UI
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Save the PDF with all sheets
    const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'');
    pdf.save(`carteles_${timestamp}.pdf`);
    
    btn.textContent = originalText;
    btn.disabled = false;
    alert(`✅ Se descargó el PDF con ${sheets.length} cartel(es).`);
    
  } catch(error) {
    console.error('Error generando PDF:', error);
    alert('Error al generar el PDF. Por favor intenta nuevamente.');
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

// Utility bindings
function bindTableEvents(){
  // handlers already attached via renderTable interactive listener
  $('#products-body').addEventListener('input', (e)=>{
    const t = e.target; const idx = parseInt(t.dataset.idx,10); const field = t.dataset.field; if(!Number.isNaN(idx)&&field) products[idx][field]=t.value;
  });
  $('#products-body').addEventListener('click', (e)=>{ if(e.target.classList.contains('btn-del')){ const idx=parseInt(e.target.dataset.idx,10); products.splice(idx,1); renderTable(); } });
}
