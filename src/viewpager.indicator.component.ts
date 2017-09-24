import { Component, ElementRef, Renderer, Inject, Input } from '@angular/core';

@Component({
    selector: 'nemex-viewpager-indicator',
    template: 
    `<div class="viewpager-indicator">
        <div class="page-dot" *ngFor="let page of pages">

        </div>
    </div>`,
    styles: [`
        .page-dot {
            width: 10px;
            height: 10px;
            float: left;
            margin-right: 10px;
            border-radius: 10px;
            border: 1px solid #e60202;
        }

        .page-dot-active {
            background-color: #ec3333;
        }
    `]
})
export class ViewPagerIndicatorComponent {
    @Input() currentIndex:number = 0;
    @Input() pageCount:number = 0;


    get pages() { 
        return [1,2,3];
    }
}