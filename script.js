// Author: Lydia Acton

var x;
var y;
var centerX = window.innerWidth/2;
var centerY = window.innerHeight/2;
var direction;
var lengthFromCenter;

// Draws snowflake on screen
function drawSnowFlake(n) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    
    x = centerX;
    y = centerY;

    y -= lengthFromCenter;
    direction = 2*Math.PI/3; //120 degrees
    ctx.moveTo(x, y);
 
    var sideLength = 2*Math.sin(Math.PI/3)*lengthFromCenter;
    // draws the 3 sides of a triangle
    for(var i = 0; i < 3; i++){
        direction += 2*Math.PI/3; //120 degrees
        drawSide(sideLength, n);
    }

    ctx.closePath();
    ctx.stroke(); 
}

// Recursive function that draws a side of the triangle
function drawSide(sideLength, n) {
    // keeps the direction variable between -2*Pi and 2*Pi, 
    // this makes it easier for checking whether the direction is to the left or right
    if(direction > 2*Math.PI){ 
        direction -= 2*Math.PI;
    }else if(direction < -2*Math.PI){
        direction += 2*Math.PI;
    }
    if(n == 1){ //base case, when n = 1 just draws straight line
        x += Math.cos(direction) * sideLength;
        y -= Math.sin(direction) * sideLength;
        ctx.lineTo(x, y);
    // else will draw a line with a triangle coming out of it    
    // Will do this by drawing 4 lines, each a third of the original length. Between each line, the direction the line is drawn in is changed
    }else{ 
        var isLineVisible = checkIsLineVisible(sideLength);

        if(isLineVisible){
            var newSideLength = sideLength/3;
            
            drawSide(newSideLength, n-1);
            
            direction -= Math.PI/3 //60 degrees
            drawSide(newSideLength, n-1);

            direction += 2*Math.PI/3 //120 degrees
            drawSide(newSideLength, n-1);

            direction -= Math.PI/3 //60 degrees
            drawSide(newSideLength, n-1);
        }else{
            drawSide(sideLength, 1); // n is 1 so will just draw one straight line
        }
    }
}

//checks if line is one screen or if line is more then one pixel
function checkIsLineVisible(sideLength){
    if(sideLength < 1){
        return false;
    }else if((x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight)){
        var newX = x + Math.cos(direction) * sideLength;
        var newY = y - Math.sin(direction) * sideLength;

        if((newX < 0 && x < 0 ) || (newX > window.innerWidth && x > window.innerWidth )){
            return false;
        }else if((newY < 0 && y < 0 ) || (newY > window.innerHeight && y > window.innerHeight )){
            // is line is above or below screen the original line might not be visible, but triangles coming off it might be
            // so extra checks are needed
                if((parseInt(direction*100) == parseInt(200*Math.PI) || (direction < 0.1 && direction > -0.1))){ // snowflake at top of screen
                if(y > -sideLength/3 && y < 0){ // snowflake close enough to top of screen to still be visible
                    return true;
                }
            }else if((parseInt(direction*100) == parseInt(100*Math.PI) || parseInt(direction*100) == parseInt(-100*Math.PI))){ // snowflake at bottom of screen
                if(y < window.innerHeight + sideLength/3 && y > window.innerHeight){ // snowflake is close enough to bottom of screen to still be visible
                    return true;
                }  
            }
            return false;
        }
    }
    return true;
}

function getHypothesis(opp, adj){
    var oppSquared = Math.pow(opp,2);
    var adjSquared = Math.pow(adj,2);
    return Math.pow((oppSquared + adjSquared),0.5);
}

window.onload = function() {
    var orderInput = document.getElementById("orderInput"); //order input button

    orderInput.oninput = function() { //when orderInput is changed the snowflake will be redrawn
        drawSnowFlake(orderInput.value);
    } 

    // zoom on scroll
    document.addEventListener("wheel", (event) => { 
        // changes snowflakes size, by changing length from center
        lengthFromCenter = parseInt(lengthFromCenter) * (1 + event.deltaY/1000); //event.deltaY is how much was scrolled
        if(lengthFromCenter < 1 ){ // can't be smaller then 1 pixel
            lengthFromCenter = 1;        
        }
        if(lengthFromCenter < 10 && event.deltaY > 0){ // doesn't increase when below 10 with the method I use, so need this instead
            lengthFromCenter += 1;
        }

        // get mouse distance and angle
        var mouseDistanceFromCenterX = event.pageX - centerX;
        var mouseDistanceFromCenterY = -(event.pageY - centerY);

        var mouseDistanceFromCenter = getHypothesis(mouseDistanceFromCenterY, mouseDistanceFromCenterX);
        var mouseAngle = Math.atan2(mouseDistanceFromCenterX, mouseDistanceFromCenterY);
        if(mouseDistanceFromCenterX < 0){
            mouseAngle = Math.atan2(-mouseDistanceFromCenterX, mouseDistanceFromCenterY) + Math.PI/2;
        }
        if(mouseDistanceFromCenterY < 0){
            mouseAngle = -Math.atan2(mouseDistanceFromCenterX, -mouseDistanceFromCenterY)
        }
        if(mouseDistanceFromCenterY < 0 && mouseDistanceFromCenterY < 0) {
            mouseAngle = -Math.atan2(-mouseDistanceFromCenterX, -mouseDistanceFromCenterY) - Math.PI/2
        }

        // translate snowflake depending on where mouse is
        // combined with the size changing, this will look like zooming in or out
        centerX -= Math.cos(mouseAngle) * (mouseDistanceFromCenter * (1 + event.deltaY/1000) - mouseDistanceFromCenter);
        centerY += Math.sin(mouseAngle) * (mouseDistanceFromCenter * (1 + event.deltaY/1000) - mouseDistanceFromCenter);
       
        // redraw snowflake with new lengthFromCenter, and center coordinates
        drawSnowFlake(orderInput.value);
    });

    // re-defines canvas size when window is resized
    window.addEventListener("resize", (event) => {
        ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        centerX = window.innerWidth/2;
        centerY = window.innerHeight/2;
        lengthFromCenter = Math.min(window.innerHeight, window.innerWidth) / 3;
        // redraws snowflake, snowflake will look the same as before, this is just nessercery after changing the canvas
        drawSnowFlake(orderInput.value);
    });

    // pan by dragging image around
    var mouseDown = false;
    document.body.onmousedown = function() { 
        mouseDown = true;
    }
    document.body.onmouseup = function() {
        mouseDown = false;
    }

    var previousX;
    var previousY;

    canvas.addEventListener("mousemove", function (event) {   
        if(mouseDown){
            mX = event.pageX;
            mY = event.pageY;
            if(previousX != null && previousY != null){
                centerX += mX - previousX;
                centerY += mY - previousY;
                drawSnowFlake(orderInput.value);
            }
            previousX = mX;
            previousY = mY;
        }else{
            previousX = null;
            previousY = null;
        }
    });
     
    ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // size of snowflake depends on size on screen
    lengthFromCenter = Math.min(window.innerHeight, window.innerWidth) / 3;
    
    drawSnowFlake(orderInput.value);
}

