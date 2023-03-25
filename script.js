var x;
var y;
var centerX = window.innerWidth/2;
var centerY = window.innerHeight/2;
var direction;
var lengthFromCenter;
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
    }
    if(n == 1){
        x += Math.cos(direction) * sideLength;
        y -= Math.sin(direction) * sideLength;
        ctx.lineTo(x, y);
    }else{
        var lineIsOnScreen = true;
        if(sideLength < 1){
            lineIsOnScreen = false;
        }else if((x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight)){
            var newX = x + Math.cos(direction) * sideLength;
            var newY = y - Math.sin(direction) * sideLength;

            if((newX < 0 && x < 0 ) || (newX > window.innerWidth && x > window.innerWidth )){
                lineIsOnScreen = false;
            }else if((newY < 0 && y < 0 ) || (newY > window.innerHeight && y > window.innerHeight )){
                var horizontal = false;
                var goingLeft = false;
                if(parseInt(direction*100) == parseInt(200*Math.PI) || (direction < 0.1 && direction > -0.1)){
                    horizontal = true;
                    goingLeft = true;
                }else if(parseInt(direction*100) == parseInt(100*Math.PI) || parseInt(direction*100) == parseInt(-100*Math.PI)){
                    horizontal = true;
                    goingLeft = false;
                }
                if(horizontal && goingLeft && y > -sideLength/3 && y < 0){
                    //snowflake at top of screen
                }else if(horizontal && !goingLeft && y < window.innerHeight + sideLength/3 && y > window.innerHeight){
                    //snowflake at bottom of screen
                }else{
                    lineIsOnScreen = false;
                }
                    
             
            }
            
        }

        if(lineIsOnScreen){
            var newSideLength = sideLength/3;
            if(newSideLength > 40 && n == 2){
                largeSideLength = true;
            }
            if(newSideLength < 20 && n == 2){
                smallSideLength = true;
            }
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

function getHypothesis(opp, adj){
    var oppSquared = Math.pow(opp,2);
    var adjSquared = Math.pow(adj,2);
    return Math.pow((oppSquared + adjSquared),0.5);
}

window.onload = function() {
    var increaseOrderAsZoomInput = document.getElementById("increaseOrderAsZoomInput");
    
    var orderInput = document.getElementById("orderInput");


    lengthFromCenter = lengthInput.value;

    orderInput.oninput = function() {
        drawSnowFlake(orderInput.value);
    } 

    document.addEventListener("wheel", (event) => { 
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


        lengthFromCenter = parseInt(lengthFromCenter) * (1 + event.deltaY/1000);
        if(lengthFromCenter < 1 ){
            lengthFromCenter = 1;        
        }
        if(lengthFromCenter < 10 && event.deltaY > 0){
            lengthFromCenter += 1;
        }

        centerX -= Math.cos(mouseAngle) * (mouseDistanceFromCenter * (1 + event.deltaY/1000) - mouseDistanceFromCenter);
        centerY += Math.sin(mouseAngle) * (mouseDistanceFromCenter * (1 + event.deltaY/1000) - mouseDistanceFromCenter);
       
        drawSnowFlake(orderInput.value);

        if(increaseOrderAsZoomInput.checked){
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

    function resizeCanvasAndRedraw() {
        ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    
        drawSnowFlake(orderInput.value);
    }
      
    window.addEventListener("resize", resizeCanvasAndRedraw);

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

