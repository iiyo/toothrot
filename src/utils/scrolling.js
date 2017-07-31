
var getAbsoluteRect = require("./getAbsoluteRect");

function getScrollX() {
    return (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0);
}

function getScrollY() {
    return (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0);
}

function scrollToBottom(element, instantly) {
    if (instantly) {
        element.scroll(0, element.scrollHeight);
    }
    else {
        element.scroll({
            top: element.scrollHeight,
            left: 0,
            behavior: "smooth"
        });
    }
}

function scrollToElement(element) {
    
    if (isElementInView(element)) {
        return;
    }
    
    try {
        element.scrollIntoView({
            behavior: "smooth"
        });
    }
    catch (error) {
        console.error(error);
    }
}

function isElementInView(element) {
    
    var rect = getAbsoluteRect(element);
    var scrollX = getScrollX();
    var scrollY = getScrollY();
    var xInView = (scrollX <= rect.left) && (rect.left <= (scrollX + window.innerWidth));
    var yInView = (scrollY <= rect.top) && (rect.top <= (scrollY + window.innerHeight));
    
    return (xInView && yInView);
}

module.exports = {
    getX: getScrollX,
    getY: getScrollY,
    scrollToBottom: scrollToBottom,
    scrollToElement: scrollToElement,
    isElementInView: isElementInView
};
