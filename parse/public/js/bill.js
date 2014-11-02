$( document ).ready(function() {

    var order = [
        {name: "Double Bypass Burger", price: 12.03},
        {name: "Single Bypass Burger", price: 9.25},
        {name: "Chili Cheese Fries", price: 4.62},
        {name: "Naughty Strawberry Shake", price: 4.62},
        {name: "Coca-Cola", price: 1.85},
        {name: "Water", price: 1.85}
    ];

    var cost = [
        {p1: 0, p2: 0, p3: 0},
        {p1: 0, p2: 0, p3: 0},
        {p1: 0, p2: 0, p3: 0},
        {p1: 0, p2: 0, p3: 0},
        {p1: 0, p2: 0, p3: 0},
        {p1: 0, p2: 0, p3: 0},
    ];

    var tax = 1.081;
    var tip = 1.15;

    function updateTotal() {
        var p1 = 0, p2 = 0, p3 = 0;
        for ( var i = 0; i < cost.length; i++ ) {
            p1 += cost[i].p1;
            p2 += cost[i].p2;
            p3 += cost[i].p3;
        }

        p1 = p1 * tax;
        p2 = p2 * tax;
        p3 = p3 * tax;


        p1 = p1 * tip;
        p2 = p2 * tip;
        p3 = p3 * tip;

        $("#total-person-1").text("$" + p1);
        $("#total-person-2").text("$" + p2);
        $("#total-person-3").text("$" + p3);

    }

});

function payall() {
    var total = $("#total-amount").text().substring(1);
    var url = "/SubmitHostedPayment?amount=" + total;
    window.location = url;
}