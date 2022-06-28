const ws = new WebSocket("ws://localhost:5000");

document.getElementById("submitButton").addEventListener("click", (e) => {
    let emailForm = document.forms.emailForm.elements;
    let emailAddress = emailForm.email.value;
    let password = emailForm.password.value;
    let username = emailForm.username.value;
    let receiverEmail = emailForm.receiverEmail.value;
    let subject = emailForm.subject.value;
    let bodyText = emailForm.subject.value;


    if (validateEmail(emailAddress) && lengthCheck(username) && lengthCheck(receiverEmail) && validateEmail(receiverEmail) && lengthCheck(subject) && lengthCheck(bodyText) === true) {

        createEmailObj(username, emailAddress, password, receiverEmail, subject, bodyText);
    }
})

function validateEmail(email) {
    let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (email.match(regex)) {
        return true;
    }
    else {
        return false;
    }
}

function lengthCheck(value) {
    if (value.length === 0) {
        return false;
    }
    return true;
}

function createEmailObj(username, emailAddress, password, receiverEmail, subject, bodyText) {
    const obj = {
        operation: 2,
        subOperation: 11,
        username: username,
        emailAddress: emailAddress,
        password: password,
        receiverEmail: receiverEmail,
        subject: subject,
        bodyText: bodyText
    }

    let json = JSON.stringify(obj);
    waitForOpenConnection(ws)
    sendMessage(ws, json);

}


document.getElementById("uploadFile").addEventListener("click", (e) => {

    let fileForm = document.forms.fileForm.elements;
    let filePath = fileForm.file.value;

    filePath.addEventListener('change', async (event) => {
        const files = event.srcElement.files;

        console.log(files)
    })

    var file = document.querySelector('#file > input[type="file"]').files[0];
    getBase64(file).then(
        data => console.log(data)
    );

    /*
    var reader = new FileReader();
    reader.readAsDataURL(filePath.files[0]);

    reader.onload = function () {
        console.log(reader.result);//base64encoded string
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
*/
    convertFile(filePath);


    console.log(filePath);
})

async function convertFile(filePath) {
    const file = document.querySelector(filePath).files[0];
    console.log(await toBase64(file));
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// get a reference to the file input
const fileInput = document.querySelector("input");

// listen for the change event so we can capture the file
fileInput.addEventListener("change", (e) => {
    // get a reference to the file
    const file = e.target.files[0];

    // encode the file using the FileReader API
    const reader = new FileReader();
    reader.onloadend = () => {
        // use a regex to remove data url part
        const base64String = reader.result
            .replace("data:", "")
            .replace(/^.+,/, "");

        // log to console
        // logs wL2dvYWwgbW9yZ...
        console.log(base64String);
    };
    reader.readAsDataURL(file);
});


