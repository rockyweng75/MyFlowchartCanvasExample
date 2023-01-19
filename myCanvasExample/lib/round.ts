
import Item from "./item";
export default class Round extends Item{
    triangleAngle: number;
    triangleWidth: number;
    constructor(
        ctx: CanvasRenderingContext2D, 
        id: number | string, 
        x: number, 
        y: number, 
        width: number, 
        height: number
    ){
        super(ctx, id, x, y, width, height);
        this.triangleAngle = 5;
        let r = this.height / Math.sin(this.triangleAngle);
        this.triangleWidth = r * Math.cos(this.triangleAngle) * -1;
    }

    print(){

        this.ctx!.beginPath();
        this.ctx!.arc(this.x  + this.width / 2, this.y + this.height/ 2, this.width /2, 0, 2 * Math.PI);

        this.ctx?.stroke();

        if(this.text){
            this.ctx!.font = "14px Arial";
            this.ctx!.textAlign = "center";
            this.ctx!.fillText(this.text, this.x + this.width / 3, this.y + this.height/3)
        }
    }
 
    isInside (mouseX, mouseY){
        let h = this.x + this.width / 2;
        let k = this.y + this.height / 2;
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