import Item from "./item";

export default class Rect extends Item {

    constructor(ctx, id, x, y, width, height){
        super(ctx, id, x, y, width, height);
    }

    isInside (mouseX, mouseY)
    {
        if( this.x <= mouseX && mouseX <= (this.x + this.width) 
            && this.y <= mouseY && mouseY <= (this.y + this.height)
                ) {
            return true;
        }
        else return false;
    }

    print(){
        this.ctx!.beginPath();
        this.ctx!.strokeRect(this.x, this.y, this.width, this.height);
        if(this.text){
            this.ctx!.font = "14px Arial";
            this.ctx!.textAlign = "center";
            this.ctx!.fillText(this.text, this.x + 14, this.y + 14)
        }
    }
}
