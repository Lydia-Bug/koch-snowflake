var x;
var y;
var direction;

function drawSnowFlake(n, lengthFromCenter) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    
    x = canvas.width/2;
    y = canvas.height/2;

    y -= lengthFromCenter;
    direction = 2*Math.PI/3; //120 degrees
    ctx.moveTo(x, y);

    var sideLength = 2*Math.sin(Math.PI/3)*lengthFromCenter;
    for(var i = 0; i < 3; i++){
        direction += 2*Math.PI/3; //120 degrees
        drawSide(sideLength, n);
    }

    ctx.closePath();
    ctx.stroke(); 
}

function drawSide(sideLength, n) {
    if(n == 1){
        x += Math.cos(direction) * sideLength;
        y -= Math.sin(direction) * sideLength;
        ctx.lineTo(x, y);
    }else{
        drawSide(sideLength/3, n-1);
        
        direction -= Math.PI/3 //60 degrees
        drawSide(sideLength/3, n-1);

        direction += 2*Math.PI/3 //120 degrees
        drawSide(sideLength/3, n-1);

        direction -= Math.PI/3 //60 degrees
        drawSide(sideLength/3, n-1);
    }
}

window.onload = function() {
    var orderInput = document.getElementById("orderInput");
    var orderOutput = document.getElementById("orderOutput");
    orderOutput.innerHTML = orderInput.value; 

    var lengthInput = document.getElementById("lengthInput");
    var lengthOutput = document.getElementById("lengthOutput");
    lengthOutput.innerHTML = lengthInput.value; 

    orderInput.oninput = function() {
        drawSnowFlake(orderInput.value, lengthInput.value);
        orderOutput.innerHTML = orderInput.value;
    } 

    lengthInput.oninput = function() {
        drawSnowFlake(orderInput.value, lengthInput.value);
        lengthOutput.innerHTML = lengthInput.value;
    } 

    ctx = canvas.getContext("2d"),

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.99;

    drawSnowFlake(orderInput.value, lengthInput.value);
}

