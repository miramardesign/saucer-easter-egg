'use strict';

(function ($) {

    /**
     * flying saucer easter egg jQuery plugin.
     * @param {object} opts the options object 
     * @returns {object} jQuery object return
     */
    $.fn.flyingSaucerAttack = function (opts) {

        var settings = $.extend({
            LABEL: '- - - - - - - - I WANT TO BELIEVE - - - - - - -'
        }, opts);

        let saucerEasterEgg = {
            /**
             * constructor? todo make ES6 contstructuor
             * @param {object} $target 
             * @param {type} $saucer the saucer jQuery object
             * @returns {undefined}
             */
            init: function ($target, $saucer) {
                if ($target.data('isFlying')) {
                    console.log('already flying?');
                    return;
                } else {
                    //let $saucerTarget = $(e.currentTarget);

                    if ($target.length === 0) {
                        throw  'couldnt find element to destroy, its selector was: ';
                    }
                    if (!$saucer || $saucer.length === 0) {
                        throw  'couldnt find $saucer saucer element to be destroyer its selector was: ';
                    }

                    //saucerEasterEgg.clearPage();

                    $target.data('isFlying', true);
                    window.setTimeout(function () {

                        saucerEasterEgg.setupCss($saucer);

                        window.setTimeout(function () {
                            saucerEasterEgg.flyAbove($target, $saucer);
                        }, 500);
                    }, 500);

                }
            },
            /**
             * get a strong selector for the saucer element, formerly had 
             * .selector
             * @param {type} $saucer the jQuery collection
             * @returns  {string} the id class like '#id.class';
             */
            getStrongSaucerSelector($saucer) {
                if ($saucer.first) {
                    $saucer = $saucer.first();
                }
                console.log('saucer obj', $saucer);
                console.dir($saucer);

                let idSaucer = $saucer.attr('id');
                let classesSaucer = $saucer.attr('class').replace(/ /gi, '.');
                if (!idSaucer) {
                    throw 'no id on saucer please add valid id to the saucer button to make strong selector';
                }
                if (!classesSaucer) {
                    throw 'no class on saucer please add valid class to the saucer button to make strong selector';
                }

                //need to make stronger, 
                //go up 4 parents get the class if any and add to the selector if body hit, stop
                let parentClasses = $saucer.parents()
                        .map(function () {
                            let $this = $(this);
                            if (this.tagName !== 'BODY'
                                    && this.tagName !== 'HTML'
                                    && $this.attr('class')
                                    ) {
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
             * setup the styles for the page.
             * @param {object} $saucer element of the saucer
             * @returns {undefined}
             */
            setupCss: function ($saucer) {
                console.log('$saucer', $saucer);

                let saucerSelector = saucerEasterEgg.getStrongSaucerSelector($saucer);

                if (typeof saucerSelector !== 'string') {
                    console.log(typeof saucerSelector);
                    throw 'saucerSel not string is listed above';
                }

                const saucerCss = `

                /* saucer shots stuffe */
                html body ${saucerSelector}::before, 
                html body ${saucerSelector}.shot::after{
                    color: transparent;
                    content: " ";
                    display: inline-block;
                }

                /* laser blast */
                html body ${saucerSelector}.shot::after {
                    background: linear-gradient(to right top, rgba(255, 255, 255, 0.03) 48%, rgba(255, 255, 255, 0.46) 40%, rgba(255, 186, 178, 0.89) 50%, rgba(255, 48, 25, 0.95) 51%, rgba(255, 186, 178, 1) 51%, rgba(255, 255, 255, 0.68) 54%, rgba(255, 255, 255, 0.03) 50%) repeat scroll 0 0 rgba(0, 0, 0, 0);
                    border-radius: 12px; 
                    margin-left: 52px;
                    margin-top: 2px;
                }
                
                /* top of saucer */
                html body ${saucerSelector}::before {
                    background-color: #e9e9e9;
                    border-radius: 6px;
                    height: 8px;
                    top: -6px;
                    left: 8%;
                    position: absolute;
                    width: 82px;
                    left: 20px;

                    /* todo make same color as the button */
                    border-top: 1px solid rgb(208, 208, 208);
                }


                /* flying saucer */
                html body ${saucerSelector}{
                  /*transition: all 2s ease; */
                  min-width: 100px;
                  max-width: 124px;
                  box-shadow: -8px 10px 22px 0px rgba(0,0,0,0.75);
                  z-index: 10001;
                  position: relative;
                }

                /* marquee w/ banner */
                html body ${saucerSelector} marquee{
                    width: 100px;  
                }
                `;

                saucerEasterEgg.appendCssToPage(saucerCss);
            },
            /**
             * start flying  up
             * @param {type} $target
             * @param {type} $saucer
             * @returns {undefined}
             */
            flyAbove: function ($target, $saucer) {

                let saucerSel = saucerEasterEgg.getStrongSaucerSelector($saucer);

                let distToTarget = saucerEasterEgg.getDistToTarget($saucer, $target);
                let {vDist, hDist, hDir, vToCiel} = distToTarget;

                let top = Math.min(vToCiel, 200);

                //todo make the saucer fly relative to target?
                $saucer.attr('data-text-was', $saucer.text())
                        .html('<marquee>' + settings.LABEL + '</marquee>')
                        .animate({
                            left: hDir + "=" + Math.abs(hDist) / 2,
                            top: "-=" + top,
                            width: "+=32",
                            height: '+=5',
                            borderRadius: '+=20'
                        }, 3000, function () {

                            saucerEasterEgg.shootSaucerTarget($saucer, $target, saucerSel);
                        }).css('overflow', 'visible');
            },
            /**
             * append a style tag to page head, so it can be removed later.
             * @param {type} css
             * @returns {undefined}
             */
            appendCssToPage: function (css) {
                $('<style class="appended-style flying-saucer" >' + css + '</style>').appendTo('head');
            },
            explodeTarget: function ($elToDestroy) {
                $elToDestroy.css('color', 'red')
                        .xplodeText(2)
                        .delay(900)
                        .fadeOut('slow');
            },
            makeShot: function (distToTarget, saucerSel) {

                const origMarginLeft = -52;
                let offset = 0;
                let sizeCssShot = '';

                //if saucer is to the right of target (needs work)
                if (distToTarget.hDist < 0) {
                    offset = origMarginLeft;
                    sizeCssShot += `
                    html body ${saucerSel}.shot::after{ 
                        margin-left: ${(origMarginLeft + distToTarget.hDist)}px;
                        transform: scaleY(-1);
                    }`;

                    distToTarget.hDist = Math.abs(distToTarget.hDist);
                }

                sizeCssShot += `
                    html body ${saucerSel}.shot::after{ 
                        width: ${(distToTarget.hDist + offset)}px;
                        height: ${distToTarget.vDist }px;
                    }`;

                saucerEasterEgg.appendCssToPage(sizeCssShot);
                saucerEasterEgg.beep();
            },
            beep: function () {
                let snd = "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=";
                let aud = new Audio(snd);
                aud.play();
            },
            /**
             * blow it up from orbit
             * @param {type} $saucer
             * @param {type} $target
             * @param {type} saucerSel
             * @returns {undefined}
             */
            shootSaucerTarget: function ($saucer, $target, saucerSel) {

                //get distance to target, pass it to css as width of after and shoot
                let distToTarget = saucerEasterEgg.getDistToTarget($saucer, $target);

                saucerEasterEgg.makeShot(distToTarget, saucerSel);
                saucerEasterEgg.explodeTarget($target);

                $saucer.addClass('shot');

                //---------xxxxxxxxxxxxxxxxxxxxxxxxxx----
                // return; //debug stop point
                window.setTimeout(function () {
                    $saucer.removeClass('shot');
                    window.setTimeout(function () {
                        saucerEasterEgg.flyAway($saucer, $target);
                    }, 500);

                }, 1000);

            },
            /**
             * get a distance object to caculate the shot
             * @param {type} $saucer
             * @param {type} $target
             * @returns {saucer.jqueryL#5.$.fn.flyingSaucerAttack.flyingSaucer.getDistToTarget.saucer.jqueryAnonym$1}
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
            /* tried for a random dir here to give it some replayability */
            flyAway: function ($saucer, $target) {

                let rand = Math.floor(Math.random() * 10);
                let leftOrRightRandom = rand % 2 === 0 ? '+' : '-';

                let leftD = leftOrRightRandom + "=2000";

                $saucer.animate({
                    left: leftD,
                    top: leftOrRightRandom + '=' + (rand * 200)}, 6000, function () {

                    saucerEasterEgg.clearPage($saucer, $target);

                });

            }, /**
             * cleanup, need to make perfectly like was before
             * @param {type} $saucer to cleanup the damn saucer
             * @param {type} $target
             * @returns {undefined}
             */
            clearPage: function ($saucer, $target) {
                $('.appended-style').remove();
                if (!$saucer) {
                    return;
                }

                $saucer.removeAttr('style');
                $saucer.text($saucer.attr('data-text-was'));

                $target.html($target.attr('data-text-was')).removeAttr('style');
                $target.xplodeText(0);

                $target.data('isFlying', false);
            }

        };

        return this.each(function () {
            // Do something to each element here.
            let $target = $(this);
            //let $saucer = $(opts.saucer);

            $target.click(function () {
                let $saucer;
                if (opts && opts.saucer) {
                    //get from options like $('#id').flyingSaucerAttack({saucer: '#saucer-btn-right'});
                    $saucer = $(opts.saucer);
                } else if ($target.data('saucer')) {
                    //get from data like :
                    //<span id="saucer-target" data-saucer="#saucer-btn">target click me to blow me up</span>

                    $saucer = $($target.data('saucer'));
                } else {
                    throw 'could not find saucer id in either options, or data.';
                }
                console.log('id:', $saucer.attr('id'));

                saucerEasterEgg.init($target, $saucer);

            });
        });


        //todo refactor so it sends 2 jQuery elements. 
        //the $saucer, and $targets!
        // saucerEasterEgg.init(e, $(this));

        return this;
    };

}(jQuery));

(function ($) {

    /**
     * makes the text turn red and go in a circle like it was exploded.
     * @param {type} stepDist whether to cleanup.
     * @returns {saucer.jqueryL#285.$.fn}
     */
    $.fn.xplodeText = function (stepDist) {
        //0 step resets
        let $this = $(this);
        /**
         * reset text
         * @param {type} $this
         * @returns {undefined}
         */
        function cleanupExplodText($this) {
            $this.removeClass('xplode');
            $this.html($this.attr('data-text-was'));

            $this.removeAttr('style');
            $('.xplode-text').remove();
            return;

        }

        if ($this.hasClass('xplode') && stepDist === 0) {
            return cleanupExplodText($this);
        }



        $this.addClass('xplode').css('position', 'relative');

        const text = jQuery.trim($this.text());
        $this.attr('data-text-was', text);

        let htmlTmpl = '';
        let len = text.length;

        let r = len / 2;

        //todo 1,loop 1 dom insert
        for (let x = 0 - r; x < r; x++) {

            //semi circle eq: y = √(r² - x²) 
            let y = Math.floor(Math.sqrt((r * r) - (x * x)));

            //add step multiplier
            y = y * stepDist;
            let letI = x + r;
            let letter = text[letI];

            htmlTmpl += `<span class="xplode${letI} xplode-text" 
                        style="position: relative; top: ${y}px;" >
                        ${letter}</span>`;
        }

        $this.html(htmlTmpl);

        return this;
    };
}(jQuery));