/* ========================================================================
 * Bootstrap: affix.js v3.3.1
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.1'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && colliderTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $('body').height()

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: alert.js v3.3.1
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.1'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
;
/* ========================================================================
 * Bootstrap: button.js v3.3.1
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.1'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: carousel.js v3.3.1
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.1'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var delta = direction == 'prev' ? -1 : 1
    var activeIndex = this.getItemIndex(active)
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: collapse.js v3.3.1
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.1'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true,
    trigger: '[data-toggle="collapse"]'
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.find('> .panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this })

    Plugin.call($target, option)
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: dropdown.js v3.3.1
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.1'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--                        // up
    if (e.which == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);
;
/* ========================================================================
 * Bootstrap: modal.js v3.3.1
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options        = options
    this.$body          = $(document.body)
    this.$element       = $(element)
    this.$backdrop      =
    this.isShown        = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.1'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (that.options.backdrop) that.adjustBackdrop()
      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .prependTo(this.$element)
        .on('click.dismiss.bs.modal', $.proxy(function (e) {
          if (e.target !== e.currentTarget) return
          this.options.backdrop == 'static'
            ? this.$element[0].focus.call(this.$element[0])
            : this.hide.call(this)
        }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    if (this.options.backdrop) this.adjustBackdrop()
    this.adjustDialog()
  }

  Modal.prototype.adjustBackdrop = function () {
    this.$backdrop
      .css('height', 0)
      .css('height', this.$element[0].scrollHeight)
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: tooltip.js v3.3.1
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.1'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (self && self.$tip && self.$tip.is(':visible')) {
      self.hoverState = 'in'
      return
    }

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
        var containerDim = this.getPosition($container)

        placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isHorizontal) {
    this.arrow()
      .css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isHorizontal ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this    = $(this)
      var data     = $this.data('bs.tooltip')
      var options  = typeof option == 'object' && option
      var selector = options && options.selector

      if (!data && option == 'destroy') return
      if (selector) {
        if (!data) $this.data('bs.tooltip', (data = {}))
        if (!data[selector]) data[selector] = new Tooltip(this, options)
      } else {
        if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      }
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);
;
/* ========================================================================
 * Bootstrap: popover.js v3.3.1
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.1'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this    = $(this)
      var data     = $this.data('bs.popover')
      var options  = typeof option == 'object' && option
      var selector = options && options.selector

      if (!data && option == 'destroy') return
      if (selector) {
        if (!data) $this.data('bs.popover', (data = {}))
        if (!data[selector]) data[selector] = new Popover(this, options)
      } else {
        if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      }
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);
;
/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.1
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var process  = $.proxy(this.process, this)

    this.$body          = $('body')
    this.$scrollElement = $(element).is('body') ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', process)
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.1'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset'
    var offsetBase   = 0

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.offsets = []
    this.targets = []
    this.scrollHeight = this.getScrollHeight()

    var self     = this

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: tab.js v3.3.1
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.1'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);
;
/* ========================================================================
 * Bootstrap: transition.js v3.3.1
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);
;
// extending function to include bind method if needed
// Credit to Douglas Crockford for orginal bind method included in ECMA5

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function​
      throw new TypeError ("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var aArgs = Array.prototype.slice.call (arguments, 1),
      fToBind = this,
      fNOP = function () {},
      fBound = function () {
        return fToBind.apply (this instanceof fNOP && oThis
          ? this
          : oThis,
          aArgs.concat (Array.prototype.slice.call (arguments)));
      };
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP ();
    return fBound;
  };
}
;
(function ($, Drupal, window, document, undefined) {
  UW = (typeof(UW) === 'undefined') ? {} : UW;

  UW.quicklinks = {
    
    el                      : '.uw-quicklinks',
    quicklinks              : '#quicklinks',
    screen_reader_shortcuts : '.screen-reader-shortcut',
    container               : '#uw-container',
    container_inner         : '#uw-container-inner',
    open                    : false,
    animating               : false,

    initialize : function (options) {
      if (typeof(options) === 'object'){
        for (var key in options){
          if (options.hasOwnProperty(key) && this.hasOwnProperty(key)){
            if (typeof(this.key) === 'string') {
              this[key] = options[key];
            }
          }
        }
      }
      this.$el = $(this.el);
      this.$quicklinks = $(this.quicklinks);
      this.$screen_reader_shortcuts = $(this.screen_reader_shortcuts);
      this.$container = $(this.container);
      this.$container_inner = $(this.inner);
      this.render();
      this.events();
    },

    render : function () {
      this.$el.attr( 'aria-controls', 'quicklinks' ).attr( 'aria-owns', 'quicklinks' );
    },

    events : function () {
      this.$quicklinks.on('keydown', 'a:first', this.inner_keydown.bind(this) );
      this.$quicklinks.on('keyup',   'a',       this.animate.bind(this) );
      this.$quicklinks.on('blur',    'a:last',  this.loop.bind(this) );
      this.$quicklinks.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', this.transitionEnd.bind(this));
      this.$el.bind({
        click      : this.animate.bind(this),
        touchstart : this.animate.bind(this),
        keyup      : this.animate.bind(this),
        blur       : this.blur.bind(this),
      }); 
    },
    
    animate : function ( event ) {
      event.preventDefault();

      if (this.animating || (event.keyCode && $.inArray(event.keyCode, [ 27 , 13 , 32 ]) == -1)){
        return false;
      }

      this.animating = true;
      this.$container.toggleClass('open');
      this.$quicklinks.toggleClass('open');
      this.open = this.$quicklinks.hasClass('open');

      if (!this.open) {
        this.accessible();
      }
    },

    inner_keydown : function(event) {
      if ( event.keyCode == 9 && event.shiftKey) {
        this.$el.focus();
        return false;
      }
    },

    transitionEnd : function (event) {
      if (this.open && event.target == this.$quicklinks[0]) {
        this.accessible();
      }
      this.animating = false;
    },

    accessible : function (){
      this.$el.attr( 'aria-expanded', this.open )
      this.$quicklinks.attr('aria-hidden',  ( ! this.open ).toString() )
      this.$container_inner.attr('aria-hidden', this.open.toString());
      this.$screen_reader_shortcuts.attr('aria-hidden', this.open.toString());
      if ( this.open ) {
         this.$el.attr('aria-label', 'Close quick links');
         this.$quicklinks.find('a').attr( 'tabindex', 0 ).first().focus()
      } else {
         this.$el.attr('aria-label', 'Open quick links');
         this.$quicklinks.find('a').attr( 'tabindex', -1 )
         this.$el.focus()
      }
    },

    blur : function (event) {
      if( this.open ) {
        this.$quicklinks.find('li a').first().focus();
      }
    },

    loop : function (event) {
      this.$el.focus();
    }
  }
})(jQuery, Drupal, this, this.document);
;
(function ($, Drupal, window, document, undefined) {
  UW = (typeof(UW) === 'undefined') ? {} : UW;

  UW.search = {
    
    el                      : '.uw-search',
    search                  : '#uwsearcharea',
    screen_reader_shortcuts : '.screen-reader-shortcut',
    body                    : 'body',
    open                    : false,
    animating               : false,

    initialize : function (options) {
      if (typeof(options) === 'object'){
        for (var key in options){
          if (options.hasOwnProperty(key) && this.hasOwnProperty(key)){
            if (typeof(this.key) === 'string') {
              this[key] = options[key];
            }
          }
        }
      }
      this.$el = $(this.el);
      this.$search = $(this.search);
      this.$screen_reader_shortcuts = $(this.screen_reader_shortcuts);
      this.$body = $(this.body);
      this.render();
      this.events();
    },

    render : function () {
      this.$el.attr( 'aria-controls', 'uwsearcharea' ).attr( 'aria-owns', 'uwsearcharea' );
    },

    events : function () {
      this.$search.on('keydown', 'input:first', this.inner_keydown.bind(this) );
      this.$search.on('keyup',   'input',       this.animate.bind(this) );
      this.$search.on('blur',    'button:last',  this.loop.bind(this) );
      this.$search.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', this.transitionEnd.bind(this));
      this.$el.bind({
        click      : this.animate.bind(this),
        touchstart : this.animate.bind(this),
        keyup      : this.animate.bind(this),
        blur       : this.blur.bind(this),
      }); 
    },
    
    animate : function ( event ) {
      event.preventDefault();

      if (this.animating || (event.keyCode && $.inArray(event.keyCode, [ 27 , 13 , 32 ]) == -1)){
        return false;
      }

      this.animating = true;
      this.$search.toggleClass('open');
      this.$body.toggleClass('search-open');
      this.open = this.$search.hasClass('open');

      if (!this.open) {
        this.accessible();
      }
    },

    inner_keydown : function(event) {
      if ( event.keyCode == 9 && event.shiftKey) {
        this.$el.focus();
        return false;
      }
    },

    transitionEnd : function (event) {
      if (this.open && event.target == this.$search[0]) {
        this.accessible();
      }
      this.animating = false;
    },

    accessible : function (){
      this.$el.attr( 'aria-expanded', this.open )
      this.$search.attr('aria-hidden',  ( ! this.open ).toString() )
      this.$screen_reader_shortcuts.attr('aria-hidden', this.open.toString());
      if ( this.open ) {
         this.$el.attr('aria-label', 'Close search area');
         this.$search.find('input').attr( 'tabindex', 0 ).first().focus()
      } else {
         this.$el.attr('aria-label', 'Open search area');
         this.$search.find('input').attr( 'tabindex', -1 )
         this.$el.focus()
      }
    },

    blur : function (event) {
      if( this.open ) {
        this.$search.find('input').first().focus();
      }
    },

    loop : function (event) {
      this.$el.focus();
    }
  }
})(jQuery, Drupal, this, this.document);
;
// jQuery plugin for the UW menu keyboard navigation
// Will only work with the specifc HTML code used by the UW Drupal and UW WordPress themes
( function ( $, Drupal, window, document ) {

    // Setup the jQuery plugin
    $.dawgDrops = function( element, options ) {

        // Variable that keeps track of the currently focused anchor in the menu
        // The `toplevel` property refers to the top level menu items
        // The `submen` property refers to the sub menu items under each top level menu item
        var index = {
          topmenu : 0,
          submenu : 0
        }

        // Translate the key codes into words for legibility
        , keys = {
          enter :   13,
          esc : 27,
          tab : 9,
          left : 37,
          up : 38,
          right : 39,
          down : 40,
          spacebar : 32
        }
        // Set a variable referencing the current plugin
        , this_ = this
        // Cache the current jQuery element using the plugin
        , $element = $(element)


        // Initializes the plugin
        this_.init = function() {
            // Binds the `keydown` event to the top menu and sub menu items
            $element.find('.dawgdrops-item > a').bind('keydown', toggleSubMenu )
            $element.find('.dawgdrops-menu a').bind('keydown', moveFocusInSubMenu )
        }

        // The function that handles the top level keyboard navigation
        var toggleSubMenu = function(e) {

            // Execute the correct logic based on which key is being pressed
            switch ( e.keyCode )
            {

              // When down or enter is pressed change the aria-expanded tags and focus on the first sub menu item
              case keys.enter :
              case keys.down  :

                $( e.currentTarget )
                  .attr( 'aria-expanded', 'true' )
                  .siblings('ul')
                    .attr( 'aria-expanded', 'true' )
                    .show()
                  .find('a')
                    .eq(0)
                    .focus()


                return false

              // When left is pressed move focus to the previous top level menu item
              case keys.left :
                $( e.currentTarget ).parent().prev().children('a').first().focus()
                return false


              // When right is pressed move focus to the next top level menu item
              case keys.right :
                $( e.currentTarget ).parent().next().children('a').first().focus()
                return false

              // When spacebar is pressed go to the URL the top level menu item points to
              case keys.spacebar:
                window.location.href = $( e.currentTarget ).attr('href')
                return false

            }
        }

      // This function handles the top sub level keyboard navigation
      var moveFocusInSubMenu = function(e) {

          // Get the current sub menu that's displaying
          var currentSubMenu = $( e.currentTarget ).closest('ul')
          // Get all the menu items in the current sub menu
          , currentSubMenuAnchors = currentSubMenu.find('a')


          // Execute the correct logic based on which key is being pressed
          switch ( e.keyCode ) {

            // When tab is pressed hide the current menu and reset the submenu index to zero
            // The browser will handle the moving of the focus to the next top level menu item
             case keys.tab:
                if ( currentSubMenu )
                {
                  currentSubMenu.hide()
                  index.submenu = 0
                }
                // Don't return false otherwise the default tab action will be cancelled
                break

              // When down is pressed calculate which menu item is next, set the index and focus on that menu item
              // If the last menu item is currently focused then the first menu item in the sub menu will be focused
              case keys.down:
                index.submenu = index.submenu === currentSubMenuAnchors.length-1 ? 0 : index.submenu + 1
                currentSubMenuAnchors.eq( index.submenu ).focus()
                return false

              // When up is pressed calculate which menu item is previous, set the index and focus on that menu item
              // If the first menu item is currently focused then the last menu item in the sub menu will be focused
              case keys.up :
                index.submenu = index.submenu === 0 ? currentSubMenuAnchors.length-1 : index.submenu - 1
                currentSubMenuAnchors.eq( index.submenu ).focus()
                return false

              // When left is pressed calculate which top level menu is previous and focus on it
              case keys.left:
                // Reset the current submenu index for the new submenu
                index.submenu = 0
                // Reset the aria-tags for the current submenu and focus on the previous top level menu item
                currentSubMenu.siblings('a').attr('aria-expanded', 'false')
                currentSubMenu.attr( 'aria-expanded', 'false' )
                  .hide().parent().prev().children('a').first().focus()
                return false;

              // When right is pressed calculate which top level menu is next and focus on it
              case keys.right:
                // Reset the current submenu index for the new submenu
                index.submenu = 0
                // Reset the aria-tags for the current submenu and focus on the next top level menu item
                currentSubMenu.siblings('a').attr('aria-expanded', 'false')
                currentSubMenu.attr( 'aria-expanded', 'false' )
                  .hide().parent().next().children('a').first().focus()
                return false;

              // When escape is pressed hide the current sub menu and focus on the current top level menu item
              case keys.esc:
                  // Reset the current submenu index
                  index.submenu = 0
                  currentSubMenu.attr('aria-expanded', 'false' )
                    .hide().parent().children('a').first().focus();
                  return false;

              // When spacebar or enter is pressed go to the URL the menu item links to
              case keys.spacebar:
              case keys.enter:
                window.location.href = $(e.currentTarget).attr('href')
                return false;

              // If any other key is pressed then search for a menu item that begins with that key/letter and focus on it
              default:
                var chr = String.fromCharCode(e.which)
                , exists = false;

                currentSubMenuAnchors.filter(function() {
                  exists = this.innerHTML.charAt(0) === chr
                  return exists;
                }).first().focus();
                return !exists;

          }
      }


      // Initialize the plugin
      this_.init();

    }

    // Setup the jQuery plugin
    $.fn.dawgDrops = function(options) {

        return this.each(function() {
            // Check if the plugin has already been initiated on the specific element
            if (undefined == $(this).data( 'dawgDrops' )) {
                var plugin = new $.dawgDrops( this, options );
                $(this).data( 'dawgDrops', plugin );
            }
        });

    }

})(jQuery, Drupal, this, this.document);
;

/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - http://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document, undefined) {

    // The document ready event executes when the HTML-Document is loaded
    // and the DOM is ready.
    jQuery(document).ready(function($) {

        /**
         * this displays/hides the search area
         */
        UW.search.initialize();

        /**
         * this displays/hides the quicklinks
         */
        UW.quicklinks.initialize();

        /**
         * this displays/hides the mobile-menu on a click event
         */
        $("button.uw-mobile-menu-toggle").click(function(event) {
            $("ul.uw-mobile-menu").toggle(200, "swing", function() {
                // Animation complete.
            }, function() {
                // Animation complete.
            });
        });

        /**
        * Setup the keyboard navigation for the drop down menu
        */
        $('.dawgdrops-nav').dawgDrops();
        
        /**
         * add second level menu links to toggle second level menu items.
         * only when $primary_nav is rendered as mobile-nav
         */
        $('#mobile-relative .navbar-nav > li.dawgdrops-item.expanded').prepend('<a class="dawgdrops-item-menu-link">menu</a>');
        $(".dawgdrops-item-menu-link").click(function(event) {
            // targets the dawgdrops-menu submenu in this dawgdrops-item
            $(this).next().next(".dawgdrops-menu").toggle(200, "swing", function() {
                // Animation complete.
            }, function() {
                // Animation complete.
            });
        });

    });//document.ready


    // The window load event executes after the document ready event,
    // when the complete page is fully loaded.
    jQuery(window).load(function() {

        /**
         * reposition the alert banner in the DOM
         */
        $("#uwalert-alert-message").insertAfter("header.uw-thinstrip");

    });//window.load

})(jQuery, Drupal, this, this.document);;
////Globals
var LAYOUT_TYPE; // Layout type is "special" "normal" "mvis" "tv"
var CQTR;        // Current quarter
var CYR;         // Current year
var DETAILS = "/events/colloquia/details?id=";
var TVDETAILS = "/events/colloquia/tvdetails?id=";
var END_DAY = new Array(21,15,15,31); // Day and month when quarters end (approximate)
var END_MONTH = new Array(2,5,8,11);  // Months are specified 0-11
var QTRS = new Array ("Winter","Spring","Summer","Autumn"); // Quarter names
// Search Webservice
var WS_URI = "//norfolk.cs.washington.edu/htbin-post/unrestricted/colloq/ws_search.cgi"; 
var WEBCAST = "http://www.cs.washington.edu/events/colloq_info/#webcast";
////

