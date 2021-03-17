/*--------------------------------------------------------------------------------------------
*   Abbreviations -
    [ni => new invoice]

*   Content -
    1. Add Style to All Input's Field of Form
    2. Set Current Date to Date Input Field
    3. Show or Hide Bank(Input Field)
    4. Check Input's value for Number and Only One Decimal
    5. Add or Remove Medicine Row
    6. Get Medicine Suggestions and Set Corrensponding Data to input field of Medicine Row
    7. Calculations
    8. Set Full-Paid Amount to Input(Paid Amount)
    9. Toggle Pop-up Boxes
    10. Load Previous Amount of Customer
---------------------------------------------------------------------------------------------*/


/*----- Get Elements -----*/
// Input Fields
const ni_input_customerName = document.querySelector('#customer-name');
const ni_input_date = document.querySelector('#date');
const ni_input_paymentType = document.querySelector('#payment-type');
const ni_input_bank = document.querySelector('#bank');

const ni_input_quantity = document.querySelector('.quantity');
const ni_input_price = document.querySelector('.price');
const ni_input_invDiscount = document.querySelector('#invoice-discount');
const ni_input_totalDiscount = document.querySelector('#total-discount');
const ni_input_totalTax = document.querySelector('#total-tax');
const ni_input_grandTotal = document.querySelector('#grand-total');
const ni_input_previous = document.querySelector('#previous');
const ni_input_netTotal = document.querySelector('#net-total');
const ni_input_paidAmount = document.querySelector('#paid-amount');
const ni_input_due = document.querySelector('#due');
const ni_input_change = document.querySelector('#change');

// Other Elements
const ni_medicineInfo = document.querySelectorAll('.medicine-info');
const ni_mediRowParent = document.querySelector('.medi-row-parent');
const ni_mediRowFirst = document.querySelector('.medi-row-1');
const ni_btn_addMediRow = document.querySelector('.add-medi-row');
const ni_btn_fullPaid = document.querySelector('.full-paid');

const ni_btn_addNewCustomer = document.querySelector('.add-new-customer');
const ni_btn_ancClose = document.querySelectorAll('.anc-close');
const ni_btn_aniForm = document.querySelector('#ani-from');
const ni_btn_pniClose = document.querySelectorAll('.pni-close');


/*--------------------------------------------------------------------------------------------
    1. Add Style to All Input's Field of Form
---------------------------------------------------------------------------------------------*/
ni_medicineInfo.forEach((el) => {
    el.querySelectorAll('input').forEach((e) => {
        if (e.getAttribute('class') == 'medicine-name' || e.getAttribute('class') == 'expiry-date') {
            return false;
        } else {
            e.style.textAlign = 'right';
        }
    });
});


/*--------------------------------------------------------------------------------------------
    2. Set Current Date to Date Input Field
---------------------------------------------------------------------------------------------*/
const ni_today = new Date();
ni_input_date.value = ni_today.getFullYear() + '-' + ('0' + (ni_today.getMonth() + 1)).slice(-2) + '-' + ('0' + ni_today.getDate()).slice(-2);


/*--------------------------------------------------------------------------------------------
    3. Show or Hide Bank(Input Field)
---------------------------------------------------------------------------------------------*/
ni_input_paymentType.addEventListener('change', (e) => {
    if (e.path[0].value == 'Bank Payment') {
        ni_input_bank.closest('div').classList.add('active');
    } else {
        ni_input_bank.closest('div').classList.remove('active');
    }
});


/*--------------------------------------------------------------------------------------------
    4. Check Input's value for Number and Only One Decimal
---------------------------------------------------------------------------------------------*/
function isNumber(e, value) {
    const unicode = e.charCode ? e.charCode : e.keyCode;

    if (value.indexOf('.') != -1) {
        if (unicode == 46) return false;
    }

    if (unicode != 46) {
        if ((unicode < 48 || unicode > 57) && unicode != 46) return false;
    }
}


/*--------------------------------------------------------------------------------------------
    5. Add or Remove Medicine Row
---------------------------------------------------------------------------------------------*/
/*----- EVENTS -----*/
ni_btn_addMediRow.addEventListener('click', addMediRow);

