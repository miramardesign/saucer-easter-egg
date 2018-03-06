//this is es6 so not for older js engines.
'use strict';

//instantiation, can be moved to other file
$('body').on("click", '#target', function (e) {
    //$(saucerSelector) -> attacks element clicked on
    console.log('click');
    $('#saucer').flyingSaucerAttack(e);
});

(function ($) {

    $.fn.flyingSaucerAttack = function (e) {

        var flyingSaucer = {
            isFlying: false,
            /**
             * constructor? todo make contstructuor
             * @param {type} e
             * @param {type} saucerSel
             * @returns {undefined}
             */
            init: function (e, saucerSel) {
                var $elToDestroy = $(e.currentTarget);
                
                if($elToDestroy.length === 0){
                    throw  'couldnt find element to destroy, its selector was: ' + e.currentTarget;
                }
                if(!saucerSel || saucerSel.length === 0){
                    throw  'couldnt find saucer element to be destroyer its selector was: ' + saucerSel;
                }

                if (flyingSaucer.isFlying) {
                    console.log('already flying?');
                    return;
                }
                flyingSaucer.cleanup();
                flyingSaucer.isFlying = true;
                window.setTimeout(function () {

                    flyingSaucer.initStyles(saucerSel);

                    window.setTimeout(function () {
                        flyingSaucer.flyUp($elToDestroy, saucerSel);
                    }, 500);
                }, 500);

            },
            /**
             * get a strong selector for the saucer element, formerly had 
             * .selector
             * @param {type} $saucer the jQuery collection
             * @returns  {string} the id class like '#id.class';
             */
            getSaucerSelector($saucer){
                var $saucer = $saucer.first();
                var idSaucer = $saucer.attr('id');
                var classSaucer = $saucer.attr('class');
                if(! idSaucer){
                    throw 'no id on saucer please add valid id to the saucer button to make strong selector';
                }
                if(! classSaucer){
                    throw 'no class on saucer please add valid class to the saucer button to make strong selector';
                }
                
                return `#${idSaucer}.${classSaucer}`;
            },
            
            /**
             * setup the styles for the page.
             * @param {type} saucerEl element of the saucer
             * @returns {undefined}
             */
            initStyles: function (saucerEl) {
                
                var $saucer;
                if( saucerEl instanceof jQuery){
                    console.log('is a jquery selector')
                    $saucer = saucerEl;
                    
                }else{
                     $saucer = $(saucerEl);
                }

                
                var saucerSel = flyingSaucer.getSaucerSelector($saucer);  // $saucer[0].selector;
                
                if(typeof saucerSel !== 'string'){
                    console.dir(saucerSel);
                    throw 'saucerSel not string is ' + ( typeof saucerSel );
                }

                
                //new es6 templates!
                var saucerSetupStyle = `

                /* both b4 and 4f */
                html body ${saucerSel}::before, 
                html body ${saucerSel}.shot::after{
                    color: transparent;
                    content: " "; /* b4 and after need content */
                    display: inline-block;
                }

                /* top of saucer */
                html body ${saucerSel}::before {
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
                html body ${saucerSel}.shot::after {

                    /* actual beam, a nifty bg gradient */
                    background: linear-gradient(to right top, rgba(255, 255, 255, 0.03) 48%, rgba(255, 255, 255, 0.46) 40%, rgba(255, 186, 178, 0.89) 50%, rgba(255, 48, 25, 0.95) 51%, rgba(255, 186, 178, 1) 51%, rgba(255, 255, 255, 0.68) 54%, rgba(255, 255, 255, 0.03) 50%) repeat scroll 0 0 rgba(0, 0, 0, 0);
                    border-radius: 12px; 
                    /* to make the corner look more real */
                    margin-left: 52px;
                    margin-top: 2px;
                }

                /* main saucer */
                html body ${saucerSel}{
                  /*transition: all 2s ease; */
                  min-width: 100px;
                  max-width: 124px;
                  box-shadow: -8px 10px 22px 0px rgba(0,0,0,0.75);
                  z-index: 10001;
                  position: relative;
                }

                html body ${saucerSel} marquee{
                    width: 100px;  
                }
                `;

                flyingSaucer.appendCss(saucerSetupStyle);
            },

            flyUp: function ($elToDestroy, $saucer) {

                var saucerSel = flyingSaucer.getSaucerSelector($saucer);

               // var $saucer = $(saucerSel);

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

                            flyingSaucer.shoot($saucer, $elToDestroy, saucerSel);
                        }).css('overflow', 'visible');
            },
            appendCss: function (styles) {
                $('<style class="appended-style flying-saucer" >' + styles + '</style>').appendTo('head');
            },
            cleanup: function () {
                flyingSaucer.isFlying = false;
                $('.appended-style').remove();
                $('a, .kpi, a span, .kpi span').removeAttr('style');
                $('a[data-text-was]').text($('a[data-text-was]').attr('data-text-was'));
            },
            explodeTarget: function ($elToDestroy) {
                $elToDestroy.css('color', 'red')
                        .xplodeText(2)
                        .delay(900)
                        .fadeOut('slow');
            },
            calcShot: function (distToTarget, $saucer) {

                var origMarginLeft = -52;
                var offset = 0;
                var sizeCssShot = '';
                var saucerSel = flyingSaucer.getSaucerSelector($saucer);
                

                //if saucer is to the right of target (needs work)
                if (distToTarget.hDist < 0) {
                    offset = origMarginLeft;
                    sizeCssShot += `
                    html body ${saucerSel}.shot::after{ 
                        margin-left: ${(-52 + distToTarget.hDist)}px;
                        transform: scaleY(-1);
                    }`;

                    distToTarget.hDist = Math.abs(distToTarget.hDist);
                }

                sizeCssShot += `
                    html body ${saucerSel}.shot::after{ 
                        width: ${(distToTarget.hDist + offset)}px;
                        height: ${distToTarget.vDist }px;
                    }`;

                flyingSaucer.appendCss(sizeCssShot);
            },
            shoot: function ($saucer, $elToDestroy, saucerSel) {

                //get distance to target, pass it to css as width of after and shoot
                var distToTarget = flyingSaucer.getDistToTarget($saucer, $elToDestroy);

                flyingSaucer.calcShot(distToTarget, saucerSel);
                flyingSaucer.explodeTarget($elToDestroy);

                $saucer.addClass('shot');
              return; //debug return to play w shot css
                window.setTimeout(function () {
                    $saucer.removeClass('shot');
                    window.setTimeout(function () {
                        flyingSaucer.flyAway($saucer);
                    }, 500);

                }, 1000);

            },
            getDistToTarget: function ($saucer, $target) {

                console.log('saucer details');
                console.dir($saucer.offset());
                console.log('target details');
                console.dir($target.offset());

                //todo return negative so that the saucer doesnt have to be on any side
                var hDist = $target.offset().left - $saucer.offset().left;

                //forcing to shoot downward 
                var vDist = Math.abs($saucer.offset().top - $target.offset().top);

                return {
                    hDist: hDist,
                    vDist: vDist
                };

            },

            /* tried for a random dir here to give it some replayability */
            flyAway: function ($saucer) {

                var rnd = Math.floor(Math.random() * 10);
                var dir = rnd % 2 === 0 ? '+' : '-';

                //like +=2000 or -=2000
                var horiz = dir + "=2000";

                $saucer.animate({
                    left: horiz,
                    top: dir + '=' + (rnd * 200)}, 6000, function () {

                    flyingSaucer.cleanup();

                });

                //calls shoot calls -> flyway etc
            }

        };

        var $this = $(this);
        console.log('this selector?', $this);
        
        //todo refactor so it sends 2 jQuery elements. 
        //the $saucer, and $targets!
        flyingSaucer.init(e, $this);
        //flyingSaucer.init(e, $this.selector);

        return this;
    };

}(jQuery));

