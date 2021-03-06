
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
    {p1: 0, p2: 0, p3: 0}
];

var tax = 1.081;
var tip = 1.15;

var cookieName = 'splitme';

$( document ).ready(function() {
    drawCard();
    updateTotal();
    if ( getParameterByName("paid") ) {

        var originalTotal = $("#total-amount").text().split("$")[1];
        var paidAmount = 0;
        var paidUsers = getParameterByName("paid").split(",");


        cost = JSON.parse(getCookie(cookieName));
        console.log("Cost " + cost);

        // TODO update toggle options

        for ( var i=0; i < cost.length; i++ ) {
            var j;
            var switchId;

            if ( cost[i].p1 > 0 ) {
                j = 0;
                switchId = "myonoffswitch" + i + "-" + j;
                $("#" + switchId).click();
            }
            if ( cost[i].p2 > 0 ) {
                j = 1;
                switchId = "myonoffswitch" + i + "-" + j;
                $("#" + switchId).click();

            }
            if ( cost[i].p3 > 0 ) {
                j = 2;
                switchId = "myonoffswitch" + i + "-" + j;
                $("#" + switchId).click();

            }

        }

        console.log("paidUsers " + paidUsers);
        for (var i = 0; i < paidUsers.length; i++) {
            switch (paidUsers[i]) {
                case "Ray":
                    paidAmount += parseFloat($("#total-person-0").text().split("$")[1]);
                    $("#total-person-0").text("All Set");
                    break;
                case "Sasi":
                    paidAmount += parseFloat($("#total-person-1").text().split("$")[1]);
                    $("#total-person-1").text("All Set");
                    break;
                case "Harvey":
                    paidAmount += parseFloat($("#total-person-2").text().split("$")[1]);
                    $("#total-person-2").text("All Set");
                    break;
            }
        }



        var newTotal = parseFloat(originalTotal) - parseFloat(paidAmount);
        $("#total-amount").text("$" + newTotal.toFixed(2));

    } else {
        setCookie(cookieName, "");
    }


});



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

    $("#total-person-0").text("Pay $" + p1);
    $("#total-person-1").text("Pay $" + p2);
    $("#total-person-2").text("Pay $" + p3);

    $("#total-amount").text("$" + total);

}

function togglePay(ndx, person) {
    var orderPrice = order[ndx].price;
    var costObj = cost[ndx];
    var p1 = costObj.p1 > 0 ? 1 : 0;
    var p2 = costObj.p2 > 0 ? 1 : 0;
    var p3 = costObj.p3 > 0 ? 1 : 0;

    var extra = 1;
    if ( getParameterByName("paid") ) {
        extra = 0;
    }
    var divider = p1 + p2 + p3 + extra;
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
    var total = $("#total-amount").text().split("$")[1];
    var url = "/SubmitHostedPayment?amount=" + total;
    window.location = url;
}

function pay(person) {
    var paidUser = "&paid=";
    if ( getParameterByName("paid") ) {
        paidUser += getParameterByName("paid");
    }
    var total = $("#total-person-" + person).text().split("$")[1];
    var url = "/SubmitHostedPayment?amount=" + total + "&payer=" + people[person] + paidUser;

    console.log("pay url " + url);

    setCookie(cookieName, JSON.stringify(cost));

    window.location = url;
}


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (30*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}