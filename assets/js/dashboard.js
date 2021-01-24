/*<--------------------- Multi-line Chart - Monthly Progress ---------------------->*/
var data = [];

var dates = [];
var sales = [408, 370, 89, 204, 316, 229, 381, 77, 160, 203, 468, 243, 190, 64, 407, 57, 209, 434, 472, 421, 295, 426, 52, 464, 54, 139, 69, 79, 214, 83];
var purchases = [75, 7, 20, 19, 54, 79, 96, 64, 76, 45, 24, 9, 27, 46, 87, 49, 66, 57, 91, 77, 58, 40, 34, 17, 18, 25, 63, 72, 32, 100];

var year = '2021';
var month = '01';

function dateFormat(y, m, d) {
    var date = y + '-' + m + '-' + d;
    return date;
}

function createDataObject(day, sales = 0, purchases = 0) {
    return {
        day: day,
        sales: sales,
        purchases: purchases
    };
}

for (var i = 0; i < sales.length; i++) {
    dates[i] = dateFormat(year, month, i + 1);
}

for (var i = 0; i < sales.length; i++) {
    data[i] = createDataObject(dates[i], sales[i], purchases[i]);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function morrisLine_init() {
    new Morris.Line({
        element: 'multi-line-mp',
        data: data,
        xkey: 'day',
        ykeys: ['sales', 'purchases'],
        labels: ['Sales', 'Purchases'],
        xLabelAngle: 45,
        lineColors: ['#4CAF50', '#FF4E72'],
        lineWidth: ['1.7'],
        pointSize: ['3.5'],
        hideHover: 'auto',
        gridTextFamily: ['inherit'],
        fillOpacity: 0,
        resize: true,

        xLabelFormat: function (d) {
            return (months[d.getMonth()]) + ' ' + (("0" + d.getDate())).slice(-2);
        }
    });
}
morrisLine_init();

/*<--------------------- Donut Chart - Monthly Income Expense Statement ---------------------->*/
_data = [{
        label: "Total Purchase",
        value: 98425
    },
    {
        label: "Total Expense",
        value: 98425 + 48000
    },
    {
        label: "Total Sales",
        value: 32024
    },
    {
        label: "Service",
        value: 10462
    },
    {
        label: "Eployee Salary",
        value: 48000
    }
];

function morrisDonut_init() {
    new Morris.Donut({
        element: 'donut-mie',
        data: _data,
        colors: [
            '#713E8D',
            '#6A6DDE',
            '#F597BB',
            '#EB6EB0',
            '#A160A0'
        ],
        resize: true,
        gridTextFamily: ['inherit'],

        formatter: function (d) {
            return ('$' + d);
        },

    });
}
morrisDonut_init();


/*<--------------------- Refresh Charts with 'click event' of .sidebar-toggle  ---------------------->*/
document.querySelector('.sidebar-toggle').addEventListener('click', function () {
    document.querySelector('#multi-line-mp').firstElementChild.remove();
    document.querySelector('#donut-mie').firstElementChild.remove();
    morrisLine_init();
    morrisDonut_init();
});