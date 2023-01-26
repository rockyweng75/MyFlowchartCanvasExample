import Piece from './piece'
import MovePoint from './movepoint';
import Coordinate from './coordinate'
export default class Siang extends Piece {
    constructor(
        ctx: CanvasRenderingContext2D, 
        id: number | string, 
        coordinate: Coordinate,
        width: number, 
        height: number,
        faction: string 
    ){
        super(ctx, id, coordinate, width, height, faction)
        this.text = this.faction === "black" ? '象': '相';
    }

    initMovePoint() : MovePoint[]{
        let movePoints = []
        // 左移
        let leftTop = this.coordinate.clone(-2, -2);
        if(leftTop !== null){
            movePoints.push(new MovePoint(this.ctx, leftTop, this.width, this.height));
        }

        let leftBottom = this.coordinate.clone(-2, 2);
        if(leftBottom !== null){
            movePoints.push(new MovePoint(this.ctx, leftBottom, this.width, this.height));
        }

        let rigthTop = this.coordinate.clone(2, -2);
        if(rigthTop !== null){
            movePoints.push(new MovePoint(this.ctx, rigthTop, this.width, this.height));
        }

        let rigthBottom = this.coordinate.clone(2, 2);
        if(rigthBottom !== null){
            movePoints.push(new MovePoint(this.ctx, rigthBottom, this.width, this.height));
        }
        return movePoints;
    }
}