import Coordinate from './coordinate'
import IItem from './iItem';
export default class MovePoint implements IItem{
    triangleAngle : number = 5;
    triangleWidth : number = 0;
    ctx: CanvasRenderingContext2D;
    cid: string;
    coordinate: Coordinate;
    x: number;
    y: number; 
    width: number; 
    height: number;
    strokeStyle: string = "#000000";
    backgroundColor = "#ffffff";    
    text: string = "";
    id: string | number = Date.now().toFixed();
    isFocus: boolean = false;

    constructor(        
        ctx: CanvasRenderingContext2D,
        coordinate: Coordinate,
        width: number,
        height: number,
        ){
        this.ctx = ctx;
        this.coordinate = coordinate;
        this.cid = coordinate.cid;
        this.x = coordinate.x;
        this.y = coordinate.y;
        this.width = width;
        this.height = height;
    }

    move(coordinate: Coordinate): void {
        throw new Error('Method not implemented.');
    }
    resize(newWidth: number, newHeight: number): void {
        throw new Error('Method not implemented.');
    }
    isOverlapping(x: number, y: number, width: number, height: number): boolean {
        throw new Error('Method not implemented.');
    }
    focus(bool: boolean): MovePoint[] {
        throw new Error('Method not implemented.');
    }

    print(){

        this.ctx.save();
        this.ctx.translate(this.x, this.y)
        this.ctx!.beginPath();
        this.ctx!.arc(0, 0, this.width /2, 0, 2 * Math.PI);
        this.ctx!.lineWidth = 5

        this.ctx!.strokeStyle = "black";
        this.ctx?.stroke();

        this.ctx!.fillStyle = "gainsboro";

        this.ctx!.fill();
        this.ctx!.restore();
    }

    isInside (mouseX: number, mouseY: number) : boolean {
        
        let h = this.x;
        let k = this.y;

        let r = this.width / 2;
        if(
            Math.pow(mouseX, 2) + Math.pow(mouseY, 2) - (2 * h * mouseX) - (2 * k * mouseY) + Math.pow(h, 2) + Math.pow(k, 2) - Math.pow(r, 2) <= 0
            && Math.pow(-2 * h, 2) + Math.pow( -2 * k, 2) - 4 * ( Math.pow(h, 2) + Math.pow(k, 2) - Math.pow(r, 2)) > 0
        ){
            return true;
        }
        return false
    }


}