var x;
var y;
var centerX = window.innerWidth/2;
var centerY = window.innerHeight/2;
var direction;
var lengthFromCenter = 300;
var largeSideLength = false;
var smallSideLength = false;

function drawSnowFlake(n) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    
    x = centerX;
    y = centerY;

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
    if(direction > 2*Math.PI){
        direction -= 2*Math.PI;
    }else if(direction < -2*Math.PI){
        direction += 2*Math.PI;
    }
    if(n == 1){ //base case, when n = 1 just draws straight line
        x += Math.cos(direction) * sideLength;
        y -= Math.sin(direction) * sideLength;
        ctx.lineTo(x, y);
    }else{
        var isLineVisible = checkIsLineVisible(sideLength);

        if(isLineVisible){
            var newSideLength = sideLength/3;
            
            checkSideLength(newSideLength, n);

            drawSide(newSideLength, n-1);
            
            direction -= Math.PI/3 //60 degrees
            drawSide(newSideLength, n-1);

            direction += 2*Math.PI/3 //120 degrees
            drawSide(newSideLength, n-1);

            direction -= Math.PI/3 //60 degrees
            drawSide(newSideLength, n-1);
        }else{
            drawSide(sideLength, 1);
        }
    }
}

//checks if line is one screen or if line is more then one pixel
function checkIsLineVisible(sideLength){
    var isLineVisible = true;
        if(sideLength < 1){
            isLineVisible = false;
        }else if((x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight)){
            var newX = x + Math.cos(direction) * sideLength;
            var newY = y - Math.sin(direction) * sideLength;

            if((newX < 0 && x < 0 ) || (newX > window.innerWidth && x > window.innerWidth )){
                isLineVisible = false;
            // is line is above or below screen the original line might not be visible, but triangles coming off it might be, so extra checks are needed
            }else if((newY < 0 && y < 0 ) || (newY > window.innerHeight && y > window.innerHeight )){
                
                if((parseInt(direction*100) == parseInt(200*Math.PI) || (direction < 0.1 && direction > -0.1))
                    && y > -sideLength/3 && y < 0){
                    //snowflake at top of screen
                }else if((parseInt(direction*100) == parseInt(100*Math.PI) || parseInt(direction*100) == parseInt(-100*Math.PI))
                        && y < window.innerHeight + sideLength/3 && y > window.innerHeight){
                    //snowflake at bottom of screen
                }else{
                    isLineVisible = false;
                }
            }
        }
    return isLineVisible;
}

// check if sidelength is too big or small for auto changing of order when zooming
function checkSideLength(sideLength, n){
    if(sideLength > 10 && n == 2){
        largeSideLength = true;
    }
    if(sideLength < 5 && n == 2){
        smallSideLength = true;
    }
}

function getHypothesis(opp, adj){
    var oppSquared = Math.pow(opp,2);
    var adjSquared = Math.pow(adj,2);
    return Math.pow((oppSquared + adjSquared),0.5);
}

window.onload = function() {
    var increaseOrderAsZoomInput = document.getElementById("increaseOrderAsZoomInput");
    var orderInput = document.getElementById("orderInput");

    orderInput.oninput = function() {
        drawSnowFlake(orderInput.value);
    } 

    // will zoom when scrolling
    document.addEventListener("wheel", (event) => { 
        // increase or decrease length from center to make snowflake smaller or larger (or more zoomed in)
        lengthFromCenter = parseInt(lengthFromCenter) * (1 + event.deltaY/1000);
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

        // translate depending on where mouse is, this will allow user to zoom in to where mouse is
        centerX -= Math.cos(mouseAngle) * (mouseDistanceFromCenter * (1 + event.deltaY/1000) - mouseDistanceFromCenter);
        centerY += Math.sin(mouseAngle) * (mouseDistanceFromCenter * (1 + event.deltaY/1000) - mouseDistanceFromCenter);
       
        drawSnowFlake(orderInput.value);

        if(increaseOrderAsZoomInput.checked){
            //my method for checking if length too large doesn't work when order is one, so this is needed
            if(orderInput.value == 1){
                largeSideLength = true;
            }
            if(largeSideLength){
                largeSideLength = false;
                orderInput.value++;
                drawSnowFlake(orderInput.value);
            }
            if(smallSideLength){
                smallSideLength = false;
                orderInput.value--;
                drawSnowFlake(orderInput.value);
            }
        }
    });

    window.addEventListener("resize", (event) => {
        ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawSnowFlake(orderInput.value);
    });

    // allows user to pan around image
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
    
    drawSnowFlake(orderInput.value);
}

