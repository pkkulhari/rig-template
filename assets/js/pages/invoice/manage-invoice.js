/*
*   Abbrivations - 
    [mi => manage invoice],
    [t => table],
    [tp => table pagination]    

*   Content - 
    1. Create Invoice Data Table
    2. Change Table Row Count
    3. Export Table Data 
    4. Table Data Sorting 
*/


/*----- GET ELEMENTS -----*/
mi_table = document.querySelector('#invoice-data');
mi_tbody = document.querySelector('#invoice-data tbody');
mi_td_totalAmount = document.querySelector('#invoice-data tfoot .total-amount');
mi_div_idtPagination = document.querySelector('.idt-pagination');
mi_select_showDataEntries = document.querySelector('#show-data-entries');
mi_th_InvoiceNo = document.querySelector('th.invoice-no');
mi_th_InvoiceNo = document.querySelector('th.invoice-no');
mi_th_InvoiceNo = document.querySelector('th.invoice-no');
mi_btn_tableExportExcel = document.querySelector('.table-export-excel');
mi_btn_tableExportCSV = document.querySelector('.table-export-csv');
mi_btn_tableCopy = document.querySelector('.table-copy');
mi_btn_printTableData = document.querySelector('.print-table');


/*------------------------------------------------------------------------------
    1. Create Invoice Data Table
------------------------------------------------------------------------------*/
const showDataEntries = Number(mi_select_showDataEntries.value);

const tState = {
    data: [],
    page: 1,
    rows: showDataEntries,
    maxButtons: 5
}

createInvoiceDataTable('http://127.0.0.1:5500/invoices.json');

/*----- FUNCTIONS -----*/
function createInvoiceDataTable(url) {
    xhr(url).then(response => {
        // Invoke tPagination() function to get trimmed data and total pages
        const tp = tPagination(response, tState.page, tState.rows);

        // Assign trimmmed Data to tState.data
        tState.data = tp.trimmedData;

        // Create table row, compute total amount and create pagination buttons
        createTableRow(tState.data);
        computeTotalAmount();
        createPaginationButtons(tp.pages);
    });
}

function refreshTable(e) {
    if (e.target.className == 'previous') {
        tState.page--;
    } else if (e.target.className == 'next') {
        tState.page++;
    } else {
        tState.page = Number(e.target.getAttribute('data-page'));
    }

    createInvoiceDataTable('http://127.0.0.1:5500/invoices.json');
}

/*----- HELPER FUNCTIONS -----*/
function tPagination(data, page, rows) {
    if (rows == 'all') rows = data.length;

    const trimStart = (page - 1) * rows;
    const trimEnd = trimStart + rows;

    const trimmedData = data.slice(trimStart, trimEnd);

    const pages = Math.ceil(data.length / rows);

    return {
        trimmedData: trimmedData,
        pages: pages
    }
}

function createTableRow(data) {
    mi_tbody.innerHTML = '';

    for (let x in data) {
        // Create new elements
        const tr = document.createElement('tr');

        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        const td5 = document.createElement('td');

        const a1 = document.createElement('a');
        const a2 = document.createElement('a');
        const a3 = document.createElement('a');

        const i1 = document.createElement('i');
        const i2 = document.createElement('i');
        const i3 = document.createElement('i');

        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const span3 = document.createElement('span');

        // Set attributes
        a1.setAttribute('href', '#');
        a2.setAttribute('href', '#');
        a3.setAttribute('href', '#');
        a1.setAttribute('class', 'table-action-btn btn-1 tool-tip-parent');
        a2.setAttribute('class', 'table-action-btn btn-2 tool-tip-parent');
        a3.setAttribute('class', 'table-action-btn btn-3 tool-tip-parent');

        i1.setAttribute('class', 'icon-invoice');
        i2.setAttribute('class', 'icon-fax');
        i3.setAttribute('class', 'icon-pencil');

        span1.classList.add('tooltipRight');
        span2.classList.add('tooltipRight');
        span3.classList.add('tooltipRight');

        // Append the elements and set text data
        span1.textContent = 'Invoice';
        span2.textContent = 'POS Invoice';
        span3.textContent = 'Update';

        a1.appendChild(i1);
        a2.appendChild(i2);
        a3.appendChild(i3);

        a1.appendChild(span1);
        a2.appendChild(span2);
        a3.appendChild(span3);

        td1.textContent = data[x].invoice_no;
        td2.textContent = data[x].customer_name;
        td3.textContent = data[x].date;
        td4.textContent = '$' + (data[x].amount).toFixed(2);
        td5.appendChild(a1);
        td5.appendChild(a2);
        td5.appendChild(a3);

        td4.setAttribute('class', 'amount');

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);

        mi_tbody.appendChild(tr);
    }
}

function computeTotalAmount() {
    const mi_td_amounts = mi_tbody.querySelectorAll('td.amount');

    let totalAmount = 0;

    mi_td_amounts.forEach((e) => {
        const amount = (e.textContent).replace('$', '');
        totalAmount += Number(amount);
    });

    mi_td_totalAmount.textContent = '$' + totalAmount.toFixed(2);
}

