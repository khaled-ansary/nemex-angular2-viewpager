import { Component, ElementRef, Renderer, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/platform-browser';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'nemex-viewpager',
  template: 
    `<div class="viewpager"></div>`,
  styles: [
      `.viewpager {
          display: block;
          width: 100%;
          height: 100%;
      }`
  ]
})
export class ViewPagerComponent {
  constructor(private el: ElementRef,
    private renderer: Renderer,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: any) { 

    }

    get viewPagerElement() {
        return this.el.nativeElement.querySelector(".viewpager");
    }

    ngAfterViewInit() {
        /*
        console.log(this.viewPagerElement.children);

        this.viewPagerElement.children.forEach(element => {
            console.log(element);
        });
        */
    }
}