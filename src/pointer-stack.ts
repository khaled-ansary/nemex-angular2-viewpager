import { PointerPosition } from 'nemex-angular2-viewpager/src/pointer-position';

// A pointer stack acts as a LIFO (Last-In First-Out) that only contains the last recent pointer location
export class PointerStack {
    public stackMax = 5;
    public positions:PointerPosition[] = [];

    push(position: PointerPosition) {
        if (this.positions.length > this.stackMax) 
            this.positions = this.positions.slice(1);

        this.positions.push(position);
    }

    pop() {
        return this.positions.pop();
    }

    clear() {
        this.positions = [];
    }

    // Returns the first entered position into the stack (limited to teh stackMax)
    get first() { return this.positions[this.positions.length - 1]; }

    // Returns the last entered position into the stack
    get last() { return this.positions[0]; }

    // Returns the sliding position calculated from the last pointer position
    getSlidePosition(minDelta:number):string {
        let previousPosition = null;

        let deltaX = this.first.x - this.last.x;
        if (Math.abs(deltaX) > minDelta) {
            if (deltaX > 0) return "left";
            else if (deltaX < 0) return "right";
        }

        return null;
    }
}