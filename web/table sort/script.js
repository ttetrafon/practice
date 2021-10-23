/**
 * Sorts an HTML Table based on values of the selected column.
 *
 * @param {HTMLTableElement} table The table to sort
 * @param {integer} columnIndex The column that will be used for sorting
 * @param {boolean} asc Ascending (true) or Descending (false) sort
 */
function sortTableByColumn(table, columnIndex, asc = true ) {
    // console.log("---> sortTableByColumn(table, " + columnIndex + ", " + asc + ")", table);
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort the rows.
    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();
        console.log(aColText, " <> ", bColText);
        if (typeof Number(aColText) === "number" && typeof Number(bColText) === "number") {
            return Number(aColText) > Number(bColText) ? dirModifier : (-1 * dirModifier);
        }
        else {
            return aColText > bColText ? dirModifier : (-1 * dirModifier);
        }
    });

    // Clean the table.
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // Readd the sorted rows.
    tBody.append(...sortedRows);

    // Remember current sorting status
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${columnIndex + 1})`).classList.toggle(asc ? "th-sort-asc" : "th-sort-desc");
    // table.querySelector(`th:nth-child(${columnIndex + 1})`).classList.toggle("th-sort-asc", asc);
    // table.querySelector(`th:nth-child(${columnIndex + 1})`).classList.toggle("th-sort-desc", !asc);
}

// sortTableByColumn(document.querySelector("table"), 1, false);

document.querySelectorAll(".table-sortable th").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        // const headerIndex = headerCell.parentElement.children.indexOf(headerCell);
        const currentIsAscending = headerCell.classList.contains("th-sort-asc");
        sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
});