(function ($) {

    $.fn.xplodeText = function (step) {
        //0 step resets
        var $this = $(this);

        //precheck cleanup, redesigned so if you call it twice on same text it
        //cleans up.
        if ($this.hasClass('xplode')) {
            $this.removeClass('xplode');
            $this.html($this.attr('text-was'));

            $this.children('span').removeAttr('style');
            $('.xplode-text').remove();//styles head
            //return this;
        }

         console.log( '$("' + $this.selector + '").xplodeText(' + step + ')');

        $this.addClass('xplode').css('position', 'relative');

        var thisTxt = jQuery.trim($this.text());
        $this.attr('text-was', thisTxt);

        var thisHtm = '';
        var len = thisTxt.length;

        var r = len / 2;

        //todo 1,loop 1 dom insert
        for (var x = 0 - r; x < r; x++) {

            //semi circle eq: y = √(r² - x²) 
            var y = Math.floor(Math.sqrt((r * r) - (x * x)));

            //add step multiplier
            y = y * step;
            var letI = x + r;
            var thisLet = thisTxt[letI];

            thisHtm += '<span class="xplode' + letI + '" ' +
                    ' style="position: relative; top: ' + y + 'px;" >'
                    + thisLet
                    + '</span>';
        }

        $this.html(thisHtm);

        return this;
    };
}(jQuery));