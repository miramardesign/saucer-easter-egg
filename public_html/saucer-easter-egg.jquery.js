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

            flyAbove: function ($target, $saucer) {

                let saucerSel = saucerEasterEgg.getSaucerSelector($saucer);

                let distToTarget = saucerEasterEgg.getDistToTarget($saucer, $target);
                var {vDist, hDist} = distToTarget;


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
                var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
                snd.play();
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

            }, /**
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
        saucerEasterEgg.init(e, $(this));

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