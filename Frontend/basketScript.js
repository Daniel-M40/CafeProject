var basket = [
    Mains = [],
    Drinks = [],
    Snacks = [],
    Combo = []
]

// When an error occurs that output the error
ws.onerror = function (event) {
    console.error("WebSocket error observed:", event);
    createPopup("WebSocket is not connected", "please reload page", "error", "Okay");
    window.history.go(-1)
};

ws.onmessage = function (event) {
    var data = JSON.parse(event.data);
    let ID = undefined;

    try {
        ID = data.ID;
    } catch (error) {
        console.log(error);
    }
    let location = document.location.href;

    if (ID != undefined && !location.includes("chatApplication")) {
        return -1;
    }
}

// Sends a request to add an item to yout basket
function addItem(id, qtyId) {

    var qty = document.getElementById(qtyId).value;

    if (validateQuantity(qty)) {
        const obj = {
            operation: 2,
            subOperation: 4,
            ID: id,
            Quantity: qty
        }

        const json = JSON.stringify(obj);
        ws.send(json);
    }
    else {
        createPopup("Invalid quantity", "You have inputted an invalid quantity", "error");
    }

    // Adds the item to the specific basket
    ws.onmessage = function (event) {
        var data = JSON.parse(event.data);
        let itemPos;
        for (let count = 0; count < data.length; count++) {
            if (data[count].length > 0) {
                basket[count].push(data[count][0]);
                itemPos = data[count][0]
            }
        }

        createPopup("Item Added", `You have added ${itemPos.productDescription} to your basket`, "success");
        let basketCount = parseInt(document.getElementById("basketCount").innerHTML);
        basketCount += 1;
        document.getElementById("basketCount").innerHTML = basketCount;
    }


}

// Sends a request to add an item to yout basket
function addMultipleItems(id, qtyId, count, menuLength) {

    var qty = document.getElementById(qtyId).value;
    var itemAddedAlert = localStorage.getItem('itemAddedAlert') || '';
    var noItemsAlert = localStorage.getItem('noItemsAlert') || '';


    if (validateQuantity(qty)) {
        const obj = {
            operation: 2,
            subOperation: 4,
            ID: id,
            Quantity: qty
        }

        const json = JSON.stringify(obj);
        sendMessage(ws, json);

        let basketCount = parseInt(document.getElementById("basketCount").innerHTML);
        basketCount += 1;
        document.getElementById("basketCount").innerHTML = basketCount;

        if (itemAddedAlert != 'yes') {
            createPopup("Item Added", `You have added an item to your basket`, "success");
            localStorage.setItem('itemAddedAlert', 'yes');

        }


    }
    else if (itemAddedAlert == 'no' && count === menuLength) {
        createPopup("No Item Added", `You have not added an item to your basket`, "error");
        localStorage.setItem('noItemsAlert', 'yes');
    }

    // Adds the item to the specific basket
    ws.onmessage = function (event) {
        var data = JSON.parse(event.data);

        for (let count = 0; count < data.length; count++) {
            if (data[count].length > 0) {
                basket[count].push(data[count][0]);
            }
        }
    }


}

document.getElementById("addAll").addEventListener("click", function () {
    let text = localStorage.getItem("Title");
    let title = JSON.parse(text)
    var menu = JSON.parse(localStorage.getItem(title.subProducts));

    for (let count = 0; count < menu.length; count++) {
        let quantityID = "quantity" + count;
        addMultipleItems(menu[count].productID, quantityID, count, menu.length - 1)


    }
    localStorage.setItem('itemAddedAlert', 'no');
    localStorage.setItem('noItemsAlert', 'no');
})



// Validates the quantity
function validateQuantity(qty) {
    if (qty <= 0 || qty === "") {
        return false;
    }
    return true
}

// Validates the basket by checking the length of each array
function validateBasket() {
    if (basket[0].length === 0 && basket[1].length === 0 && basket[2].length === 0) {
        return false;
    }
    return true;
}

// When the page unloads we update the baskets
window.addEventListener('beforeunload', function (e) {
    console.log(basket);

    if (validateBasket() === false) {
        return -1;
    }

    var localBasket = localStorage.getItem("Basket");
    localBasket = updateBasket(localBasket, basket);
    updatelocalBasket(localBasket);
});


var updateBasket = function (localBasket) {


    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    localBasket = localBasket ? JSON.parse(localBasket) : [[], [], [], []];

    // Add new data to localStorage Array and check for duplicate items in the temp basket
    for (let basketIndex = 0; basketIndex < basket.length; basketIndex++) {

        for (let index = 0; index < basket[basketIndex].length; index++) {
            let item = basket[basketIndex][index];
            item.productQty = findDuplicateQty(item.productID, basketIndex, basket);


            localBasket[basketIndex].push(basket[basketIndex][index]);
        }
    }

    // Save back to localStorage and calculate total cost
    localStorage.setItem("Basket", JSON.stringify(localBasket));
    return localStorage.getItem("Basket");


};

var updatelocalBasket = function (localBasket) {


    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    localBasket = localBasket ? JSON.parse(localBasket) : [[], [], [], []];

    // Add new data to localStorage Array and check for duplicate items in the temp basket
    for (let basketIndex = 0; basketIndex < localBasket.length; basketIndex++) {

        for (let index = 0; index < localBasket[basketIndex].length; index++) {
            let item = localBasket[basketIndex][index];
            item.productQty = findDuplicateQty(item.productID, basketIndex, localBasket);
        }
    }

    // Save back to localStorage and calculate total cost
    localStorage.setItem("Basket", JSON.stringify(localBasket));

};

// Checks to see if their any duplicate items and duplicate quantities and adds them together
function findDuplicateQty(id, basketIndex, basket) {
    var quantity = 0;
    var pos = 0;

    // Add the quantities together as one total quantity 
    for (let index = 0; index < basket[basketIndex].length; index++) {

        if (id === basket[basketIndex][index].productID) {
            quantity += basket[basketIndex][index].productQty;
        }
        pos = index;


    }
    // Find any duplicate items and remove them from the array
    if (findDuplicateItems(id, basket, basketIndex)) {
        basket[basketIndex].splice(pos, 1);
    }

    return quantity;
}


// Finds the duplicate item id
function findDuplicateItems(id, localBasket, basketIndex) {
    var duplicate = 0;
    for (let index = 0; index < localBasket[basketIndex].length; index++) {

        if (id === localBasket[basketIndex][index].productID) {
            duplicate++;

            if (duplicate > 1 && id != 20) {
                return true;
            }
        }
    }

    return false;
}




