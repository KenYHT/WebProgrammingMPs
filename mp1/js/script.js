$(document).ready(function() {
  var $win = $(window)
  , windowHeight = $win.height()
  , bodyHeight = $('body').height()
  , scrollHeight = windowHeight - bodyHeight
  , $header = $('header')
  , headerHeight = $header.height()
  , sec1Height = $('#sec1').height() + 40
  , sec2Height = sec1Height + $('#sec2').height()
  , sec3Height = sec2Height + $('#sec3').height()
  , $sec1Link = $('#sec1-link')
  , $sec2Link = $('#sec2-link')
  , $sec3Link = $('#sec3-link')
  , $sec4Link = $('#sec4-link');
  $('header').data('size', 'large');

  $win.scroll(function() {
    // resizing navbar
    if ($win.scrollTop() >= 300 && $('header').data('size') == 'large') { // resize the header to become small after scrolling a certain height
      $('header').data('size', 'small');
      $('header').stop().animate({
        height: '50px'
      }, 'fast');
    } else if ($win.scrollTop() < 300 && $('header').data('size') == 'small') { // resize the header back to large
      $('header').data('size', 'large');
      $('header').stop().animate({
        height: '80px'
      }, 'fast');
    }

    // position indicator
    $sec1Link.removeClass('link-container-highlight');
    $sec2Link.removeClass('link-container-highlight');
    $sec3Link.removeClass('link-container-highlight');
    $sec4Link.removeClass('link-container-highlight');

    if ($win.scrollTop() < sec1Height) { // looking at section 1
      $sec1Link.addClass('link-container-highlight');
    } else if ($win.scrollTop() >= sec1Height && $win.scrollTop() < sec2Height) { // looking at section 2
      $sec2Link.addClass('link-container-highlight');
    } else if ($win.scrollTop() >= sec2Height && $win.scrollTop() < sec3Height) { // looking at section 3
      $sec3Link.addClass('link-container-highlight');
    } else if ($win.scrollTop() >= sec3Height) { // looking at section 4
      $sec4Link.addClass('link-container-highlight');
    }
  });

  // smooth scrolling
  $sec1Link.click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 'slow');
  });

  $sec2Link.click(function() {
    $('html, body').animate({
      scrollTop: sec1Height
    }, 'slow');
  });

  $sec3Link.click(function() {
    $('html, body').animate({
      scrollTop: sec2Height
    }, 'slow');
  });

  $sec4Link.click(function() {
    $('html, body').animate({
      scrollTop: sec3Height
    }, 'slow');
  });


  // carousel
  var currentImage = 1
  , numImages = $('.carousel-img').length;
  $('#left-scroll').click(function() {
    $('.carousel-img:nth-child(' + currentImage + ')').animate({
      width: 'toggle'
    }, 350);
    currentImage = ((currentImage - 2 + numImages) % numImages) + 1;
    console.log(currentImage);
    $('.carousel-img:nth-child(' + currentImage + ')').animate({
      width: 'toggle'
    }, 350);
  });

  $('#right-scroll').click(function() {
    $('.carousel-img:nth-child(' + currentImage + ')').animate({
      width: 'toggle'
    }, 350);
    currentImage = (currentImage % numImages) + 1;
    $('.carousel-img:nth-child(' + currentImage + ')').animate({
      width: 'toggle'
    }, 350);
  });

  // modal
  $('#trailer-btn').click(function() {
    $('#modal').fadeIn('fast', function() {
      $('#video').fadeIn('slow');
    });
  });

  $('#modal').click(function() {
    $('#video').fadeOut('fast', function() {
      $('#modal').fadeOut('fast');
    });
  });
});