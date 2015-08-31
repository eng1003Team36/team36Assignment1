/****************************************************************************************
Avaiable functions for usage in the uiController object
================================================================
uiController.bubbleTranslate(x,y, id)
    This function will translate the bubble from the middle of the screen.
    The center of the screen is considered (0,0).

    Inputs:
        x,y
        Translates the bubble x px right and y px up. Negative values are accepted
        and translate the bubble in the opposite direction.

        id
        ID of bubble that needs to be moved

uiController.bodyDimensions()
    Returns the width and height of the body (without the toolbar)

    Return:
        Returns an object with the following fields
        {
            width:      [Returns the width of the body],
            height:     [Returns the width of the body]
        }

ID of HTML elements that are of interest
==============================================================
dark-bubble
    ID of the dark green bubble

pale-bubble
    ID of the pale green bubble

message-area
    ID of text area at the bottom of the screen, just on top on the "Feeze" button

freeze-button
    ID of the "Freeze" button
****************************************************************************************/


function SpiritLevelProcessor() {

    //initialising the buffers
    var bufferLength = 25;
    var pitchBuffer = Array.apply(null, Array(bufferLength)).map(Number.prototype.valueOf, 0);
    var rollBuffer = Array.apply(null, Array(bufferLength)).map(Number.prototype.valueOf, 0);
    
    //making the bubble stop at the edges of the screen
    var screenWidth = document.body.clientWidth;
    var screenHeight = document.body.clientHeight;
    var widthLimit = 30; //this is the angle it stops at
    var heightLimit = widthLimit*screenHeight/screenWidth;
    var rollLimitFactor = screenWidth/widthLimit/2;
    var pitchLimitFactor = screenHeight/heightLimit/2;
    
    var self = this, uiController = null;
    
    self.initialise = function (controller) {
        uiController = controller;
        window.addEventListener("devicemotion", handleMotion);
    };
    
    function handleMotion(event) {
        
        //getting the accelerometer data
        var aX = event.accelerationIncludingGravity.x;
        var aY = event.accelerationIncludingGravity.y;
        var aZ = event.accelerationIncludingGravity.z;
        
        var pitch = (Math.atan(-aY / aZ) * 180) / Math.PI; //y axis
        if(pitch > heightLimit)
            pitch = heightLimit;
        else if (pitch < -heightLimit)
            pitch = -heightLimit
        
        var roll = (Math.atan(aX / Math.sqrt(Math.pow(aY, 2) + Math.pow(aZ, 2))) * 180) / Math.PI; //x axis
        if (roll > widthLimit)
            roll = widthLimit;
        else if (roll < -widthLimit)
            roll = -widthLimit
        
        rollBuffer = newBuffer(rollBuffer, roll);
        pitchBuffer = newBuffer(pitchBuffer, pitch);
        
        //taking average or median
        //var smoothRoll = movingAverage(rollBuffer), smoothPitch = movingAverage(pitchBuffer);
        var smoothRoll = movingMedian(rollBuffer), smoothPitch = movingMedian(pitchBuffer);
        
        //moving the bubble
        uiController.bubbleTranslate(smoothRoll * rollLimitFactor, smoothPitch * pitchLimitFactor, "dark-bubble");
        
        //freeze button
        self.freezeClick = function() {
        uiController.bubbleTranslate(smoothRoll * rollLimitFactor, smoothPitch * pitchLimitFactor, "pale-bubble");
        }
        
        //displaying angle
        var target = document.getElementById("message-area");
        var xRound = Math.round(smoothRoll);
        var yRound = Math.round(-smoothPitch);
        var zRound = Math.round(Math.pow(Math.pow(smoothRoll, 2) + Math.pow(smoothPitch, 2), 1/2));
        target.innerHTML = displayAngle(xRound, yRound, zRound);
    }
    
    function newBuffer(buffer, newValue) {
        //moves all data one spot forward and puts the new value in the back
        for (var i = 1; i<buffer.length; i++) {
        var temp = buffer;

        temp[i-1] = buffer[i];
        }
        temp[buffer.length-1] = newValue;
        buffer = temp;

        return buffer;
    }
    
    function movingAverage(buffer) {
        //takes the average of the input array
        var sum = 0;
        for (var i = 0; i<buffer.length; i++) {
            sum += buffer[i];
        }
        var average = sum / buffer.length;
        return average;
    }

    function movingMedian(buffer) {
        //takes the median of the input array
        //var median = 
        
        var sortedBuffer = buffer.sort();
        var median = buffer[Math.round(buffer.length/2)];
        console.log(median);
        
        return median;
    }
    
    function displayAngle(x,y,z) {
        //creates a display string
        var displayString = "x: " + x + " y: " + y + " z: " + z;
        return displayString;
    }
}