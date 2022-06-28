const ws = new WebSocket("ws://localhost:5000");

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


document.getElementById("login").addEventListener("click", function () {
    waitForOpenConnection(ws)
    validation()


})


// Resets the error messages
function resetErrorMessage() {
    document.getElementById("firstNameError").innerHTML = "";
    document.getElementById("lastNameError").innerHTML = "";
    document.getElementById("studentIDError").innerHTML = "";
    document.getElementById("studentIDErrorVerification").innerHTML = "";
    document.getElementById("checkboxError").innerHTML = "";
    document.getElementById("passwordError").innerHTML = "";



}


// Displays the name errors for the error message
function outputErrorMessage(errorIndex) {

    switch (errorIndex) {
        case 0:
            displayMessage("firstNameError", "Enter in a first name or longer than one character");
            break;
        case 1:
            displayMessage("lastNameError", "Enter in a last name or longer than one character");
            break;
        case 2:
            displayMessage("passwordError", "Enter in a password or longer than one character");
            break;
    }
}


// Displays the student id errors
function studentIDErrorMessage(errorIndex) {

    switch (errorIndex) {
        case 0:
            displayMessage("studentIDError", "Enter in a student ID or invalid id");
            break;
        case 1:
            displayMessage("studentIDError", "Not the same");
            break;

    }
}


function checkboxErrorMessage() {
    displayMessage("checkboxError", "Need to check the box");
}

function displayMessage(id, message) {
    document.getElementById(id).innerHTML = message;
}


function validation() {
    var userForm = document.forms.userDetails.elements;
    var firstName = userForm.firstName.value;
    var lastName = userForm.lastName.value;
    var studentID = userForm.studentID.value;
    var studentIDVerification = userForm.studentIDVerification.value;
    var isChecked = false;
    var password = userForm.password.value;


    var firstNameValid = lengthCheck(firstName, 0);
    var lastNameValid = lengthCheck(lastName, 1);
    var studentIDValid = validateStudentID(studentID, studentIDVerification)
    var passwordValid = lengthCheck(password, 2)
    isChecked = checkboxChecked();

    if (firstNameValid && lastNameValid && studentIDValid && isChecked && passwordValid === true) {
        createUser(firstName, lastName, studentID, password);
    }
    else {
        createPopup("Invalid Input", "Please make sure all inputs are valid", "error");
    }

}

// Checks to see if the checkbox is checked or outputs and error
function checkboxChecked() {
    if (document.getElementById("checkbox").checked == true) {
        return true;
    }
    checkboxErrorMessage();
    return false;
}




// Length check
function lengthCheck(value, errorIndex) {
    if (value.length <= 1) {
        outputErrorMessage(errorIndex);
        return false;
    };
    return true;
}

// Validates student ID
function validateStudentID(studentID, studentIDVerification) {

    const regex = /[a-zA-Z]{3}[0-9]{8}/gm;
    let duplicate = false;

    if (studentID === studentIDVerification && studentID.length != 0) {
        duplicate = true;

    }
    else {
        console.log("Student ID not the same");
        studentIDErrorMessage(1);
    }


    const str = studentID

    if (!regex.exec(str) || duplicate === false) {
        studentIDErrorMessage(0);
        return false;
    }
    return true;
}

// Creates a user object and sends it to the server
function createUser(firstName, lastName, studentID, password) {

    const user = {
        operation: 2,
        subOperation: 0,
        studentID: studentID,
        firstName: firstName,
        lastName: lastName,
        password: password

    };

    const json = JSON.stringify(user);
    sendMessage(ws, json);

    ws.onmessage = function (e) {
        const data = JSON.parse(e.data);


        // Checks to see if the json has text in it
        // If it does then an error has occured in the backend
        if (e.data.includes("Text")) {
            if (e.data.includes("User Created") || e.data.includes("Logged In")) {
                searchUser(user);
            }
            else {
                displayMessage("passwordError", data.Text)
            }
        }

    }

}


// Search for the user based on the id
function searchUser(user) {
    const obj = {
        operation: 2,
        subOperation: 3,
        studentID: user.studentID
    }

    ws.send(JSON.stringify(obj));

    ws.onmessage = function (e) {
        const data = e.data;


        // Checks to see if the json is valid and stores the user
        if (JsonValid(data)) {
            if (data.includes("Text")) {
                displayMessage("studentIDError", data.Text);
            } else {
                storeUser(data);
            }


        }
        console.log("Message Received");

    }
}


function storeUser(data) {
    localStorage.setItem("User", data);
    console.log("User Stored");
    locationObj = document.location;
    createPopup("Order confirmed", data.Text, "success", "Okay", locationObj);
}


function JsonValid(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}