/*----- FUNCTIONS -----*/
function addMediRow() {
    // Clone first medi row
    const mediRow_clone = ni_mediRowFirst.cloneNode(true);

    // Remove .medi-row-1 class of cloned medi row
    mediRow_clone.classList.remove('medi-row-1');

    // Set default value of all input field in cloned medi row
    mediRow_resetInputValue(mediRow_clone);

    // Reset all events in cloned medi row
    setEventsForloadData(mediRow_clone);
    setEventsForCalculation(mediRow_clone);
    mediRow_clone.querySelector('.remove-medi-row').addEventListener('click', removeMediRow);

    // Append a new medi row to parent div
    ni_mediRowParent.appendChild(mediRow_clone);
}

function removeMediRow(e) {
    e.target.closest('div.medicine-info').remove();
}

/*----- HELPER FUNCTIONS -----*/
function mediRow_resetInputValue(mediRow_clone) {
    mediRow_clone.querySelectorAll('input').forEach((e) => {
        if (e.className == 'unit') e.value = 'None';
        if (e.className == 'total') e.value = '0.00';
        if (!(e.className == 'unit' || e.className == 'total')) e.value = '';
    });

    mediRow_clone.querySelector('select').querySelectorAll('option').forEach((e) => {
        if (!e.hasAttribute('hidden')) e.remove();
    });
}


/*--------------------------------------------------------------------------------------------
    6. Get Medicine Suggestions and Set Corrensponding Data to input field of Medicine Row
---------------------------------------------------------------------------------------------*/
/*----- EVENTS -----*/
setEventsForloadData(ni_mediRowFirst); // For only first medicine row
document.addEventListener('click', closeAutocompletePanel)

/*----- FUNCTIONS -----*/
function setEventsForloadData(mediRow) {
    // Child Elements of Current Medicine Row
    input_medicineName = mediRow.querySelector('.medicine-name');

    // get the suggestions of medicines name
    input_medicineName.addEventListener('input', load_mediSuggestions);

    // Get Batch, Ava. Quantity, Expiry Date, Unit and Price of selected medicine
    input_medicineName.addEventListener('input', load_mediCorrespondingData);
    input_medicineName.nextElementSibling.addEventListener('click', load_mediCorrespondingData);
}

function closeAutocompletePanel(e) {
    if (e.target.closest('.autocomplete')) return;
    // Search through whole DOM for the divs with .autocomplete-items class and remove .show class of them
    document.querySelectorAll('.autocomplete-items').forEach((e) => {
        e.classList.remove('show');
    });
}

/*----- HELPER FUNCTIONS -----*/
function load_mediSuggestions(e) {
    // Close all opend autocomplete/suggestion panels
    document.querySelectorAll('.autocomplete-items').forEach((e) => {
        e.innerHTML = '';
    });

    // send http request to server
    xhr('http://127.0.0.1:5500/medicines.json').then(response => {
        autocomplete(e.target, response); // From autocomplete.js file
    });
}

function load_mediCorrespondingData(e) {
    // Current medicine row
    const currentMediRow = e.target.closest('.medicine-info');

    // Get current medicine row's elements
    const input_medicineName = currentMediRow.querySelector('.medicine-name');
    const input_batch = currentMediRow.querySelector('.batch');
    const input_avaQuantity = currentMediRow.querySelector('.available-quantity');
    const input_expiryDate = currentMediRow.querySelector('.expiry-date');
    const input_unit = currentMediRow.querySelector('.unit');
    const input_price = currentMediRow.querySelector('.price');

    // Check if input field (Medicine Name) is empty or not, and then send http request
    if (input_medicineName.value != '') {
        xhr('http://127.0.0.1:5500/medicines.json').then(response => {

            const medicine = response.filter((e) => {
                return e.name.toLowerCase() === input_medicineName.value.toLowerCase();
            });

            // If it does not find any medicine for current keyword, then set default value to all input field
            if (medicine.length == 0) {
                if (input_batch.children.length > 0) {
                    input_batch.querySelectorAll('option').forEach((el) => {
                        if (!el.hasAttribute('hidden')) el.remove();
                    });
                }

                input_avaQuantity.value = '';
                input_expiryDate.value = '';
                input_unit.value = 'None';
                input_price.value = '';
            }

            // Set the values of inputs
            medicine.forEach((e) => {

                // Check if batch(input) has any value(options) or not, if has then remove it
                if (input_batch.children.length > 0) {
                    input_batch.querySelectorAll('option').forEach((el) => {
                        if (!el.hasAttribute('hidden')) {
                            el.remove();
                        }
                    });
                }

                let a = document.createElement('option');
                a.value = e.batch;
                a.textContent = e.batch;
                input_batch.appendChild(a);

                input_avaQuantity.value = e.quantity;
                input_expiryDate.value = e.expiry;
                input_unit.value = 'Pics';
                input_price.value = e.price;

            });
        });
    }
}


