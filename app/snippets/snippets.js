

///////////////////////////////////
// Scroll Top Smooth Animation
///////////////////////////////////
$('#scroll').click(function(){ 
    $("html, body").animate({ scrollTop: 0 }, 600); 
    return false; 
  }); 

//////////////////////////////////////////////////////////////////
// Slick Custom arrow + Custom Append Arrow + Ask For Nav
//////////////////////////////////////////////////////////////////
$('.className').slick({
    dots: false,
    infinite: false,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows:true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade:true,
    asNavFor: '.nav-slider',
    appendArrows: '.image-slider-arrow-folder-name',
    prevArrow: '<span class="slick-arrow arrow-left"><i class="icofont-long-arrow-left"></i></span>',
    nextArrow: '<span class="slick-arrow arrow-right"><i class="icofont-long-arrow-right"></i></span>'
})

//////////////////////////////////
// Isotop Activation Js
//////////////////////////////////
$('.mesonry-list').imagesLoaded(function () {

    // filter items on button click
    $('.messonry-button').on('click', 'button', function () {
        var filterValue = $(this).attr('data-filter');
        $(this).siblings('.is-checked').removeClass('is-checked');
        $(this).addClass('is-checked');
        $grid.isotope({
            filter: filterValue
        });
    });

    // init Isotope
    var $grid = $('.mesonry-list').isotope({
        percentPosition: true,
        transitionDuration: '0.7s',
        layoutMode: 'masonry',
        masonry: {
            columnWidth: '.resizer',
        }
    });

});