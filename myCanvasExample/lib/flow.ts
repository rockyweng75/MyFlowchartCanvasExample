export class FlowCanvas {
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D | null;
    width : number;
    height : number;
    startX : number;
    startY : number;
    offsetX : number;
    offsetY : number;
    isDown = false;
    isDrop = false;
    dropItem : IItem | null = null;
    nodes :IItem[] = [] ;
    connectLines : ConnectLine[] = [];
    points = [];
    scrollX: number;
    scrollY: number;

    constructor(canvas){
        this.width = canvas.width;
        this.height = canvas.height;
        this.canvas = canvas;

        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
            this.offsetX = this.canvas.offsetLeft;
            this.offsetY = this.canvas.offsetTop;
            this.scrollX = window.scrollX;
            this.scrollY = window.scrollY;


            this.canvas.onresize = e => this.handleResize(e);
            this.canvas.onscroll = e => this.handleResize(e);

            this.canvas.onmousedown = e => this.handleMouseDown(e);
            this.canvas.onmousemove = e => this.handleMouseMove(e);
            this.canvas.onmouseup = e => this.handleMouseUp(e);
            this.canvas.onmouseout = e => this.handleMouseOut(e);
        } else {
            alert('error')
        }
    }

    handleResize(e){
        e.preventDefault();
        e.stopPropagation();
        this.offsetX = this.canvas.offsetLeft;
        this.offsetY = this.canvas.offsetTop;
        this.scrollX = window.scrollX;
        this.scrollY = window.scrollY;
    }

    handleScroll(e){
        e.preventDefault();
        e.stopPropagation();
        this.scrollX = window.scrollX;
        this.scrollY = window.scrollY;
    }

    handleMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();
    
        // save the starting x/y of the rectangle
        this.startX = e.clientX - this.offsetX + this.scrollX;
        this.startY = e.clientY - this.offsetY + this.scrollY;
        console.log(e);
        console.log(e.clientY, this.offsetY, this.startY);
        // set a flag indicating the drag has begun
        this.isDown = true;
    }
    
    handleMouseUp(e) {
        e.preventDefault();
        e.stopPropagation();
    
        // the drag is over, clear the dragging flag
        this.isDown = false;
    }
    
    handleMouseOut(e) {
        e.preventDefault();
        e.stopPropagation();
    
        // the drag is over, clear the dragging flag
        this.isDown = false;
    }
    
    async handleMouseMove (e) {
        e.preventDefault();
        e.stopPropagation();
        // // if we're not dragging, just return
        // if (!this.isDown) {
        //     return;
        // }
    
        // get the current mouse position
        let mouseX = e.clientX - this.offsetX + this.scrollX;
        let mouseY = e.clientY - this.offsetY + this.scrollY;
        let isReload = false 
        if(this.nodes){
            this.nodes.forEach(async (item) =>{
                // 拖曳
                if( this.isDown && this.isDrop ){
                    isReload = true;
                } else if(this.isDown && item.isSlideIn(this.startX, this.startY)){
                    this.dropItem = item 
                    this.isDrop = true;
                } else {
                    this.isDrop = false;
                }              
            })
        }

        if(isReload){
            if(!this.isOverSide(mouseX, mouseY, this.dropItem!.width, this.dropItem!.height))
            {
                this.dropItem!.move(mouseX, mouseY);
                await this.clear();
                await this.print();       
            }
        }
    }

    print(){
        return new Promise<void>((resolve)=>{
            if(this.nodes) 
                this.nodes
                    .forEach(item=> item.print());

            if(this.connectLines) 
                this.connectLines
                    .forEach(item=> item.print());

            resolve();
        });
    }

    clear(){
        return new Promise<void>((resolve)=>{
            this.ctx!.clearRect(0, 0, this.canvas.width, this.canvas.height);
            resolve();
        });
    }

    
    // resize(ratioX, ratioY){
        
    //     this.clear();

    //     this.canvas.width
    //     this.nodes.forEach(item =>{
    //         console.log(item.x,  Math.floor(item.x * ratioX))
    //         item.x = Math.floor(item.x * ratioX);
    //         item.y = Math.floor(item.y * ratioY);
    //         item.width = Math.floor(item.width * ratioX);
    //         item.height = Math.floor(item.height * ratioX);
    //     })

    // }

    isOverSide(mouseX, mouseY, objWidth, objHeight){
        if(mouseX < 0 || mouseY < 0){
            return true;
        } else if(mouseX + objWidth > this.width){
            return true;
        }
        else if(mouseY + objHeight > this.height){
            return true;
        } else {
            return false;
        }
    }

    createNode(type: string) : Promise<IItem>{
        return new Promise((resolve)=>{
            let x = 15;
            let y = 15;
            let width = 50;
            let height = 50;
            if(this.nodes){
                this.nodes.forEach(item =>{
                    if(item.isExists(x, y, width, height)){
                        y += item.height + 10;
                        if(this.isOverSide(x, y, width, height)){
                            console.log('overside', x, y, item.height + 10, this.canvas.height )
                            this.canvas.height += item.height + 10
                        }
                    }
                })
            }
            let id = Date.now().toFixed();
            let node;
            if(type === 'Diamond')
                node = new Diamond(this.ctx, id, x, y, width, height)
            else if(type === 'Trapezoidal')
                node = new Trapezoidal(this.ctx, id, x, y, width, height)
            else if(type === 'Round')
                node = new Round(this.ctx, id, x, y, width, height)
            else if(type === 'Ellipse')
                node = new Ellipse(this.ctx, id, x, y, width, height)
            else if(type === 'Terminator')
                node = new Terminator(this.ctx, id, x, y, width, height)
            else 
                node = new Rect(this.ctx, id, x, y, width, height)

            this.nodes.push(node);
            resolve(node);
        })
    }

    createConnectLine(node1, node2){
        return new Promise((resolve)=>{
            let connectLine = new ConnectLine(this.ctx, node1, node2, 1);
            this.connectLines.push(connectLine)
            resolve(connectLine)
        });
    }
} 

