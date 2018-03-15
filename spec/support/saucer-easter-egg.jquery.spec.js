/* global expect, jasmine */

describe("Test flying saucer jquery plugin", function () {

    let saucerEasterEgg, $saucer, $target;

    beforeEach(function () {

        //https://github.com/velesin/jasmine-jquery
        let html = `
            <div class="col-md-2">
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <button id="saucer-btn-right" class="saucer">
                    button no span
                </button>
            </div>
            <div class="col-md-6">
            </div>

            <div class="col-md-2">
                <br>
                <br>
                <span id="saucer-target-right"  class="saucer-target" >target on no inner span</span>
            </div>`;

        jasmine.getFixtures().set(html);

        $target = $('#saucer-target-right');
        $saucer = $('#saucer-btn-right');

        saucerEasterEgg = $('#saucer-target-right')
                .flyingSaucerAttack(
                        {
                            saucer: '#saucer-btn-right',
                            label: 'labeltext',
                            snd: null,
                            makeGlobal: true
                        });
    });

    it("jasmine for jasmine-jquery is  defined", function () {
        expect(jasmine).toBeDefined();
    });

    it("saucerEaster egg is defined and returned from makeGlobal true", function () {
         expect(saucerEasterEgg).toBeDefined();
    });


    describe("testing utils", function () {

        it("saucerEaster egg utils are  defined", function () {
            //  console.log('saucerEasterEgg.utils:', saucerEasterEgg.utils);
            expect(saucerEasterEgg.utils).toBeDefined();
        });

        it("getDistToTarget should return an object", function () {
            var distObj = saucerEasterEgg.utils.getDistToTarget($saucer, $target);
            expect(distObj.vToCiel).toEqual(116);
        });

        it("appendCssToPage leave a style tag in html", function () {
            var styleElementClass = 'my-css-class';
            saucerEasterEgg.utils.appendCssToPage('body {color: red}', styleElementClass);

            var $styleClass = $('.' + styleElementClass);

            expect($styleClass.length).toEqual(1);
            expect($styleClass.html()).toContain('color: red');

        });

        it("clearPage should remove a previous appended Style ", function () {
            var styleElementClass = 'my-css-class';
            saucerEasterEgg.utils.appendCssToPage('body {color: red}', styleElementClass);

            saucerEasterEgg.utils.clearPage($saucer, $target, styleElementClass);

            var $styleClass = $('.' + styleElementClass);
            expect($styleClass.length).toEqual(0);
        });


        it("getStyleElementClass should contain a parseble number", function () {
            var styleElementClass = saucerEasterEgg.utils.getStyleElementClass().replace(/saucer/gi, '');
            console.log('styleElementClass', styleElementClass);
            var retNum = parseInt(styleElementClass);
            expect(retNum).toBeGreaterThan(10);

        });
    });

    describe("testing anims", function () {
        
        it("flyAbove should return a promise ", function () {
            
            var ret = saucerEasterEgg.anims.flyAbove($target, $saucer) ;
            console.log('re===============t', ret);
            
            expect(ret.then).toBeDefined();
            expect( typeof(ret.then) ).toEqual('function');
           
        });
        

    });

    describe("testing actions", function () {

    });

});


