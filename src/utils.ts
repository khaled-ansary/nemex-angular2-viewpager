import { PointerPosition } from './pointer_position';

export const isMouseInBounds = function (event: Event, el: HTMLElement, leaveRadius: number, document: Document) {
  var pointerPosition = getPointerPosition(event);
  var mouseX = document.body.scrollLeft + pointerPosition.x;
  var mouseY = document.body.scrollTop + pointerPosition.y;

  var elementX = el.offsetLeft;
  var elementWidth = el.offsetWidth;
  var elementY = el.offsetTop;
  var elementHeight = el.offsetHeight;

  return mouseX >= (elementX - leaveRadius) &&
    mouseX <= (elementX + elementWidth + leaveRadius) &&
    mouseY >= (elementY - leaveRadius) &&
    mouseY <= (elementY + elementHeight + leaveRadius);
};

export const getPointerPosition = function (event: Event): PointerPosition {
  if (event instanceof MouseEvent)
    return new PointerPosition(event.clientX, event.clientY);
  else if (event instanceof TouchEvent)
    return new PointerPosition(event.touches[0].clientX, event.touches[0].clientY);
}