jQuery(document).ready(function () {
   // Hide the javascript warning
    jQuery('#requiresjs').hide();

   // Make the enter key inside the basic search box 
   // cause a search button click event.
    jQuery("#basicsearch").keyup(function(event){
	if(event.keyCode == 13){
            jQuery("#searchbutton").click();
	}
    });

   // Figure out what Quarter it is: 0=Winter, 1=Spring, 2=Summer, 3=Autumn.
   CQTR = getCurrentQuarter();
   CYR = new Date().getFullYear();

   if (jQuery("div#searchbox").length) {
        //Do the search UI
        // Use a different details page to make it use the video menu.
        DETAILS = "/events/colloquia/search/details?id=";
        // Setup UI and set default values
        initUI();
        // Use the search click event handler to do initial default search.
        searchClick();
    }
    else if (jQuery("div.tvinfobox").length) {
        //Do the TV Talks page
        LAYOUT_TYPE = "tv";
        jqQuery(location.protocol + WS_URI + "?tv=true");
    }
    else if (jQuery("div#front-page-events-content").length) {
        //Front page events list
        LAYOUT_TYPE = "frontpage";
        var terms = getDefaultSearchTerms();
        jqQuery(location.protocol + WS_URI + terms);
    }
    else {
        //Do the list UI (aka mvis)
        LAYOUT_TYPE = "mvis";
        var terms = getDefaultSearchTerms();
        jqQuery(location.protocol + WS_URI + terms);
    }
});

