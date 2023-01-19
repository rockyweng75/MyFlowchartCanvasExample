import Item from "./item";
export default class Terminator extends Item {
    a: number;
    b: number;
    constructor(
        ctx: CanvasRenderingContext2D, 
        id: number | string, 
        x: number, 
        y: number, 
        width: number, 
        height: number
    ){
        super(ctx, id, x, y, width, height);
        this.a = this.width/ 3
        this.b = this.height / 2;
    }

    print() {

        let a = this.width/ 3 ;
        let b = this.height / 2;
        let ox = 0.5 * a, oy = 0.6 * b;

        // this.ctx.moveTo(this.width / 3, 0);
        // this.ctx.lineTo(this.width - this.width / 3, 0)
        this.ctx!.save();
        this.ctx!.translate(this.x + this.width /2 + ox, this.y + this.height/2);
        this.ctx!.beginPath();

        this.ctx!.moveTo(0, b);
        this.ctx!.bezierCurveTo(ox, b, a, oy, a, 0);
        this.ctx!.bezierCurveTo(a, -oy, ox, -b, 0, -b);

        this.ctx!.lineTo(Math.ceil(-this.width/3), -b);
        this.ctx!.bezierCurveTo(-ox-Math.ceil(this.width/3), -b, -a-Math.ceil(this.width/3) , -oy, -a-Math.ceil(this.width/3), 0);
        this.ctx!.bezierCurveTo(-a-Math.ceil(this.width/3), oy, -ox-Math.ceil(this.width/3), b, -Math.ceil(this.width/3), b);
        this.ctx!.closePath();
        this.ctx!.stroke();
        this.ctx!.restore();

        this.ctx!.stroke();

        // this.ctx.
        
    }
    isInside(mouseX: number, mouseY: number): boolean {
        // 圓點座標
        let h = this.x + this.width / 2;
        let k = this.y + this.height / 2;
        let h1 = h - Math.ceil(this.width / 3); 
        let h2 = h + Math.ceil(this.width / 3);
        let ox = 0.5 * this.width/ 3;
        if(
            Math.pow(mouseX - h1, 2) / Math.pow(this.b, 2) + Math.pow(mouseY - k, 2) / Math.pow(this.a, 2)  <= 1
            || Math.pow(mouseX - h2, 2) / Math.pow(this.b, 2) + Math.pow(mouseY - k, 2) / Math.pow(this.a, 2)  <= 1
            || ( mouseX >= this.x - Math.floor(ox) + Math.ceil(this.width / 3) && mouseX <= this.x + this.width + Math.floor(ox) - Math.ceil(this.width / 3))
                && ( mouseY >= this.y && mouseY <= this.y + this.height )
        ){
            return true;
        }

        return false;
    } 
}

