import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ViewPagerComponent } from './viewpager.component';

@NgModule({
    imports: [CommonModule, BrowserAnimationsModule],
    declarations: [ViewPagerComponent],
    exports: [ViewPagerComponent],
    providers: [],
    entryComponents: [ViewPagerComponent]
})
export class NemexViewPagerModule {
    constructor() {

    }
 }
