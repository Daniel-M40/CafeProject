var basket = retrieveProducts();
const ws = new WebSocket("ws://localhost:5000");

// When an error occurs that output the error
ws.onerror = function (event) {
    console.error("WebSocket error observed:", event);
    createPopup("WebSocket not connected", `The websocket has not been connected`, "error");
    window.history.go(-1)
};

// When the website loads we validate the basket and check for a meal deal
window.addEventListener("load", (event) => {

    waitForOpenConnection(ws);

    if (validateBasket(basket) === true) {
        checkMealDeal(basket);
    }
    else {
        document.getElementById("totalCostHeader").innerHTML = "Total Cost: £0.00"
    }


})


function validateBasket(basket) {
    if (basket === null) {
        document.getElementById("basketError").innerHTML = "Basket is empty";
        return false;
    }
    else if (basket[0].length === 0 && basket[1].length === 0 && basket[2].length === 0 && basket[3].length === 0) {
        document.getElementById("basketError").innerHTML = "Basket is empty";
        return false;
    }
    else {
        return true;
    }
}


// Send a response to the server
function calculateTotalCost(basket) {
    const obj = {
        operation: 2,
        subOperation: 7,
        basket: basket
    }

    sendMessage(ws, JSON.stringify(obj))

    ws.onmessage = function (e) {
        const obj = JSON.parse(e.data);
        document.getElementById("totalCostHeader").innerHTML = `Total Cost: £${(obj.totalCost / 100).toFixed(2)}`; // Displays the total cost

        if (isID(obj, ID = undefined) === -1) {
            return -1;
        }
        if (document.location.href.includes("orderConfirmation")) { // If we are on the order page we send the order
            sendOrder();
        }

        // As i re-use the code on the order page
        // through therefore i need to check whether the user is on the order page
    }
}

// Get the products from local storage
function retrieveProducts() {
    let localStorageName = "Basket";


    let basket = JSON.parse(localStorage.getItem(localStorageName));
    return basket;
}

// Send a request to the backend to check for meal deals
function checkMealDeal(basket) {
    const obj = {
        operation: 2,
        subOperation: 8,
        basket: basket
    }

    sendMessage(ws, JSON.stringify(obj))

    ws.onmessage = function (e) {
        const mealDealBasket = JSON.parse(e.data);
        let ID = undefined;

        if (isID(mealDealBasket, ID) === -1) {
            return -1;
        }
        else {
            createBasketTable(mealDealBasket); // Re-create the basket
            calculateTotalCost(mealDealBasket); // Calculate the total cost
            localStorage.setItem("Basket", JSON.stringify(mealDealBasket)); // Store it in local storage
        }

    }
}


function isID(obj, ID) {
    try {
        ID = obj.ID;
    } catch (error) {
        console.log(error);
    }
    let location = document.location.href;

    if (ID != undefined && !location.includes("chatApplication")) {
        return -1;
    }
}


// Create a table which displays the basket items
function createBasketTable(basket) {

    html = `<tr><th>Item</th><th>Price</th><th>Quantity</th><th></th></tr>`;

    for (let basketIndex = 0; basketIndex < basket.length; basketIndex++) {
        for (let index = 0; index < basket[basketIndex].length; index++) {

            var productType = basket[basketIndex][index]["productType"];


            html += "<tr><td>" + basket[basketIndex][index]["productDescription"];

            // Create a list for the products in a combo meal
            if (productType === "Meal Deal") {
                html += createComboTable(basket, html, basketIndex, index);
                basket[basketIndex][index]["productID"] = basket[basketIndex][index]["productID"] + index;
            }
            else {
                html += "</td>";
            }

            html += "<td>£" + (basket[basketIndex][index]["productCost"] / 100).toFixed(2) + "</td>";

            if (!document.location.href.includes("orderConfirmation")) {
                html += `<td><span onclick="deductQuantity(${basket[basketIndex][index].productID}, 'quantity${index}')" class="icon" id="minus">&#8722;</span><span id="quantity${index}">${basket[basketIndex][index].productQty}</span><span onclick="addQuantity(${basket[basketIndex][index].productID}, 'quantity${index}')" class="icon" id="plus">&#43;</span></td>`
            }
            else {
                html += `<td>${basket[basketIndex][index].productQty}</td>`

            }

            if (document.location.href.includes("orderConfirmation")) {
                html += `<td></td>`
            }
            else {
                html += `<td><button class="btn btn-primary text-white removeItemButton"  onclick="confirmationPopup(${basket[basketIndex][index].productID})"><img src="Images/crossIcon.png" alt="cross icon"></button></td>`
            }
            html += "</tr>"
        }

    }
    var tbl = document.createElement("table");
    var basketTable = document.getElementById("basketTable");

    tbl.setAttribute("ID", "tableID");
    tbl.innerHTML = html;
    basketTable.appendChild(tbl);

}


