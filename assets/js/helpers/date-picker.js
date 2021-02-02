const dp1_el_selectedDate = document.querySelector('.dp-1 .selected-date');
const dp1_el_dates = document.querySelector('.dp-1 .dates');
const dp1_el_selectedYear = document.querySelector('.dp-1 .dates .year .yr');
const dp1_el_preYr = document.querySelector('.dp-1 .dates .year .pre-yr');
const dp1_el_nextYr = document.querySelector('.dp-1 .dates .year .next-yr');
const dp1_el_months = document.querySelector('.dp-1 .dates .months');

const dp2_el_selectedDate = document.querySelector('.dp-2 .selected-date');
const dp2_el_dates = document.querySelector('.dp-2 .dates');
const dp2_el_selectedYear = document.querySelector('.dp-2 .dates .year .yr');
const dp2_el_preYr = document.querySelector('.dp-2 .dates .year .pre-yr');
const dp2_el_nextYr = document.querySelector('.dp-2 .dates .year .next-yr');
const dp2_el_months = document.querySelector('.dp-2 .dates .months');


date_picker(dp1_el_selectedDate, dp1_el_dates, dp1_el_selectedYear, dp1_el_preYr, dp1_el_nextYr, dp1_el_months);
date_picker(dp2_el_selectedDate, dp2_el_dates, dp2_el_selectedYear, dp2_el_preYr, dp2_el_nextYr, dp2_el_months);


function date_picker(el_selectedDate, el_dates, el_selectedYear, el_preYr, el_nextYr, el_months) {

    const monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthsFullName = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    let date = new Date();
    let d_month = date.getMonth();
    let d_year = date.getFullYear();

    el_selectedDate.value = monthsFullName[d_month] + ' ' + d_year;
    el_selectedYear.textContent = d_year;

    // Add Months Name inside div.months 
    for (let i = 0; i < 12; i++) {
        const newEl_month = document.createElement('div');
        newEl_month.classList.add('month');
        newEl_month.textContent = monthsName[i];
        newEl_month.value = i;

        el_months.appendChild(newEl_month);
    }

    const el_month = el_dates.querySelectorAll('.months .month');

    // EVENT LISTENERS
    el_selectedDate.addEventListener('click', toggle_datePicker);

    el_month.forEach(function (e) {
        e.addEventListener('click', toggle_datePicker);
        e.addEventListener('click', setDate);
    });

    document.addEventListener('click', remove_datePicker);

    el_preYr.addEventListener('click', goToPreYear);
    el_nextYr.addEventListener('click', goToNextYear);


    // FUNCTIONS
    function toggle_datePicker() {
        el_dates.classList.toggle('active');
    }

    function remove_datePicker(e) {
        if (!checkEventPathForClass(e.path, 'date-picker')) {
            el_dates.classList.remove('active');
        }
    }

    function goToPreYear() {
        d_year--;
        el_selectedYear.textContent = d_year;
    }

    function goToNextYear() {
        d_year++;
        el_selectedYear.textContent = d_year;
    }

    // Set the value of input(Date)
    function setDate(e) {
        el_selectedDate.value = monthsFullName[e.target.value] + ' ' + d_year;
    }

    // HELPER FUNCTIONS
    function checkEventPathForClass(path, selector) {
        for (let i = 0; i < path.length; i++) {
            if (path[i].classList && path[i].classList.contains(selector)) {
                return true;
            }
        }

        return false;
    }

}