//instantiation, can be moved to other file
$('body').on("click", '#saucer-target', function (e) {
    //$(saucerSelector) -> attacks element clicked on
    console.log('click');
    $('#saucer').flyingSaucerAttack(e);
});

