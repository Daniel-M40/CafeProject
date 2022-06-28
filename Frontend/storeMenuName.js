// Stores the menu name based on the button you clicked
function storeMenuName(menuName) {
    // Storing data:
    const myObj = { operation: 2, subOperation: 5, subProducts: menuName };
    const myJSON = JSON.stringify(myObj);
    localStorage.setItem("Title", myJSON);
}