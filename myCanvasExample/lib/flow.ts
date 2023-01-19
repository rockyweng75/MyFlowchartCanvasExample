import IItem from './iitem'
import ConnectLine from './connectLine'
import Rect from './rect'
import Diamond from './diamond'
import Trapezoidal from './Trapezoidal'
import Round from './Round'
import Ellipse from './Ellipse'
import Terminator from './Terminator'

export default class FlowCanvas {
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

    constructor(canvas : HTMLCanvasElement){
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
        // set a flag indicating the drag has begun
        console.log('mouseDown', this.startX, this.startY);
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
                } else if(this.isDown && item.isInside(this.startX, this.startY)){
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

    print() : Promise<void> {
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

    clear() : Promise<void>{
        return new Promise<void>((resolve)=>{
            this.ctx!.clearRect(0, 0, this.canvas.width, this.canvas.height);
            resolve();
        });
    }

    isOverSide(mouseX, mouseY, objWidth, objHeight): boolean{
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
                    if(item.isOverlapping(x, y, width, height)){
                        y += item.height + 10;
                        if(this.isOverSide(x, y, width, height)){
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

    createConnectLine(node1, node2) : Promise<ConnectLine>{
        return new Promise((resolve)=>{
            let connectLine = new ConnectLine(this.ctx, node1, node2, 1);
            this.connectLines.push(connectLine)
            resolve(connectLine)
        });
    }
} 



