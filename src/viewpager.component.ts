import { Component, ElementRef, Renderer, Inject, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/platform-browser';

import { PointerPosition } from './pointer-position';
import { PointerStack } from './pointer-stack';
import * as util from './utils';

@Component({
    selector: 'nemex-viewpager',
    template:
    `<div class="viewpager-wrapper">
        <div class="viewpager"
            (mousedown)="onMouseDown($event)" (mouseup)="onMouseUp($event)" 
            (touchstart)="onMouseDown($event)" (touchend)="onMouseUp($event)"
            (window:resize)="onWindowResize($event)"
            (window:mouseout)="onWindowMouseLeave()">
        
            <div class="viewpager-content">
                <ng-content></ng-content>
            </div>
        </div>

        <nemex-viewpager-indicator class="indicator" *ngIf="!hideIndicator"
            [pageCount]="childrenCount" [currentIndex]="currentIndex">
        
        </nemex-viewpager-indicator>
    </div>`,
    styles: [
        `.viewpager, .viewpager-wrapper {
          display: block;
          width: 100%;
          overflow: hidden;
          padding: 0px;
          position: relative;
      }
      
      .viewpager-content {
          position: relative;
          display: block;
          height: 100%;   
          padding: 0px;
          margin: 0px;
          border: 0px;
      }
      
      .indicator {
          position: fixed;
          left: 0px;
          right: 0px;
          bottom: 20px;
       }`
    ]
})
export class ViewPagerComponent {
    // Configurables

    // The default tags to prevent the default event behavior for
    @Input() preventDefaultTags: string[] = ["IMG"];
    @Input() maxDeltaTimeForSlideLeave = 150; // The max time the mouse\touch should leave the screen for things to move using acceleration
    @Input() minDeltaPixelsForSlideAcceleration = 3; // The minimum delta pixels should be between the last and first points in the stack for the acceleration to work
    @Input() minPixelsToStartMove = 5; // The minimum pixels to start moving the view pager
    @Input() hideIndicator = false;
    @Input() preventDefaults = false;

    private mouseMoveBind: EventListener;
    private mouseMoveBound = false;
    private previousPointerPosition: PointerPosition;
    private firstPointerPosition: PointerPosition;
    private pointerStack: PointerStack = new PointerStack();
    private currentSlidingIndex = 0;
    private currentIndex = 0;
    private isNowMoving = false;
    private slidingTimer = null;

    constructor(private el: ElementRef,
        private renderer: Renderer,
        private sanitizer: DomSanitizer,
        @Inject(DOCUMENT) private document: any) {
        this.mouseMoveBind = this.onWindowMouseMove.bind(this);
    }

    get viewPagerElement() { return this.el.nativeElement.querySelector(".viewpager"); }

    get viewPagerContentElement() { return this.viewPagerElement.children[0]; }

    get viewPagerItems() { return this.viewPagerContentElement.children; }

    get childrenCount() { return this.viewPagerItems.length; }

    get canvasWidth() { return this.viewPagerElement.clientWidth; }

    ngAfterViewInit() {
        this.placeElements();

        // A fix for the index not updating after items have been updated
        setTimeout(() => {
            this.currentIndex = this.getCurrentElementInView();
        }, 50);
    }

    /* Called when mouse\touch down is taking place. From here we are trying to bind mouse and touch move events in order to
    track the mouse changes */
    onMouseDown(event: Event) {
        // -- FUTURE USE --
        /* Check if we should use prevent default
        if (event instanceof MouseEvent) {
            for (let tag in this.preventDefaultTags) {
                if (event.target instanceof HTMLElement && event.target.tagName == tag) {
                    // This tag prevent default should be ignored
                    event.preventDefault();
                    break;
                }
            }
        }
        */

        // Only prevent mouse events
        // if (event instanceof MouseEvent)
        //    event.preventDefault();
        // -- FUTURE USE --

        if (this.preventDefaults) event.preventDefault();

        if (!this.mouseMoveBound) {
            this.document.addEventListener('touchmove', this.mouseMoveBind);
            this.document.addEventListener('mousemove', this.mouseMoveBind);

            // Add this position to the stack
            let pointerPosition = util.getPointerPosition(event);
            this.pointerStack.push(pointerPosition);

            this.mouseMoveBound = true;
            this.currentSlidingIndex = this.getCurrentElementInView();
            // console.log("Current sliding index: " + this.currentSlidingIndex);
        }
    }

    /* Called when mouse or touch move events are taking place. in this method we are detecting wheter the user wants to move the view-pager,
    and if so - we check if the movement occurs via acceleration (such as fast finger swiping) or slowly. */
    onWindowMouseMove(event: Event) {
        if (util.isMouseInBounds(event, this.viewPagerElement, 0, this.document)) {
            let pointerPosition = util.getPointerPosition(event);

            if (this.previousPointerPosition == null)
                this.firstPointerPosition = pointerPosition;
            else {
                let deltaPosition = pointerPosition.getDeltaPointerPosition(this.previousPointerPosition);

                if (!this.isNowMoving) {
                    let deltaFirstPosition = this.firstPointerPosition.getDeltaPointerPosition(pointerPosition);

                    // Check if the user moved enough pixels to determine it's direction
                    if (Math.abs(deltaFirstPosition.x) >= this.minPixelsToStartMove ||
                        Math.abs(deltaFirstPosition.y) >= this.minPixelsToStartMove) {

                        // If the user is trying to move to it's x axis, allow the movement
                        if (Math.abs(deltaFirstPosition.y) < Math.abs(deltaFirstPosition.x))
                            this.isNowMoving = true;
                        else {
                            // If the user is trying to move to the y axis, stop everything and let him continue
                            this.unbindAndClear();
                            return;
                        }
                    }

                }

                // Update the viewpager location according to the mouse delta position
                if (this.isNowMoving) this.viewPagerElement.scrollLeft += deltaPosition.x;
            }

            this.previousPointerPosition = pointerPosition;
            this.pointerStack.push(pointerPosition);
        }
    }

    // If the cursor left the window, act as mouse up
    onWindowMouseLeave() {
        if (this.mouseMoveBound && this.isNowMoving)
            this.onMouseUp(null);
    }

    // Update all of the elements to fit the new size of the window
    onWindowResize(event: Event) {
        this.placeElements();
    }

    /* Called when the mouse up or touch up are taking place. These allows us to detect if the user tried to swipe
    using acceleration (fast finger swiping), swipe normally, or not move at all. */
    onMouseUp(event: Event) {
        if (this.mouseMoveBound && this.isNowMoving) {
            // If the mouse up was called not from the mouse leave event
            if (event != null) {
                // Get the first and last positions the user started from
                let firstPosition = this.pointerStack.first;
                let lastPosition = this.pointerStack.last;

                // The time taken from the first position to the last one
                let deltaTime = firstPosition.date_created - lastPosition.date_created;

                // Detect the slide direction
                let slideDirection = this.pointerStack.getSlidePosition(this.minDeltaPixelsForSlideAcceleration);

                // Check if the delta time is within the bounds to allow the slide acceleration effect
                if (slideDirection != null && deltaTime <= this.maxDeltaTimeForSlideLeave) {
                    // console.log("Passed the first acceleration if");
                    let slideSucccided = false;

                    if (slideDirection == "left" && this.canSlideLeft) {
                        // console.log("Should slide left from acceleration");
                        slideSucccided = this.slideToElement(this.currentSlidingIndex - 1);
                    }
                    else if (slideDirection == "right" && this.canSlideRight) {
                        // console.log("Should slide right from acceleration");
                        slideSucccided = this.slideToElement(this.currentSlidingIndex + 1);
                    }

                    // If the slide effect succided, stop any bindings and exit
                    if (slideSucccided) {
                        this.unbindAndClear();
                        return;
                    }
                }
            }

            this.unbindAndClear();

            // Complete the sliding animation the user attempted to slide to
            var currentElementInView = this.getCurrentElementInView();
            this.slideToElement(currentElementInView);
        }
    }

    // Unbinds any detection of mouse or touch movements and resets everything
    unbindAndClear() {
        document.removeEventListener('touchmove', this.mouseMoveBind);
        document.removeEventListener('mousemove', this.mouseMoveBind);
        this.pointerStack.clear();
        this.previousPointerPosition = null;
        this.firstPointerPosition = null;
        this.mouseMoveBound = false;
        this.isNowMoving = false;
    }

    placeElements() {
        let index = 0;
        for (let child of this.viewPagerItems)
            this.prepareElementForViewpager(child, this.canvasWidth, index++);

        this.viewPagerContentElement.style.width = (index * this.canvasWidth) + "px";
        this.viewPagerElement.style.height = this.viewPagerElement.scrollHeight + "px";
    }

    prepareElementForViewpager(el, width, index) {
        el.style.display = "block";
        el.style.position = "absolute";
        el.style.top = "0px";
        el.style.left = (width * index) + "px";
        el.style.width = width + "px";
        el.style.height = "100%";
        el.style.padding = "0px";
        el.style.margin = "0px";
        el.style.border = "0px";
    }

    getCurrentElementInView(): number {
        var childrenCount = this.viewPagerItems.length;
        var currentScrollLeft = this.viewPagerElement.scrollLeft;
        var isRtl = currentScrollLeft < 0;

        var selectedIndex = 0;

        if (!isRtl) selectedIndex = Math.round(currentScrollLeft / (this.canvasWidth * childrenCount) * childrenCount);
        else selectedIndex = -(Math.round(Math.abs(currentScrollLeft / this.canvasWidth)));

        return selectedIndex;
    }

    // The number of pixels to move when animating
    private animationPixelJump = 50;

    // The minimum delta position to stop the scrolling from
    private minDeltaToPosition = 9;

    get canSlideLeft(): boolean { return this.viewPagerItems.length > 1 && this.getCurrentElementInView() > 0; }
    get canSlideRight(): boolean { return this.getCurrentElementInView() < this.viewPagerItems.length - 1; }

    slideLeft(): boolean { return this.slideToElement(this.getCurrentElementInView() - 1); }

    slideRight(): boolean { return this.slideToElement(this.getCurrentElementInView() + 1); }

    // Slides into a specific child
    slideToElement(index: number): boolean {
        if (this.slidingTimer) return;

        var destination = (this.canvasWidth * index);

        var viewPagerElement = this.viewPagerElement;
        if (viewPagerElement.scrollLeft == destination) return;

        var scrollDirection = (viewPagerElement.scrollLeft < destination) ? "right" : "left";

        // Create the sliding animations
        this.slidingTimer = setInterval(() => {
            var diff = destination - viewPagerElement.scrollLeft;
            var stopSliding =
                ((scrollDirection == "left" && viewPagerElement.scrollLeft - this.animationPixelJump < destination) ||
                    (scrollDirection == "right" && viewPagerElement.scrollLeft + this.animationPixelJump > destination) ||
                    Math.abs(diff) < this.minDeltaToPosition);

            if (stopSliding) {
                clearInterval(this.slidingTimer);
                this.slidingTimer = null;
                this.viewPagerElement.scrollLeft = destination;
                this.currentIndex = this.getCurrentElementInView();
                return;
            }

            if (viewPagerElement.scrollLeft < destination)
                viewPagerElement.scrollLeft += this.animationPixelJump;
            else
                viewPagerElement.scrollLeft -= this.animationPixelJump;
        }, 15);

        return true;
    }
}