const ws = new WebSocket("ws://localhost:5000");

menu = [
    mains = [],
    drinks = [],
    snacks = [],
    combo = []
];

document.getElementById("goBack").addEventListener("click", () => {
    window.history.go(-1);
})


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


// Event listener that waits for the page to load and retrieves the menu items from the database
window.addEventListener("load", (event) => {
    waitForOpenConnection(ws)

    const subProducts = setTitle();

    let menu = localStorage.getItem(subProducts)

    if (!(menu)) {
        retreiveMenu(subProducts);
    }
    else {
        createProductTable(subProducts)
    }
})


// Displays the title on the html page
function setTitle() {
    // Retrieve data:
    let text = localStorage.getItem("Title");
    const obj = JSON.parse(text);
    var name = obj.subProducts;

    document.getElementById("title").innerHTML = name;
    return name;
}


// Gets the sub products from the database and stores it in local storage
function retreiveMenu(name) {
    const obj = {
        operation: 2,
        subOperation: 6,
        subProducts: name
    }
    const json = JSON.stringify(obj);
    sendMessage(ws, json);

    ws.onmessage = function (event) {
        var data = JSON.parse(event.data);

        if (isID(data, ID = undefined) === -1) {
            return -1;
        }

        if (name === "Mains") {
            menu[0].push(data);
        }
        else if (name === "Snack") {
            menu[1].push(data);
        }
        else if (name === "Drinks") {
            menu[2].push(data);
        }


        storeMenu(name, data);
        createProductTable(name)
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


// Stores the menu
function storeMenu(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

// Displays the menu items on the html file
function createProductTable(localStorageName) {
    let subProducts = JSON.parse(localStorage.getItem(localStorageName));

    html = `<tr><th>Item</th><th>Price</th><th>Quantity</th><th></th></tr>`;

    for (var i = 0; i < subProducts.length; i++) {
        var productType = subProducts[i]["productType"];

        html += "<tr><td>" + subProducts[i]["productDescription"] + "</td>";

        html += "<td>£" + (subProducts[i]["productCost"] / 100).toFixed(2) + "</td>";

        html += `<td><input type="number" name="quantity" id="${"quantity" + i}" min="1" max="10"></td>`

        html += `<td><button class="btn btn-primary text-white addItemButton" onclick="addItem(${subProducts[i].productID}, '${"quantity" + i}')"><img src="Images/plusIcon.png" alt="plus icon"></button></td>`

        html += "</tr>"




    }

    var tbl = document.createElement("table");
    var menu = document.getElementById("menu");

    tbl.setAttribute("ID", "tableID");
    tbl.innerHTML = html;
    menu.appendChild(tbl);


}
