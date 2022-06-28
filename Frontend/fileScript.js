
document.getElementById("uploadFile").addEventListener("click", (e) => {
    const fileInput = document.getElementById('file')

    // This is for storing the base64 strings
    var myFiles = {}
    // if you expect files by default, make this disabled
    // we will wait until the last file being processed
    let isFilesReady = true

    const files = fileInput.files;
    var fileType = fileInput.type;
    var fileName = fileInput.name;
    console.log(files)

    const filePromises = Object.entries(files).map(item => {
        return new Promise((resolve, reject) => {
            const [index, file] = item
            const reader = new FileReader();
            reader.readAsBinaryString(file);

            reader.onload = function (event) {
                // Convert file to Base64 string
                // btoa is built int javascript function for base64 encoding
                myFiles['text'] = btoa(event.target.result)
                resolve()
            };
            reader.onerror = function () {
                console.log("can't read the file");
                reject()
            };
        })
    })

    Promise.all(filePromises)
        .then(() => {
            console.log('ready to submit')
            isFilesReady = true
            createBase64Object(myFiles, fileType, fileName);
        })
        .catch((error) => {
            console.log(error)
            console.log('something wrong happened')
        })


})

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


function createBase64Object(myFiles, fileType, fileName) {
    const obj = {
        operation: 2,
        subOperation: 12,
        base64: myFiles,
        fileName: fileName,
        fileType: fileType

    }
    const json = JSON.stringify(obj);
    waitForOpenConnection(ws);
    sendMessage(ws, json);

}
