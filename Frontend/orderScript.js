// When an error occurs that output the error
ws.onerror = function (event) {
    console.error("WebSocket error observed:", event);
    createPopup("WebSokcet is not connected", "Please reload the page", "error");
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


// Sends the order to the database with the users details and the basket
function sendOrder() {
    var basket = retrieveProducts();
    var user = retrieveUser();

    const obj = {
        operation: 2,
        subOperation: 9,
        user: user,
        basket: basket,
        dateTime: new Date().toLocaleDateString()
    };

    sendMessage(ws, JSON.stringify(obj));

    // Displays their order on the html file
    ws.onmessage = function (e) {
        var data = JSON.parse(e.data);

        document.getElementById("orderID").innerHTML = `Order ID: ${data.OrdersID}`;
        document.getElementById("customerName").innerHTML = `Customer Name: ${user[0].firstName} ${user[0].lastName}`;
        document.getElementById("customerID").innerHTML = `Customer ID: ${user[0].studentID}`;
        document.getElementById("date").innerHTML = `Date: ${data.OrderDate}`;
        var localBasket = localStorage.getItem("Basket");
        localBasket = [[], [], [], []];
        localStorage.setItem("Basket", JSON.stringify(localBasket));

    }
}


// Gets the products from local storage
function retrieveProducts() {
    let localStorageName = "Basket";

    let basket = JSON.parse(localStorage.getItem(localStorageName));
    return basket;
}

// Gets the user details from local storage
function retrieveUser() {
    let localStorageName = "User";

    let user = JSON.parse(localStorage.getItem(localStorageName));
    return user;
}
