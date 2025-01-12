const form = document.getElementById('transaction-form');
const transactionTable = document.getElementById('transaction-table');
const totalIngresosElement = document.getElementById('total-ingresos');
const totalEgresosElement = document.getElementById('total-egresos');
const utilidadElement = document.getElementById('utilidad');
const exportButton = document.createElement('button');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let totalIngresos = 0;
let totalEgresos = 0;

// Función para renderizar la tabla desde el almacenamiento
function renderTransactions() {
  transactionTable.innerHTML = ''; // Limpiar la tabla
  totalIngresos = 0;
  totalEgresos = 0;

  transactions.forEach(({ date, concept, value, type }) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${date}</td>
      <td>${concept}</td>
      <td>${type === 'ingreso' ? value : ''}</td>
      <td>${type === 'egreso' ? value : ''}</td>
    `;
    transactionTable.appendChild(row);

    // Actualizar totales
    if (type === 'ingreso') {
      totalIngresos += parseFloat(value);
    } else {
      totalEgresos += parseFloat(value);
    }
  });

  // Actualizar totales en pantalla
  totalIngresosElement.textContent = totalIngresos.toFixed(2);
  totalEgresosElement.textContent = totalEgresos.toFixed(2);
  utilidadElement.textContent = (totalIngresos - totalEgresos).toFixed(2);
}

// Agregar movimiento
form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Obtener datos del formulario
  const date = document.getElementById('date').value;
  const concept = document.getElementById('concept').value;
  const value = parseFloat(document.getElementById('value').value);
  const type = document.getElementById('type').value;

  // Agregar a la lista de transacciones
  transactions.push({ date, concept, value, type });
  localStorage.setItem('transactions', JSON.stringify(transactions));

  // Actualizar la tabla
  renderTransactions();

  // Resetear el formulario
  form.reset();
});

// Función para exportar los datos a CSV
function exportToCSV() {
  let csvContent = "data:text/csv;charset=utf-8,Fecha,Concepto,Ingreso,Egreso\n";
  transactions.forEach(({ date, concept, value, type }) => {
    const ingreso = type === 'ingreso' ? value : '';
    const egreso = type === 'egreso' ? value : '';
    csvContent += `${date},${concept},${ingreso},${egreso}\n`;
  });

  // Crear un enlace para descargar el archivo
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'movimientos.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Agregar botón de exportación
exportButton.textContent = 'Exportar a CSV';
exportButton.style.marginTop = '20px';
exportButton.addEventListener('click', exportToCSV);
document.getElementById('totals-section').appendChild(exportButton);

// Renderizar los datos al cargar la página
renderTransactions();