function getDefaultSearchTerms() {
    var ey = CYR + 1;
    if (CQTR > 1) ey++;
    return "?sq=" + QTRS[CQTR] + "&sy=" + CYR + "&eq=Autumn&ey=" + ey;
}

// Set up the search UI and set default values
function initUI() {
    //Init the quarter drop-down menus
    for (var i=0; i<4; i++) {
        var sel = ""; var sel2 = "";
        if (i==CQTR) sel = " selected=\"selected\"";
        if (i==3) sel2 = " selected=\"selected\"";
        jQuery("#sqtr").append("<option" + sel + ">" + QTRS[i] + "</option>");
        jQuery("#eqtr").append("<option" + sel2 + ">" + QTRS[i] + "</option>");
    }

    //Set up the range of possible years
    var yrs = new Array();
    for (var i=1996; i<=CYR; i++) {
        yrs.push(i);
    }
    //After Spring quarter, make the next year available.
    if (CQTR > 1) yrs.push(CYR+1);

    //Init the year dropdown menus
    for (var i=0; i<yrs.length; i++) {
        var sel = ""; var sel2 = "";
        if (yrs[i] == CYR-2) sel = " selected=\"selected\"";
        if (i+1 == yrs.length) sel2 = " selected=\"selected\"";
        jQuery("#syr").append("<option" + sel + ">" + yrs[i] + "</option>");
        jQuery("#eyr").append("<option" + sel2 + ">" + yrs[i] + "</option>");
    }

    //Init the attribute dropdowns for the advanced search
    var atts = new Array("Title","Date","Speaker Last Name","Speaker Affiliation","Abstract","All");
    var vals = new Array("Title","Date","Speaker_Last_Name","Speaker_Affiliation","Abstract","All");
    for (var i=0; i<atts.length; i++) {
        jQuery("#sel_att1").append("<option value=" + vals[i] + ">" + atts[i] + "</option>");
        jQuery("#sel_att2").append("<option value=" + vals[i] + ">" + atts[i] + "</option>");
    }

    //Init the sort dropdown for the advanced search
    var sorts = new Array("Title","Date","Speaker Last Name");
    var svals = new Array("title","date","speaker_last_name");
    for (var i=0; i<sorts.length; i++) {
        var sel = "";
        if (sorts[i]=="Date") sel = " selected=\"selected\"";
        jQuery("#sel_sort").append("<option value=" + svals[i] + sel + ">" + sorts[i] + "</option>");
    }

    // Clear text fields and checkboxes
    jQuery("input[type=text]").val("");
    jQuery("#cb_avo").attr('checked', false)
}

