# saucer-easter-egg
Flying Saucer Easter  Egg

Click on a text element in the page, and then a designated button transforms into 
a flying  saucer, flies over your target element zaps it with a laser, then 
flies away. The page is then reset perfectly like nothing happened.

Gif preview:

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

## Options
---

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-source=""`.

If you are using jQuery in your application, note that camel case attributes such as `data-minLength`
 should be formatted as `data-min-length`.
 
|Name|Type|Default|Description|
|--- |--- |--- |--- |
|saucer|string| ` ` empty string, 
|REQUIRED,  the flying saucer buttons id or other jquery selector in order to bind it  to the target
|label|string|` - - - - - - - I WANT T0 BEL1EVE - - - - - - -`
|the label on the side of the ufo button so that it is seen rotating 
|snd|string|(beep sound)
|the sound effect when the laser strikes, see ready.js for a cool laser sound, (but much longer at 6000 lines) so i didnt default it.
send null for no silent explosions
|speed|number|`3000`
|animation speed, in milliseconds, larger is slower. 

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


