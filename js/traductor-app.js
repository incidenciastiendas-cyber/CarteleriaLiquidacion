// traductor-app.js - Lógica de procesamiento del Master de Eventos

let datosOriginales = [];
let datosProcesados = [];
let estadisticas = {};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('file-input');
  const dropZone = document.getElementById('drop-zone');

  // Eventos de archivo
  fileInput.addEventListener('change', handleFileSelect);
  
  // Drag & Drop
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  });
});

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    processFile(file);
  }
}

function processFile(file) {
  const fileName = file.name;
  document.getElementById('file-name').textContent = fileName;
  document.getElementById('file-info').style.display = 'flex';
  document.querySelector('.drop-zone').style.display = 'none';

  // Mostrar sección de procesamiento
  document.getElementById('processing-section').style.display = 'block';

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      
      datosOriginales = jsonData;
      procesarDatos(jsonData);
    } catch (error) {
      alert('Error al procesar el archivo: ' + error.message);
      resetUpload();
    }
  };
  reader.readAsArrayBuffer(file);
}

function procesarDatos(datos) {
  console.log('\n========================================');
  console.log('INICIO DEL PROCESAMIENTO');
  console.log('========================================');
  console.log('PASO 1: Datos originales:', datos.length);
  
  // 1. Filtrar por Testimonial = "SI"
  const filtrados = datos.filter(row => {
    const testimonial = String(row['Testimonial'] || '').trim().toUpperCase();
    return testimonial === 'SI' || testimonial === 'SÍ';
  });

  console.log('PASO 2: Filtrados (Testimonial=SI):', filtrados.length);

  // 2. Procesar cada fila individualmente primero
  const filasProcesadas = [];
  const dptosPermitidos = ['80', '43', '21', '93', '98'];
  
  filtrados.forEach(row => {
    const tituloOriginal = String(row['Título acción'] || '').trim();
    if (!tituloOriginal) return;
    
    const resultado = procesarTituloYTipo(row, tituloOriginal);
    
    // FILTRO: Descartar títulos vacíos después de procesar
    if (!resultado.titulo || resultado.titulo.trim() === '') {
      return; // Descartar esta fila
    }
    
    // FILTRO CRÍTICO: Si es precio producto ($), solo departamentos permitidos
    if (resultado.tipoAccion && resultado.tipoAccion.startsWith('$')) {
      if (!dptosPermitidos.includes(resultado.departamento)) {
        return; // Descartar precios de departamentos no permitidos
      }
    }
    // Para otros tipos de acción (%, cuotas, NxN), permitir todos los departamentos
    
    filasProcesadas.push(resultado);
  });

  console.log('PASO 3: Procesadas individualmente (CSI, CCQ, Incluye/Excluye):', filasProcesadas.length);

  // 3. PASO ESPECIAL: Detectar y combinar mismo título con versión regular y MC
  // Agrupar por departamento + TÍTULO ORIGINAL (sin procesar) para detectar versiones MC
  const gruposPorTitulo = {};
  
  filasProcesadas.forEach(item => {
    const dpto = item.departamento || 'SIN-DPTO';
    const tituloOriginal = item.tituloOriginal || 'SIN-TITULO'; // Usar título ORIGINAL
    const claveTitulo = `${dpto}|||${tituloOriginal}`;
    
    if (!gruposPorTitulo[claveTitulo]) {
      gruposPorTitulo[claveTitulo] = [];
    }
    gruposPorTitulo[claveTitulo].push(item);
  });

  // Procesar cada grupo de título para combinar MC con regular
  const itemsProcesadosMC = [];
  let combinacionesMC = 0;
  
  console.log('\n--- DETALLE DE COMBINACIONES MC ---');
  
  Object.keys(gruposPorTitulo).forEach(claveTitulo => {
    const grupo = gruposPorTitulo[claveTitulo];
    
    // Separar versiones con y sin MC
    const versionesRegular = grupo.filter(item => !item.tuClub);
    const versionesMC = grupo.filter(item => item.tuClub);
    
    // Si hay versiones con y sin MC del mismo título, combinarlas
    if (versionesRegular.length > 0 && versionesMC.length > 0) {
      // Tomar SOLO LA PRIMERA de cada tipo para combinar
      const itemRegular = versionesRegular[0];
      const itemMC = versionesMC[0];
      
      // Extraer porcentajes o tipos base (sin MC)
      const tipoRegular = itemRegular.tipoAccion.replace(/MC/g, '').trim();
      const tipoMC = itemMC.tipoAccion.replace(/MC/g, '').trim();
      
      // Combinar como X%OY%MC
      const tipoCombinadoMC = `${tipoRegular}O${tipoMC}MC`;
      combinacionesMC++;
      
      console.log(`✓ Combinación ${combinacionesMC}:`, {
        'Título original': itemRegular.tituloOriginal.substring(0, 50) + '...',
        'Tipo Regular': itemRegular.tipoAccion,
        'Tipo MC': itemMC.tipoAccion,
        'Tipo Combinado': tipoCombinadoMC,
        'Regulares eliminadas': versionesRegular.length,
        'MC eliminadas': versionesMC.length,
        'Total eliminadas': versionesRegular.length + versionesMC.length,
        'Total agregadas': 1
      });
      
      // Crear item combinado (REEMPLAZA TODAS las versiones regular y MC)
      itemsProcesadosMC.push({
        ...itemMC, // Usar base MC
        tipoAccion: tipoCombinadoMC,
        tituloOriginal: [itemRegular.tituloOriginal, itemMC.tituloOriginal].filter((v, i, a) => a.indexOf(v) === i).join('; ')
      });
      
      // CRÍTICO: NO agregar NINGUNA de las versiones originales (ni regulares ni MC)
      // Todas se eliminan, solo queda la combinada
      
    } else {
      // No hay combinación MC/Regular (solo hay de un tipo), agregar todos normalmente
      grupo.forEach(item => itemsProcesadosMC.push(item));
    }
  });

  console.log(`PASO 4: Combinaciones MC+Regular creadas: ${combinacionesMC}`);
  console.log(`PASO 4: Items después de combinar MC: ${itemsProcesadosMC.length}`);

  // 4. Agrupar por Departamento + Tipo de Acción para unificar títulos
  const grupos = {};
  
  itemsProcesadosMC.forEach(item => {
    const dpto = item.departamento || 'SIN-DPTO';
    const tipo = item.tipoAccion || 'SIN-TIPO';
    const clave = `${dpto}|||${tipo}`; // Usar ||| como separador único
    
    if (!grupos[clave]) {
      grupos[clave] = [];
    }
    grupos[clave].push(item);
  });

  console.log('PASO 5: Grupos por dpto+tipo:', Object.keys(grupos).length);

  // 5. Unificar títulos por grupo (máx 4, cada uno < 30 caracteres)
  datosProcesados = [];
  
  Object.keys(grupos).forEach(clave => {
    const grupo = grupos[clave];
    const primerItem = grupo[0];
    
    // Obtener todos los títulos únicos
    const todosLosTitulos = grupo
      .map(item => item.titulo)
      .filter(titulo => titulo)
      .filter((titulo, index, self) => self.indexOf(titulo) === index); // Únicos
    
    // Intentar primero con títulos < 30 caracteres
    let titulosValidos = todosLosTitulos.filter(titulo => titulo.length < 30);
    
    // Si no hay ninguno < 30, usar todos los títulos sin filtrar por longitud
    if (titulosValidos.length === 0) {
      titulosValidos = todosLosTitulos;
    }
    
    // Máximo 4 títulos
    titulosValidos = titulosValidos.slice(0, 4);
    
    // Unificar títulos con coma
    const tituloUnificado = titulosValidos.join(', ');
    
    // Recopilar todos los títulos originales
    const titulosOriginales = grupo
      .map(item => item.tituloOriginal)
      .filter((titulo, index, self) => self.indexOf(titulo) === index) // Únicos
      .join('; ');
    
    // Crear item unificado
    datosProcesados.push({
      ...primerItem,
      titulo: tituloUnificado,
      titulosOriginales: titulosOriginales,
      cantidadUnificada: grupo.length
    });
  });

  console.log('PASO 6: Títulos unificados, filas finales:', datosProcesados.length);
  console.log('========================================');
  console.log('FIN DEL PROCESAMIENTO');
  console.log('========================================\n');
  console.log('Resumen:', {
    'Datos originales': datos.length,
    'Filtrados (Testimonial=SI)': filtrados.length,
    'Combinaciones MC creadas': combinacionesMC,
    'Filas finales en CSV': datosProcesados.length
  });

  // 5. Calcular estadísticas
  calcularEstadisticas();

  // 5. Mostrar resultados
  setTimeout(() => {
    mostrarResultados();
  }, 800);
}

