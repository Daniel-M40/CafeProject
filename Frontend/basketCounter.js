window.addEventListener("load", function () {
    setBasketLength();
})

function setBasketLength() {
    var localBasket = JSON.parse(localStorage.getItem("Basket"));
    let totalLength = 0;

    if (localBasket == null) {
        document.getElementById("basketCount").innerHTML = 0;
        return -1;
    }

    for (let basketIndex = 0; basketIndex < localBasket.length; basketIndex++) {
        totalLength += localBasket[basketIndex].length;
    }

    document.getElementById("basketCount").innerHTML = totalLength;
}