function createPaginationButtons(pages) {
    mi_div_idtPagination.innerHTML = '';

    let maxLeftButtons = tState.page - Math.floor(tState.maxButtons / 2);
    let maxRightButtons = tState.page + Math.floor(tState.maxButtons / 2);

    if (maxLeftButtons <= (1 + 1)) {
        maxLeftButtons = 1;
        maxRightButtons = tState.maxButtons;
    }

    if ((maxRightButtons + 1) >= pages) {
        maxRightButtons = pages;
        maxLeftButtons = pages - (tState.maxButtons - 1);
        if (maxLeftButtons < 1) maxLeftButtons = 1;
    }

    // Create 'Previous Button'
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.setAttribute('href', 'javascript:void(0)');
    a.setAttribute('class', 'previous');
    a.textContent = 'Previous';

    if (tState.page == 1) {
        a.classList.add('disable');
    } else {
        a.addEventListener('click', refreshTable);
    }

    li.appendChild(a);
    mi_div_idtPagination.appendChild(li);

    // Create 'First Page' button '...' Button
    if (maxLeftButtons > 2) {
        li = document.createElement('li');
        a = document.createElement('a');
        a.setAttribute('href', 'javascript:void(0)');
        a.setAttribute('class', 'idt-page');
        a.setAttribute('data-page', 1);
        a.textContent = '1';
        a.addEventListener('click', refreshTable);
        li.appendChild(a);
        mi_div_idtPagination.appendChild(li);

        li = document.createElement('li');
        a = document.createElement('a');
        a.setAttribute('href', 'javascript:void(0)');
        a.classList.add('dots');
        a.textContent = '...';
        li.appendChild(a);
        mi_div_idtPagination.appendChild(li);
    }

    // Create Pagination Buttons
    for (let i = maxLeftButtons; i <= maxRightButtons; i++) {
        const li = document.createElement('li');
        const a = document.createElement('a');

        a.setAttribute('href', 'javascript:void(0)');
        a.setAttribute('class', 'idt-page');

        if (i == tState.page) {
            a.classList.add('active');
        }

        a.setAttribute('data-page', i);
        a.textContent = i;
        a.addEventListener('click', refreshTable);

        li.appendChild(a);
        mi_div_idtPagination.appendChild(li);
    }

    // Create 'Last Page' button and '...' Button
    if (maxRightButtons < pages) {
        li = document.createElement('li');
        a = document.createElement('a');
        a.setAttribute('href', 'javascript:void(0)');
        a.classList.add('dots');
        a.textContent = '...';
        li.appendChild(a);
        mi_div_idtPagination.appendChild(li);

        li = document.createElement('li');
        a = document.createElement('a');
        a.setAttribute('href', 'javascript:void(0)');
        a.setAttribute('class', 'idt-page');
        a.setAttribute('data-page', pages);
        a.textContent = pages;
        a.addEventListener('click', refreshTable);
        li.appendChild(a);
        mi_div_idtPagination.appendChild(li);
    }

    // Create 'Next' Button
    li = document.createElement('li');
    a = document.createElement('a');
    a.setAttribute('href', 'javascript:void(0)');
    a.setAttribute('class', 'next');
    a.textContent = 'Next';

    if (tState.page == pages) {
        a.classList.add('disable');
    } else {
        a.addEventListener('click', refreshTable);
    }

    li.appendChild(a);
    mi_div_idtPagination.appendChild(li);
}


/*------------------------------------------------------------------------------
    2. Change Table Row Count
------------------------------------------------------------------------------*/
/*----- EVENTS -----*/
mi_select_showDataEntries.addEventListener('change', (e) => {
    let showDataEntries = 0;

    if (e.target.value == 'all') {
        showDataEntries = 'all';
    } else {
        showDataEntries = Number(e.target.value);
    }

    tState.rows = showDataEntries;
    tState.page = 1;

    // Recreate Table
    createInvoiceDataTable('http://127.0.0.1:5500/invoices.json');
});


/*------------------------------------------------------------------------------
    3. Export Table Data
------------------------------------------------------------------------------*/
/*------ EVENTS -----*/
// To Excel
mi_btn_tableExportExcel.addEventListener('click', () => {
    tableExportToExcel(trimTable(), 'Invoice Data');
});

// To CSV
mi_btn_tableExportCSV.addEventListener('click', () => {
    tableExportToCSV(trimTable(), 'Invoice Data');
});

// Copy Table Data
mi_btn_tableCopy.addEventListener('click', () => {
    copytableData(mi_table)
});

// Print Table Data
mi_btn_printTableData.addEventListener('click', () => {
    printTableData(trimTable());
});

/*------ FUNCTIONS -----*/
function trimTable() {
    // Create a clone of table node and remove last column(action) from table
    let mi_table_copy = mi_table.cloneNode(true);
    mi_table_copy.querySelector('thead tr th:last-child').remove();
    mi_table_copy.querySelectorAll('thead tr th').forEach((e) => {
        e.children[0].remove();
    });
    mi_table_copy.querySelectorAll('a.table-action-btn').forEach((e) => {
        e.parentNode.remove();
    });
    mi_table_copy.querySelector('tfoot tr td:last-child').remove();

    return mi_table_copy;
}


/*------------------------------------------------------------------------------
    4. Table Data Sorting
------------------------------------------------------------------------------*/