function procesarTituloYTipo(item, tituloOriginal) {
  let tipoAccion = String(item['Tipo acción'] || '').trim();
  let titulo = tituloOriginal;
  let incluyeExcluye = '';
  let aclaracion2 = '';
  const tuClub = String(item['Tu Club'] || '').trim().toUpperCase() === 'SI';
  
  // Extraer los primeros 1 o 2 dígitos del departamento (formato: "95 Bebidas sin alcohol" o "9 Deportes")
  const dptoCompleto = String(item['Dpto.'] || '').trim();
  const matchDpto = dptoCompleto.match(/^(\d{1,2})/);
  const dpto = matchDpto ? matchDpto[1] : '';

  // ORDEN DE PROCESAMIENTO (de primero a último):
  // 1. CSI (Cuotas Sin Interés) - PRIMERO
  // 2. CCQ (Combínalo Como Quieras)
  // 3. Incluye/Excluye
  // 4. Hasta X%

  // REGLA 1: Interpretar CSI (Cuotas sin interés) - PRIMERO
  // Patrones: "Mas XCSI", "mas x csi", "XCSI", "X CSI"
  const regexCSI = /(?:Mas\s+)?(\d+)\s*CSI/gi;
  const matchCSI = titulo.match(regexCSI);
  if (matchCSI) {
    const numeroCuotas = matchCSI[0].match(/\d+/)[0];
    const cuotasStr = `+${numeroCuotas}Q`;
    
    // Si ya hay un tipo de acción, combinar con +
    if (tipoAccion && tipoAccion.trim() !== '') {
      tipoAccion = tipoAccion + cuotasStr;
    } else {
      tipoAccion = cuotasStr.substring(1); // Quitar el + inicial si no hay tipo previo
    }
    
    // Remover del título (incluye "Mas" si existe)
    titulo = titulo.replace(regexCSI, '').trim();
    titulo = titulo.replace(/\s+/g, ' ').trim();
  }

  // REGLA 2: Interpretar CCQ (Combinalo como quieras)
  const regexCCQ = /CCQ|COMBINALO\s+COMO\s+QUIERAS/gi;
  if (regexCCQ.test(titulo)) {
    aclaracion2 = 'COMBINALO COMO QUIERAS';
    titulo = titulo.replace(regexCCQ, '').trim();
    titulo = titulo.replace(/\s+/g, ' ').trim();
  }

  // REGLA 3: Extraer Incluye/Excluye del título
  const regexIncluyeExcluye = /(Incluye|Incl|Inc|Excluye|Exc)\s+(.+)/i;
  const matchInclExcl = titulo.match(regexIncluyeExcluye);
  if (matchInclExcl) {
    const tipo = matchInclExcl[1]; // "Incluye", "Excluye", etc.
    const detalle = matchInclExcl[2]; // Lo que viene después
    incluyeExcluye = `${tipo} ${detalle}`;
    // Remover del título
    titulo = titulo.replace(regexIncluyeExcluye, '').trim();
    titulo = titulo.replace(/\s+/g, ' ').trim();
  }

  // REGLA 4: Interpretar "Hasta XX%" en el título
  const regexHasta = /HASTA\s+(\d+)%/i;
  const matchHasta = titulo.match(regexHasta);
  if (matchHasta) {
    const porcentaje = matchHasta[1];
    tipoAccion = `H${porcentaje}%`;
    // Remover "Hasta XX%" del título
    titulo = titulo.replace(regexHasta, '').trim();
    // Limpiar espacios múltiples
    titulo = titulo.replace(/\s+/g, ' ').trim();
  }

  // REGLA: Procesar tipo de acción original
  if (!matchHasta && tipoAccion) {
    tipoAccion = procesarTipoAccion(tipoAccion);
  }

  // REGLA: Agregar MC si Tu Club = Si
  if (tuClub && tipoAccion && !tipoAccion.includes('MC')) {
    tipoAccion = tipoAccion + 'MC';
  }

  // REGLA: Precios productos solo para departamentos 80, 43, 21, 93
  const dptosPermitidos = ['80', '43', '21', '93','98'];
  let precioProducto = '';
  
  if (dptosPermitidos.includes(dpto)) {
    const pvp = item['PVP Evento unitario'];
    if (pvp) {
      precioProducto = `$${pvp}`;
    }
  }

  // Fechas
  const fechaDesde = formatearFecha(item['Fecha Inicio Item']);
  const fechaHasta = formatearFecha(item['Fecha Fin Item']);

  // Legal (usar campos disponibles)
  const legal1 = 'EL DESCUENTO SE HARÁ EFECTIVO EN LÍNEA DE CAJAS Y SE APLICARÁ SOBRE EL PRECIO UNITARIO';
  const legal2 = generarLegal2(fechaDesde, fechaHasta);

  return {
    tipoAccion: tipoAccion || '',
    titulo: titulo || '',
    tituloOriginal: tituloOriginal, // Guardar título original sin procesar
    desde: fechaDesde,
    hasta: fechaHasta,
    incluyeExcluye: incluyeExcluye,
    aclaracion2: aclaracion2,
    legal1: legal1,
    legal2: legal2,
    tuClub: tuClub,
    tipoOriginal: String(item['Tipo acción'] || '').trim(),
    departamento: dpto,
    descripcionDpto: dptoCompleto
  };
}

