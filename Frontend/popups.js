
function createPopup(title, text, icon, confirmButtonText = "Okay", locationObj) {
    swal({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: confirmButtonText
    }).then((isConfirm) => {
        if (isConfirm) {
            if (locationObj.pathname.includes("login.html")) {
                location.replace("orderConfirmation.html");
            }

        }
    });
}

function confirmationPopup(id) {
    swal({
        title: "Are you sure?",
        text: "Do you want to remove this item from your basket?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((isConfirm) => {
        if (isConfirm) {
            swal("The item has been removed from your basket", {
                icon: "success",
            });
            removeItem(id);
        } else {
            swal("Action canceled");
            return -1;
        }
    });

}

function changeLocation() {
    document.location.href = "orderConfirmation.html"; // changes the location of the user
}


