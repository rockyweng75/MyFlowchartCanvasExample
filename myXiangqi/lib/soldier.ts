import Piece from './piece'
import MovePoint from './movepoint';
import Coordinate from './coordinate'
export default class Soldier extends Piece {
    constructor(
        ctx: CanvasRenderingContext2D, 
        id: number | string, 
        coordinate: Coordinate,
        width: number, 
        height: number,
        faction: string 
    ){
        super(ctx, id, coordinate, width, height, faction)
        this.text = this.faction === "black" ? '卒': '兵';
    }

    initMovePoint() : MovePoint[]{
        let movePoints = []
        // 左移
        let left = this.coordinate.clone(-1, 0);
        if(left !== null){
            movePoints.push(new MovePoint(this.ctx, left, this.width, this.height));
        }

        let top = this.coordinate.clone(0, -1);
        if(top !== null){
            movePoints.push(new MovePoint(this.ctx, top, this.width, this.height));
        }

        let bottom = this.coordinate.clone(0, 1);
        if(bottom !== null){
            movePoints.push(new MovePoint(this.ctx, bottom, this.width, this.height));
        }

        let rigth = this.coordinate.clone(1, 0);
        if(rigth !== null){
            movePoints.push(new MovePoint(this.ctx, rigth, this.width, this.height));
        }
        return movePoints;
    }
}