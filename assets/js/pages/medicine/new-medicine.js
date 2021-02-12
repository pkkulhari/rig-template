/*
*   Abbrivations -  
    [nm => new medincine]
*   Contents - 
    1. Toggle Add New Manufacturer Pop Box
*/

/*----- Get Elements -----*/
const nm_btn_addNewMenufacturer = document.querySelector('.add-new-manufacturer-btn');
const nm_div_anmPopupBox = document.querySelector('#anm-pop-up-box');

/*---------------------------------------------------------------------------------------------
    1. Toggle Add New Manufacturer
----------------------------------------------------------------------------------------------*/
nm_btn_addNewMenufacturer.addEventListener('click', () => {
    nm_div_anmPopupBox.classList.add('show');
});