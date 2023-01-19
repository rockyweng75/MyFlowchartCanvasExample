import Item from "./item";
export default class Ellipse extends Item{
    triangleAngle: number;
    triangleWidth: number;
    a: number;
    b: number;
    constructor(ctx, id, x, y, width, height){
        super(ctx, id, x, y, width, height)
        this.triangleAngle = 5;
        let r = this.height / Math.sin(this.triangleAngle);
        this.triangleWidth = r * Math.cos(this.triangleAngle) * -1;
        this.a = width;
        this.b = Math.abs(height / 2);
    }
    print(){

        // this.ctx!.arc(this.x  + this.width / 2, this.y + this.height/ 2, this.width /2, 0, 2 * Math.PI);
        this.a = this.width/2;
        this.b = this.height/3;

        this.bezierEllipsel(this.x + this.width/2 , this.y + this.height/ 2, this.a, this.b);

        if(this.text){
            this.ctx!.font = "14px Arial";
            this.ctx!.textAlign = "center";
            this.ctx!.fillText(this.text, this.x + this.width / 3, this.y + this.height/3)
        }
    }

    scaleEllipsel(ratioX: number, ratioY: number){
        this.ctx!.beginPath();
        this.ctx!.save();//儲存初始座標系
        let r = this.width / 2;
        // let ratioX = r / r;
        // let ratioY = (r/1.5) / r;
        this.ctx!.scale(ratioX, ratioY);
        this.ctx!.arc((this.x  + this.width / 2) / ratioX, (this.y + this.height/ 2) / ratioY, r, 0, 2 * Math.PI, false);
        this.ctx!.closePath();
        this.ctx!.restore(); //恢復初始座標系
        this.ctx?.stroke();
    }

    bezierEllipsel(x: number, y: number, a: number, b: number){
        let ox = 0.5 * a, oy = 0.6 * b;
        this.ctx!.save();
        this.ctx!.translate(x, y);
        this.ctx!.beginPath();
        this.ctx!.moveTo(0, b);
        this.ctx!.bezierCurveTo(ox, b, a, oy, a, 0);
        this.ctx!.bezierCurveTo(a, -oy, ox, -b, 0, -b);
        this.ctx!.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
        this.ctx!.bezierCurveTo(-a, oy, -ox, b, 0, b);
        this.ctx!.closePath();
        this.ctx!.stroke();
        this.ctx!.restore();
    }

    // paramEllipse(x,y,a,b){
    //     let step = (a > b) ? 1 / a: 1 / b;
    //     for(var i = 0 ; i < 2 * Math.PI; i += step){
    //         let _x = x + a * Math.cos(i);
    //         let _y = y + b * Math.sin(i);
    //     }
    // }

    isInside (mouseX: number, mouseY: number){

        let h = this.x + this.width / 2;
        let k = this.y + this.height / 2;
        if(
            Math.pow(mouseX - h, 2) / Math.pow(this.a, 2) + Math.pow(mouseY - k, 2) / Math.pow(this.b, 2)  <= 1
        ){
            return true;
        }
        
        return false
    }
}
