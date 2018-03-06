//$('body').on("click", '#saucer-target', function (e) {
//    console.log('click');
//    $('#saucer-btn').flyingSaucerAttack(e);
//});
//
//$('body').on("click", '#saucer-target-right', function (e) {
//    console.log('click');
//    $('#saucer-btn-right').flyingSaucerAttack(e);
//});

//   $('#saucer-btn-right').flyingSaucerAttack('#saucer-target-right');
$(document).ready(function(){
   $('#saucer-target-right').flyingSaucerAttack({saucer: '#saucer-btn-right'});
   
   //todo add support for data-saucer attribute while passing no opts.
   $('#saucer-target').flyingSaucerAttack();
});