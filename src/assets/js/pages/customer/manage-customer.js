/*
*   Abbrivations - 
    [mc => manage customer],
    [t => table],
    [tp => table pagination]    

*   Content - 
    1. Create Table
    2. Change Table Row Count
    3. Export Table Data 
    4. Table Data Sorting
    5. Current Rows and Total Rows 
*/


/*----- GET ELEMENTS -----*/
mc_table = document.querySelector('#customer-data');
mc_tbody = document.querySelector('#customer-data tbody');
mc_td_balance = document.querySelector('#customer-data tfoot .balance');
mc_div_idtPagination = document.querySelector('.idt-pagination');
mc_select_showDataEntries = document.querySelector('#show-data-entries');
mc_th_InvoiceNo = document.querySelector('th.invoice-no');
mc_btn_tableExportExcel = document.querySelector('.table-export-excel');
mc_btn_tableExportCSV = document.querySelector('.table-export-csv');
mc_btn_tableCopy = document.querySelector('.table-copy');
mc_btn_printTableData = document.querySelector('.print-table');
mc_span_firstRow = document.querySelector('.first-row');
mc_span_lastRow = document.querySelector('.last-row');
mc_span_totalRows = document.querySelector('.total-rows');


/*------------------------------------------------------------------------------
    1. Create Table
------------------------------------------------------------------------------*/
const showDataEntries = Number(mc_select_showDataEntries.value);

const tState = {
    data: [],
    page: 1,
    rows: showDataEntries,
    maxButtons: 5
}

createTable('http://127.0.0.1:5500/data/customers.json');

