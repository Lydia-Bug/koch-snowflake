To run this code open index.html in a browser

[Product demonstration video](https://www.youtube.com/watch?v=v5ZBeJs5bjs)

#### Snowflake algorithm
My code to draw the snowflake uses a direction vector and a recursive drawLine function. If the base case is meet (order 1) just a line will be drawn. If not the drawLine function will be called four times to create a line with a triangle poking out of it. When the drawLine function is called the side-length divided by three and the order minus one is passed into it. So it will be recursively called until order equals one then just a line will be draw.

#### Panning and Scrolling
I found coding the panning pretty easy, the snowflake was originally coded for the center to be at the center coordinates of the screen, so I just made it when you click the mouse and drag, it changes the center coordinates it draws the snowflake depending where you've dragged the mouse.
It was easy to make the snowflake larger or smaller, but I was initially having trouble getting it to zoom into where the mouse was. I did figure it out out though, so when you zoom in it changes the size and translates the snowflake depending on the angle of the mouse from the center of the snowflake and how far it is. 

#### Optimizing 
When I didn't have any scrolling I didn't really need any optimization because you couldn't see any detail above order ten, and it could draw that in about a second. But I had to optimize was I added scrolling, because I could now see higher orders. So if a line drawn is completely off the screen, it will just draw a line rather then doing further recursions. I had to alter this a bit for horizontal lines, because a horizontal line could be completely off the screen the screen but the triangle bit coming off it might not be, so I had to add something to check for that. I also added something so that if a line was less then one, it wouldn't compute any further recursions, because you couldn't see any more detail at the that point anyway.

Author: Lydia Acton