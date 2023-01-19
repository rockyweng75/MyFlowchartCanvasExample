import Item from "./item";

export default class Diamond implements Item{

    ctx : CanvasRenderingContext2D | null;
    x: number;
    y: number;
    width : number;
    height : number;
    text: string;
    id: string | number;

    constructor(ctx, id, x, y, width, height){
        this.ctx = ctx;
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    print(){
        this.ctx!.beginPath();
        this.ctx!.moveTo(this.x + this.width / 2, this.y);
        this.ctx!.lineTo(this.x, this.y + this.height / 2);
        this.ctx!.lineTo(this.x + this.width / 2, this.y + this.height);
        this.ctx!.lineTo(this.x + this.width, this.y + this.height / 2);
        this.ctx!.lineTo(this.x + this.width / 2, this.y);
        this.ctx?.stroke();

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

        if( mouseY < this.y + this.height / 2 
            && mouseY - this.y >= 0
            && mouseX >= this.x + this.width / 2 - (mouseY - this.y)
            && mouseX <= this.x + this.width / 2 + (mouseY - this.y)
        ) {
            return true
        } 

        if( mouseY > this.y + this.height / 2 
            && mouseY - this.y >= 0
            && mouseX >= this.x + (mouseY - this.y - this.height / 2)
            && mouseX <= this.x + this.width - (mouseY - this.y - this.height / 2)
        ) {
            return true
        } 

        if(mouseY === this.y + this.height / 2 
            && mouseX >= this.x
            && mouseX <= this.x + this.width)
        {
            return true
        } 
        return false
    }

    isOverlapping(x, y, width, height){
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

    move (newX, newY)
    {
        this.x = newX;
        this.y = newY;
    }

    resize (newWidth, newHeight)
    {
        this.width = newWidth;
        this.height = newHeight;
    }
}