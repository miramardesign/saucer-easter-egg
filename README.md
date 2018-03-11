
# saucer-easter-egg
Flying Saucer Easter  Egg

Click on a text element in the page, and then a designated button transforms into 
a flying  saucer, flies over your target element zaps it with a laser, then 
flies away. The page is then reset perfectly like nothing happened.

Usage:

![Blow it up!](https://i.imgur.com/2uR07V7.gif)

## Installation

Install with bower (or download/clone).

```shell
bower install saucer-easter-egg --save
```

Import the required files to your html.

```html
<script src="/bower_components/saucer.jquery/dist/saucer-easter-egg.jquery.js"></script>
```

## Usage

```javascript
    $('#saucer-target-center').flyingSaucerAttack({saucer: '#saucer-btn-center');

```
See examples/index.html and examples/ready.js for more options.

Using data attributes
```html
 <span id="saucer-target-both-2"
                       class="saucer-targets-both"
                      data-saucer="#saucer-btn-both"
                      data-label="### hit 2!!!!! ###"
                      data-speed="500"
                      >two targets</span>
```



dependencies: jQuery