export interface IItem {

    ctx : CanvasRenderingContext2D | null;
    x: number;
    y: number;
    width : number;
    height : number;
    text: string;
    id: string | number;

    isSlideIn (mouseX, mouseY)

    move (newX, newY)

    resize (newWidth, newHeight)

    print()

    isExists(x, y, width, height)
}



export class Rect implements IItem {
    ctx : CanvasRenderingContext2D | null;
    x: number;
    y: number;
    width : number;
    height : number;
    text: string;
    id: string | number;
    constructor(ctx, id, x, y, width, height){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = id;
    }

    isSlideIn (mouseX, mouseY)
    {
        if( this.x <= mouseX && mouseX <= (this.x + this.width) 
            && this.y <= mouseY && mouseY <= (this.y + this.height)
                ) {
            return true;
        }
        else return false;
    }

    isSlideOut (mouseX, mouseY)
    {
        return !this.isSlideIn(mouseX, mouseY);
    }

    move (newX, newY)
    {
        console.log('move')
        this.x = newX;
        this.y = newY;
    }

    resize (newWidth, newHeight)
    {
        console.log('resize')
        this.width = newWidth;
        this.height = newHeight;
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

    isExists(x, y, width, height){
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
}

export class ConnectLine{
    ctx : CanvasRenderingContext2D | null;
    node1 : IItem;
    node2 : IItem;
    width : number;
    constructor(ctx, node1, node2, width){
        this.ctx = ctx;
        this.node1 = node1;
        this.node2 = node2;
        this.width = width;
    }

    print(){
        this.ctx!.beginPath();
        let node1 = this.node1;
        let node2 = this.node2;
        let top = node1.y <= node2.y ? node1 : node2;
        let bottom = node1.y > node2.y ? node1 : node2;

        this.ctx!.moveTo(top.x + top.width / 2, top.y + top.height);
        this.ctx!.lineTo(bottom.x + bottom.width / 2, bottom.y);
        this.ctx!.stroke();
    }
}

export class Diamond implements IItem{

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

    isSlideIn (mouseX, mouseY){
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

    isExists(x, y, width, height){
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
        console.log('move')
        this.x = newX;
        this.y = newY;
    }

    resize (newWidth, newHeight)
    {
        console.log('resize')
        this.width = newWidth;
        this.height = newHeight;
    }
}

export class Trapezoidal implements IItem {
    ctx : CanvasRenderingContext2D | null;
    x: number;
    y: number;
    width : number;
    height : number;
    text: string;
    id: string | number;
    triangleAngle: number;
    triangleWidth: number;
    constructor(ctx, id, x, y, width, height){
        this.ctx = ctx;
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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

    isSlideIn (mouseX, mouseY){
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

    isExists(x, y, width, height){
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
        console.log('move')
        this.x = newX;
        this.y = newY;
    }

    resize (newWidth, newHeight)
    {
        console.log('resize')
        this.width = newWidth;
        this.height = newHeight;
    }
}

export class Round implements IItem{
    ctx : CanvasRenderingContext2D | null;
    x: number;
    y: number;
    width : number;
    height : number;
    text: string;
    id: string | number;
    triangleAngle: number;
    triangleWidth: number;
    constructor(ctx, id, x, y, width, height){
        this.ctx = ctx;
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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

    isSlideIn (mouseX, mouseY){

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

    isExists(x, y, width, height){
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
        console.log('move')
        this.x = newX;
        this.y = newY;
    }

    resize (newWidth, newHeight)
    {
        console.log('resize')
        this.width = newWidth;
        this.height = newHeight;
    }
}

export class Ellipse implements IItem{
    ctx : CanvasRenderingContext2D | null;
    x: number;
    y: number;
    width : number;
    height : number;
    text: string;
    id: string | number;
    triangleAngle: number;
    triangleWidth: number;
    a: number;
    b: number;
    constructor(ctx, id, x, y, width, height){
        this.ctx = ctx;
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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

    scaleEllipsel(ratioX, ratioY){
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

    bezierEllipsel(x, y, a, b){
        let ox = 0.5 * a, oy = 0.6 * b;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        this.ctx.moveTo(0, b);
        this.ctx.bezierCurveTo(ox, b, a, oy, a, 0);
        this.ctx.bezierCurveTo(a, -oy, ox, -b, 0, -b);
        this.ctx.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
        this.ctx.bezierCurveTo(-a, oy, -ox, b, 0, b);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }

    paramEllipse(x,y,a,b){
        let step = (a > b) ? 1 / a: 1 / b;
        for(var i = 0 ; i < 2 * Math.PI; i += step){
            let _x = x + a * Math.cos(i);
            let _y = y + b * Math.sin(i);
        }
    }

    isSlideIn (mouseX, mouseY){

        let h = this.x + this.width / 2;
        let k = this.y + this.height / 2;
        if(
            Math.pow(mouseX - h, 2) / Math.pow(this.a, 2) + Math.pow(mouseY - k, 2) / Math.pow(this.b, 2)  <= 1
        ){
            
            return true;
        }
        
        return false
    }

    isExists(x, y, width, height){
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
        console.log('move')
        this.x = newX;
        this.y = newY;
    }

    resize (newWidth, newHeight)
    {
        console.log('resize')
        this.width = newWidth;
        this.height = newHeight;
    }
}

export abstract class Item implements IItem{
    ctx : CanvasRenderingContext2D | null;
    x: number;
    y: number;
    width : number;
    height : number;
    text: string;
    id: string | number;
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

    isExists(x: number, y: number, width: number, height: number) : boolean{
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

    abstract isSlideIn(mouseX: number, mouseY: number);

    move (newX: number, newY: number)
    {
        console.log('move')
        this.x = newX;
        this.y = newY;
    }

    resize (newWidth: number, newHeight: number)
    {
        console.log('resize')
        this.width = newWidth;
        this.height = newHeight;
    }
}

export class Terminator extends Item {

    constructor(
        ctx: CanvasRenderingContext2D, 
        id: number | string, 
        x: number, 
        y: number, 
        width: number, 
        height: number
    ){
        super(ctx, id, x, y, width, height);
    }

    print() {

        let a = this.width/ 3 ;
        let b = this.height / 2;
        let ox = 0.5 * a, oy = 0.6 * b;

        // this.ctx.moveTo(this.width / 3, 0);
        // this.ctx.lineTo(this.width - this.width / 3, 0)

        this.ctx.save();
        this.ctx.translate(this.x + this.width /2, this.y + this.height / 2);
        this.ctx.beginPath();

        this.ctx.moveTo(0, b);
        this.ctx.bezierCurveTo(ox, b, a, oy, a, 0);
        this.ctx.bezierCurveTo(a, -oy, ox, -b, 0, -b);

        this.ctx.lineTo(Math.ceil(-this.width/3), -b);
        this.ctx.bezierCurveTo(-ox-Math.ceil(this.width/3), -b, -a-Math.ceil(this.width/3) , -oy, -a-Math.ceil(this.width/3), 0);
        this.ctx.bezierCurveTo(-a-Math.ceil(this.width/3), oy, -ox-Math.ceil(this.width/3), b, -Math.ceil(this.width/3), b);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();

        this.ctx.stroke();

        // this.ctx.
        
    }
    isSlideIn(mouseX: number, mouseY: number): boolean {
        // throw new Error("Method not implemented.");

        return false;
    } 
 
}

