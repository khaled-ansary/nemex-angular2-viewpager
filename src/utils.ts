export const isMouseInBounds = function(event:Event, el:HTMLElement, leaveRadius:number, document:Document) {
    var pointerX = 0;
    var pointerY = 0;

    if (event instanceof MouseEvent) {
      pointerX = event.clientX;
      pointerY = event.clientY;
    }
    else if (event instanceof TouchEvent) {
      pointerX = event.touches[0].clientX;
      pointerY = event.touches[0].clientY;
    }

    var mouseX = document.body.scrollLeft + pointerX;
    var mouseY = document.body.scrollTop + pointerY;
  
    var elementX = el.offsetLeft;
    var elementWidth = el.offsetWidth;
    var elementY = el.offsetTop;
    var elementHeight = el.offsetHeight;
  
    return mouseX >= (elementX - leaveRadius) &&
          mouseX <= (elementX + elementWidth + leaveRadius) &&
          mouseY >= (elementY - leaveRadius) &&
          mouseY <= (elementY + elementHeight + leaveRadius);
  };