
export default interface IItem {

    ctx : CanvasRenderingContext2D | null;
    x: number;
    y: number;
    width : number;
    height : number;
    text: string;
    id: string | number;

    isInside (mouseX, mouseY)

    move (newX, newY)

    resize (newWidth, newHeight)

    print()

    isOverlapping(x, y, width, height)
}