function procesarTipoAccion(tipo) {
  tipo = tipo.trim();
  
  // 1x25% → 25%
  if (/^\d+[xX]\d+%$/.test(tipo)) {
    const match = tipo.match(/\d+%$/);
    return match ? match[0] : tipo;
  }
  
  // 2x1 → 2x1 (mantener)
  if (/^\d+[xX]\d+$/.test(tipo)) {
    return tipo;
  }
  
  // #2x70% → 70%2
  if (/^#\d+[xX]\d+%$/.test(tipo)) {
    const match = tipo.match(/(\d+)%$/);
    if (match) {
      return match[1] + '%2';
    }
  }
  
  // $13333 → $13333 (mantener)
  if (tipo.startsWith('$')) {
    return tipo;
  }
  
  return tipo;
}

function formatearFecha(fecha) {
  if (!fecha) return '';
  
  try {
    let fechaObj;
    
    // Si es un número (formato Excel serial)
    if (typeof fecha === 'number') {
      // Excel fecha serial (desde 1900-01-01)
      const excelEpoch = new Date(1899, 11, 30);
      fechaObj = new Date(excelEpoch.getTime() + fecha * 86400000);
    } else {
      // Intentar parsear como string
      fechaObj = new Date(fecha);
    }
    
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const anio = fechaObj.getFullYear();
    
    return `${dia}/${mes}/${anio}`;
  } catch (e) {
    console.error('Error formateando fecha:', fecha, e);
    return String(fecha);
  }
}

