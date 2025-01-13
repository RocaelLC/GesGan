import { transactionsCollection } from "./firebaseConfig.js";
import { onSnapshot, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const form = document.getElementById("transaction-form");
const transactionTable = document.getElementById("transaction-table");
const totalIngresosElement = document.getElementById("total-ingresos");
const totalEgresosElement = document.getElementById("total-egresos");
const utilidadElement = document.getElementById("utilidad");
const exportButton = document.createElement("button");

let totalIngresos = 0;
let totalEgresos = 0;

// Función para renderizar transacciones
function renderTransactions(transactions) {
  transactionTable.innerHTML = ""; // Limpiar la tabla
  totalIngresos = 0;
  totalEgresos = 0;

  transactions.forEach(({ date, concept, value, type }) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${date}</td>
      <td>${concept}</td>
      <td>${type === "ingreso" ? value : ""}</td>
      <td>${type === "egreso" ? value : ""}</td>
    `;
    transactionTable.appendChild(row);

    // Actualizar totales
    if (type === "ingreso") {
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

// Escuchar cambios en Firestore
onSnapshot(transactionsCollection, (snapshot) => {
  const transactions = snapshot.docs.map((doc) => doc.data());
  renderTransactions(transactions);
});

// Agregar transacción
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const date = document.getElementById("date").value;
  const concept = document.getElementById("concept").value;
  const value = parseFloat(document.getElementById("value").value);
  const type = document.getElementById("type").value;

  try {
    await addDoc(transactionsCollection, { date, concept, value, type });
    form.reset();
  } catch (error) {
    console.error("Error agregando la transacción: ", error);
  }
});

// Exportar a CSV
exportButton.textContent = "Exportar a CSV";
exportButton.addEventListener("click", async () => {
  const snapshot = await getDocs(transactionsCollection);
  let csvContent = "data:text/csv;charset=utf-8,Fecha,Concepto,Ingreso,Egreso\n";

  snapshot.docs.forEach((doc) => {
    const { date, concept, value, type } = doc.data();
    const ingreso = type === "ingreso" ? value : "";
    const egreso = type === "egreso" ? value : "";
    csvContent += `${date},${concept},${ingreso},${egreso}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "movimientos.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

document.getElementById("totals-section").appendChild(exportButton);
