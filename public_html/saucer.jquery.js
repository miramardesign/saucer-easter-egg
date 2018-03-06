'use strict';

(function ($) {

    /**
     * flying saucer easter egg jQuery plugin.
     * @param {type} e
     * @returns {saucer.jqueryL#3.$.fn}
     */
    $.fn.flyingSaucerAttack = function (e) {

        let saucerEasterEgg = {
            isFlying: false,
            /**
             * constructor? todo make contstructuor
             * @param {type} e
             * @param {type} saucerSel
             * @returns {undefined}
             */
            init: function (e, saucerSel) {
                let $saucerTarget = $(e.currentTarget);

                if ($saucerTarget.length === 0) {
                    throw  'couldnt find element to destroy, its selector was: ' + e.currentTarget;
                }
                if (!saucerSel || saucerSel.length === 0) {
                    throw  'couldnt find saucer element to be destroyer its selector was: ' + saucerSel;
                }

                if (saucerEasterEgg.isFlying) {
                    console.log('already flying?');
                    return;
                }
                saucerEasterEgg.clearPage();
                saucerEasterEgg.isFlying = true;
                window.setTimeout(function () {

                    saucerEasterEgg.setupCss(saucerSel);

                    window.setTimeout(function () {
                        saucerEasterEgg.flyAbove($saucerTarget, saucerSel);
                    }, 500);
                }, 500);

            },
          
            /**
             * get a strong selector for the saucer element, formerly had 
             * .selector
             * @param {type} $saucer the jQuery collection
             * @returns  {string} the id class like '#id.class';
             */
            getSaucerSelector($saucer) {
                if ($saucer.first) {
                    $saucer = $saucer.first();
                }
                console.log('saucer obj', $saucer);
                console.dir($saucer);

                let idSaucer = $saucer.attr('id');
                let classSaucer = $saucer.attr('class');
                if (!idSaucer) {
                    throw 'no id on saucer please add valid id to the saucer button to make strong selector';
                }
                if (!classSaucer) {
                    throw 'no class on saucer please add valid class to the saucer button to make strong selector';
                }

                return `#${idSaucer}.${classSaucer}`;
            },

            /**
             * setup the styles for the page.
             * @param {type} saucerEl element of the saucer
             * @returns {undefined}
             */
            setupCss: function (saucerEl) {

                let $saucer = $(saucerEl);
                if (saucerEl instanceof jQuery) {
                    console.log('is a jquery selector');
                    $saucer = saucerEl;
                }

                let saucerSelector = saucerEasterEgg.getSaucerSelector($saucer);

                if (typeof saucerSelector !== 'string') {
                    console.log(typeof saucerSelector);
                    throw 'saucerSel not string is listed above';
                }

                const saucerCss = `

                /* both b4 and 4f */
                html body ${saucerSelector}::before, 
                html body ${saucerSelector}.shot::after{
                    color: transparent;
                    content: " "; /* b4 and after need content */
                    display: inline-block;
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

                /* laser shot! which is a div w/ a bg t
                 * hat looks like a laser!, toggled .shot */
                html body ${saucerSelector}.shot::after {

                    /* actual beam, a nifty bg gradient */
                    background: linear-gradient(to right top, rgba(255, 255, 255, 0.03) 48%, rgba(255, 255, 255, 0.46) 40%, rgba(255, 186, 178, 0.89) 50%, rgba(255, 48, 25, 0.95) 51%, rgba(255, 186, 178, 1) 51%, rgba(255, 255, 255, 0.68) 54%, rgba(255, 255, 255, 0.03) 50%) repeat scroll 0 0 rgba(0, 0, 0, 0);
                    border-radius: 12px; 
                    margin-left: 52px;
                    margin-top: 2px;
                }

                /* main saucer */
                html body ${saucerSelector}{
                  /*transition: all 2s ease; */
                  min-width: 100px;
                  max-width: 124px;
                  box-shadow: -8px 10px 22px 0px rgba(0,0,0,0.75);
                  z-index: 10001;
                  position: relative;
                }

                html body ${saucerSelector} marquee{
                    width: 100px;  
                }
                `;

                saucerEasterEgg.appendCssToPage(saucerCss);
            },

            flyAbove: function ($elToDestroy, $saucer) {

                let saucerSel = saucerEasterEgg.getSaucerSelector($saucer);

                // let $saucer = $(saucerSel);

                //todo make the saucer fly relative to target?
                $saucer.attr('data-text-was', $saucer.text())
                        .html('<marquee>- - - - - - - - I WANT TO BELIEVE - - - - - -</marquee>')
                        .animate({
                            left: "-=150",
                            top: "-=250",
                            width: "+=32",
                            height: '+=5',
                            borderRadius: '+=20'
                        }, 3000, function () {

                            saucerEasterEgg.shootSaucerTarget($saucer, $elToDestroy, saucerSel);
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

                return {
                    hDist: hDist,
                    vDist: vDist
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

            },  /**
             * cleanup, need to make perfectly like was before
             * @param {type} $saucer to cleanup the damn saucer
             * @param {type} $target
             * @returns {undefined}
             */
            clearPage: function ($saucer, $target) {
                saucerEasterEgg.isFlying = false;
                $('.appended-style').remove();
                if (!$saucer) {
                    return;
                }

                $saucer.removeAttr('style');
                $saucer.text($saucer.attr('data-text-was'));
                
                $target.html($target.attr('data-text-was')).removeAttr('style');
                $target.xplodeText(0);
            }

        };

        //todo refactor so it sends 2 jQuery elements. 
        //the $saucer, and $targets!
        saucerEasterEgg.init(e,  $(this));

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
        function cleanupExplodText($this){
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