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