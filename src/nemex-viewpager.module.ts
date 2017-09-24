import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ViewPagerComponent } from './viewpager.component';
import { ViewPagerIndicatorComponent } from './viewpager.indicator.component';

@NgModule({
    imports: [CommonModule, BrowserAnimationsModule],
    declarations: [ViewPagerComponent, ViewPagerIndicatorComponent],
    exports: [ViewPagerComponent, ViewPagerIndicatorComponent],
    providers: [],
    entryComponents: [ViewPagerComponent, ViewPagerIndicatorComponent]
})
export class NemexViewPagerModule {
    constructor() {

    }
 }
