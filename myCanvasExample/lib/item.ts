import IItem from "./iitem";

export default abstract class Item implements IItem{
    ctx : CanvasRenderingContext2D | null;
    x: number;
    y: number;
    width : number;
    height : number;
    text: string;
    id: string | number;
    strokeStyle: string = "#0047b3";
    constructor(
        ctx: CanvasRenderingContext2D, 
        id: number | string, 
        x: number, 
        y: number, 
        width: number, 
        height: number
    ){
        this.ctx = ctx;
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    isOverlapping(x: number, y: number, width: number, height: number) : boolean{
        if( this.x <= x 
            && x <= (this.x + this.width) 
            && this.y <= y 
            && y <= (this.y + this.height)
            && this.x <= x + width
            && x + width <= (this.x + this.width) 
            && this.y <= y + height
            && y + height <= (this.y + this.height) 
                ) {
            return true;
        }
        return false;
    }

    abstract print()

    abstract isInside(mouseX: number, mouseY: number);

    move (newX: number, newY: number)
    {
        this.x = newX;
        this.y = newY;
    }

    resize (newWidth: number, newHeight: number)
    {
        this.width = newWidth;
        this.height = newHeight;
    }
}