// Figure out what quarter it is (approximately)
// 0=Winter, 1=Spring, 2=Summer, 3=Autumn
function getCurrentQuarter() {
    var now = new Date();
    // Month and day of the end of each quarter:
    for (var i=0; i<4; i++) {
        if (now <= new Date(now.getFullYear(), END_MONTH[i], END_DAY[i])) {
            return i;
        }
    }
    return 3; //border case for 12/31
}

// The user clicks the search button
function searchClick() {
    jQuery('body').css('cursor','wait');
    // Construct the search based on the contents of the search fields.
    var terms = getSearchTerms();
    //jQuery("body").append(terms);
    // Calculate the new layout based on the search terms
    LAYOUT_TYPE = updateLayoutType();
    //IE requires the protocol (http/https) match the originating page.
    jqQuery(location.protocol + WS_URI + terms);
}

function updateLayoutType() {
    // special layout if end date is after today and sort is by date, otherwise normal layout
    if (new Date() <= getEndDateFromQtr(jQuery("#eqtr").val(), jQuery("#eyr").val())) {
        // If advanced search is visible, we require sort by date to return special layout
        if ((jQuery("#sel_sort").val() == "date") || (!jQuery("#pimg").is(":hidden"))) {
            return "special";
        } 
    }
    return "normal";
}

