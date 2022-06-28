const ws = new WebSocket("ws:localhost:5000");
var select = document.getElementById("questionSelect");

// Resets the error messages
function resetErrorMessage() {
    document.getElementById("userNameError").innerHTML = "";
    document.getElementById("emailErrorMessage").innerHTML = "";

}


// Outputs error message based on the case number
function outputErrorMessage(errorIndex) {

    switch (errorIndex) {
        case 0:
            document.getElementById("userNameError").innerHTML = "Enter in user name";
            break;
        case 1:
            document.getElementById("emailErrorMessage").innerHTML = "Enter in an correct email";
            break;

    }
}


// When the website loads we validate the basket and check for a meal deal
window.addEventListener("load", (event) => {

    waitForOpenConnection(ws);

    const obj = {
        operation: 2,
        subOperation: 17,
    }

    const json = JSON.stringify(obj);
    sendMessage(ws, json);

    ws.onmessage = function (event) {
        const obj = JSON.parse(event.data);
        let ID = undefined;

        if (isID(obj, ID) === -1) {
            return -1;
        }

        createSelect(obj);
        displayQuestions(obj);
    }
})



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


// Displays the questions
function displayQuestions(obj) {
    for (let count = 0; count < obj.data.length; count++) {
        var paragraph = document.createElement("p");
        paragraph.innerHTML = obj.data[count].Text;
        paragraph.setAttribute("ID", `${obj.data[count].ID}`);
        paragraph.setAttribute("Branch", `${obj.data[count].Branch}`);
        paragraph.setAttribute("Option", `${obj.data[count].Option}`);
        paragraph.text = obj.data[count].Text;

    }

}


// Adding the questions to the select element
function createSelect(obj) {

    for (let count = 0; count < obj.data.length; count++) {
        var select = document.getElementById("questionSelect");
        var option = document.createElement("option");
        option.value = `{"ID":${obj.data[count].ID}, "Branch":${obj.data[count].Branch}, "Option":${obj.data[count].Option}}`;
        option.text = obj.data[count].Text;
        select.appendChild(option);
    }
}

// Delets previous questions in the select
function deleteSelectOptions() {
    let count = 0;

    while (select.length != 0) {
        select.remove(0);
        count++;
    }
}


// Get the values from the form and validate them.
document.getElementById("submit").addEventListener("click", function () {

    resetErrorMessage();
    var userForm = document.forms.userDetails.elements;
    var userName = userForm.userName.value;
    var email = userForm.email.value;
    const valueObj = userForm.questionSelect.value;


    var userNameValid = validateName(userName);
    var emailValid = validateEmail(email);

    if (userNameValid && emailValid === true) {
        createUser(userName, email, valueObj);
    }
    else {
        createPopup("Invalid Input", "Please make sure all inputs are valid", "error");
    }

})

// Validates user name
function validateName(userName) {
    if (userName.length <= 0) {
        outputErrorMessage(0);
        return false;
    }

    return true;
}

// Validates Email
function validateEmail(email) {
    if (email.length <= 0 || !(email.includes("@"))) {
        outputErrorMessage(1);
        return false
    }

    return true;
}

// Creates a user object and sends it to the server
function createUser(userName, email, valueObj) {

    let firstName = userName.split(' ').slice(0, -1).join(' ');
    let lastName = userName.split(' ').slice(-1).join(' ');
    const obj = JSON.parse(valueObj);

    const user = {
        operation: 2,
        subOperation: 18,
        firstName: firstName,
        lastName: lastName,
        email: email,
        id: obj.ID,
        branch: obj.Branch,
        option: obj.Option,
        refresh: false

    };

    const json = JSON.stringify(user);
    ws.send(json);
    createPopup("Message Send", "Message sent successfully", "success");

    ws.onmessage = function (event) {
        const obj = JSON.parse(event.data);

        //Makes sure the message isnt reset when resetting the questions
        if (select.length != 0) {
            document.getElementById("answerOutput").innerHTML = obj.answer;
        }
        deleteSelectOptions();
        createSelect(obj);
        validateSelect();

    }

}

//Checks to see if the questions need refreshing
function validateSelect() {

    if (select.length === 0) {
        const obj = {
            refresh: true
        };
        ws.send(JSON.stringify(obj));
    }
}
