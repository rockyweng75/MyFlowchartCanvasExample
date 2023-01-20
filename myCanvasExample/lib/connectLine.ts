import IItem from "./iitem";

export default class ConnectLine{
    ctx : CanvasRenderingContext2D | null;
    node1 : IItem;
    node2 : IItem;
    width : number;
    strokeStyle: string = "#000000";
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