/*----- FUNCTIONS -----*/
function createTable(url) {
    xhr(url).then(response => {
        // Invoke tPagination() function to get trimmed data and total pages
        const tp = tPagination(response, tState.page, tState.rows);

        // Assign trimmmed Data to tState.data
        tState.data = tp.trimmedData;;

        // Create table row, compute total amount and create pagination buttons
        createTableRow(tState.data); 
        computeBalance();
        createPaginationButtons(tp.pages);
        displayRowInfo(response.length);
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

    createTable('http://127.0.0.1:5500/data/customers.json');
}

/*----- HELPER FUNCTIONS -----*/
function tPagination(data, page, rows) {
    if (rows == 'all') rows = data.length;

    trimStart = (page - 1) * rows; // Global
    trimEnd = trimStart + rows; // Global

    const trimmedData = data.slice(trimStart, trimEnd);

    const pages = Math.ceil(data.length / rows);

    return {
        trimmedData: trimmedData,
        pages: pages
    }
}

function createTableRow(data) {
    mc_tbody.innerHTML = '';

    for (let x in data) {
        // Create new elements
        const tr = document.createElement('tr');

        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        const td5 = document.createElement('td');
        const td6 = document.createElement('td');

        const a1 = document.createElement('a');
        const a2 = document.createElement('a');       

        const i1 = document.createElement('i');
        const i2 = document.createElement('i');       

        const span1 = document.createElement('span');
        const span2 = document.createElement('span');        

        // Set attributes
        a1.setAttribute('href', '#');
        a2.setAttribute('href', '#');       
        a1.setAttribute('class', 'table-action-btn btn-1 tool-tip-parent');
        a2.setAttribute('class', 'table-action-btn btn-2 tool-tip-parent');       

        i1.setAttribute('class', 'icon-edit');
        i2.setAttribute('class', 'icon-trash');      

        span1.classList.add('tooltipRight');
        span2.classList.add('tooltipRight');   

        // Append the elements and set text data
        span1.textContent = 'Update';
        span2.textContent = 'Delete';   

        a1.appendChild(i1);
        a2.appendChild(i2);      

        a1.appendChild(span1);
        a2.appendChild(span2);      

        td1.textContent = data[x].customer_name;
        td2.textContent = data[x].email;
        td3.textContent = data[x].mobile;
        td4.textContent = data[x].address;
        td5.textContent = '$' + (data[x].balance).toFixed(2);
        td6.appendChild(a1);
        td6.appendChild(a2);  

        td5.setAttribute('class', 'balance');

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);

        mc_tbody.appendChild(tr);
    }
}

function computeBalance() {
    const mc_td_balances = mc_tbody.querySelectorAll('td.balance');

    let balance = 0;

    mc_td_balances.forEach((e) => {
        const amount = (e.textContent).replace('$', '');
        balance += Number(amount);
    });

    mc_td_balance.textContent = '$' + balance.toFixed(2);
}

function createPaginationButtons(pages) {
    mc_div_idtPagination.innerHTML = '';

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
    mc_div_idtPagination.appendChild(li);

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
        mc_div_idtPagination.appendChild(li);

        li = document.createElement('li');
        a = document.createElement('a');
        a.setAttribute('href', 'javascript:void(0)');
        a.classList.add('dots');
        a.textContent = '...';
        li.appendChild(a);
        mc_div_idtPagination.appendChild(li);
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
        mc_div_idtPagination.appendChild(li);
    }

    // Create 'Last Page' button and '...' Button
    if (maxRightButtons < pages) {
        li = document.createElement('li');
        a = document.createElement('a');
        a.setAttribute('href', 'javascript:void(0)');
        a.classList.add('dots');
        a.textContent = '...';
        li.appendChild(a);
        mc_div_idtPagination.appendChild(li);

        li = document.createElement('li');
        a = document.createElement('a');
        a.setAttribute('href', 'javascript:void(0)');
        a.setAttribute('class', 'idt-page');
        a.setAttribute('data-page', pages);
        a.textContent = pages;
        a.addEventListener('click', refreshTable);
        li.appendChild(a);
        mc_div_idtPagination.appendChild(li);
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
    mc_div_idtPagination.appendChild(li);
}

function displayRowInfo(totalRows) {
    mc_span_firstRow.textContent = trimStart + 1;
    mc_span_lastRow.textContent = trimEnd;
    mc_span_totalRows.textContent = totalRows;
}


/*------------------------------------------------------------------------------
    2. Change Table Row Count
------------------------------------------------------------------------------*/
/*----- EVENTS -----*/
mc_select_showDataEntries.addEventListener('change', (e) => {
    let showDataEntries = 0;

    if (e.target.value == 'all') {
        showDataEntries = 'all';
    } else {
        showDataEntries = Number(e.target.value);
    }

    tState.rows = showDataEntries;
    tState.page = 1;

    // Recreate Table
    createTable('http://127.0.0.1:5500/data/customers.json');
});


/*------------------------------------------------------------------------------
    3. Export Table Data
------------------------------------------------------------------------------*/
/*------ EVENTS -----*/
// To Excel
mc_btn_tableExportExcel.addEventListener('click', () => {
    tableExportToExcel(trimTable(), 'Invoice Data');
});

// To CSV
mc_btn_tableExportCSV.addEventListener('click', () => {
    tableExportToCSV(trimTable(), 'Invoice Data');
});

// Copy Table Data
mc_btn_tableCopy.addEventListener('click', () => {
    copytableData(mc_table)
});

// Print Table Data
mc_btn_printTableData.addEventListener('click', () => {
    printTableData(trimTable());
});

/*------ FUNCTIONS -----*/
function trimTable() {
    // Create a clone of table node and remove last column(action) from table
    let mc_table_copy = mc_table.cloneNode(true);
    mc_table_copy.querySelector('thead tr th:last-child').remove();
    mc_table_copy.querySelectorAll('thead tr th').forEach((e) => {
        e.children[0].remove();
    });
    mc_table_copy.querySelectorAll('a.table-action-btn').forEach((e) => {
        e.parentNode.remove();
    });
    mc_table_copy.querySelector('tfoot tr td:last-child').remove();

    return mc_table_copy;
}


/*------------------------------------------------------------------------------
    4. Table Data Sorting
------------------------------------------------------------------------------*/