function getEndDateFromQtr(q,y) {
    for (var i=0; i<QTRS.length; i++) {
        if (q==QTRS[i]) {
            return new Date(y,END_MONTH[i],END_DAY[i]);
        }
    }
}

function getSearchTerms() {
    var terms = "?";
    //Start/end date
    terms += "sq=" + jQuery("#sqtr").val() ;
    terms += "&sy=" + jQuery("#syr").val() ;
    terms += "&eq=" + jQuery("#eqtr").val() ;
    terms += "&ey=" + jQuery("#eyr").val() ;
    //Basic search
    if (trimField("#basicsearch") != "") {
        terms += "&q=" + encodeURIComponent(trimField("#basicsearch")) ;
    }
    //Archive Video: Whether the attribute is 'checked' or true seems to depend on the jQuery version??
    if ((jQuery("#cb_avo").attr('checked') == "checked") ||
        (jQuery("#cb_avo").attr('checked'))) {
        terms += "&avo=true";
    }
    
    if (jQuery("#pimg").is(":hidden")) {
        // Advanced search terms
        if (trimField("#txt_s1") != "") {
            terms += "&t1=" + encodeURIComponent(trimField("#txt_s1")) ;
            terms += "&a1=" + jQuery("#sel_att1").val() ;
            if (trimField("#txt_s2") != "") {
                terms += "&bop=" + jQuery("#sel_bool").val() ;
            }
        }
        if (trimField("#txt_s2") != "") {
            terms += "&t2=" + encodeURIComponent(trimField("#txt_s2")) ;
            terms += "&a2=" + jQuery("#sel_att2").val() ;
        }
        terms += "&sort=" + jQuery("#sel_sort").val() ;
    }
    
    return terms;
}

