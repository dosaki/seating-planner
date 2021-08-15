export const coordInRectangle = (coord, rect) => {
    return rect.x <= coord.x && coord.x <= rect.x + rect.width && rect.y <= coord.y && coord.y <= rect.y + rect.height;
};