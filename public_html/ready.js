/**
 * this file calls the saucer plugin on jQuery ready. 
 * @type type
 */
$(document).ready(function(){
   $('#saucer-target-right').flyingSaucerAttack({saucer: '#saucer-btn-right', label: '- - - - get rekt!!!:) - - - -'});
   
   // with data attibute data-saucer="#saucer-btn" in html
   $('#saucer-target').flyingSaucerAttack();
});