function trimField(id) {
    return jQuery.trim(jQuery(id).val());
}

// The user clicks on the plus button to show advanced search 
function showOptions() {
    jQuery('#mo').hide();
    jQuery('#pimg').hide();
    jQuery('#mimg').show(); 
    jQuery('#hd').show(); 
    jQuery('#advsearch').show();
}

// The user clicks on the minus button to hide advanced search
function hideOptions() {
    jQuery('#mimg').hide();
    jQuery('#hd').hide();
    jQuery('#mo').show();
    jQuery('#pimg').show();
    jQuery('#advsearch').hide();
}

function jqQuery(path) {
    crossDomainAjaxQuery(path);
}

// Do a browser independent cross domain query
function crossDomainAjaxQuery(path) {
    if (jQuery.browser.msie && window.XDomainRequest) {
        // Use Microsoft XDR
        var xdr = new XDomainRequest();
        xdr.open("get", path);
        xdr.onload = function() {
            //alert(xdr.responseText);
            xmlParse(xdr.responseText);
            // XDomainRequest doesn't provide responseXml, so if you need it:
            //var dom = new ActiveXObject("Microsoft.XMLDOM");
            //dom.async = false;
            //dom.loadXML(xdr.responseText);
        };

        xdr.onprogress = function() {
            //Strangely, IE9 seems to need this function defined,
            //Otherwise it won't work on page load.
            //alert("progress");
        };

        xdr.send();
    } else {
        //All other browsers use standard jQuery ajax.
        jqAjaxQuery(path);
    }
}

