(function() {
  var navSelector;

  if ($('.nav').size() > 0) {
    navSelector = '.nav';
  } else {
    navSelector = 'nav';
  }

  $(function() {
    var delay, openMenu,
      _this = this;

    delay = '';
    openMenu = function(target) {
      return $(target).parent('li.menu').toggleClass('on');
    };
    $('body').on('mouseenter', navSelector + ' > ul > li.menu:not(.disabled)', function(e) {
      if ($(window).width() >= 768) {
        clearTimeout(delay);
        $(navSelector + ' > ul > li.menu.on').removeClass('on');
        return $(this).addClass('on');
      }
    });
    $('body').on('mouseleave', navSelector + ' > ul > li.menu:not(.disabled)', function(e) {
      if ($(window).width() >= 768) {
        return delay = setTimeout((function() {
          return $(navSelector + ' > ul > li.menu.on').removeClass('on');
        }), 350);
      }
    });
    $('body').on('click', navSelector + ' > ul > li.menu:not(.disabled) > a', function(e) {
      if (Modernizr.touch || $(window).width() < 768) {
        openMenu(e.target);
      } else {
        $(navSelector + ' > ul > li.menu.on').removeClass('on');
        $(e.target).parents('li.menu').addClass('on');
      }
      e.preventDefault();
      return false;
    });
    $('body').on('focus', navSelector + ' > ul > li:not(.on) > a', function() {
      return $(navSelector + ' > ul > li.menu.on').removeClass('on');
    });
    $('body').on('focus', navSelector + ' > ul > li.menu > a', function(e) {
      openMenu(e.target);
      e.preventDefault();
      return false;
    });
    $('body').on('click', function(e) {
      if ($(e.target).hasClass('dropdown')) {
        $(e.target).toggleClass('on');
      } else {
        if ($('.dropdown').filter('.on').length) {
          $('.dropdown').filter('.on').removeClass('on');
        }
      }
      if ($(navSelector + ' > ul > li').filter('.menu.on').length) {
        return $(navSelector + ' > ul > li').filter('.menu.on').removeClass('on');
      }
    });
    $('body').on('focus', '.dropdown', function(e) {
      return $(this).addClass('on');
    });
    $('body').on('blur', '.dropdown li:last-child a', function(e) {
      return $('.dropdown').filter('.on').removeClass('on');
    });
    $(navSelector + '.menu').each(function() {
      if (!$(this).attr('data-label')) {
        $(this).attr('data-label', 'Menu');
      }
      if (!($(this).find('.menu-toggle').length > 0)) {
        return $(this).prepend('<a href="#" class="menu-toggle"><i class="icon-reorder"></i></a>');
      }
    });
    $('body').on('click', navSelector + '.menu .menu-toggle', function(e) {
      $(this).parent(navSelector + '.menu').toggleClass('on');
      e.preventDefault();
      return false;
    });
    $('body').on('focus', '.menu-toggle', function(e) {
      return $(e.target).parent(navSelector + '.menu').addClass('on');
    });
    $('body').on('blur', navSelector + '.menu > ul > li:last-child a', function(e) {
      return $(navSelector + '.menu').filter('.on').removeClass('on');
    });
  });

  $(window).on('resize', function() {
    if ($(navSelector + ' > ul > li.menu.on').length > 1) {
      return $(navSelector + ' > ul > li.menu.on').removeClass('on').first().addClass('on');
    }
  });

}).call(this);
