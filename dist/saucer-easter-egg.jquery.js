'use strict';
(function ($, Math, Date, window, global) {

    /**
     * flying saucer easter egg jQuery plugin.
     * @param {object} opts the options object 
     * @returns {object} jQuery object return
     */
    $.fn.flyingSaucerAttack = function (opts) {

        var settings;

        /**
         * main object that  encompasses everything
         * @type type
         */
        let saucerEasterEgg = {
            /**
             * constructor? todo make ES6 contstructuor
             * @param {object} $target the text that was clicked on and will be destroyed
             * @param {object} $saucer the jquery element for the saucer the saucer jQuery object
             * @returns {undefined}
             */
            run: function ($target, $saucer) {
                if ($target.data('isFlying')) {
                    console.log('is flying returning');
                    return;
                }

                if (!$target || $target.length === 0) {
                    throw  'couldnt find element to destroy, its selector was: ';
                }
                if (!$saucer || $saucer.length === 0) {
                    throw  'couldnt find $saucer saucer element to be destroyer its selector was: ';
                }

                let styleElementClass = saucerEasterEgg.utils.getStyleElementClass();
                let saucerSel = saucerEasterEgg.utils.getStrongSaucerSelector($saucer);
                $target.data('cssClass', styleElementClass);

                $target.data('isFlying', true);

                saucerEasterEgg.utils.setupCss(styleElementClass, saucerSel);

                saucerEasterEgg.anims.flyAbove($target, $saucer)
                        .then(function () {
                            return saucerEasterEgg
                                    .anims
                                    .shootSaucerTarget($saucer, $target, saucerSel, styleElementClass);
                        })
                        .then(function () {
                            return saucerEasterEgg
                                    .anims
                                    .flyAway($saucer);
                        })
                        .then(function () {
                            saucerEasterEgg
                                    .utils
                                    .clearPage($saucer, $target, styleElementClass);
                        });

            },
            /**
             * animations, all return promises.
             */
            anims: {
                /**
                 * start flying  up
                 * @param {object} $target the jQuery element for the target text
                 * @param {object} $saucer the jquery element for the saucer
                 * @returns {object} promise of anim result
                 */
                flyAbove: function ($target, $saucer) {

                    let minV = 200;
                    let minH = 100;

                    let distToTarget = saucerEasterEgg.utils.getDistToTarget($saucer, $target);
                    let {vDist, hDist, hDir, vToCiel} = distToTarget;
                    let top = Math.min(vToCiel, minV);
                    let left = Math.max(Math.abs(hDist) / 2, minH);

                    //todo make the saucer fly relative to target?
                    return $saucer.data('text-was', $saucer.text())
                            .html('<marquee>' + settings.label + '</marquee>')
                            //need for a tags and need to wait to fly away so it doesnt 
                            .css('position', 'relative')
                            .css('display', 'inline-block')
                            .css('width', $saucer.width()) //problem w/ width
                            .animate({
                                left: hDir + "=" + left,
                                top: "-=" + top,
                                width: "+=32",
                                height: '+=5',
                                borderRadius: '+=20'
                            }, settings.speed)
                            .css('overflow', 'visible')
                            .promise();
                },
                /**
                 * blow it up from orbit
                 * @param {object} $saucer the jquery element for the saucer
                 * @param {object} $target the jQuery element for the target text
                 * @param {string} saucerSel
                 * @param {string} cssClass the class to removve
                 * @returns {object} promise to string animations
                 */
                shootSaucerTarget: function ($saucer, $target, saucerSel, cssClass) {

                    //get distance to target, pass it to css as width of after and shoot
                    let distToTarget = saucerEasterEgg.utils.getDistToTarget($saucer, $target);
                    saucerEasterEgg.actions.shootLaser(distToTarget, saucerSel, cssClass);
                    saucerEasterEgg.actions.blowUpTarget($target);
                    $saucer.addClass('laser');

                    return saucerEasterEgg.utils.delay(400).then(
                            function () {
                                $saucer.removeClass('laser');
                            }
                    );

                },
                /**
                 * flys away semi randomly 
                 * then calls 
                 * @param {object} $saucer the jquery element for the saucer
                 * @returns {object} promise of animation result
                 */
                flyAway: function ($saucer) {

                    let rand = Math.floor(Math.random() * 10);
                    let plusOrMinusRandom = rand % 2 === 0 ? '+' : '-';
                    let leftD = plusOrMinusRandom + "=2000";
                    return $saucer
                            .animate({
                                left: leftD,
                                top: plusOrMinusRandom + '=' + (rand * 200)},
                                    settings.speed * 2
                                    )
                            .promise();
                }

                //end anims
            },
            utils: {
                /**
                 * promise based delay for animations via css changes, (as opposed 
                 * to $.animate which can return .promise() 
                 * @param {type} ms
                 * @returns {object} a promise
                 * http://jamesknelson.com/grokking-es6-promises-the-four-functions-you-need-to-avoid-callback-hell/
                 */
                delay: function (ms) {
                    var ctr, rej, p = new Promise(function (resolve, reject) {
                        ctr = window.setTimeout(resolve, ms);
                        rej = reject;
                    });
                    p.cancel = function () {
                        clearTimeout(ctr);
                        rej(Error("Cancelled"));
                    };
                    return p;
                },
                /**
                 * initial setup the styles for the page.
                 * @param {string} cssClass for removing css from head
                 * @param {string} strongSaucerSelector css selector all the way to body
                 * @returns {object} promise for anim
                 */
                setupCss: function (cssClass, strongSaucerSelector) {

                    const saucerCss = `
                    /* saucer lasers stuffe */
                    ${strongSaucerSelector}::before, 
                    ${strongSaucerSelector}.laser::after{
                        color: transparent;
                        content: " ";
                        display: inline-block;
                    }

                    /* laser blast */
                    ${strongSaucerSelector}.laser::after {
                        background: linear-gradient(to right top, rgba(255, 255, 255, 0.03) 48%, 
                            rgba(255, 255, 255, 0.46) 40%, rgba(255, 187, 179, 0.89) 50%,
                            rgba(255, 48, 26, 0.95) 51%, 
                            rgba(255, 187, 179, 1) 51%, 
                            rgba(255, 255, 255, 0.68) 54%,
                            rgba(255, 255, 255, 0.03) 50%) repeat scroll 0 0 rgba(0, 0, 0, 0);
                        border-radius: 12px; 
                        margin-left: 52px;
                        margin-top: 4px;
                    }

                    /* top of saucer */
                    ${strongSaucerSelector}::before {
                        background-color: #e9e9e9;
                        border-radius: 6px;
                        height: 8px;
                        top: -6px;
                        left: 8%;
                        position: absolute;
                        width: 82px;
                        left: 20px;
                        border-top: 1px solid rgb(208, 208, 208);
                    }

                    /* flying saucer */
                    ${strongSaucerSelector}{
                        min-width: 100px;
                        max-width: 124px;
                        box-shadow: -8px 10px 22px 0px rgba(0,0,0,0.55);
                        z-index: 10001;
                        position: relative;
                        overflow: visible;
                    }

                    /* marquee w/ banner */
                    ${strongSaucerSelector} marquee{
                        width: 100px;  
                    }

                    /*misc styles (target really) */
                    .blown-text{
                        position: relative;
                    }
                    `;

                    saucerEasterEgg.utils.appendCssToPage(saucerCss, cssClass);
                },
                /**
                 * get a strong selector for the saucer element, formerly had 
                 * .selector
                 * @param {object} $saucer the jquery element for the saucer the jQuery collection
                 * @returns  {string} the id class like '#id.class';
                 */
                getStrongSaucerSelector($saucer) {
                    if ($saucer.first) {
                        $saucer = $saucer.first();
                    }

                    let idSaucer = $saucer.attr('id');
                    let classesSaucer = $saucer.attr('class').replace(/ /gi, '.');
                    if (!idSaucer) {
                        throw 'no id on saucer please add valid id to the saucer button to make strong selector';
                    }
                    if (!classesSaucer) {
                        throw 'no class on saucer please add valid class to the saucer button to make strong selector';
                    }

                    //get all the classes and elements to the body html
                    let parentClasses = $saucer.parents()
                            .map(function () {
                                let $this = $(this);
                                if ($this.attr('class')) {
                                    return this.tagName.toLowerCase() + '.' + $this.attr('class');
                                }

                            })
                            .get()
                            .reverse()
                            .join(" ");

                    let tagName = $saucer.get(0).tagName.toLowerCase();
                    let strongSaucerSelector = `${parentClasses} ${tagName}#${idSaucer}.${classesSaucer}`;
                    console.log('strongSaucerSElector:', strongSaucerSelector);
                    return strongSaucerSelector;
                },
                /**
                 * append a style tag to page head, so it can be removed later.
                 * @param {type} css striing to add
                 * @param {type} cssClass identifier so we can remove it from head.
                 * @returns {undefined}
                 */
                appendCssToPage: function (css, cssClass) {
                    $(`<style class="${cssClass}"  > ${css}</style>`)
                            .appendTo('head');
                    if (!cssClass) {
                        throw 'need css Id';
                    }

                },
                /**
                 * gets timestamp id for added <style> tags
                 * @returns {String} the css class with timestamp id
                 */
                getStyleElementClass() {

                    let timestamp = Math.floor(Date.now() / 1000);
                    let cssClass = 'saucer' + timestamp;
                    return cssClass;
                },

                /**
                 * get a distance object to caculate the laser divs,
                 * height and width, also gets didstance to top so i can avoid going offscreen
                 * top
                 * @param {object} $saucer the jquery element for the saucer
                 * @param {object} $target the jQuery element for the target text
                 * @returns {object} object with distance info
                 */
                getDistToTarget: function ($saucer, $target) {

                    //todo return negative so that the saucer doesnt have to be on any side
                    let hDist = $target.offset().left - $saucer.offset().left;
                    //forcing to shoot downward 
                    let vDist = Math.abs($saucer.offset().top - $target.offset().top);
                    let hDir = hDist.toString().indexOf('-') ? '+' : '-';
                    return {
                        hDist: hDist,
                        vDist: vDist,
                        hDir: hDir,
                        vToCiel: $saucer.offset().top
                    };
                },
                /**
                 * cleanup, need to make perfectly like was before
                 * @param {object} $saucer the jquery element for the saucer to cleanup the damn saucer
                 * @param {object} $target the jQuery element for the target text
                 * @param {string} styleElementClass the class of css to remove 
                 * @returns {undefined}
                 */
                clearPage: function ($saucer, $target, styleElementClass) {

                    $('.' + styleElementClass).remove();

                    if (!$saucer) {
                        return;
                    }

                    $saucer.removeAttr('style');
                    $saucer.text($saucer.data('text-was'));
                    $target.html($target.data('text-was')).removeAttr('style');

                    saucerEasterEgg.actions.blowupText(0, $target);

                    $target.data('isFlying', false);
                }

                //end utils
            },
            /**
             * non anim eents, things that take no time nor return promises
             */
            actions: {
                /**
                 * blow it up like the mythbusters, using plugin.
                 * @param {object} $target the jQuery element for the target text
                 * @returns {undefined}
                 */
                blowUpTarget: function ($target) {
                    $target.css('color', settings.blownColor)
                            .delay(900)
                            .fadeOut('slow');

                    saucerEasterEgg.actions.blowupText(settings.stepDist, $target);
                },
                /**
                 * make the text blow up in a circle
                 * @param {type} stepDist the distance the text should spread
                 * @param {object} $target the jQuery element for the target text
                 * todo return es6 promises?
                 * @returns {undefined}
                 */
                blowupText: function (stepDist, $target) {

                    if ($target.hasClass('blown-wrap') && stepDist === 0) {
                        return saucerEasterEgg.actions.cleanupBlownText($target);
                    }

                    $target.addClass('blown-wrap');

                    const text = $.trim($target.text());
                    $target.data('text-was', text);
                    let htmlTmpl = [];
                    let lenLenText = text.length;
                    let halfLenText = lenLenText / 2;

                    for (let x = 0 - halfLenText; x < halfLenText; x++) {

                        // equation: y = √(r² - x²) 
                        let top = Math.floor(Math.sqrt((halfLenText * halfLenText) - (x * x)));

                        let topMulted = top * stepDist;
                        let letI = x + halfLenText;
                        let letter = text[letI];
                        let line = `<span class="blown${letI} blown-text" 
                        style="top: ${topMulted}px;" >
                        ${letter}</span>`;
                        htmlTmpl.push(line);
                    }

                    $target.html(htmlTmpl.join(''));
                },
                /**
                 * reset text
                 * @param {object} $target the jQuery element for the target text
                 * @returns {undefined}
                 */
                cleanupBlownText: function ($target) {
                    $target.removeClass('blown-wrap')
                            .html($target.data('text-was'))
                            .removeAttr('style');
                    $target.children('.blown-text').remove();
                    return;
                },
                /**
                 * laser w/ the laser css 
                 * @param {object} distToTarget
                 * @param {string} saucerSel
                 * @param {string} cssClass
                 * @returns {undefined}
                 */
                shootLaser: function (distToTarget, saucerSel, cssClass) {
                    saucerEasterEgg.actions.playSnd();

                    const origMarginLeft = -52;
                    let offset = 0;
                    let sizeCssShot = '';
                    //if saucer is to the right of target (needs work)
                    if (distToTarget.hDist < 0) {
                        offset = origMarginLeft;
                        sizeCssShot += `
                    ${saucerSel}.laser::after{ 
                        margin-left: ${(origMarginLeft + distToTarget.hDist)}px;
                        transform: scaleY(-1);
                    }`;
                        distToTarget.hDist = Math.abs(distToTarget.hDist);
                    }

                    sizeCssShot += `
                    ${saucerSel}.laser::after{ 
                        width: ${(distToTarget.hDist + offset)}px;
                        height: ${distToTarget.vDist }px;
                    }`;
                    saucerEasterEgg.utils.appendCssToPage(sizeCssShot, cssClass);
                },
                /**
                 * sound using base64 sound passed in from options for max dopeness
                 * @returns {undefined}
                 */
                playSnd: function () {
                    if (settings.snd) {
                        let aud = new Audio(settings.snd);
                        aud.play();
                    }
                }
            }
        };


        //FOR TESTING decide whether you want to expose your api or not 
        if (opts.makeGlobal) {
            //global.api = saucerEasterEgg;
            console.log('making global for testing==============')
            return  saucerEasterEgg;
            ///return {saucerEasterEgg: saucerEasterEgg};
        }

        /**
         * invoke on each jQuery matched set
         */
        return this.each(function () {

            let $target = $(this);

            /**
             * get opts from data attributes if not passed in.
             * should all work.
             */
            if ($target && $target.data() && $target.data('saucer')) {
                opts = $target.data();
            }

            settings = $.extend({
                blownColor: '#f10',
                stepDist: 2,
                label: '- - - - - - - - I WANT T0 BEL1EVE - - - - - - -',
                speed: 3000,
                snd: "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
            }, opts);
 
            // Do something to each element here.
            let $saucer = $(settings.saucer);

            $target.click(function () {
                console.log('id:', $saucer.attr('id'));
                saucerEasterEgg.run($target, $saucer);
            });
        });

//        return this;
    };
}(jQuery, Math, Date, window, this));