import { Component, ElementRef, Renderer, Inject, Input } from '@angular/core';

@Component({
    selector: 'nemex-viewpager-indicator',
    template: 
    `<div class="viewpager-indicator">
        <div  *ngFor="let page of pages; let i = index;" 
            [ngClass]="[(i == (pageCount - 1) - currentIndex) ? 'page-dot page-dot-active' : 'page-dot']">

        </div>
    </div>`,
    styles: [`
        .viewpager-indicator {
            text-align: center;
            margin-left: auto;
            margin-right: auto;
        }

        .page-dot {
            width: 10px;
            height: 10px;
            display: inline-block;
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
    @Input() currentIndex:number;
    @Input() pageCount:number;

    get pages() { 
        let arr = [];
        for (let i = 0; i < this.pageCount; i++) 
            arr.push(i);

        return arr;
    }
}