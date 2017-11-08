# Nemex Angular 2 Viewpager

This package implements a simple Android\iPhone viewpager which allows swiping between
views easily using the mouse or touch "drag" motion.

It implements this by creating an invisible horizontal scroll which contains
the contents.

## Installation

Install the package using the following command:
> npm install nemex-angular2-viewpager

In your app module add the follwing code:
```typescript
...
import { NemexViewPagerModule } from 'nemex-angular2-viewpager';

@NgModule({
  ...
  // Import the module in order to add the tooltip directive
  imports: [
    ...
    NemexViewPagerModule
  ],
  ...
})
```

## Usage

To use this library add the following HTML to where you want the viewpager to be positioned:
```html
<nemex-viewpager>
    <div>
        <!-- Some custom screen in the viewpager -->
        <img src="some_image.jpg" />
    </div>

    <div>
        <h2>Screen 2</h2>

        <p>This is screen number 2 contents!</p>
    </div>
</nemex-viewpager>
```

Each child item will be styled and positioned on 100% of the viewpager canvas. If you want you want views to keep their sizes preserved wrap them in a div as the root.
