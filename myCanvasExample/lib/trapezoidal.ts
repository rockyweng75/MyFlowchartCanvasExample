import Item from "./item";
export default class Trapezoidal extends Item {

    triangleAngle: number;
    triangleWidth: number;
    constructor(ctx, id, x, y, width, height){
        super(ctx, id, x, y, width, height)
        this.triangleAngle = 5;
        let r = this.height / Math.sin(this.triangleAngle);
        this.triangleWidth = r * Math.cos(this.triangleAngle) * -1;
    }
    print(){
        this.ctx!.beginPath();
        this.ctx!.moveTo(this.x + this.triangleWidth, this.y);
        this.ctx!.lineTo(this.x, this.y + this.height);
        this.ctx!.lineTo(this.x + this.width - this.triangleWidth, this.y + this.height);
        this.ctx!.lineTo(this.x + this.width, this.y);
        this.ctx!.lineTo(this.x + this.triangleWidth, this.y);
        this.ctx?.stroke();

        if(this.text){
            this.ctx!.font = "14px Arial";
            this.ctx!.textAlign = "center";
            this.ctx!.fillText(this.text, this.x + this.width / 3, this.y + this.height/3)
        }
    }

    isInside (mouseX, mouseY){
        if(this.y <= mouseY && mouseY <= (this.y + this.height))
        {
        } else {
            return false;
        }
        let r = (this.height - (mouseY - this.y)) / Math.sin(this.triangleAngle);
        let triangleWidth = r * Math.cos(this.triangleAngle) * -1;
        if( mouseX >= this.x + triangleWidth 
            && mouseX <= this.x + this.width - triangleWidth
        ) {
            return true
        } 
        return false
    }
}