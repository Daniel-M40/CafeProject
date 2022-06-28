
read = new FileReader();

function dropHandler(ev) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        for (let count = 0; count < ev.dataTransfer.files.length; count++) {
            uploadFile(ev.dataTransfer.files[count]);
        }

    }

    document.querySelector(".dropzone").style.visibility = "hidden";
    document.querySelector(".dropzone").style.opacity = 0;
}

function dragOverHandler(ev) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}


/* lastTarget is set first on dragenter, then
   compared with during dragleave. */
var lastTarget = null;

window.addEventListener("dragenter", function (e) {
    lastTarget = e.target; // cache the last target here
    // unhide our dropzone overlay
    document.querySelector(".dropzone").style.visibility = "";
    document.querySelector(".dropzone").style.opacity = 1;
});

window.addEventListener("dragleave", function (e) {
    if (e.target === lastTarget || e.target === document) {
        document.querySelector(".dropzone").style.visibility = "hidden";
        document.querySelector(".dropzone").style.opacity = 0;
    }
});


const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.substr(reader.result.indexOf(',') + 1));
    reader.onerror = error => reject(error);
});


async function uploadFile(file) {
    console.log(currentDirectory);
    let base64 = await toBase64(file);
    let fileType = file.type;
    let fileName = file.name;

    createBase64Object(base64, fileType, fileName, currentDirectory)
}

function createBase64Object(base64, fileType, fileName, currentDirectory) {
    const obj = {
        operation: 2,
        subOperation: 12,
        base64: base64,
        fileName: fileName,
        fileType: fileType,
        currentDirectory: currentDirectory

    }
    const json = JSON.stringify(obj);
    waitForOpenConnection(ws);
    sendMessage(ws, json);
}

// event fired when file reading finished
read.addEventListener('load', function (e) {
    // contents of the file
    let text = e.target.result;

    document.querySelector("#file-contents").textContent = text;
});




