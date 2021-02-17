/*
*   Abbrivations - 
    [c => category],
    [t => table],
    [tp => table pagination]    

*   Content - 
    1. Create Medicine Categories Data Table
    2. Change Table Row Count
    3. Export Table Data 
    4. Table Data Sorting 
*/


/*----- GET ELEMENTS -----*/
c_table = document.querySelector('#category-data');
c_tbody = document.querySelector('#category-data tbody');
c_td_totalAmount = document.querySelector('#category-data tfoot .total-amount');
c_div_tPagination = document.querySelector('.t-pagination');
c_select_showDataEntries = document.querySelector('#show-data-entries');
c_btn_tableExportExcel = document.querySelector('.table-export-excel');
c_btn_tableExportCSV = document.querySelector('.table-export-csv');
c_btn_tableCopy = document.querySelector('.table-copy');
c_btn_printTableData = document.querySelector('.print-table');
c_span_firstRow = document.querySelector('.first-row');
c_span_lastRow = document.querySelector('.last-row');
c_span_totalRows = document.querySelector('.total-rows');


/*------------------------------------------------------------------------------
    1. Create Invoice Data Table
------------------------------------------------------------------------------*/
const showDataEntries = Number(c_select_showDataEntries.value);

const tState = {
    data: [],
    page: 1,
    rows: showDataEntries,
    maxButtons: 5
}

createInvoiceDataTable('http://127.0.0.1:5500/data/medicines.json');

/*----- FUNCTIONS -----*/
function createInvoiceDataTable(url) {
    xhr(url).then(response => {
        // Invoke tPagination() function to get triced data and total pages
        const tp = tPagination(response, tState.page, tState.rows);

        // Assign tricmed Data to tState.data
        tState.data = tp.tricedData;

        // Create table row, compute total amount and create pagination buttons
        createTableRow(tState.data);       
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

    createInvoiceDataTable('http://127.0.0.1:5500/data/medicines.json');
}

/*----- HELPER FUNCTIONS -----*/
function tPagination(data, page, rows) {
    if (rows == 'all') rows = data.length;

    trimStart = (page - 1) * rows;
    trimEnd = trimStart + rows;

    const tricedData = data.slice(trimStart, trimEnd);

    const pages = Math.ceil(data.length / rows);

    return {
        tricedData: tricedData,
        pages: pages
    }
}

function createTableRow(data) {
    c_tbody.innerHTML = '';

    for (let x in data) {
        // Create new elements
        const tr = document.createElement('tr');

        const td1 = document.createElement('td');        
        const td2 = document.createElement('td');

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

        i1.setAttribute('class', 'icon-pencil');
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

        td1.textContent = data[x].category;
        td2.appendChild(a1);
        td2.appendChild(a2);
     
        td2.setAttribute('class', 'action');        

        tr.appendChild(td1);
        tr.appendChild(td2);   

        c_tbody.appendChild(tr);
    }
}

function createPaginationButtons(pages) {
    c_div_tPagination.innerHTML = '';

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
    c_div_tPagination.appendChild(li);

    // Create 'First Page' button '...' Button
    if (maxLeftButtons > 2) {
        li = document.createElement('li');
        a = document.createElement('a');
        a.setAttribute('href', 'javascript:void(0)');
        a.setAttribute('class', 't-page');
        a.setAttribute('data-page', 1);
        a.textContent = '1';
        a.addEventListener('click', refreshTable);
        li.appendChild(a);
        c_div_tPagination.appendChild(li);

        li = document.createElement('li');
        a = document.createElement('a');
        a.setAttribute('href', 'javascript:void(0)');
        a.classList.add('dots');
        a.textContent = '...';
        li.appendChild(a);
        c_div_tPagination.appendChild(li);
    }

    // Create Pagination Buttons
    for (let i = maxLeftButtons; i <= maxRightButtons; i++) {
        const li = document.createElement('li');
        const a = document.createElement('a');

        a.setAttribute('href', 'javascript:void(0)');
        a.setAttribute('class', 't-page');

        if (i == tState.page) {
            a.classList.add('active');
        }

        a.setAttribute('data-page', i);
        a.textContent = i;
        a.addEventListener('click', refreshTable);

        li.appendChild(a);
        c_div_tPagination.appendChild(li);
    }

    // Create 'Last Page' button and '...' Button
    if (maxRightButtons < pages) {
        li = document.createElement('li');
        a = document.createElement('a');
        a.setAttribute('href', 'javascript:void(0)');
        a.classList.add('dots');
        a.textContent = '...';
        li.appendChild(a);
        c_div_tPagination.appendChild(li);

        li = document.createElement('li');
        a = document.createElement('a');
        a.setAttribute('href', 'javascript:void(0)');
        a.setAttribute('class', 't-page');
        a.setAttribute('data-page', pages);
        a.textContent = pages;
        a.addEventListener('click', refreshTable);
        li.appendChild(a);
        c_div_tPagination.appendChild(li);
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
    c_div_tPagination.appendChild(li);
}

function displayRowInfo(totalRows) {
    c_span_firstRow.textContent = trimStart + 1;
    c_span_lastRow.textContent = trimEnd;
    c_span_totalRows.textContent = totalRows;
}


/*------------------------------------------------------------------------------
    2. Change Table Row Count
------------------------------------------------------------------------------*/
/*----- EVENTS -----*/
c_select_showDataEntries.addEventListener('change', (e) => {
    let showDataEntries = 0;

    if (e.target.value == 'all') {
        showDataEntries = 'all';
    } else {
        showDataEntries = Number(e.target.value);
    }

    tState.rows = showDataEntries;
    tState.page = 1;

    // Recreate Table
    createInvoiceDataTable('http://127.0.0.1:5500/data/medicines.json');
});


/*------------------------------------------------------------------------------
    3. Export Table Data
------------------------------------------------------------------------------*/
/*------ EVENTS -----*/
// To Excel
c_btn_tableExportExcel.addEventListener('click', () => {
    tableExportToExcel(trimTable(), 'Medicine Data');
});

// To CSV
c_btn_tableExportCSV.addEventListener('click', () => {
    tableExportToCSV(trimTable(), 'Medicine Data');
});

// Copy Table Data
c_btn_tableCopy.addEventListener('click', () => {
    copytableData(c_table)
});

// Print Table Data
c_btn_printTableData.addEventListener('click', () => {
    printTableData(trimTable());
});

/*------ FUNCTIONS -----*/
function trimTable() {
    // Create a clone of table node and remove last column(action) from table
    let c_table_copy = c_table.cloneNode(true);

    c_table_copy.querySelector('thead tr th:last-child').remove();

    c_table_copy.querySelectorAll('a.table-action-btn').forEach((e) => {
        if(e.parentNode) e.parentNode.remove();
    });

    return c_table_copy;
}


/*------------------------------------------------------------------------------
    4. Table Data Sorting
------------------------------------------------------------------------------*/