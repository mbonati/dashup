(function() {
  var equalizeColumns, limitPaginationItems, navSelector;

  $(function() {
    $('.disabled').each(function() {
      $(this).attr('tabindex', '-1');
      $(this).find('a').attr('tabindex', '-1');
      return $(this).find('input, select, textarea').addClass('disabled').attr('tabindex', '-1').attr('readonly', 'readyonly');
    });
    $('body').on('click', '.disabled, .disabled *', function(e) {
      e.preventDefault();
      return false;
    });
  });

  $(window).load(function() {
    return equalizeColumns();
  });

  $(window).resize(function() {
    return equalizeColumns();
  });

  equalizeColumns = function() {
    return $('.row.equalize').each(function() {
      var $row, collapsed, tallest;

      $row = $(this);
      tallest = 0;
      collapsed = false;
      $(this).children('*').each(function(i) {
        $(this).css('min-height', '1px');
        collapsed = $(this).outerWidth() === $row.outerWidth();
        if (!collapsed) {
          if (!$(this).hasClass('equal')) {
            $(this).addClass('equal');
          }
          if ($(this).outerHeight() > tallest) {
            return tallest = $(this).outerHeight();
          }
        }
      });
      if (!collapsed) {
        return $(this).children('*').css('min-height', tallest);
      }
    });
  };

  $(function() {
    $('body').on('click', '\
    .error input, \
    .error textarea, \
    .invalid input, \
    .invalid textarea, \
    input.error, \
    textarea.error, \
    input.invalid, \
    textarea.invalid', function(e) {
      return $(this).focus().select();
    });
    $('span.select select').each(function() {
      if ($(this).children('option').first().val() === '' && $(this).children('option').first().attr('selected')) {
        return $(this).addClass('unselected');
      } else {
        return $(this).removeClass('unselected');
      }
    });
    $('body').on('change', 'span.select select', function(e) {
      if ($(this).children('option').first().val() === '' && $(this).children('option').first().attr('selected')) {
        return $(this).addClass('unselected');
      } else {
        return $(this).removeClass('unselected');
      }
    });
  });

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

  /*
   * Requires jquery.modals.js
  */


  $(function() {
    return $('div.modal, div[role=dialog]').modal();
  });

  $(function() {
    limitPaginationItems();
    $('body').on('click', '.pagination ul > li:not(.next, .prev) a', function(e) {
      $('.pagination ul > li:not(.next, .prev)').removeClass('active');
      $(this).parent('li').addClass('active');
      if ($(this).parent('li').hasClass('first')) {
        $('.pagination ul > li.prev').addClass('disabled');
      } else {
        $('.pagination ul > li.prev').removeClass('disabled');
      }
      if ($(this).parent('li').hasClass('last')) {
        $('.pagination ul > li.next').addClass('disabled');
      } else {
        $('.pagination ul > li.next').removeClass('disabled');
      }
      limitPaginationItems();
      e.preventDefault();
      return false;
    });
    $('body').on('click', '.pagination ul > li.prev:not(.disabled)', function(e) {
      var el;

      $('.pagination ul > li.next').removeClass('disabled');
      el = $('.pagination ul > li.active');
      if (!el.hasClass('first')) {
        el.removeClass('active');
        el.prev().addClass('active');
        limitPaginationItems();
      }
      if ($('.pagination ul > li.active').hasClass('first')) {
        $(this).addClass('disabled');
      }
      e.preventDefault();
      return false;
    });
    $('body').on('click', '.pagination ul > li.next:not(.disabled)', function(e) {
      var el;

      $('.pagination ul > li.prev').removeClass('disabled');
      el = $('.pagination ul > li.active');
      if (!el.hasClass('last')) {
        el.removeClass('active');
        el.next().addClass('active');
        limitPaginationItems();
      }
      if ($('.pagination ul > li.active').hasClass('last')) {
        $(this).addClass('disabled');
      }
      e.preventDefault();
      return false;
    });
    $('body').on('click', '.pagination ul > li.disabled a', function(e) {
      e.preventDefault();
      return false;
    });
  });

  $(window).resize(function() {
    return limitPaginationItems();
  });

  limitPaginationItems = function() {
    return $('.pagination ul').each(function() {
      var pagination, totalItemsWidth, visibleItemsWidth, visibleSpace, _results;

      pagination = $(this);
      visibleSpace = pagination.outerWidth() - pagination.children('li.prev').outerWidth() - pagination.children('li.next').outerWidth();
      totalItemsWidth = 0;
      pagination.children('li').each(function() {
        return totalItemsWidth += $(this).outerWidth();
      });
      pagination.children('li').not('.prev, .next, .active').hide();
      visibleItemsWidth = 0;
      pagination.children('li:visible').each(function() {
        return visibleItemsWidth += $(this).outerWidth();
      });
      _results = [];
      while ((visibleItemsWidth + 29) < visibleSpace && (visibleItemsWidth + 29) < totalItemsWidth) {
        pagination.children('li:visible').not('.next').last().next().show();
        visibleItemsWidth = 0;
        pagination.children('li:visible').each(function() {
          return visibleItemsWidth += $(this).outerWidth();
        });
        if ((visibleItemsWidth + 29) <= visibleSpace) {
          pagination.children('li:visible').not('.prev').first().prev().show();
          visibleItemsWidth = 0;
          pagination.children('li:visible').each(function() {
            return visibleItemsWidth += $(this).outerWidth();
          });
        }
        visibleItemsWidth = 0;
        _results.push(pagination.children('li:visible').each(function() {
          return visibleItemsWidth += $(this).outerWidth();
        }));
      }
      return _results;
    });
  };

  /*
   * Requires jquery.responsiveText.js
  */


  $(function() {
    return $('table.responsive').each(function(index, object) {
      var compression, max, min, padding;

      compression = 30;
      min = 8;
      max = 13;
      padding = 0;
      compression = parseFloat($(this).attr('data-compression') || compression);
      min = parseFloat($(this).attr('data-min') || min);
      max = parseFloat($(this).attr('data-max') || max);
      padding = parseFloat($(this).attr('data-padding') || padding);
      return $(object).responsiveTable({
        compressor: compression,
        minSize: min,
        maxSize: max,
        padding: padding
      });
    });
  });

  /*
   * Requires jquery.responsiveText.js
  */


  $(function() {
    return $('.responsive').not('table').each(function(index, object) {
      var $this, compression, max, min, scrollReset, scrollTime;

      compression = 10;
      min = 10;
      max = 200;
      scrollTime = 650;
      scrollReset = 200;
      compression = parseFloat($(this).attr('data-compression') || compression);
      min = parseFloat($(this).attr('data-min') || min);
      max = parseFloat($(this).attr('data-max') || max);
      $(object).responsiveText({
        compressor: compression,
        minSize: min,
        maxSize: max
      });
      $this = $(this);
      return $(this).hover((function() {
        var difference;

        difference = $this.get(0).scrollWidth - $this.width();
        if (difference > scrollTime) {
          scrollTime = difference;
        }
        if (difference > 0) {
          return $this.stop().animate({
            "text-indent": -difference
          }, scrollTime);
        }
      }), function() {
        return $this.stop().animate({
          "text-indent": 0
        }, scrollReset);
      });
    });
  });

  $(function() {
    return $('body').on('click', '.tabs > ul li a[href^=#], [role=tab] a', function(e) {
      var tabs;

      if (!$(this).hasClass('disabled')) {
        if ($(this).parents('[role=tabpanel]').length > 0) {
          tabs = $(this).parents('[role=tabpanel]');
        } else {
          tabs = $(this).parents('.tabs');
        }
        tabs.find('> ul li a, [role=tab] a').removeClass('active');
        $(this).addClass('active');
        tabs.children('div, [role=tabpanel]').removeClass('active');
        tabs.children($(this).attr('href')).addClass('active');
      }
      e.preventDefault();
      return false;
    });
  });

  $(function() {
    $('.tiles').each(function() {
      $(this).find('.tile').attr('role', 'button');
      return $(this).find('.tile[data-value=' + $(this).find('input.value, select.value').val() + ']').addClass('active');
    });
    $('body').on('click', '.tiles .tile', function(e) {
      var tiles;

      if (!$(this).hasClass('disabled')) {
        tiles = $(this).parents('.tiles');
        tiles.find('.tile').removeClass('active');
        tiles.find('input.value, select.value').val($(this).data('value')).change();
        $(this).addClass('active');
      }
      e.preventDefault();
      return false;
    });
    return $('body').on('change', '.tiles input.value, .tiles select.value', function(e) {
      var tiles;

      tiles = $(this).parents('.tiles');
      tiles.find('.tile').removeClass('active');
      return tiles.find('.tile[data-value=' + $(this).val() + ']').addClass('active');
    });
  });

  /*
   * Requires jquery.tooltips.js
  */


  $(function() {
    return $('.tooltip[title]').tooltip();
  });

  /*
   *
   *  jQuery Modals by Gary Hepting
   *  
   *  Open source under the MIT License. 
   *
   *  Copyright © 2013 Gary Hepting. All rights reserved.
   *
  */


  (function($) {
    var elems, modals;

    if ($('div#iframeModal').length < 1) {
      $('body').append('<div class="iframe modal" id="iframeModal"><iframe marginheight="0" marginwidth="0" frameborder="0"></iframe></div>');
      $('div#iframeModal').prepend('<i class="close icon-remove"></i>').prepend('<i class="fullscreen icon-resize-full"></i>');
    }
    $('a.modal').each(function() {
      $(this).attr('data-url', $(this).attr('href'));
      return $(this).attr('href', '#iframeModal');
    });
    $('a.modal').on("click", function(e) {
      $('div#iframeModal iframe').replaceWith('<iframe marginheight="0" marginwidth="0" frameborder="0" width="100%" height="100%" src="' + $(this).attr('data-url') + '"></iframe>');
      e.preventDefault();
      return false;
    });
    elems = [];
    $.fn.modal = function() {
      this.each(function() {
        var $this;

        $(this).not('#iframeModal').wrapInner('<div class="modal-content"></div>');
        $(this).prepend('<i class="close icon-remove"></i>').prepend('<i class="fullscreen icon-resize-full"></i>').appendTo('body');
        $this = $(this);
        return $('[href=#' + $(this).attr('id') + ']').on("click", function(e) {
          modals.open($(this).attr('href'), $(this).hasClass('fullscreen'));
          e.preventDefault();
          return false;
        });
      });
      $('div.modal .close').on("click", function() {
        return modals.close();
      });
      return $('div.modal .fullscreen').on("click", function() {
        return modals.fullscreen($(this).parent('div.modal'));
      });
    };
    modals = (function() {
      var close, fullscreen, open;

      $('body').addClass('modal-ready');
      if ($("#overlay").length < 1) {
        $('body').append('<div id="overlay"></div>');
      }
      $('#overlay, div.modal .close').bind("click", function(e) {
        return close();
      });
      open = function(elem, fullscreen) {
        $(window).bind("keydown", function(e) {
          var keyCode;

          keyCode = (e.which ? e.which : e.keyCode);
          if (keyCode === 27) {
            return close();
          }
        });
        $(elem).addClass("active");
        if (!$(elem).hasClass('iframe')) {
          $(elem).css({
            width: 'auto',
            height: 'auto'
          });
          $(elem).css({
            height: $(elem).outerHeight()
          });
        }
        $(elem).css({
          top: '50%',
          left: '50%',
          'margin-top': ($(elem).outerHeight() / -2) + 'px',
          'margin-left': ($(elem).outerWidth() / -2) + 'px'
        });
        setTimeout(function() {
          return $('body').addClass("modal-active");
        }, 0);
        setTimeout(function() {
          return $('body').removeClass('modal-ready');
        }, 400);
        if (fullscreen) {
          modals.fullscreen(elem);
        }
      };
      close = function() {
        var modal;

        modal = $('div.modal.active');
        $(window).unbind("keydown");
        $('body').removeClass("modal-active").addClass('modal-ready');
        if (modal.hasClass('iframe')) {
          $('div#iframeModal iframe').replaceWith('<iframe marginheight="0" marginwidth="0" frameborder="0"></iframe>');
          modal.css({
            width: '80%',
            height: '80%'
          });
        } else {
          modal.css({
            width: 'auto',
            height: 'auto'
          });
        }
        modal.css({
          top: '10%',
          left: '10%',
          'max-width': '80%',
          'max-height': '80%',
          'margin-top': 0,
          'margin-left': 0
        });
        modal.removeClass("active").removeClass("fullscreen");
        $('i.fullscreen', modal).removeClass('icon-resize-small').addClass('icon-resize-full');
      };
      fullscreen = function(elem) {
        if ($('div.modal.active').hasClass('fullscreen')) {
          $('div.modal i.fullscreen').removeClass('icon-resize-small').addClass('icon-resize-full');
          if ($('div.modal.active').hasClass('iframe')) {
            $('div.modal.active').css({
              width: '80%',
              height: '80%'
            });
          } else {
            $('div.modal.active').css({
              width: 'auto',
              height: 'auto'
            });
            $('div.modal.active').css({
              height: $('div.modal.active').outerHeight()
            });
          }
          $('div.modal.active').removeClass('fullscreen').css({
            'max-width': '80%',
            'max-height': '80%'
          });
          $('div.modal.active').delay(100).css({
            top: '50%',
            left: '50%',
            'margin-top': ($('div.modal.active').outerHeight() / -2) + 'px',
            'margin-left': ($('div.modal.active').outerWidth() / -2) + 'px'
          });
        } else {
          $('div.modal i.fullscreen').addClass('icon-resize-small').removeClass('icon-resize-full');
          $('div.modal.active').addClass('fullscreen').css({
            top: 0,
            left: 0,
            'margin-top': 0,
            'margin-left': 0,
            width: '100%',
            height: '100%',
            'max-width': '100%',
            'max-height': '100%'
          });
        }
      };
      return {
        open: open,
        close: close,
        fullscreen: fullscreen
      };
    })();
    return $(window).resize(function() {
      return $('div.modal.active').each(function() {
        if (!$(this).hasClass('fullscreen')) {
          $(this).removeClass('active').css({
            top: '50%',
            left: '50%',
            'margin-top': ($(this).outerHeight() / -2) + 'px',
            'margin-left': ($(this).outerWidth() / -2) + 'px'
          }).addClass('active');
          if (!$(this).hasClass('iframe')) {
            $(this).css({
              height: 'auto'
            });
            return $(this).css({
              height: $(this).outerHeight()
            });
          }
        }
      });
    });
  })(jQuery);

  /*
   *
   *  jQuery Popovers by Gary Hepting - https://github.com/ghepting/jquery-popovers
   *  
   *  Open source under the MIT License. 
   *
   *  Copyright © 2013 Gary Hepting. All rights reserved.
   *
  */


  (function($) {
    return $.fn.popover = function(options) {
      var closePopover, defaults, delayAdjust, delayHide, getElementPosition, popover, resetPopover, setPosition, showPopover, trigger;

      defaults = {
        hover: false,
        click: true,
        resize: true,
        scroll: true,
        topOffset: 0,
        delay: 500,
        speed: 100
      };
      options = $.extend(defaults, options);
      popover = $('#popover');
      delayHide = '';
      delayAdjust = '';
      trigger = '';
      getElementPosition = function(el) {
        var bottom, left, offset, right, top, win;

        offset = el.offset();
        win = $(window);
        return {
          top: top = offset.top - win.scrollTop(),
          left: left = offset.left - win.scrollLeft(),
          bottom: bottom = win.height() - top - el.outerHeight(),
          right: right = win.width() - left - el.outerWidth()
        };
      };
      resetPopover = function(resize) {
        popover.css({
          top: 'auto',
          right: 'auto',
          bottom: 'auto',
          left: 'auto'
        });
        if (resize) {
          popover.css({
            width: 'auto'
          });
        }
        popover.removeClass('top');
        popover.removeClass('right');
        popover.removeClass('bottom');
        return popover.removeClass('left');
      };
      setPosition = function(trigger, skipAnimation, resize) {
        var attrs, coords, height, width;

        if (trigger) {
          if (resize) {
            resetPopover(true);
          } else {
            resetPopover();
          }
          coords = getElementPosition(trigger);
          if (popover.outerWidth() > ($(window).width() - 20)) {
            popover.css('width', $(window).width() - 20);
          }
          popover.css('max-width', Math.min($(window).width() - parseInt($('body').css('padding-left')) - parseInt($('body').css('padding-right')), parseInt(popover.css('max-width'))));
          width = popover.outerWidth();
          height = popover.outerHeight();
          attrs = {};
          if (coords.left <= coords.right) {
            popover.addClass('left');
            attrs.left = coords.left;
          } else {
            popover.addClass('right');
            attrs.right = coords.right;
          }
          if ((coords.top - options.topOffset) > (height + 20)) {
            popover.addClass('top');
            attrs.top = trigger.offset().top - height - 20;
          } else {
            popover.addClass('bottom');
            attrs.top = trigger.offset().top + 15;
          }
          popover.css(attrs);
          if (skipAnimation) {
            return popover.css({
              top: '+=10'
            });
          }
        }
      };
      closePopover = function() {
        $('.popover-trigger').removeClass('popover-trigger');
        return popover.removeClass('sticky').remove();
      };
      showPopover = function(e) {
        var tip;

        trigger = $(e.target);
        if (!trigger.hasClass('popover-trigger')) {
          closePopover();
          trigger.addClass('popover-trigger');
        }
        tip = $('#' + trigger.attr('data-content')).html();
        popover = $("<div id=\"popover\"></div>");
        if (!tip || tip === "") {
          return false;
        }
        trigger.removeAttr("title");
        popover.css("opacity", 0).html(tip).appendTo("body");
        setPosition(trigger);
        popover.animate({
          top: "+=10",
          opacity: 1
        }, options.speed);
        popover.bind("click", function(e) {
          if (e.target.tagName !== 'a') {
            popover.addClass('sticky');
            e.stopPropagation();
            e.preventDefault();
            return false;
          }
        });
        popover.find('.close').bind("click", function(e) {
          $('.popover-trigger').removeClass('popover-trigger');
          popover.removeClass('sticky').remove();
          e.stopPropagation();
          e.preventDefault();
          return false;
        });
        return popover.bind({
          mouseenter: function() {
            return clearTimeout(delayHide);
          },
          mouseleave: function() {
            if (!popover.hasClass('sticky')) {
              return delayHide = setTimeout((function() {
                $('.popover-trigger').removeClass('popover-trigger');
                return popover.removeClass('sticky').remove();
              }), 500);
            }
          }
        });
      };
      return this.each(function() {
        var $this;

        $this = $(this);
        if (options.hover) {
          $this.bind({
            mouseenter: function(e) {
              trigger = $(e.target);
              clearTimeout(delayHide);
              if (!$this.hasClass('popover-trigger') && !popover.hasClass('sticky')) {
                return showPopover(e);
              }
            },
            mouseleave: function() {
              if (!popover.hasClass('sticky')) {
                return delayHide = setTimeout(function() {
                  return closePopover();
                }, options.delay);
              }
            }
          });
        }
        if (options.click) {
          $this.bind("click", function(e) {
            trigger = $(e.target);
            if (!trigger.hasClass('popover-trigger')) {
              closePopover();
              showPopover(e);
            }
            popover.addClass('sticky');
            e.preventDefault();
            e.stopPropagation();
            return false;
          });
        }
        if (options.resize) {
          $(window).resize(function() {
            clearTimeout(delayAdjust);
            return delayAdjust = setTimeout(function() {
              return setPosition(trigger, true, true);
            }, 100);
          });
        }
        if (options.scroll) {
          $(window).scroll(function() {
            return setPosition(trigger, true);
          });
        }
        return $('html, body').bind("click", function(e) {
          $('.popover-trigger').removeClass('popover-trigger');
          return popover.removeClass('sticky').remove();
        });
      });
    };
  })(jQuery);

  /*
   *
   *  jQuery ResponsiveTables by Gary Hepting - https://github.com/ghepting/responsiveTables
   *  
   *  Open source under the MIT License. 
   *
   *  Copyright © 2013 Gary Hepting. All rights reserved.
   *
  */


  (function($) {
    var elems;

    elems = [];
    $.fn.responsiveTable = function(options) {
      var settings;

      settings = {
        compressor: options.compressor || 10,
        minSize: options.minSize || Number.NEGATIVE_INFINITY,
        maxSize: options.maxSize || Number.POSITIVE_INFINITY,
        padding: 2,
        height: "auto",
        adjust_parents: true
      };
      return this.each(function() {
        var columns, elem, fontSize, rows;

        elem = $(this);
        elem.attr('data-compression', settings.compressor);
        elem.attr('data-min', settings.minSize);
        elem.attr('data-max', settings.maxSize);
        elem.attr('data-padding', settings.padding);
        columns = $("tr", elem).first().children("th, td").length;
        rows = $("tr", elem).length;
        if (settings.height !== "auto") {
          $this.css("height", settings.height);
          if (settings.adjust_parents) {
            $this.parents().each(function() {
              return $(this).css("height", "100%");
            });
          }
        }
        $("tr th, tr td", elem).css("width", Math.floor(100 / columns) + "%");
        $("tr th, tr td", elem).css("height", Math.floor(100 / rows) + "%");
        fontSize = Math.floor(Math.max(Math.min(elem.width() / settings.compressor, parseFloat(settings.maxSize)), parseFloat(settings.minSize)));
        $("tr th, tr td", elem).css("font-size", fontSize + "px");
        return elems.push(elem);
      });
    };
    return $(window).on("resize", function() {
      return $(elems).each(function() {
        var elem, fontSize;

        elem = $(this);
        fontSize = Math.floor(Math.max(Math.min(elem.width() / (elem.attr('data-compression')), parseFloat(elem.attr('data-max'))), parseFloat(elem.attr('data-min'))));
        return $("tr th, tr td", elem).css("font-size", fontSize + "px");
      });
    });
  })(jQuery);

  /*
   *
   *  jQuery ResponsiveText by Gary Hepting - https://github.com/ghepting/responsiveText
   *  
   *  Open source under the MIT License. 
   *
   *  Copyright © 2013 Gary Hepting. All rights reserved.
   *
  */


  (function($) {
    var elems;

    elems = [];
    $.fn.responsiveText = function(options) {
      var settings;

      settings = {
        compressor: options.compressor || 10,
        minSize: options.minSize || Number.NEGATIVE_INFINITY,
        maxSize: options.maxSize || Number.POSITIVE_INFINITY
      };
      return this.each(function() {
        var elem;

        elem = $(this);
        elem.attr('data-compression', settings.compressor);
        elem.attr('data-min', settings.minSize);
        elem.attr('data-max', settings.maxSize);
        elem.css("font-size", Math.floor(Math.max(Math.min(elem.width() / settings.compressor, parseFloat(settings.maxSize)), parseFloat(settings.minSize))));
        return elems.push(elem);
      });
    };
    return $(window).on("resize", function() {
      return $(elems).each(function() {
        var elem;

        elem = $(this);
        return elem.css("font-size", Math.floor(Math.max(Math.min(elem.width() / (elem.attr('data-compression')), parseFloat(elem.attr('data-max'))), parseFloat(elem.attr('data-min')))));
      });
    });
  })(jQuery);

  /*
   *
   *  jQuery Tooltips by Gary Hepting - https://github.com/ghepting/jquery-tooltips
   *  
   *  Open source under the MIT License. 
   *
   *  Copyright © 2013 Gary Hepting. All rights reserved.
   *
  */


  (function($) {
    return $.fn.tooltip = function(options) {
      var closetooltip, defaults, delayShow, getElementPosition, resettooltip, setPosition, showtooltip, tooltip, trigger;

      defaults = {
        topOffset: 0,
        delay: 100,
        speed: 100
      };
      options = $.extend(defaults, options);
      tooltip = $('#tooltip');
      delayShow = '';
      trigger = '';
      if ($('#tooltip').length !== 1) {
        tooltip = $("<div id=\"tooltip\"></div>");
        tooltip.appendTo("body").hide();
      }
      getElementPosition = function(el) {
        var bottom, left, offset, right, top, win;

        offset = el.offset();
        win = $(window);
        return {
          top: top = offset.top - win.scrollTop(),
          left: left = offset.left - win.scrollLeft(),
          bottom: bottom = win.height() - top - el.outerHeight(),
          right: right = win.width() - left - el.outerWidth()
        };
      };
      setPosition = function(trigger) {
        var attrs, coords, height, width;

        coords = getElementPosition(trigger);
        if (tooltip.outerWidth() > ($(window).width() - 20)) {
          tooltip.css('width', $(window).width() - 20);
        }
        attrs = {};
        tooltip.css('max-width', Math.min($(window).width() - parseInt($('body').css('padding-left')) - parseInt($('body').css('padding-right')), parseInt(tooltip.css('max-width'))));
        width = tooltip.outerWidth();
        height = tooltip.outerHeight();
        if (coords.left <= coords.right) {
          tooltip.addClass('left');
          attrs.left = coords.left;
        } else {
          tooltip.addClass('right');
          attrs.right = coords.right;
        }
        if ((coords.top - options.topOffset) > (height + 20)) {
          tooltip.addClass('top');
          attrs.top = (trigger.offset().top - height) - 20;
        } else {
          tooltip.addClass('bottom');
          attrs.top = trigger.offset().top + trigger.outerHeight() - 4;
        }
        return tooltip.css(attrs);
      };
      resettooltip = function() {
        return tooltip.text('').removeClass().css({
          left: 'auto',
          right: 'auto',
          top: 'auto',
          bottom: 'auto',
          width: 'auto',
          'padding-left': 'auto',
          'padding-right': 'auto'
        });
      };
      closetooltip = function() {
        tooltip.stop().hide();
        resettooltip();
        return $('[role=tooltip]').removeClass('on');
      };
      showtooltip = function(trigger) {
        clearTimeout(delayShow);
        return delayShow = setTimeout(function() {
          tooltip.css({
            "opacity": 0,
            "display": "block"
          }).text(trigger.attr('data-title'));
          $.each(['disabled', 'info', 'alert', 'warning', 'error', 'success', 'green', 'blue', 'purple', 'yellow', 'orange', 'red', 'asphalt'], function(index, value) {
            if (trigger.hasClass(value)) {
              return tooltip.addClass(value);
            }
          });
          setPosition(trigger);
          trigger.addClass('on');
          return tooltip.animate({
            top: "+=10",
            opacity: 1
          }, options.speed);
        }, options.delay);
      };
      this.each(function() {
        var $this;

        $this = $(this);
        $this.attr('role', 'tooltip').attr('data-title', $this.attr('title'));
        return $this.removeAttr("title");
      });
      $('body').on('focus', '[role=tooltip]', function() {
        return showtooltip($(this));
      }).on('blur', '[role=tooltip]', function() {
        clearTimeout(delayShow);
        return closetooltip();
      }).on('mouseenter', '[role=tooltip]:not(input,select,textarea)', function() {
        return showtooltip($(this));
      }).on('mouseleave', '[role=tooltip]:not(input,select,textarea)', function() {
        clearTimeout(delayShow);
        return closetooltip();
      });
      return $(window).on({
        scroll: function() {
          trigger = $('[role=tooltip].on');
          if (trigger.length) {
            setPosition(trigger);
            return $('#tooltip').css({
              top: "+=10"
            });
          }
        }
      });
    };
  })(jQuery);

}).call(this);
