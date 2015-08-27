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


// these two lines make an array of zeros to a certain length (I don't understand it)
var pitchBuffer = Array.apply(null, Array(50)).map(Number.prototype.valueOf, 0);
var rollBuffer = Array.apply(null, Array(50)).map(Number.prototype.valueOf, 0);

function SpiritLevelProcessor()
{
    var self = this;
    var uiController = null;

    self.initialise = function(controller)
    {
        uiController = controller;

        window.addEventListener("devicemotion", handleMotion);
    }

    function handleMotion(event)
    {
        var aX = event.accelerationIncludingGravity.x;
        var aY = event.accelerationIncludingGravity.y;
        var aZ = event.accelerationIncludingGravity.z;

        var pitch = (Math.atan(-aY / aZ) * 180) / Math.PI;
        var pitchAverage;
        var pitchObject = movingAverage(pitchBuffer, pitch);
        
        var roll = (Math.atan(aX / Math.sqrt(Math.pow(aY,2) + Math.pow(aZ,2))) * 180) / Math.PI;
        var rollAverage;
        var rollObject = movingAverage(rollBuffer, roll);

        var motion = uiController.bubbleTranslate(rollObject.average,pitchObject.average, "dark-bubble");
    }

        function movingAverage(buffer, newValue)
        {
            var temp = buffer;
            for(var i = 0; i<buffer.length; i++){
                temp[i+1] = buffer[i];
            }
            temp[0] = newValue;

            //console.log(pitchBuffer);
            buffer = temp.slice(0, buffer.length);

            var sum = 0;
            for(var i = 0; i<buffer.length; i++){

                sum += buffer[i];
            }
            var average = sum / buffer.length;

                return {average : average, buffer : buffer};
        }

    function displayAngle(x,y,z)
    {
        // This function will handle the calculation of the angle from the z-axis and
        // display it on the screen inside a "div" tag with the id of "message-area"

        // Input: x,y,z
        //      These values should be the filtered values after the Moving Average for
        //      each of the axes respectively
    }

    self.freezeClick = function()
    {
        // ADVANCED FUNCTIONALITY
        // ================================================================
        // This function will trigger when the "Freeze" button is pressed
        // The ID of the button is "freeze-button"
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