/*--------------------------------------------------------------------------------------------
    7. Calculations
---------------------------------------------------------------------------------------------*/
/*----- EVENTS -----*/
setEventsForCalculation(ni_mediRowFirst);
ni_input_invDiscount.addEventListener('input', computeValues_2);
ni_input_paidAmount.addEventListener('input', computeValues_2);

/*----- FUNCTIONS -----*/
function setEventsForCalculation(mediRow) {
    const input_medicineName = mediRow.querySelector('.medicine-name');
    const input_quantity = mediRow.querySelector('.quantity');
    const input_price = mediRow.querySelector('.price');
    const input_discount = mediRow.querySelector('.discount');

    input_medicineName.addEventListener('input', computeValues_1); // Bug - Event fires when the key pressed twice    
    input_quantity.addEventListener('input', computeValues_1);
    input_price.addEventListener('input', computeValues_1);
    input_discount.addEventListener('input', computeValues_1);
}

function computeValues_1(e) {
    // Input fields of all rows
    const ni_input_total = document.querySelectorAll('.total');
    const ni_input_totalWithoutDiscount = document.querySelectorAll('.total-without-discount');
    const ni_input_discount = document.querySelectorAll('.discount');

    // Current medicine row
    const currentMediRow = e.target.closest('.medicine-info');

    // Input field of current row
    const input_quantity = currentMediRow.querySelector('.quantity');
    const input_price = currentMediRow.querySelector('.price');
    const input_discount = currentMediRow.querySelector('.discount');
    const input_total = currentMediRow.querySelector('.total');
    const input_rowTotalWithoutDiscount = currentMediRow.querySelector('.total-without-discount');

    // Start Computation    
    let quantity = 0;
    let price = 0;
    let row_discount = 0;
    let discount = 0;
    let row_total = 0;
    let total = 0;
    let row_totalWithoutDiscount = 0;
    let totalWithoutDiscount = 0;
    let totalDiscount = 0;

    if (input_quantity.value) quantity = Math.round(Number(input_quantity.value));
    if (input_price.value) price = Number(input_price.value);
    if (input_discount.value) row_discount = Number(input_discount.value);
    if (input_total.value) row_total = Number(input_total.value);

    if (ni_input_totalDiscount.value) totalDiscount = Number(ni_input_totalDiscount.value);

    row_total = quantity * price;
    if (row_discount > 0) {
        row_discount = (row_total * row_discount) / 100;
        row_total -= row_discount;
    }

    row_totalWithoutDiscount = row_total + row_discount;

    // Set values
    input_total.value = row_total.toFixed(2);
    input_rowTotalWithoutDiscount.value = row_totalWithoutDiscount;

    //  Calculate the 'total without discount' of all medicine rows   
    if (ni_input_totalWithoutDiscount.length > 0) {
        ni_input_totalWithoutDiscount.forEach((e) => {
            if (e.value) totalWithoutDiscount += Number(e.value);
        });
    }
    //  Calculate the 'total with discount' of all medicine rows   
    if (ni_input_total.length > 0) {
        ni_input_total.forEach((e) => {
            if (e.value) total += Number(e.value);
        });
    }
    //  Calculate the 'discount' of all medicine rows    
    if (ni_input_discount.length > 0) {
        ni_input_discount.forEach((e) => {
            if (e.value) discount += Number(e.value);
        });
    }

    discount = totalWithoutDiscount - total;
    totalDiscount = discount;

    // Set values     
    ni_input_totalDiscount.value = totalDiscount.toFixed(2);
    if (quantity == 0 || price == 0) input_discount.value = '';

    // Call computeValues_2() function
    computeValues_2();
}

