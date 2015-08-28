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
    
    // these two lines make an array of zeros to a certain length (I don't understand it)
    var pitchBuffer = Array.apply(null, Array(25)).map(Number.prototype.valueOf, 0);
    var rollBuffer = Array.apply(null, Array(25)).map(Number.prototype.valueOf, 0);
    
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
        
        var pitch = (Math.atan(-aY / aZ) * 180) / Math.PI;
        var roll = (Math.atan(aX / Math.sqrt(Math.pow(aY, 2) + Math.pow(aZ, 2))) * 180) / Math.PI;
        
        rollBuffer = newBuffer(rollBuffer, roll);
        pitchBuffer = newBuffer(pitchBuffer, pitch);
        
        var rollAverage = movingAverage(rollBuffer);
        var pitchAverage = movingAverage(pitchBuffer);
        
        //moving the bubble
        uiController.bubbleTranslate(rollAverage * 2, pitchAverage * 2, "dark-bubble");
        
        
        // displaying angle
        var target = document.getElementById("message-area");
        var xDisplay = Math.round(rollAverage);
        var yDisplay = Math.round(-1*pitchAverage);
        var zDisplay = 0; // what is the calculation here?
        target.innerHTML = displayAngle(xDisplay, yDisplay, zDisplay);
        
        //moving and freezing the pale bubble when freeze button is pressed
        self.freezeClick = function() {
        uiController.bubbleTranslate(rollAverage * 2, pitchAverage * 2, "pale-bubble");
        }
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

    function displayAngle(x,y,z) {
        //creates a display string
        var displayString = "x: " + x + " y: " + y + " z: " + z;
        return displayString;
    }


    function movingMedian(buffer, newValue)
    {
      // ADVANCED FUNCTIONALITY
      // =================================================================
      // This function handles the Moving Median Filter
      // Input:
      //      buffer
      //      The buffer in which the function will apply the moving to.

      //      newValue
      //      This should be the newest value that will be pushed into the buffer

      // Output: filteredValue
      //      This function should return the result of the moving average filter
    }
}