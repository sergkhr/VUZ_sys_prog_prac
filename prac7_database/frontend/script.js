const API_URL = "http://localhost:3000";

let selectedTable = null;

/* ===== Выполнение SQL ===== */

document.getElementById("runQuery").addEventListener("click", async () => {
    const query = document.getElementById("queryInput").value;

    const res = await fetch(`${API_URL}/query`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
    });

    const data = await res.json();
    renderTable(data);
});

/* ===== Получение таблиц ===== */

document.getElementById("loadTables").addEventListener("click", async () => {

    const res = await fetch(`${API_URL}/tables`);
    const data = await res.json();

    const list = document.getElementById("tablesList");
    list.innerHTML = "";

    data.forEach(row => {
        const name = Object.values(row)[0];

        const li = document.createElement("li");
        li.textContent = name;

        li.addEventListener("click", () => {
            selectedTable = name;
            loadTableData(name);
        });

        list.appendChild(li);
    });
});

/* ===== Загрузка содержимого таблицы ===== */

async function loadTableData(tableName) {

    const res = await fetch(`${API_URL}/query`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `SELECT * FROM ${tableName}`
        })
    });

    const data = await res.json();
    renderTable(data);
}

/* ===== Отрисовка таблицы ===== */

function renderTable(data) {

    const table = document.getElementById("resultTable");
    table.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
        table.innerHTML = "<tr><td>Нет данных</td></tr>";
        return;
    }

    // заголовки
    const headerRow = document.createElement("tr");

    Object.keys(data[0]).forEach(key => {
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    // строки
    data.forEach(row => {
        const tr = document.createElement("tr");

        Object.values(row).forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });

        table.appendChild(tr);
    });
}




async function getColumns(tableName) {
    const res = await fetch(`${API_URL}/query`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `SHOW COLUMNS FROM ${tableName}`
        })
    });

    return await res.json();
}


document.getElementById("insertBtn").addEventListener("click", async () => {

    if (!selectedTable) {
        alert("Выберите таблицу");
        return;
    }

    const columns = await getColumns(selectedTable);

    const colNames = columns.map(c => c.Field);

    const values = colNames.map(col => `VALUE_FOR_${col.toUpperCase()}`);

    const sql = `INSERT INTO ${selectedTable} (${colNames.join(", ")})
VALUES (${values.map(v => `'${v}'`).join(", ")});`;

    document.getElementById("queryInput").value = sql;
});


document.getElementById("updateBtn").addEventListener("click", async () => {

    if (!selectedTable) {
        alert("Выберите таблицу");
        return;
    }

    const columns = await getColumns(selectedTable);

    const colNames = columns.map(c => c.Field);

    const setPart = colNames.map(col =>
        `${col}='NEW_${col.toUpperCase()}'`
    ).join(", ");

    const sql = `UPDATE ${selectedTable}
SET ${setPart}
WHERE CONDITION_HERE;`;

    document.getElementById("queryInput").value = sql;
});


document.getElementById("deleteBtn").addEventListener("click", () => {

    if (!selectedTable) {
        alert("Выберите таблицу");
        return;
    }

    const sql = `DELETE FROM ${selectedTable}
WHERE CONDITION_HERE;`;

    document.getElementById("queryInput").value = sql;
});