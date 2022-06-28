var timer = 10000;
var connectionUrl = document.getElementById("connectionUrl")
var connectButton = document.getElementById("connectButton")
var stateLabel = document.getElementById("stateLabel")
var sendMessageInput = document.getElementById("sendMessageInput")
var sendButton = document.getElementById("sendButton")
var commsLog = document.getElementById("commsLog")
var closeButton = document.getElementById("closeButton")
var recipents = document.getElementById("recipents")
var connID = document.getElementById("connIDLabel")

connectionUrl.value = "ws://localhost:5000";

connectButton.onclick = function () {
    stateLabel.innerHTML = "Attempting to connect...";
    socket = new WebSocket(connectionUrl.value)
    socket.onopen = function (event) {
        updateState();
        commsLog.innerHTML += '<tr>' +
            '<td colspan="3"> Connection opened</td>' +
            '</tr>';
    };

    socket.onclose = function (event) {
        updateState();
        commsLog.innerHTML += '<tr>' +
            '<td colspan="3"> Connection closed. Code: ' + htmlEscape(event.code)
            + 'Reason: ' + htmlEscape(event.reason) + '</td>' +
            '</tr>';
    };

    socket.onerror = updateState();
    socket.onmessage = function (event) {
        const obj = JSON.parse(event.data);

        updateCurrentUsers(obj);

        if (obj.hasOwnProperty("usersAmount") && !obj.hasOwnProperty("ID")) {
            return -1;
        }

        commsLog.innerHTML += '<tr>' +
            '<td>Server</td>' +
            '<td>Client</td>' +
            `<td>From: ${obj.ID}</td>` +
            `<td>Message: ${obj.Message}</td>` + `<td>Type: ${obj.Type}</td>` + '</td></tr>';
        isConnID(obj.ID);


    };
};

function updateCurrentUsers(obj) {
    document.getElementById("currentlyConnected").innerHTML = `Connected Users: ${obj.usersAmount}`;
}

function getAmountOfUsers() {
    var data = constructJSON(1);
    try {
        socket.send(data);
        const obj = JSON.parse(data);
    }
    catch (err) {
        document.getElementById("currentlyConnected").innerHTML = `Connected Users: User not found`;
    }



}

var refreshIntervalId = setInterval(getAmountOfUsers, timer);

closeButton.onclick = function () {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        createPopup("WebSocket not connected", `The websocket has not been connected`, "error");
    }
    socket.close(1000, "Closing from client");
};

sendButton.onclick = function () {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        createPopup("WebSocket not connected", `The websocket has not been connected`, "error");
    }
    var data = constructJSON(0);
    socket.send(data);

    const obj = JSON.parse(data);
    commsLog.innerHTML += '<tr>' +
        '<td>Server</td>' +
        '<td>Client</td>' +
        '<td>' + htmlEscape(obj.Message) + '</td></tr>';
};

function isConnID(str) {
    if (str.length > 0) {
        connID.innerHTML = "ConnID: " + str;
    }


};

function constructJSON(operation) {

    if (operation === 0) {
        return JSON.stringify({
            "operation": operation,
            "From": connID.innerHTML.substring(8, connID.innerHTML.length),
            "To": recipents.value,
            "Message": sendMessageInput.value
        });
    }
    else if (operation == 1) {
        return JSON.stringify({
            "operation": operation
        });
    }


}

function htmlEscape(str) {
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

function updateState() {
    function disable() {
        sendMessageInput.disabled = true;
        sendButton.disabled = true;
        closeButton.disabled = true;
        recipents.disabled = true;
    };
    function enable() {
        sendMessageInput.disabled = false;
        sendButton.disabled = false;
        closeButton.disabled = false;
        recipents.disabled = false;
    };
    connectionUrl.disabled = true;
    if (!socket) {
        disable();
    } else {
        switch (socket.readyState) {
            case WebSocket.CLOSED:
                stateLabel.innerHTML = "Closed";
                connID.innerHTML = "ConnID: N/a";
                disable();
                connectionUrl.disable = false;
                closeButton.disable = true;
                connectButton.disable = false;
                clearInterval(refreshIntervalId);
                break;
            case WebSocket.CLOSING:
                stateLabel.innerHTML = "Closing...";
                disable();
                break;
            case WebSocket.OPEN:
                stateLabel.innerHTML = "Open";
                connectButton.disable = false;
                enable();
                break;
            default:
                stateLabel.innerHTML = "Unknown WebSocket State: " + htmlEscape(socket.readyState);
                disable();
                break;
        }
    }
};