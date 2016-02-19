(function($) {
  if (!$.browser) {
    var userAgent = navigator.userAgent.toLowerCase();
    $.browser = {
      version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, "0"])[1],
      chrome: /webkit/.test(userAgent),
      safari: /webkit/.test(userAgent),
      webkit: /webkit/.test(userAgent),
      opera: /opera/.test(userAgent),
      msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
      firefox: /firefox/.test(userAgent),
      mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
    };
  };
  if (!$.cookie) {
    $.cookie = function(name, value, options) {
      name = prefixStr + name;
      if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
          value = '';
          options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
          var date;
          if (typeof options.expires == 'number') {
            date = new Date();
            date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
          } else {
            date = options.expires;
          }
          expires = '; expires=' + date.toUTCString(); //max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
      } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
            }
          }
        }
        return cookieValue;
      }
    };
  };
  $.extend(Number.prototype, {
    NaN0: function() {
      return isNaN(this) ? this : 0;
    },
    toMoney: function(type) {
      var s = this;
      if (/[^0-9\.]/.test(s)) return "0";
      if (s == null || s == "") return "0";
      s = s.toString().replace(/^(\d*)$/, "$1.");
      s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
      s = s.replace(".", ",");
      var re = /(\d)(\d{3},)/;
      while (re.test(s)) s = s.replace(re, "$1,$2");
      s = s.replace(/,(\d\d)$/, ".$1");
      if (type == 0) {
        var a = s.split(".");
        if (a[1] == "00") s = a[0];
      }
      return s;
    },
    dateDiff: function(s) {
      var dtStart = this,
        dtEnd = new Date();
      if (arguments.length > 1) dtEnd = arguments[1];
      if (typeof dtEnd == 'string') {
        dtEnd = new Date(Date.parse(dtEnd));
        if (isNaN(dtEnd)) {
          var arys = dtEnd.split((dtEnd.indexOf('/') != -1) ? '/' : '-');
          dtEnd = new Date(arys[0], --arys[1], arys[2]);
        }
      }
      switch (s) {
        case 's':
          return parseInt((dtEnd - dtStart) / 1000);
        case 'm':
          return parseInt((dtEnd - dtStart) / 60000);
        case 'h':
          return parseInt((dtEnd - dtStart) / 3600000);
        case 'd':
          return parseInt((dtEnd - dtStart) / 86400000);
        case 'w':
          return parseInt((dtEnd - dtStart) / (86400000 * 7));
        case 'M':
          return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
        case 'y':
          return dtEnd.getFullYear() - dtStart.getFullYear();
      }
    }
  });
  $.extend(Date.prototype, {
    format: function(s) {
      if (s.length == 1 && !/^[0-9]+.?[0-9]*$/.test(s)) {
        return this.getFullYear() + s + (this.getMonth() + 1) + s + this.getDate();
      }
      var week = ['日', '一', '二', '三', '四', '五', '六'];
      s = s.replace(/yyyy|YYYY/, this.getFullYear());
      s = s.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
      s = s.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1).toString());
      s = s.replace(/M/g, this.getMonth() + 1);
      s = s.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
      s = s.replace(/d|D/g, this.getDate());
      s = s.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
      s = s.replace(/h|H/g, this.getHours());
      s = s.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
      s = s.replace(/m/g, this.getMinutes());
      s = s.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
      s = s.replace(/s|S/g, this.getSeconds());
      s = s.replace(/ms|MS/, this.getMilliseconds());
      s = s.replace(/q|Q/, Math.floor((this.getMonth() + 3) / 3));
      s = s.replace(/w|W/g, week[this.getDay()]);
      return s;
    }
  });
  $.extend(String.prototype, {
    isPositiveInteger: function() { //是否为正整数
      return (new RegExp(/^[1-9]\d*$/).test(this));
    },
    isInteger: function() { //是否为整数
      return (new RegExp(/^\d+$/).test(this));
    },
    isNumber: function() { //是否为数字
      return (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(this));
    },
    isAmount: function() { //是否为金额
      if (this == 0) return false;
      return (new RegExp(/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,})?$/).test(this));
    },
    isPwd: function() { //密码:6~32位,字母,数字,下划线,点
      return (new RegExp(/^([_.]|[a-zA-Z0-9]){6,32}$/).test(this));
    },
    isMail: function() { //是否为邮箱
      return (new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(this.trim()));
    },
    isMail2: function() { //是否为邮箱2
      return (new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(this.trim()));
    },
    isTel: function() { //是否为电话
      return (new RegExp(/^(\(\d{3,4}\)|\d{3,4}(-|\s|))?\d{7,8}$/).test(this));
    },
    isMobile: function() { //是否为手机
      return (new RegExp(/^(86)*0*1[3458]{1}\d{9}$/).test(this));
    },
    isPhone: function() { //是否为联系方式
      return (new RegExp(/(^([0-9]{3,4}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0-9]{3,4}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{3,8}$)/).test(this));
    },
    isPhone2: function() { //是否为联系方式2
      return (new RegExp(/(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/).test(this));
    },
    isPostCode: function() { //是否为邮编
      return (new RegExp(/(^[1-9]\d{5}(?!d)$)/).test(this));
    },
    isUrl: function() { //是否为Url
      return (new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(this));
    },
    isExternalUrl: function() { //是否为外部Url
      return this.isUrl() && this.indexOf("://" + document.domain) == -1;
    },
    isSpaces: function() { //是否为空白
      for (var i = 0; i < this.length; i += 1) {
        var ch = this.charAt(i);
        if (ch != ' ' && ch != "\n" && ch != "\t" && ch != "\r") {
          return false;
        }
      }
      return true;
    },
    len: function() {
      return this.replace(/[^\x00-\xff]/g, "xx").length;
    },
    trim: function() {
      return this.replace(/(^\s*)|(\s*$)|\r|\n/g, "");
    },
    ldel: function(a) {
      return this.substring(a, this.length);
    },
    rdel: function(a) {
      return this.substring(0, this.length - a);
    },
    left: function(a) {
      return this.substring(0, a);
    },
    right: function(a) {
      return this.substring(this.length - a, this.length);
    },
    startsWith: function(pattern) {
      return this.indexOf(pattern) === 0;
    },
    endsWith: function(pattern) {
      var d = this.length - pattern.length;
      return d >= 0 && this.lastIndexOf(pattern) === d;
    },
    encodeTXT: function() {
      return (this).replaceAll('&', '&amp;').replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll(" ", "&nbsp;");
    },
    replaceAll: function(os, ns) {
      return this.replace(new RegExp(os, "gm"), ns);
    },
    skipChar: function(ch) {
      if (!this || this.length === 0) {
        return '';
      }
      if (this.charAt(0) === ch) {
        return this.substring(1).skipChar(ch);
      }
      return this;
    },
    parseJSON: function() {
      if (typeof parseJSON === 'function' && JSON.parseJSON) return JSON.parseJSON(this);
      try {
        return (/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(this)) && eval('(' + this + ')');
      } catch (e) {
        return false;
      }
    }
  });
  $.fn.extend({
    hoverClass: function(className, speed) {
      var _className = className || "hover";
      return this.each(function() {
        var $this = $(this),
          mouseOutTimer;
        $this.hover(function() {
          if (mouseOutTimer) clearTimeout(mouseOutTimer);
          $this.addClass(_className);
        }, function() {
          mouseOutTimer = setTimeout(function() {
            $this.removeClass(_className);
          }, speed || 10);
        });
      });
    },
    focusClass: function(className) {
      var _className = className || "inputFocus";
      return this.each(function() {
        $(this).focus(function() {
          $(this).addClass(_className);
        }).blur(function() {
          $(this).removeClass(_className);
        });
      });
    },
    isBind: function(type) {
      var _events = $(this).data("events");
      return _events && type && _events[type];
    },
    unSelect: function() {
      $(this).css({
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none',
        'user-select': 'none'
      }).bind("selectstart", function() {
        return false;
      });
    },
    //复选框
    xlSingleCheckbox: function() {
      return $(this).each(function() {
        var parentObj = $(this);
        var checkObj = parentObj.children('input:checkbox').eq(0);
        parentObj.children().hide();
        var newObj = $('<a href="javascript:;"><i class="off">否</i><i class="on">是</i></a>').prependTo(parentObj);
        parentObj.addClass("single-checkbox");
        if (checkObj.prop("checked")) newObj.addClass("selected");
        if (checkObj.prop("disabled")) {
          newObj.css("cursor", "default");
          return;
        }
        $(newObj).click(function() {
          if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            //checkObj.prop("checked", false);
          } else {
            $(this).addClass("selected");
            //checkObj.prop("checked", true);
          }
          checkObj.trigger("click");
        });
      });
    },
    //多项复选框
    xlMultiCheckbox: function() {
      return $(this).each(function() {
        var parentObj = $(this);
        parentObj.addClass("multi-checkbox");
        parentObj.children().hide();
        var divObj = $('<div class="boxwrap"></div>').prependTo(parentObj);
        parentObj.find(":checkbox").each(function() {
          var indexNum = parentObj.find(":checkbox").index(this);
          var newObj = $('<a href="javascript:;">' + parentObj.find('label').eq(indexNum).text() + '</a>').appendTo(divObj);
          if ($(this).prop("checked")) newObj.addClass("selected");
          if ($(this).prop("disabled")) {
            newObj.css("cursor", "default");
            return;
          }
          $(newObj).click(function() {
            if ($(this).hasClass("selected")) {
              $(this).removeClass("selected");
              //parentObj.find(':checkbox').eq(indexNum).prop("checked",false);
            } else {
              $(this).addClass("selected");
              //parentObj.find(':checkbox').eq(indexNum).prop("checked",true);
            }
            parentObj.find(':checkbox').eq(indexNum).trigger("click");
            //alert(parentObj.find(':checkbox').eq(indexNum).prop("checked"));
          });
        });
      });
    },
    //多项复选框2
    xlMultiCheckbox2: function() {
      return $(this).each(function() {
        var parentObj = $(this);
        parentObj.addClass("multi-checkbox2");
        parentObj.children().hide();
        var divObj = $('<ul></ul>').prependTo(parentObj);
        parentObj.find(":checkbox").each(function() {
          var indexNum = parentObj.find(":checkbox").index(this);
          var liObj = $('<li></li>').appendTo(divObj)
          var newObj = $('<a href="javascript:;">' + parentObj.find('label').eq(indexNum).text() + '</a><i></i>').appendTo(liObj);
          if ($(this).prop("checked")) liObj.addClass("selected");
          if ($(this).prop("disabled")) {
            newObj.css("cursor", "default");
            return;
          }
          $(newObj).click(function() {
            if ($(this).parent().hasClass("selected")) {
              $(this).parent().removeClass("selected");
            } else {
              $(this).parent().addClass("selected");
            }
            parentObj.find(':checkbox').eq(indexNum).trigger("click");
            //alert(parentObj.find(':checkbox').eq(indexNum).prop("checked"));
          });
        });
      });
    },
    //单选框
    xlMultiRadio: function() {
      return $(this).each(function() {
        var parentObj = $(this);
        parentObj.addClass("multi-radio");
        parentObj.children().hide();
        var divObj = $('<div class="boxwrap"></div>').prependTo(parentObj);
        parentObj.find('input[type="radio"]').each(function() {
          var indexNum = parentObj.find('input[type="radio"]').index(this);
          var newObj = $('<a href="javascript:;">' + parentObj.find('label').eq(indexNum).text() + '</a>').appendTo(divObj);
          if ($(this).prop("checked")) newObj.addClass("selected");
          if ($(this).prop("disabled")) {
            newObj.css("cursor", "default");
            return;
          }
          $(newObj).click(function() {
            $(this).siblings().removeClass("selected");
            $(this).addClass("selected");
            parentObj.find('input[type="radio"]').prop("checked", false);
            parentObj.find('input[type="radio"]').eq(indexNum).prop("checked", true);
            parentObj.find('input[type="radio"]').eq(indexNum).trigger("click");
            //alert(parentObj.find('input[type="radio"]:checked').val());
          });
        });
      });
    },
    //单选下拉框
    xlSingleSelect: function() {
      return $(this).each(function() {
        var parentObj = $(this);
        parentObj.addClass("single-select");
        parentObj.children().hide();
        var divObj = $('<div class="boxwrap"></div>').prependTo(parentObj);
        var titObj = $('<a class="select-tit" href="javascript:;"><span></span><i></i></a>').appendTo(divObj);
        var itemObj = $('<div class="select-items"><ul></ul></div>').appendTo(divObj);
        var arrowObj = $('<i class="arrow"></i>').appendTo(divObj);
        var selectObj = parentObj.find("select").eq(0);
        selectObj.find("option").each(function(i) {
          var indexNum = selectObj.find("option").index(this);
          var liObj = $('<li>' + $(this).text() + '</li>').appendTo(itemObj.find("ul"));
          if ($(this).prop("selected")) {
            liObj.addClass("selected");
            titObj.find("span").text($(this).text());
          }
          if ($(this).prop("disabled")) {
            liObj.css("cursor", "default");
            return;
          }
          liObj.click(function() {
            $(this).siblings().removeClass("selected");
            $(this).addClass("selected");
            selectObj.find("option").prop("selected", false);
            selectObj.find("option").eq(indexNum).prop("selected", true);
            titObj.find("span").text($(this).text());
            arrowObj.hide();
            itemObj.hide();
            selectObj.trigger("change");
            //alert(selectObj.find("option:selected").val());
          });
        });
        if (selectObj.prop("disabled")) {
          titObj.css("cursor", "default");
          return;
        }
        titObj.click(function(e) {
          e.stopPropagation();
          if (itemObj.is(":hidden")) {
            $(".single-select .select-items").hide();
            $(".single-select .arrow").hide();
            arrowObj.css("z-index", "1").show();
            itemObj.css("z-index", "1").show();
          } else {
            arrowObj.css("z-index", "").hide();
            itemObj.css("z-index", "").hide();
          }
        });
        $(document).click(function(e) {
          selectObj.trigger("blur");
          arrowObj.hide();
          itemObj.hide();
        });
      });
    },
    //Tab切换
    xltabs: function(options) {
      var opts = $.extend({}, {
        onStyle: "selected",
        menuSel: ".itab-item ul li",
        contentSel: ".itab-con",
        contentChildSel: "*",
        tabEvent: "click", //触发的类型：click, mouseover
        tabStyle: "normal", //切换的动画
        direction: "top", //移动的方向：left, top
        aniMethod: "swing",
        aniSpeed: "fast",
        loaded: null
      }, options);
      return this.each(function() {
        var _this = $(this);
        var tabItem = _this.find(opts.menuSel),
          tabCon = _this.find(opts.contentSel);
        if (!tabCon) return;
        var tabConitems = tabCon.children(opts.contentChildSel);
        if (opts.tabStyle == "move" || opts.tabStyle == "move-fade" || opts.tabStyle == "move-animate") {
          var step = 0;
          tabCon.html('<div style="position:absolute;left:0;top:0;">' + tabCon.html() + '</div>');
          tabConitems = tabCon.children().children(opts.contentChildSel);
          if (opts.direction == "left") {
            step = tabConitems.outerWidth(true);
            tabCon.children().css({
              width: "9999em"
            });
            tabConitems.css({
              float: "left"
            });
          } else {
            step = tabConitems.outerHeight(true);
          }
          tabCon.css({
            position: "relative",
            overflow: "hidden",
            width: tabConitems.outerWidth(true),
            height: tabConitems.outerHeight(true)
          });
        }
        var ajaxUrl = tabItem.eq(0).attr("data-url");
        if (ajaxUrl) {
          tabConitems.html(xl.loadStr);
          tabConitems.eq(0).load(ajaxPath + ajaxUrl);
          tabItem.eq(0).removeAttr("data-url");
        }
        if (opts.tabStyle == "move-animate") var animateArgu = new Object();
        tabItem[opts.tabEvent](function() {
          var index = tabItem.index($(this));
          $(this).addClass(opts.onStyle).siblings().removeClass(opts.onStyle);
          var tabCons = tabCon.children(opts.contentChildSel);
          ajaxUrl = $(this).attr("data-url");
          if (ajaxUrl) {
            tabConitems.eq(index).load(ajaxPath + ajaxUrl);
            $(this).removeAttr("data-url");
          }
          switch (opts.tabStyle) {
            case "fade":
              if (!(tabCons.eq(index).is(":animated"))) {
                tabCons.eq(index).siblings().css("display", "none").end().stop(true, true).fadeIn(opts.aniSpeed);
              }
              break;
            case "move":
              tabCons.css(opts.direction, -step * index + "px");
              break;
            case "move-fade":
              if (tabCons.css(opts.direction) == -step * index + "px") break;
              tabCons.stop(true).css("opacity", 0).css(opts.direction, -step * index + "px").animate({
                "opacity": 1
              }, opts.aniSpeed);
              break;
            case "move-animate":
              animateArgu[opts.direction] = -step * index + "px";
              tabCons.stop(true).animate(animateArgu, opts.aniSpeed, opts.aniMethod);
              break;
            default:
              tabCons.eq(index).css("display", "block").siblings().css("display", "none");
          }
          if (opts.loaded)(opts.loaded)();
          return false;
        });
        tabItem.eq(0)[opts.tabEvent]();
      });
    },
    //智能浮动层
    xlSmartFloat: function() {
      return $(this).each(function() {
        var element = $(this);
        var obj = element.children("div");
        var top = obj.position().top;
        var pos = obj.css("position");
        $(window).scroll(function() {
          var scrolls = $(this).scrollTop();
          if (scrolls > top) {
            obj.width(element.width());
            element.height(obj.outerHeight());
            if (window.XMLHttpRequest) {
              obj.css({
                position: "fixed",
                top: 0
              });
            } else {
              obj.css({
                top: scrolls
              });
            }
          } else {
            obj.css({
              position: pos,
              top: top
            });
          }
        });
      });
    }
  });
  $.fn.live = $.fn.on ? $.fn.on : $.fn.live;
})(jQuery);