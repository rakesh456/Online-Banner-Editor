/**
 * Drag.js: drag absolutely positioned HTML elements
 * 
 * This module defines a single drag() function that is designed to be called from an onmousedown event handler. Subsequent events will move *  
 * the specified element. A mouseup event will terminate the drag. This implementation works with both the standard and IE event models. It requires
 * the getScrollOffsets() function defined elsewhere.
 * 
 * Arguments:
 * 
 * 	elementToDrag: the element that received the mousedown event or some containing element. It must be absolutely positioned. Its style.left
 * 		style.top values will be changed on the user's drag.
 * 	
 * 	event: the Event object for the mousedown event.
 *  
 *  Based on code by David Flanagan in his book JavaScript The Definitive Guide Sixth Edition, Example 17-2
 **/
function drag(elementToDrag, event, correction) {
	// The initial mouse position, converted to document coordinates
	var correction = correction | 0;
	var scroll = getScrollOffsets();		// A utility function from elsewhere
	var startX = event.clientX + scroll.x;
	var startY = event.clientY + scroll.y;
	
	// The original position (in document coordinates) of the element that is going to be dragged. Since elementToDrag is absolutely positioned, 
	// we assume that its offsetParent is the document body.
	var origX = elementToDrag.offsetLeft;
	var origY = elementToDrag.offsetTop;
	
	// Compute the distance between the mouse down event and the upper-left corner of the element. We'll maintain this distance as the mouse moves.
	var deltaX = startX - origX;
	var deltaY = startY - origY + correction;
	
	elementToDrag.style.border = "1px dashed gray";
	// Register the event handlers that will respond to the mousemove events
	// and the mouseup event that follow this mousedown event.
	if (document.addEventListener) {		// Standard event model
		// Register capturing event handlers on the document
		document.addEventListener("mousemove", moveHandler, true);
		document.addEventListener("mouseup", upHandler, true);		
	}
	else if (document.attachEvent) {	// IE Event Model for IE5-8
		// In the IE event model, we capture events by calling setCapture() on the element to capture them.
		elementToDrag.setCapture();
		elementToDrag.attachEvent("onmousemove", moveHandler);
		elementToDrag.attachEvent("onmouseup", upHandler);
		// Treat loss of mouse capture as a mouseup event.
		elementToDrag.attachEvent("onlosecapture", upHandler);
	}
	
	// We've handled this event. Don't let anyone else see it.
	if (event.stopPropogation) event.stopPropogation();		// Standard model
	else event.cancelBubble = true;							// IE
	
	// Now prevent any default action.
	if (event.preventDefault) event.preventDefault();		// Standard model
	else event.returnValue = false;							// IE
	
	/**
	 * This is the handler that captures mousemove events when an element is being dragged. It is responsible for moving the element.
	 **/
	function moveHandler(e) {
		if (!e) e = window.event;		// IE event model
		
		// Move the element to the current mouse position, adjusted by the position of the scrollbars and the offset of the initial click.
		var scroll = getScrollOffsets();
		elementToDrag.style.left = (e.clientX + scroll.x - deltaX) + "px";
		elementToDrag.style.top = (e.clientY + scroll.y - deltaY) + "px";
		
		// And don't let anyone else see this event.
		if (e.stopPropogation) e.StopPropogation();		// Standard
		else e.cancelBubble = true;						// IE
	}
	
	/**
	 * This is the handler that captures the final mouseup event that occurs at the end of a drag.
	 **/
	function upHandler(e) {
		if (!e) e = window.event;		// IE event model
		
		// Unregister the capturing event handlers.
		if (document.removeEventListener) {		// DOM event model
			document.removeEventListener("mouseup", upHandler, true);
			document.removeEventListener("mousemove", moveHandler, true);
		}
		else if (document.detachEvent) {		// IE 5+ Event model
			elementToDrag.detachEvent("onlosecapture", upHandler);
			elementToDrag.detachEvent("onmouseup", upHandler);
			elementToDrag.detachEvent("onmousemove", moveHandler);
			elementToDrag.releaseCapture();
		}
		
		// And don't let the event propagate any further.
		if (e.stopPropagation) e.stopPropagation();		// Standard Model
		else e.cancelBubble = true;
		
		elementToDrag.style.border = "";
	}
}	