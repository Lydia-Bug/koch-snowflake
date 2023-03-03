var x = 0;
var y = 0;
var direction = 0;

function drawSnowFlake(n) {
    var lengthFromCenter = canvas.width/4;

    ctx.beginPath();
    
    x = canvas.width/2;
    y = canvas.width/2;

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
   // const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d"),

    canvas.width = window.innerHeight * 0.95;
    canvas.height = window.innerHeight * 0.95;

    n = 4;

    drawSnowFlake(n);
}