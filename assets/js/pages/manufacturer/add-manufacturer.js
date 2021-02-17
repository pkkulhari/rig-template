/*
*   Abbrivations -  
    [am => add manufacturer]
*   Contents - 
    1. Toggle Upload Manufacturer CSV
*/

/*----- Get Elements -----*/
const am_btn_uploadManufacturerCSV = document.querySelector('.upload-m-csv-btn');
const am_div_amCSVPopupBox = document.querySelector('#am-csv-pop-up-box');

/*---------------------------------------------------------------------------------------------
    1. Toggle Upload Manufacturer CSV
----------------------------------------------------------------------------------------------*/
am_btn_uploadManufacturerCSV.addEventListener('click', () => {
    am_div_amCSVPopupBox.classList.add('show');
});