function jqAjaxQuery(path) {
    //Note, cross domain fails in IE
    jQuery.ajax({
        url: path,

        success: function (result) {
            xmlParse(result);
        },

        // Normally use "xml" here. "text" allows us to easily see the results as a string
        // Note that in Firefox, "text" limits the output to 4096 characters.
        dataType: "xml",

        error: function (jqxhr, status, errorThrown) { 
            //alert(status + "; " + errorThrown);
        },

    });
}

// Put the XML into the DOM.
// There are a number of different layouts:
// 1. If sort order is date ASC and we have future talks in the result set
//    separate future talks from upcoming, and reverse the order of the 
//    upcoming talks to DESC.  This is "special" layout.
// 2. In other cases, just put them in one list, in the order received.
//    This is "normal" layout.
function xmlParse(xml) {
    if ((LAYOUT_TYPE=="special") || (LAYOUT_TYPE == "mvis")) {
        specialLayout(xml);
    }
    else if (LAYOUT_TYPE == "normal") {
        normalLayout(xml);
    }
    else if (LAYOUT_TYPE == "tv") {
        tvTalksLayout(xml);
    }
    else if (LAYOUT_TYPE == "frontpage") {
        frontPageLayout(xml);
    }
    jQuery("body").css('cursor','auto');
}

function specialLayout(xml) {
    var upcomingCnt = 0;
    var prevCnt = 0;

    //Remove any existing results 
    jQuery('#previous').empty();
    jQuery('#upcoming').empty();

    var formatFunction = formatOneTalk;
    if(LAYOUT_TYPE=="mvis") {
        formatFunction = mvisFormatOneTalk;    
    }

    jQuery(xml).find("Colloquium").each(function()
    {
        var divid = "";
        if (jQuery(this).attr("future") == "true") {
            upcomingCnt++;
            jQuery("#upcoming").append(formatFunction(jQuery(this)));
        }
        else {
	    if (jQuery(this).attr("none_scheduled") == "0") {
		prevCnt++;
		jQuery("#previous").prepend(formatFunction(jQuery(this)));
	    }
        }
    });

    //Show the elements that may have been hidden by normalLayout
    jQuery("#prevLbl").show();
    jQuery("#upcomingLbl").show();
    jQuery("#feeds").show();
    jQuery("#jumptoprev").show();

    //Remove things that depend on there being at least some content
    if (prevCnt == 0) {
        jQuery("#prevLbl").hide();
        jQuery("#jumptoprev").hide();
    }
    if (upcomingCnt == 0) {
        jQuery("#upcomingLbl").hide();    
        jQuery("#feeds").hide();
        jQuery("#jumptoprev").hide();
    }
}

// Do a two column tabular layout
function tvTalksLayout(xml) {
    var colloqArray = [];
    var dlArray = [];
    // In the first pass, separate Distinguished Lectures and other talks into 
    // two separate arrays.
    jQuery(xml).find("Colloquium").each(function()
    {
        if (RegExp('[Dd]istinguished').exec(jQuery(this).attr("class_number"))) {
            dlArray.push(tvTalksFormatOneTalk(jQuery(this)));
        }
        else {
            colloqArray.push(tvTalksFormatOneTalk(jQuery(this)));
       }
    });

    var i = 0;
    var rows = [];
    // In the second pass, generate the table rows.
    while(true) {
        if (!dlArray[i] && !colloqArray[i]) break;
        rows.push(tvTalksFormatRow(colloqArray[i],dlArray[i]));
        i++;
    }
    jQuery("table#tvtalks").append(rows.join(""));
}

function tvTalksFormatRow(colloq,dl) {
    if (!colloq) { colloq = "&nbsp;"; }
    if (!dl) { dl = "&nbsp;"; }
    return "<tr><td>" + colloq + "</td><td>" + dl + "</td></tr>";
}

function tvTalksFormatOneTalk(node) {
    var ret = "<div><strong>" + 
        node.attr("speaker_first_name") + " " + 
        node.attr("speaker_last_name") + "</strong> (" +
        node.attr("speaker_affiliation") + ") </div>";
    ret += "<div> <a href='" + TVDETAILS + 
            node.attr("ID") + "'>" + 
            node.attr("title") +
            "</a></div>";
         
    ret += "<div class='indent'>Week of " + node.attr("fdate") + "</div>";
    return ret;
}

