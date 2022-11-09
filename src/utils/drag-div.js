let targetElement = undefined;
let downX = 0,
  downY = 0,
  left = 0,
  top = 0;

document.addEventListener("mouseleave", () => {
  targetElement = undefined;
});

document.addEventListener("mousemove", (e) => {
  if (targetElement) {
    targetElement.style.cursor = "move";
    const xBias = e.x - downX;
    const yBias = e.y - downY;
    targetElement.style.left = left + xBias + "px";
    targetElement.style.top = top + yBias + "px";
  }
});

/**
 * @param element {HTMLElement}
 */
export function enableDrag(element) {
  element.style.position = "fixed";
  const prevCursor = element.style.cursor;
  element.addEventListener("mousedown", (e) => {
    downX = e.x;
    downY = e.y;
    const size = element.getBoundingClientRect();
    left = size.left;
    top = size.top;
    targetElement = element;
  });
  element.addEventListener("mouseup", () => {
    targetElement = undefined;
    element.style.cursor = prevCursor;
  });
}
