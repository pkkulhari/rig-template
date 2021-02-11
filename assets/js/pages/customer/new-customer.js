/*
*   Abbrivations -  
*   Contents - 
    1. Toggle Upload Customer CSV
*/

/*----- Get Elements -----*/
const nc_btn_uploadCustomerCSV = document.querySelector('.upload-nc-csv-btn');
const nc_div_ancCSVPopupBox = document.querySelector('#anc-csv-pop-up-box');
const nc_div_ancCSVPopupBoxClose = document.querySelectorAll('.pop-up-box-close');

/*---------------------------------------------------------------------------------------------
    1. Toggle Upload Customer CSV
----------------------------------------------------------------------------------------------*/
nc_btn_uploadCustomerCSV.addEventListener('click', () => {
    nc_div_ancCSVPopupBox.classList.add('show');
});

