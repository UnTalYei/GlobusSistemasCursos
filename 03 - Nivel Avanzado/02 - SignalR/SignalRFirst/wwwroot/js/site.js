var connection = new signalR.HubConnectionBuilder()
    .withUrl("/positionhub").build();

dragElement(document.getElementById("miDiv"));

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    // elmnt.onmousedown = dragMouseDown;
    document.getElementById(elmnt.id + "Cursor").onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // if (value = reached / exceeded){ stop dragging any       
        //further please}

        // elmnt.style.top = (topPos - pos2) + "px";
        // elmnt.style.left = (leftPos - pos1) + "px";
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";


        //envio de mensajes a los otros que no soy yo
        connection.invoke("SendPosition",
            (elmnt.offsetLeft - pos1),
            (elmnt.offsetTop - pos2)).catch(function(err) {
            return console.error(err.toString());
        })
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


connection.on("ReceivePosition", function(left, top) {
    console.log(left + " " + top)

    document.getElementById("miDiv").style.top = top + "px";
    document.getElementById("miDiv").style.left = left + "px";
})

connection.start().then(function() {
    console.log("Conectado");
})