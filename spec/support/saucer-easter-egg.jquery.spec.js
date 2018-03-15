/* global expect */

describe("Test flying saucer utils", function () {

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

 
       jasmine.getFixtures().set(html)

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
    
    it("saucerEaster egg is defined", function () {
      //  console.log('saucereasteregg', saucerEasterEgg);
        expect(saucerEasterEgg).toBeDefined();
    });
    
    it("saucerEaster egg utils are  defined", function () {
      //  console.log('saucerEasterEgg.utils:', saucerEasterEgg.utils);
        expect(saucerEasterEgg.utils).toBeDefined();
    });
    
    it("getDistToTarget should return an object", function () {
        var distObj = saucerEasterEgg.utils.getDistToTarget($saucer, $target);
        expect(distObj.vToCiel).toEqual(116)
    });
});


