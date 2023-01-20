import Item from "./item";

export default class Triangle extends Item{

    angle: number = 180;

    print(){

        if(this.angle === 180){
            this.ctx!.beginPath();
            this.ctx!.moveTo(this.x + this.width / 2, this.y);
            this.ctx!.lineTo(this.x, this.y + this.height);
            this.ctx!.lineTo(this.x + this.width, this.y + this.height);
            this.ctx!.closePath();
            this.ctx?.stroke();
        }

        if(this.text){
            this.ctx!.font = "14px Arial";
            this.ctx!.textAlign = "center";
            this.ctx!.fillText(this.text, this.x + this.width / 3, this.y + this.height/2)
        }
    }

    isInside (mouseX, mouseY){
        if( this.x <= mouseX && mouseX <= (this.x + this.width) 
            && this.y <= mouseY && mouseY <= (this.y + this.height)
            )
        {
            
        } else {
            return false;
        }

        if( mouseY < this.y + this.height
            && mouseY - this.y >= 0
            && mouseX >= this.x + this.width / 2 - (mouseY - this.y)
            && mouseX <= this.x + this.width / 2 + (mouseY - this.y)
        ) {
            return true
        } 

        // if( mouseY > this.y + this.height / 2 
        //     && mouseY - this.y >= 0
        //     && mouseX >= this.x + (mouseY - this.y - this.height / 2)
        //     && mouseX <= this.x + this.width - (mouseY - this.y - this.height / 2)
        // ) {
        //     return true
        // } 

        if(mouseY === this.y + this.height / 2 
            && mouseX >= this.x
            && mouseX <= this.x + this.width)
        {
            return true
        } 
        return false
    }
}