function generarLegal2(desde, hasta) {
  if (!desde || !hasta) return '';
  
  // Extraer solo día y mes
  const desdePartes = desde.split('/');
  const hastaPartes = hasta.split('/');
  
  if (desdePartes.length >= 2 && hastaPartes.length >= 2) {
    const desdeDM = `${desdePartes[0]}/${desdePartes[1]}/${desdePartes[2]}`;
    const hastaDM = `${hastaPartes[0]}/${hastaPartes[1]}/${hastaPartes[2]}`;
    return `PROMOCIÓN VÁLIDA DESDE EL ${desdeDM} HASTA EL ${hastaDM} PARA MÁS INFORMACIÓN O CONDICIONES O LIMITACIONES APLICABLES CONSULTE EN MAXIAHORRO.AR/LEGALES. DONNA SA: 30-67871830-0`;
  }
  
  return '';
}

function calcularEstadisticas() {
  estadisticas = {
    original: datosOriginales.length,
    procesadas: datosProcesados.length,
    unicas: datosProcesados.length,
    masclub: 0,
    masclubDescuento: 0,
    masclubCuotas: 0,
    masclubDescCuotas: 0,
    regularDescuento: 0,
    regularCuotas: 0,
    regularNxN: 0,
    regularPrecio: 0,
    regularOtros: 0,
    porDepartamento: {}
  };

  datosProcesados.forEach(item => {
    // Contar por departamento
    const dpto = item.departamento || 'Sin departamento';
    const dptoNombre = item.descripcionDpto || dpto;
    const dptoKey = `${dpto} - ${dptoNombre}`;
    
    if (!estadisticas.porDepartamento[dptoKey]) {
      estadisticas.porDepartamento[dptoKey] = 0;
    }
    estadisticas.porDepartamento[dptoKey]++;

    if (item.tuClub) {
      estadisticas.masclub++;
      
      if (item.tipoAccion.includes('%') && item.tipoAccion.includes('Q')) {
        estadisticas.masclubDescCuotas++;
      } else if (item.tipoAccion.includes('%')) {
        estadisticas.masclubDescuento++;
      } else if (item.tipoAccion.includes('Q')) {
        estadisticas.masclubCuotas++;
      }
    } else {
      // Regular
      if (item.tipoAccion.includes('%') && item.tipoAccion.includes('Q')) {
        // Ya contado en otros
      } else if (item.tipoAccion.includes('%')) {
        estadisticas.regularDescuento++;
      } else if (item.tipoAccion.includes('Q')) {
        estadisticas.regularCuotas++;
      } else if (/\d+[xX]\d+/.test(item.tipoAccion)) {
        estadisticas.regularNxN++;
      } else if (item.tipoAccion.includes('$')) {
        estadisticas.regularPrecio++;
      } else {
        estadisticas.regularOtros++;
      }
    }
  });
}