function computeValues_2() {
    // Input fields of all rows
    const ni_input_total = document.querySelectorAll('.total');
    const ni_input_totalWithoutDiscount = document.querySelectorAll('.total-without-discount');
    const ni_input_discount = document.querySelectorAll('.discount');

    // Start Computation   
    let discount = 0;
    let total = 0;
    let totalWithoutDiscount = 0;
    let invDiscount = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let grandTotal = 0;
    let previous = 0;
    let netTotal = 0;
    let paidAmount = 0;
    let due = 0;
    let change = 0;

    if (ni_input_invDiscount.value) invDiscount = Number(ni_input_invDiscount.value);
    if (ni_input_totalDiscount.value) totalDiscount = Number(ni_input_totalDiscount.value);
    if (ni_input_previous.value) previous = Number(ni_input_previous.value);
    if (ni_input_netTotal.value) netTotal = Number(ni_input_netTotal.value);
    if (ni_input_paidAmount.value) paidAmount = Number(ni_input_paidAmount.value);
    if (ni_input_due.value) due = Number(ni_input_due.value);
    if (ni_input_change.value) change = Number(ni_input_change.value);

    //  Calculate the 'total without discount' of all medicine rows   
    if (ni_input_totalWithoutDiscount.length > 0) {
        ni_input_totalWithoutDiscount.forEach((e) => {
            if (e.value) totalWithoutDiscount += Number(e.value);
        });
    }
    //  Calculate the 'total with discount' of all medicine rows   
    if (ni_input_total.length > 0) {
        ni_input_total.forEach((e) => {
            if (e.value) total += Number(e.value);
        });
    }
    //  Calculate the 'discount' of all medicine rows    
    if (ni_input_discount.length > 0) {
        ni_input_discount.forEach((e) => {
            if (e.value) discount += Number(e.value);
        });
    }

    discount = totalWithoutDiscount - total;
    totalDiscount = (invDiscount > 0) ? discount + invDiscount : discount;

    totalTax = (total * 5) / 100; // 5 % Hard Coded Total Tax
    grandTotal = (total + totalTax) - invDiscount;

    netTotal = grandTotal + previous;

    due = netTotal;
    if (paidAmount > 0) {
        if (paidAmount > netTotal) {
            change = paidAmount - netTotal;
            due = 0;
        } else {
            due = netTotal - paidAmount;
            change = 0;
        }
    }

    // Set Values
    ni_input_totalDiscount.value = totalDiscount.toFixed(2);
    ni_input_totalTax.value = totalTax.toFixed(2);
    ni_input_grandTotal.value = grandTotal.toFixed(2);
    ni_input_netTotal.value = netTotal.toFixed(2);
    ni_input_due.value = due.toFixed(2);
    ni_input_change.value = change.toFixed(2);
}


/*--------------------------------------------------------------------------------------------
    8. Set Full-Paid Amount to Input(Paid Amount)
---------------------------------------------------------------------------------------------*/
ni_btn_fullPaid.addEventListener('click', () => {
    let netTotal = 0;
    if (ni_input_netTotal.value) netTotal = Number(ni_input_netTotal.value);

    ni_input_paidAmount.value = netTotal.toFixed(2);

    // Set Default(0.00) value to 'Due' and 'Change' Input fields
    ni_input_due.value = '0.00';
    ni_input_change.value = '0.00';
});


/*--------------------------------------------------------------------------------------------
   9. Toggle Pop-up Boxes
---------------------------------------------------------------------------------------------*/
/*----- ADD NEW USER POP-UP BOX -----*/
ni_btn_addNewCustomer.onclick = () => {
    document.querySelector('#anc-pop-up-box').classList.add('show');
}

ni_btn_ancClose.forEach((e) => {
    e.addEventListener('click', () => {
        document.querySelector('#anc-pop-up-box').classList.remove('show');
    });
});

/*----- INVOICE SUBMIT POP-UP-----*/
ni_btn_aniForm.onsubmit = (e) => {
    e.preventDefault();
    document.querySelector('#pni-pop-up-box').classList.add('show');
}

ni_btn_pniClose.forEach((e) => {
    e.addEventListener('click', () => {
        document.querySelector('#pni-pop-up-box').classList.remove('show');
    });
});

/*----- Close All Pop-Box on click event of .pop-up-box -----*/
document.querySelectorAll('.pop-up-box').forEach((e) => {
    e.onclick = (e) => {
        if (e.target.closest('div.inner')) return;
        document.querySelectorAll('.pop-up-box').forEach((e) => {
            e.classList.remove('show');
        });
    }
});


/*--------------------------------------------------------------------------------------------
    10. Load Previous Amount of Customer
---------------------------------------------------------------------------------------------*/
/*----- EVENTS -----*/
ni_input_customerName.addEventListener('input', loadPreviousAmount);

/*----- FUNCTIONS -----*/
function loadPreviousAmount() {
    let previous = 0; // Hard Coded Previous Amount

    // Set Value 
    ni_input_previous.value = previous.toFixed(2);
}