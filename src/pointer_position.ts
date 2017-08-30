export class PointerPosition {
    public x: number;
    public y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getDeltaPointerPosition(newPosition: PointerPosition): PointerPosition {
        return new PointerPosition(newPosition.x - this.x, newPosition.y - this.y);
    }
}