// Document ready
$(document).ready(function(){

  //SVG Fallback
  if(!Modernizr.svg) {
    $("img[src*='svg']").attr("src", function() {
      return $(this).attr("src").replace(".svg", ".png");
    });
  };

  // Retina
  if( 'devicePixelRatio' in window && window.devicePixelRatio == 2 || window.devicePixelRatio == 3  ){
    var img_to_replace = jQuery( 'img.replace-2x' ).get();

    for (var i=0,l=img_to_replace.length; i<l; i++) {
      var src = img_to_replace[i].src;
      src = src.replace(/\.(png|jpg|gif)+$/i, '@2x.$1');
      img_to_replace[i].src = src;
    };
  }

  // Main slider
  $('#main-slider').bxSlider({
    mode: 'fade',
    pagerCustom: '#main-slider__pagination',
    auto: true,
    easing: 'ease',
    autoControls: false,
    speed: 1500,
    autoHover: true
  });

  // Seo text
  $('#seo-text__body').on('hide.bs.collapse', function () {
    $('#seo-text__btn').html('Показать<i class="zmdi zmdi-chevron-down"></i>');
  })
  $('#seo-text__body').on('show.bs.collapse', function () {
    $('#seo-text__btn').html('Скрыть<i class="zmdi zmdi-chevron-up"></i>');
  })

  // image zoom
  $('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    mainClass: 'mfp-img-mobile',
    image: {
      verticalFit: true
    }
  });

  // Magnific popup gallery
  $('.gallery').each(function() {
      $(this).magnificPopup({
        delegate: '.gallery-item',
        type: 'image',
        gallery:{
          enabled:true
        },
        zoom: {
          enabled: true, // By default it's false, so don't forget to enable it

          duration: 300, // duration of the effect, in milliseconds
          easing: 'ease-in-out', // CSS transition easing function

          // The "opener" function should return the element from which popup will be zoomed in
          // and to which popup will be scaled down
          // By defailt it looks for an image tag:
          opener: function(openerElement) {
            // openerElement is the element on which popup was initialized, in this case its <a> tag
            // you don't need to add "opener" option if this code matches your needs, it's defailt one.
            return openerElement.is('img') ? openerElement : openerElement.find('img');
          }
        }
      });
  });

  // mobile navigation
  // Clone novigation and language
  $('.navigation ul').clone().appendTo('.mobile');
  $('.language ul').clone().appendTo('.language__mobile');

  // Popup video
  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,

		fixedContentPos: false
	});

  // News text height
  $('#news__row .news__block').matchHeight();

  //Chrome Smooth Scroll
  try {
      $.browserSelector();
      if($("html").hasClass("chrome")) {
          $.smoothScroll();
      }
  } catch(err) {

  };

  // simpleForm
  simpleForm('form.form-contacts');
  simpleForm('form.form-subscription__sms');
  simpleForm('form.form-subscription__email');
})

$(window).load(function() {
  // $(".loader_inner").fadeOut();
  $(".loader").delay(400).fadeOut("slow");

  // custom scroll
  $(".scroll__body").mCustomScrollbar({
    theme: "light-thin",
    axis: "x",
    mouseWheel: false,
    scrollInertia: 0,
    scrollButtons: {
      enable: false,
      scrollType: "stepless"
    },
    contentTouchScroll: true,
    documentTouchScroll: true,
    advanced: { updateOnImageLoad: false }
  });

  // Page scroll to
  $("a[rel='m_PageScroll2id']").mPageScroll2id({
    scrollSpeed: 500,
    scrollEasing: 'easeOutSine'
  });
});

// mobile navigation
function initMenu () {
  var ourClass = 'slideout';
  var ourElem = $('.slideout-menu');
  $(document).on('click', '.toggle-button', function(e){
    var action = '';
    if ($(ourElem).hasClass(ourClass)) {
      action = 'removeClass';
    }
    else {
      action = 'addClass';
    }
    $('body')[action](ourClass);
    $(ourElem)[action](ourClass);
  });

  $(window).resize(function(){
    if ($(window).width() >= 992 && $(ourElem).length && $(ourElem).hasClass(ourClass)) {
      $('body').removeClass(ourClass);
      $(ourElem).removeClass(ourClass);
    }
  });
}
$(window).ready(initMenu);

/*
version 2015-09-23 14:30 GMT +2
*/
function simpleForm(form, callback) {
  $(document).on('submit', form, function(e){
      e.preventDefault();

      var formData = {};

      var hasFile = false;

      if ($(this).find('[type=file]').length < 1) {
          formData = $(this).serialize();
      }
      else {
          formData = new FormData();
          $(this).find('[name]').each(function(){

              switch($(this).prop('type')) {

                  case 'file':
                      if ($(this)[0]['files'].length > 0) {
                          formData.append($(this).prop('name'), $(this)[0]['files'][0]);
                          hasFile = true;
                      }
                      break;

                  case 'radio':
                  case 'checkbox':
                      if (!$(this).prop('checked')) {
                          break;
                      }
                      formData.append($(this).prop('name'), $(this).val().toString());
                      break;

                  default:
                      formData.append($(this).prop('name'), $(this).val().toString());
                      break;
              }
          });
      }

      $.ajax({
          url: $(this).prop('action'),
          data: formData,
          type: 'POST',
          contentType : hasFile ? 'multipart/form-data' : 'application/x-www-form-urlencoded',
          cache       : false,
          processData : false,
          success: function(response) {
              $(form).removeClass('ajax-waiting');
              $(form).html($(response).find(form).html());

              if (typeof callback === 'function') {
                  callback(response);
              }
          }
      });

      $(form).addClass('ajax-waiting');

      return false;
  });
}