// Creates a list for the items in a combo meal
function createComboTable(basket, html, basketIndex, index) {
    var html = "<ul class='dashed'>";

    var comboItemArray = basket[basketIndex];
    document.getElementById("totalMealDeals").innerHTML = `Total Meal Deals: ${comboItemArray.length}`;


    for (let count = 0; count < comboItemArray[index]["products"].length; count++) {
        html += "<li>" + comboItemArray[index]["products"][count]["productDescription"] + "</li>"
    }


    html += "</ul></td>";

    return html;
}

// Uses Jquery to check if the length of the basket is empty and prevents the user from going onto another page
$(document).ready(function () {
    $('#checkout').click(function () {
        var basket = JSON.parse(localStorage.getItem("Basket"));

        if (validateBasket(basket) === false) {
            createPopup("Basket is empty", `There are no items in your basket`, "error");
            return false; // cancel the event
        }
    });
});



// Removes the item from the basket based on the product ID
async function removeItem(id) {
    localBasket = JSON.parse(localStorage.getItem("Basket"));

    for (let basketIndex = 0; basketIndex < localBasket.length; basketIndex++) {
        for (let index = 0; index < localBasket[basketIndex].length; index++) {

            if (id === localBasket[basketIndex][index].productID) {
                localBasket[basketIndex].splice(index, 1);
                continue;
            }
        }
    }
    localStorage.setItem("Basket", JSON.stringify(localBasket));

    var table = document.getElementById("tableID")
    table.remove();

    if (validateBasket(localBasket) === true) {
        checkMealDeal(localBasket);
    }
    else {
        document.getElementById("totalCostHeader").innerHTML = "Total Cost: £0.00"
    }
    setBasketLength();

}


function addQuantity(id, quantityID) {
    quantity = parseInt(document.getElementById(quantityID).innerHTML);
    quantity += 1;

    if (quantity <= 0) {
        createPopup("Invalid Quantity", "Please input a valid quantity", "error");
    }
    else {
        changeQuantity(id, quantity);
    }

}


function deductQuantity(id, quantityID) {
    quantity = parseInt(document.getElementById(quantityID).innerHTML);
    quantity -= 1;

    if (quantity <= 0) {
        createPopup("Invalid Quantity", "Please input a valid quantity", "error");
    }
    else {
        changeQuantity(id, quantity);
    }
}


function changeQuantity(id, quantity) {
    localBasket = JSON.parse(localStorage.getItem("Basket"));
    for (let basketIndex = 0; basketIndex < localBasket.length; basketIndex++) {
        for (let index = 0; index < localBasket[basketIndex].length; index++) {

            if (id === localBasket[basketIndex][index].productID) {
                localBasket[basketIndex][index].productQty = quantity
            }
        }
    }
    localStorage.setItem("Basket", JSON.stringify(localBasket));
    var table = document.getElementById("tableID")
    table.remove();

    if (validateBasket(localBasket) === true) {
        checkMealDeal(localBasket);
    }
    else {
        document.getElementById("totalCostHeader").innerHTML = "Total Cost: £0.00"
    }
}
