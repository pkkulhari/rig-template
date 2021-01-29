const el_medicineInfo = document.querySelectorAll('.medicine-info');
const el_date = document.querySelector('#date');
const el_paymentType = document.querySelector('#payment-type');
const el_bank = document.querySelector('#bank');

// Add Style
el_medicineInfo.forEach((el) => {
    el.querySelectorAll('input').forEach((e) => {
        if (e.getAttribute('class') == 'medicine-name' || e.getAttribute('class') == 'expiry-date') {
            return false;
        } else {
            e.style.textAlign = 'right';
        }
    });
});

// Set Today's Date
const today = new Date();
el_date.value = today.getFullYear() + '-' + ('0' + today.getMonth() + 1).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);


// EVENTS
el_paymentType.addEventListener('change', toggleBank);

// FUNCTIONS
function toggleBank(e) {
    if (e.path[0].value == 'Bank Payment') {
        el_bank.closest('div').classList.add('active');
    } else {
        el_bank.closest('div').classList.remove('active');
    }
}


/*------------------------------- Auto Input Data -------------------------------*/

// Get Input Elements
const input_cName = document.querySelector('#customer-name');
const input_medicineName = document.querySelector('.medicine-name');
const input_batch = document.querySelector('.batch');
const input_avaQuantity = document.querySelector('.available-quantity');
const input_expiry = document.querySelector('.expiry-date');
const input_unit = document.querySelector('.unit');
const input_price = document.querySelector('.price');
const input_previous = document.querySelector('#previous');


/*---- EVENTS ----*/
// Getting Medicine Name(Input) Suggestions
input_medicineName.addEventListener('input', (e) => {
    xhr('http://127.0.0.1:5500/medicines.json').then(response => {
        autocomplete(e.target, response);
    });
});

// Getting Batch, Ava. Quantity, Expiry Date, Unit and Price
input_medicineName.parentElement.querySelector('.autocomplete-items').addEventListener('click', () => {
    xhr('http://127.0.0.1:5500/medicines.json').then(response => {
        getInputValue(response);
    });
});
input_medicineName.addEventListener('keyup', () => {
    if (input_medicineName.value != '') {
        xhr('http://127.0.0.1:5500/medicines.json').then(response => {
            getInputValue(response);
        });
    }
});

// Getting Previous(of customer)
input_cName.addEventListener('input', (e) => {
    let previous = 4; // It is hardcore value,  Not from DB
    input_previous.value = previous.toFixed(2);
});

/*---- FUNCTIONS ----*/
function getInputValue(response) {
    const medicine = response.filter((e) => {
        return e.name.toLowerCase() === input_medicineName.value.toLowerCase();
    });

    if (medicine.length == 0) {
        if (input_batch.children.length > 0) {
            input_batch.querySelectorAll('option').forEach((el) => {
                if (!el.hasAttribute('hidden')) {
                    el.remove();
                }
            });
        }

        input_avaQuantity.value = '';
        input_expiry.value = '';
        input_unit.value = 'None';
        input_price.value = '';
    }

    medicine.forEach((e) => {
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
        input_expiry.value = e.expiry;
        input_unit.value = 'Pics';
        input_price.value = e.price;

    });
}


/*------------------------------- Calculations -------------------------------*/

// Geting Input Elements
const input_quantity = document.querySelector('.quantity');
const input_discount = document.querySelector('.discount');
const input_total = document.querySelector('.total');
const input_invDiscount = document.querySelector('#invoice-discount');
const input_totalDiscount = document.querySelector('#total-discount');
const input_totalTax = document.querySelector('#total-tax');
const input_grandTotal = document.querySelector('#grand-total');
const input_netTotal = document.querySelector('#net-total');
const input_paidAmount = document.querySelector('#paid-amount');
const input_due = document.querySelector('#due');
const input_change = document.querySelector('#change');

/*------ EVENTS -----*/
input_medicineName.parentElement.querySelector('.autocomplete-items').addEventListener('click', computeValues);
input_medicineName.parentElement.querySelector('.autocomplete-items').addEventListener('click', computeValues);
input_medicineName.addEventListener('input', computeValues); // Wroks when key pressed twice - Bug
input_quantity.addEventListener('keyup', computeValues);
input_price.addEventListener('keyup', computeValues);
input_discount.addEventListener('keyup', computeValues);
input_invDiscount.addEventListener('keyup', computeValues);
input_paidAmount.addEventListener('keyup', computeValues);

/*------ FUNCTIONS -----*/
function computeValues() {
    let quantity = 0;
    let price = 0;
    let discount = 0;
    let total = 0;
    let invDiscount = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let grandTotal = 0;
    let previous = 0;
    let netTotal = 0;
    let paidAmount = 0;
    let due = 0;
    let change = 0;

    if (input_quantity.value) {
        quantity = Math.round(Number(input_quantity.value))
    };
    if (input_price.value) {
        price = Number(input_price.value)
    };
    if (input_discount.value) {
        discount = Number(input_discount.value)
    };
    if (input_total.value) {
        total = Number(input_total.value)
    };
    if (input_invDiscount.value) {
        invDiscount = Number(input_invDiscount.value)
    };
    if (input_totalDiscount.value) {
        totalDiscount = Number(input_totalDiscount.value)
    };
    if (input_totalTax.value) {
        totalTax = Number(input_totalTax.value)
    };
    if (input_grandTotal.value) {
        grandTotal = Number(input_grandTotal.value)
    };
    if (input_previous.value) {
        previous = Number(input_previous.value)
    };
    if (input_netTotal.value) {
        netTotal = Number(input_netTotal.value)
    };
    if (input_paidAmount.value) {
        paidAmount = Number(input_paidAmount.value)
    };
    if (input_due.value) {
        due = Number(input_due.value)
    };
    if (input_change.value) {
        change = Number(input_change.value)
    };

    total = quantity * price;
    if (discount > 0) {
        discount = (total * discount) / 100;
        total -= discount;
    }

    totalDiscount = (invDiscount > 0) ? discount + invDiscount : discount;

    totalTax = (total * 5) / 100; // 5% Total Tax(Hardcore)

    grandTotal = total + totalTax;
    if (invDiscount > 0) {
        grandTotal -= invDiscount;
    }

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

    input_total.value = total.toFixed(2);
    input_totalDiscount.value = totalDiscount.toFixed(2);
    input_totalTax.value = totalTax.toFixed(2);
    input_grandTotal.value = grandTotal.toFixed(2);
    input_netTotal.value = netTotal.toFixed(2);
    input_due.value = due.toFixed(2);
    input_change.value = change.toFixed(2);
}


