$(document).ready(function() {
  $('select').niceSelect();


  // Scroll Top Smooth Animation
  $('#scroll').click(function(){ 
    $("html, body").animate({ scrollTop: 0 }, 600); 
    return false; 
  }); 

/*-----------------------
  --> Off Canvas Menu
  -------------------------*/
  /*Variables*/
  var $offCanvasNav = $('.off-canvas-nav'),
    $offCanvasNavSubMenu = $offCanvasNav.find('.sub-menu');

  /*Add Toggle Button With Off Canvas Sub Menu*/
  // $offCanvasNavSubMenu.parent().prepend('<span class="menu-expand"><i class="fas fa-chevron-down"></i></span>');

  /*Close Off Canvas Sub Menu*/
  // $offCanvasNavSubMenu.slideUp();

  /*Category Sub Menu Toggle*/
  $offCanvasNav.on('click', 'li a, li .menu-expand', function (e) {
    var $this = $(this);
    if (($this.parent().attr('class').match(/\b(menu-item-has-children|has-children|has-sub-menu)\b/)) && ($this.attr('href') === '#' || $this.hasClass('menu-expand'))) {
      e.preventDefault();
      if ($this.siblings('ul:visible').length) {
        $this.parent('li').removeClass('active');
        $this.siblings('ul').slideUp();
      } else {
        $this.parent('li').addClass('active');
        $this.closest('li').siblings('li').find('ul:visible').slideUp();
        $this.siblings('ul').slideDown();
      }
    }
  });

  // Off Canvas Open close
  $(".offcanvas-btn").on('click', function () {
    $(".off-canvas-wrapper").addClass('open').removeClass('menu-close');
    $("body").addClass('body-overlay offcanvas');
  });

  $(".btn-close-off-canvas").on('click', function () {
    $(".off-canvas-wrapper").removeClass('open').addClass('menu-close');
    $("body").removeClass('body-overlay offcanvas');
  });



    function clickDom() {
        $('body').on('click', function (e) {
            if($('body').hasClass('searchbar-visible')){
              $('body').removeClass('searchbar-visible');
            }
            if($(".off-canvas-wrapper").hasClass('open')){
              $(".off-canvas-wrapper").removeClass('open').addClass('menu-close');
            }
            if($("body").hasClass('body-overlay offcanvas')){
              $("body").removeClass('body-overlay offcanvas');
            }
            
        });
        $('.off-canvas-wrapper,.offcanvas-btn').on('click', function (e) {
            e.stopPropagation();
        })
    };
    clickDom();


});

