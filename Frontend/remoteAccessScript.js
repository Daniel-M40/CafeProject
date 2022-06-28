const ws = new WebSocket("ws://localhost:5000");
var currentDirectory = "";
var counter = 0;

window.addEventListener("load", (e) => {

    const obj = {
        operation: 2,
        subOperation: 13
    };

    const json = JSON.stringify(obj);
    waitForOpenConnection(ws);
    sendMessage(ws, json)

})

ws.onmessage = function (event) {
    var data = JSON.parse(event.data);
    let ID = undefined;

    if (data.hasOwnProperty('popupTitle')) {
        createPopup(data.popupTitle, data.popupMessage, data.icon, "Okay")

        if (data.icon != "error") {
            createObject(data.currentDirectory, 14);
        }

    }


    try {
        ID = data.ID;
    } catch (error) {
        console.log(error);
    }
    let location = document.location.href;

    if (ID != undefined && !location.includes("chatApplication")) {
        return -1;
    }

    if (data.hasOwnProperty('base64')) {
        createDownloadLink(data);

    }

    createFileStructure(data);

}

function createFileStructure(data) {
    var folderStructure = document.getElementById("folderStructure");
    var row = document.createElement("div");

    const rowCollection = document.getElementsByClassName("row");

    if (rowCollection.length >= 1) {
        rowCollection[0].remove(0);
    }

    row.classList.add("row");
    row.setAttribute("id", counter)
    counter++;


    for (let count = 0; count < data.length; count++) {
        var column = document.createElement("div");
        var image = document.createElement("img");
        var paragraph = document.createElement("p");
        var button = document.createElement("button");
        var anchor = document.createElement("a");

        var src = data[count].fileIconBase64;
        let filePath = data[count].filePath;

        currentDirectory = filePath;



        column.setAttribute("class", "col-2 mr-2");
        image.setAttribute("class", "icon");
        image.setAttribute('src', `data:image/jpg;base64,${src}`);
        image.setAttribute("alt", "Icon");
        button.setAttribute("type", "button");
        button.setAttribute("class", "btn bg-black, text-white");
        button.setAttribute("id", filePath);

        fileName = data[count].fileName;
        paragraph.innerHTML = fileName;



        if (fileName.includes(".txt")) {
            createDownloadLink(data, count, anchor);
        }
        else {
            eventListener("dblclick", button, 14);
        }


        button.appendChild(image);
        anchor.appendChild(button)
        column.appendChild(anchor);
        column.appendChild(paragraph);
        row.appendChild(column);

    }

    folderStructure.appendChild(row);


}

function createDownloadLink(data, count, anchor) {
    var fileName = data[count].fileName;
    var base64 = data[count].fileBase64;

    var byteArray = Base64Binary.decodeArrayBuffer(base64);


    var myFile = new Blob([byteArray], { type: 'text/plain' });
    window.URL = window.URL || window.webkitURL;
    anchor.setAttribute('href', window.URL.createObjectURL(myFile));
    anchor.setAttribute('download', fileName);

}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}



function createBreadcrumbs(fileName, isLastElement) {
    var breadcrums = document.getElementById("breadcrumList");
    var li = document.createElement("li");

    if (isLastElement) {
        li.setAttribute("class", "breadcrumb-item active");
    }
    else {
        li.setAttribute("class", "breadcrumb-item");
    }
    li.setAttribute("aria-current", "page");
    li.innerHTML = fileName.replace(/[^A-Za-z0-9\+\/\=]/g, "");;

    breadcrums.appendChild(li);

}


function removeBreadcrumbs() {
    var breadcrumList = document.getElementsByClassName("breadcrumb-item");
    let length = breadcrumList.length;
    breadcrumList[length - 1].remove();
}

const eventListener = (type, element, subOperation) => {
    element.addEventListener(type, (e) => {
        createObject(e.currentTarget.id, subOperation)
        createBreadcrumbs(e.currentTarget.id, true)
    })
}

document.getElementById("backBtn").addEventListener("click", (e) => {
    createObject(currentDirectory, 15);
    removeBreadcrumbs();

})


function createObject(id, subOperation) {

    const obj = {
        operation: 2,
        subOperation: subOperation,
        filePath: id
    }
    const json = JSON.stringify(obj);

    waitForOpenConnection(ws);
    sendMessage(ws, json);

}


/*
Copyright (c) 2011, Daniel Guerrero
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

      
 * Uses the new array typed in javascript to binary base64 encode/decode
 * at the moment just decodes a binary base64 encoded
 * into either an ArrayBuffer (decodeArrayBuffer)
 * or into an Uint8Array (decode)
 * 
 * References:
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/ArrayBuffer
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/Uint8Array
 
*/
var Base64Binary = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    /* will return a  Uint8Array type */
    decodeArrayBuffer: function (input) {
        var bytes = (input.length / 4) * 3;
        var ab = new ArrayBuffer(bytes);
        this.decode(input, ab);

        return ab;
    },

    removePaddingChars: function (input) {
        var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
        if (lkey == 64) {
            return input.substring(0, input.length - 1);
        }
        return input;
    },

    decode: function (input, arrayBuffer) {
        //get last chars to see if are valid
        input = this.removePaddingChars(input);
        input = this.removePaddingChars(input);

        var bytes = parseInt((input.length / 4) * 3, 10);

        var uarray;
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var j = 0;

        if (arrayBuffer)
            uarray = new Uint8Array(arrayBuffer);
        else
            uarray = new Uint8Array(bytes);

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        for (i = 0; i < bytes; i += 3) {
            //get the 3 octects in 4 ascii chars
            enc1 = this._keyStr.indexOf(input.charAt(j++));
            enc2 = this._keyStr.indexOf(input.charAt(j++));
            enc3 = this._keyStr.indexOf(input.charAt(j++));
            enc4 = this._keyStr.indexOf(input.charAt(j++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            uarray[i] = chr1;
            if (enc3 != 64) uarray[i + 1] = chr2;
            if (enc4 != 64) uarray[i + 2] = chr3;
        }

        return uarray;
    }
}