/*------------------------------- Set Value on Button click -------------------------------*/
// Full Paid
const el_fullPaid = document.querySelector('.full-paid');

el_fullPaid.addEventListener('click', () => {
    let netTotal = 0;
    if (input_netTotal.value) {
        netTotal = Number(input_netTotal.value);
    }

    input_paidAmount.value = netTotal.toFixed(2);

    // Reset 'Due' and 'Change'
    input_due.value = '0.00';
    input_change.value = '0.00';
});


/*------------------------------- Check Input Value for Number / One Decimal  -------------------------------*/
function isNumber(e, value) {
    const unicode = e.charCode ? e.charCode : e.keyCode;

    if (value.indexOf('.') != -1) {
        if (unicode == 46) return false;
    }

    if (unicode != 46) {
        if ((unicode < 48 || unicode > 57) && unicode != 46) return false;
    }
}

/*------------------------------- Toggle Pop Up Box  -------------------------------*/

// Add New User
el_addNewCustomer = document.querySelector('.add-new-customer');
el_ancClose = document.querySelectorAll('.anc-close');

el_addNewCustomer.onclick = () => {
    document.querySelector('#anc-pop-up-box').classList.add('show');
}

el_ancClose.forEach((e) => {
    e.addEventListener('click', closeAnc);
});

function closeAnc() {
    document.querySelector('#anc-pop-up-box').classList.remove('show');
}

// New Invoice Submit
el_aniForm = document.querySelector('#ani-from');
el_pniClose = document.querySelectorAll('.pni-close');

el_aniForm.onsubmit = (e) => {
    e.preventDefault();
    document.querySelector('#pni-pop-up-box').classList.add('show');
}

el_pniClose.forEach((e) => {
    e.addEventListener('click', closePni);
});

function closePni() {
    document.querySelector('#pni-pop-up-box').classList.remove('show');
}


// Close All Pop-Box on click event of .pop-up-box
document.querySelectorAll('.pop-up-box').forEach((e) => {
    e.onclick = (e) => {
        if (e.target.closest('div.inner')) return;
        document.querySelectorAll('.pop-up-box').forEach((e) => {
            e.classList.remove('show');
        });
    }
});


/*---------------------------- Add and Remove Medi Row -------------------------*/

// Elements
const mediRow = document.querySelector('.medicine-info');
const parentMediRow = document.querySelector('.parent-medicine-info');
const btn_addMediRow = document.querySelector('.add-medi-row');

// Events
btn_addMediRow.addEventListener('click', newMediRow);

// FUNCTIONS
function newMediRow() {
    const mediRow_clone = mediRow.cloneNode(true);

    newMediRow_resetValue(mediRow_clone); 

    mediRow_clone.childNodes[19].childNodes[1].addEventListener('click', removeMediRow);
    parentMediRow.appendChild(mediRow_clone);
}

function removeMediRow(e) {
    e.target.closest('div.medicine-info').remove();
}

// HELPER FUNCTIONS
function newMediRow_resetValue(mediRow_clone) {
    for (let i = 0; i < mediRow_clone.children.length; i++) {
        for (let j = 0; j < mediRow_clone.children[i].children.length; j++) {
            if (mediRow_clone.children[i].children[j].className == 'autocomplete') {
                for (let k = 0; k < mediRow_clone.children[i].children[j].children.length; k++) {
                    if (mediRow_clone.children[i].children[j].children[k].tagName == 'INPUT') {
                        mediRow_clone.children[i].children[j].children[k].value = '';
                    }
                }
            }

            if (mediRow_clone.children[i].children[j].tagName == 'SELECT') {
                for (let k = 0; k < mediRow_clone.children[i].children[j].children.length; k++) {
                    if (!mediRow_clone.children[i].children[j].children[k].hasAttribute('hidden')) {
                        mediRow_clone.children[i].children[j].children[k].remove();
                    }
                }

            }

            if (mediRow_clone.children[i].children[j].tagName == 'INPUT') {
                if (mediRow_clone.children[i].children[j].className == 'unit') {
                    mediRow_clone.children[i].children[j].value = 'None';
                }
                if (mediRow_clone.children[i].children[j].className == 'total') {
                    mediRow_clone.children[i].children[j].value = '0.00';
                }
                if (!(mediRow_clone.children[i].children[j].className == 'unit' || mediRow_clone.children[i].children[j].className == 'total')) {
                    mediRow_clone.children[i].children[j].value = '';
                }
            }

        }
    }
}