// Format one talk in mvis style
function mvisFormatOneTalk (node) {
    if (node.attr("none_scheduled") == "1") {
	return "<div class='spacebelow'><strong>NO COLLOQUIUM SCHEDULED" +
	    "</strong> " + node.attr("fdate") + ", " + 
	    node.attr("time") + "</div>";
    }
    var ret = "<div class='talkinfo'><strong>" + 
        node.attr("speaker_first_name") + " " + 
        node.attr("speaker_last_name") + "</strong> (" +
        node.attr("speaker_affiliation") + ") ";
    if (node.attr("live_now") == "true") {
        ret += "<a href='" + WEBCAST + "' class='live_now'>Watch Live Now</a>";
    }
    ret += "</div>";
    ret += "<div class='link'> <a href='" + DETAILS + 
            node.attr("ID") + "'>" + 
            node.attr("title") +
            "</a></div>";
         
    ret += "<div>" + node.attr("dow") + ", " + node.attr("fdate") + "</div>";
    ret += "<div class='indent'>" + node.attr("time") + ", " +
                node.attr("Room") + "</div>";
    ret += "<div class='indent spacebelow'>" + node.attr("class_number") + "</div>";

    return ret;
}

// Format html for one talk in compact style
// Only include time and room for future talks.
function formatOneTalk (node) {
    if (node.attr("none_scheduled") == "1") {
	return "<div class='spacebelow'><strong>NO COLLOQUIUM SCHEDULED" +
	    "</strong> " + node.attr("fdate") + ", " + 
	    node.attr("time") + "</div>";
    }

    var ret = "<div class='talkinfo'><strong>" + 
            node.attr("speaker_first_name") + " " + 
            node.attr("speaker_last_name") + "</strong> (" +
            node.attr("speaker_affiliation") + ") " +
            node.attr("fdate") + " ";

    if (node.attr("future") == "true") {
        ret += node.attr("time") + ", " +
                node.attr("Room");
    }
    
    if (node.attr("live_now") == "true") {
        ret += " <a href='" + WEBCAST + "' class='live_now'>Watch Live Now</a>";
    }
    
    ret += "</div>";
        
    ret += "<div class='spacebelow'> <a href='" + DETAILS + 
            node.attr("ID") + "'>" + 
            node.attr("title") +
            "</a>";

    if (node.attr("acnt") != "") {
        ret += " (Archive Available)";
    }        
    ret += "</div>";
    return ret;
}

// Put talks in the DOM in the order received
function normalLayout(xml) {
    //Remove any existing results 
    jQuery('#previous').empty();
    jQuery('#upcoming').empty();

    jQuery(xml).find("Colloquium").each(function()
    {
	if (jQuery(this).attr("none_scheduled") == "0") {	
            jQuery("#upcoming").append(formatOneTalk(jQuery(this)));
	}
    });

    //Labels, feed links, etc. are superfluous in this case
    jQuery("#prevLbl").hide();
    jQuery("#upcomingLbl").hide();
    jQuery("#feeds").hide();
    jQuery("#jumptoprev").hide();

}

// Front page events block. Limit to three items.
function frontPageLayout(xml) { 
    jQuery('#front-page-events-content').empty();
    var resultCount = 0;
    jQuery(xml).find("Colloquium").each(function()
    {
        var divid = "";
        if ((jQuery(this).attr("future") == "true") && 
            (jQuery(this).attr("speaker_last_name") != "TBD") &&
            (jQuery(this).attr("speaker_first_name") != "TBD") &&
            (jQuery(this).attr("none_scheduled") == "0") &&
            (resultCount < 3)) {
            jQuery("#front-page-events-content").append(formatNodeFrontPage(jQuery(this)));
            resultCount++;
        }
    });
}

function formatNodeFrontPage(node) {
   var ret = "<div class='front-page-events-row'> <a href='" + DETAILS + 
            node.attr("ID") + "'>" + 
            "<div class='event-speaker'>" +
              node.attr("speaker_first_name") + " " + 
              node.attr("speaker_last_name") +
            "</div>" +
            "<div class='event-speaker-affiliation'>" + node.attr("speaker_affiliation") + "</div>" +
            "<div class='event-date'>" + node.attr("fdate") + "</div>" +
            "<div class='event-title'>" + node.attr("title") + " </div></a>";
    if (node.attr("live_now") == "true") {
        ret += "<a href='" + WEBCAST + 
                "' class='live_now'>Watch&nbsp;Live&nbsp;Now</a> ";
    }
    ret += "</div>";
    return ret;
}

//For debugging/dev
//Put a message in any enabled consoles
function log(msg) {
    setTimeout(function () {
        throw new Error(msg);
    }, 0);
}
;