function mostrarResultados() {
  // Ocultar processing
  document.getElementById('processing-section').style.display = 'none';
  
  // Mostrar results
  document.getElementById('results-section').style.display = 'block';

  // Llenar estadísticas
  document.getElementById('stat-original').textContent = estadisticas.original;
  document.getElementById('stat-procesadas').textContent = estadisticas.procesadas;
  document.getElementById('stat-unicas').textContent = estadisticas.unicas;
  document.getElementById('stat-masclub').textContent = estadisticas.masclub;

  // Detalle MásClub
  const detailMasclub = document.getElementById('detail-masclub');
  detailMasclub.innerHTML = `
    <li><span>Descuentos MásClub</span><span class="count">${estadisticas.masclubDescuento}</span></li>
    <li><span>Cuotas MásClub</span><span class="count">${estadisticas.masclubCuotas}</span></li>
    <li><span>Desc + Cuotas MásClub</span><span class="count">${estadisticas.masclubDescCuotas}</span></li>
  `;

  // Detalle Regular
  const detailRegular = document.getElementById('detail-regular');
  detailRegular.innerHTML = `
    <li><span>Descuentos</span><span class="count">${estadisticas.regularDescuento}</span></li>
    <li><span>Cuotas</span><span class="count">${estadisticas.regularCuotas}</span></li>
    <li><span>NxN</span><span class="count">${estadisticas.regularNxN}</span></li>
    <li><span>Precios</span><span class="count">${estadisticas.regularPrecio}</span></li>
    <li><span>Otros</span><span class="count">${estadisticas.regularOtros}</span></li>
  `;

  // Detalle por Departamento
  const detailDpto = document.getElementById('detail-departamento');
  const dptosOrdenados = Object.entries(estadisticas.porDepartamento)
    .sort((a, b) => b[1] - a[1]); // Ordenar por cantidad descendente
  
  detailDpto.innerHTML = dptosOrdenados.map(([dpto, count]) => 
    `<li><span>${escapeHtml(dpto)}</span><span class="count">${count}</span></li>`
  ).join('');

  // Preview de tabla
  const previewBody = document.getElementById('preview-body');
  previewBody.innerHTML = '';

  datosProcesados.slice(0, 20).forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${escapeHtml(item.tipoAccion)}</strong></td>
      <td>${escapeHtml(item.desde)}</td>
      <td>${escapeHtml(item.hasta)}</td>
      <td>${escapeHtml(item.titulo)}</td>
      <td>${escapeHtml(item.incluyeExcluye)}</td>
      <td>${escapeHtml(item.aclaracion2)}</td>
      <td style="font-size: 0.8em;">${escapeHtml(item.legal1).substring(0, 40)}...</td>
      <td style="font-size: 0.8em;">${escapeHtml(item.legal2).substring(0, 40)}...</td>
      <td style="font-size: 0.8em;">${escapeHtml(item.titulosOriginales || '').substring(0, 50)}...</td>
    `;
    previewBody.appendChild(row);
  });

  if (datosProcesados.length > 20) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="10" style="text-align: center; color: #64748b; font-style: italic;">... y ${datosProcesados.length - 20} filas más</td>`;
    previewBody.appendChild(row);
  }
}

