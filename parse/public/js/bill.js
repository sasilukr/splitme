$( document ).ready(function() {
    drawCard();
    updateTotal();

});

var order = [
    {name: "Double Bypass Burger", price: 12.03},
    {name: "Single Bypass Burger", price: 9.25},
    {name: "Chili Cheese Fries", price: 4.62},
    {name: "Naughty Strawberry Shake", price: 4.62},
    {name: "Coca-Cola", price: 1.85},
    {name: "Water", price: 1.85}
];

var people = ["Ray", "Sasi", "Harvey"];
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


function drawCard() {
    $("#cards").empty();
    for (var i = 0; i < order.length; i++ ) {
        var cardDiv = $("<div class='card'></div>");
        var dishDiv = $("<div class='dish-name'>"+
            order[i].name+"</div>");
        var priceDiv  = $("<div class='price'>"+
            order[i].price+"</div>");
        var imgDiv = $("<img class='menu-img' src=\"img/menu-img" + (i+1) + ".png\"/>");

        var menuPeopleDiv = $("<div class='menu-people'></div>");
        var tableDiv = $("<table class='menu-people'></table>");

        for ( var j = 0; j < 3; j++ ) {

            var switchId = "myonoffswitch" + i + "-" + j;
            var trDiv = $("<tr></tr>");
            var tdDiv = $("<td>"+ people[j] + "</td>");
            var tdToggleDiv = $("<td class='menu-toggle'></td>");

            var switchDiv = $("<div class='onoffswitch'></div>");
            var inputDiv = $("<input type='checkbox' name='onoffswitch' class='onoffswitch-checkbox' id='" + switchId + "' onclick='togglePay("+i+", "+j+")'></input>");

            var labelDiv = $("<label class='onoffswitch-label' for='" + switchId + "'></label>");

            var spanInnerDiv = $("<span class='onoffswitch-inner'></span>");
            var spanSwitchDiv = $("<span class='onoffswitch-switch'></span>");

            labelDiv.append(spanInnerDiv);
            labelDiv.append(spanSwitchDiv);

            switchDiv.append(inputDiv);
            switchDiv.append(labelDiv);

            tdToggleDiv.append(switchDiv);

            trDiv.append(tdDiv);
            trDiv.append(tdToggleDiv);

            tableDiv.append(trDiv);
        }

        menuPeopleDiv.append(tableDiv);

        cardDiv.append(dishDiv);
        cardDiv.append(priceDiv);
        cardDiv.append(imgDiv);
        cardDiv.append(menuPeopleDiv);

        $("#cards").append(cardDiv);

    }
}

function updateTotal() {
    var p1 = 0, p2 = 0, p3 = 0;
    for ( var i = 0; i < cost.length; i++ ) {
        p1 += cost[i].p1;
        p2 += cost[i].p2;
        p3 += cost[i].p3;
    }

    var total = 0;
    for ( var i = 0 ; i<order.length; i++ ) {
        total += order[i].price;
    }

    p1 = p1 * tax;
    p2 = p2 * tax;
    p3 = p3 * tax;
    total = total * tax;

    p1 = (p1 * tip).toFixed(2);
    p2 = (p2 * tip).toFixed(2);
    p3 = (p3 * tip).toFixed(2);
    total = (total * tip).toFixed(2);

    $("#total-person-1").text("$" + p1);
    $("#total-person-2").text("$" + p2);
    $("#total-person-3").text("$" + p3);

    $("#total-amount").text("$" + total);

}

function togglePay(ndx, person) {
    var orderPrice = order[ndx].price;
    var costObj = cost[ndx];
    var p1 = costObj.p1 > 0 ? 1 : 0;
    var p2 = costObj.p2 > 0 ? 1 : 0;
    var p3 = costObj.p3 > 0 ? 1 : 0;

    var divider = p1 + p2 + p3 + 1;
    var costPP = orderPrice / divider;
    switch (person) {
        case 0:
            cost[ndx].p1 = costPP;
            break;
        case 1:
            cost[ndx].p2 = costPP;
            break;
        case 2:
            cost[ndx].p3 = costPP;
            break;
    }

    if ( costObj.p1 > 0 ) {
        cost[ndx].p1 = costPP;
    }

    if ( costObj.p2 > 0 ) {
        cost[ndx].p2 = costPP;
    }
    if ( costObj.p3 > 0 ) {
        cost[ndx].p3 = costPP;
    }

    updateTotal();
}

function payall() {
    var total = $("#total-amount").text().substring(1);
    var url = "/SubmitHostedPayment?amount=" + total;
    window.location = url;
}
