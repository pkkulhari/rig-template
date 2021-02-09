function tableExportToExcel(table, filename = 'table') {
    // Excel Template
    let template = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
    template = template + '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
    template = template + '<x:Name>' + filename + '</x:Name>';
    template = template + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
    template = template + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
    template = template + "<table text-align='center'>";    
   
    template = template + table.innerHTML.replace(/(’|')/g, '&#39');

    template = template + '</table></body></html>';

    const dataType = 'application/vnd.ms-excel; charset=utf-8;';

    const blob  = new Blob([template], {type: dataType});
    const url = URL.createObjectURL(blob);

    const downloadURL = document.createElement('a');
    document.body.appendChild(downloadURL);

    downloadURL.href = url;
    downloadURL.download = filename;

    downloadURL.click();
}                                    

function tableExportToCSV(table, filename = 'table') {
    let rows = [];
    let content = '';

    // Sperate values with commas
    for (let i = 0; i < table.rows.length; i++) {
        let row = table.rows[i];
        let cols = [];

        for (let j = 0; j < row.children.length; j++) {
            cols.push(row.children[j].innerText.replace(/(\r\n|\n|\r|  |)/g, '').replace(/’/g, "'"));            
        }  
        
        rows.push(cols);
    }
    rows.forEach( (row) => {
        content += row.join(',') + '\r\n';        
    });

    const dataType = 'text/csv; charset=utf-8;';

    const blob  = new Blob([content], {type: dataType});
    const url = URL.createObjectURL(blob);

    const downloadURL = document.createElement('a');
    document.body.appendChild(downloadURL);

    downloadURL.href = url;
    downloadURL.download = filename + '.csv';

    downloadURL.click();
}

function copytableData(table) {  
    const range = document.createRange();
    range.selectNode(table);
    window.getSelection().addRange(range); 
    document.execCommand('copy');
}

function printTableData(table) {
    let style = "<style>";
    style += "body {margin: 10px; box-size: border-box;}";
    style += "table {width: 100%; font: 16px Calibri;}";
    style += "table {width: 100%; font: 16px Calibri;}";  
    style += "table, th, td {border: solid 1px #E1E6EF; border-collapse: collapse; padding: 10px; text-align: left;}";
    style += "table tfoot {font-weight: bold;}";
    style += "</style>";

    let tableContent = "<html><head>";
    tableContent += style;
    tableContent += "</head><body>";
    tableContent += table.outerHTML;
    tableContent += "</body></html>";

    let win = window.open('', '', width='800', height='800');
    win.document.write(tableContent);
    win.document.close();    
    win.print();   
} 