function downloadCSV() {
  // Generar CSV en el formato esperado por cenefas promocionales
  // IMPORTANTE: Separador punto y coma (;) para evitar confusión con comas en los títulos
  const headers = ['Tipo Acción', 'Desde', 'Hasta', 'Título Acción', 'Incluye/Excluye', 'Aclaración 2', 'Legal 1', 'Legal 2', 'Títulos Originales'];
  
  let csv = headers.join(';') + '\n';
  
  datosProcesados.forEach(item => {
    const row = [
      escaparCSV(item.tipoAccion),
      escaparCSV(item.desde),
      escaparCSV(item.hasta),
      escaparCSV(item.titulo),
      escaparCSV(item.incluyeExcluye),
      escaparCSV(item.aclaracion2),
      escaparCSV(item.legal1),
      escaparCSV(item.legal2),
      escaparCSV(item.titulosOriginales)
    ];
    csv += row.join(';') + '\n';
  });

  // Agregar BOM UTF-8 para soportar caracteres especiales (tildes, eñe)
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csv;
  
  // Descargar con encoding UTF-8
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const fecha = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `cenefas-procesadas-${fecha}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escaparCSV(valor) {
  if (valor == null) return '""';
  
  valor = String(valor);
  
  // Si contiene punto y coma, coma, comilla o salto de línea, envolver en comillas
  if (valor.includes(';') || valor.includes(',') || valor.includes('"') || valor.includes('\n')) {
    // Duplicar comillas internas
    valor = valor.replace(/"/g, '""');
    return `"${valor}"`;
  }
  
  return `"${valor}"`;
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

function resetUpload() {
  // Resetear todo
  document.getElementById('file-input').value = '';
  document.getElementById('file-info').style.display = 'none';
  document.querySelector('.drop-zone').style.display = 'block';
  document.getElementById('processing-section').style.display = 'none';
  document.getElementById('results-section').style.display = 'none';
  
  datosOriginales = [];
  datosProcesados = [];
  estadisticas = {};
}

function enviarACenefas() {
  if (!datosProcesados || datosProcesados.length === 0) {
    alert('No hay datos procesados para enviar');
    return;
  }

  // Convertir datosProcesados al formato de cenefas
  const cenefasData = datosProcesados.map(item => ({
    tipo: item.tipoAccion,
    desde: item.desde,
    hasta: item.hasta,
    titulo: item.titulo,
    incluyeExcluye: item.incluyeExcluye || '',
    aclaracion2: item.aclaracion2 || '',
    legal1: item.legal1,
    legal2: item.legal2
  }));

  // Guardar en localStorage con clave especial
  localStorage.setItem('traductor-to-cenefas', JSON.stringify(cenefasData));
  
  console.log(`✓ Enviando ${cenefasData.length} cenefas a Cenefas Promocionales`);
  
  // Redirigir a cenefas.html
  window.location.href = 'cenefas.html';
}

function toggleHelp() {
  const helpContent = document.getElementById('help-content');
  if (helpContent.style.display === 'none') {
    helpContent.style.display = 'block';
  } else {
    helpContent.style.display = 'none';
  }
}
