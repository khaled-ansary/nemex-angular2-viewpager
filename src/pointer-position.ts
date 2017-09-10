export class PointerPosition {
    public x: number;
    public y: number;
    public date_created:number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.date_created = Date.now();
    }

    getDeltaPointerPosition(newPosition: PointerPosition): PointerPosition {
        return new PointerPosition(newPosition.x - this.x, newPosition.y - this.y);
    }
}