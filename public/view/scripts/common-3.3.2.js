/**
 * v3.3.2
 */
function mobilecheck() {
  var a = !1;
  return function(b) {
    (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(b) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(b.substr(0, 4))) && (a = !0)
  }(navigator.userAgent || navigator.vendor || window.opera), a
}
function isWeixin() {
  var a = navigator.userAgent.toLowerCase();
  return "micromessenger" == a.match(/MicroMessenger/i) ? !0 : !1
}
function countCharacters(a) {
  for (var b = 0, c = 0; c < a.length; c++) {
    var d = a.charCodeAt(c);
    d >= 1 && 126 >= d || d >= 65376 && 65439 >= d ? b++ : b += 2
  }
  return b
}
function playVideo(a) {
  if (a && a.bgAudio) {
    var b = $("#media"),
      c = $("#audio_btn"),
      d = $("#yinfu"),
      e = "1" == a.bgAudio.type ? a.bgAudio.url : PREFIX_HOST + a.bgAudio.url;
    b.attr("src", e), c.addClass("video_exist"), b.bind("canplay", function() {
      b.get(0).play()
    }).bind("play", function() {
      c.addClass("play_yinfu").removeClass("off"), d.addClass("rotate")
    }).bind("pause", function() {
      c.addClass("off").removeClass("play_yinfu"), d.removeClass("rotate")
    }), c.show().click(function() {
      $(this).hasClass("off") ? (b.get(0).play(), utilSound.pause()) : b.get(0).pause()
    })
  }
}
function renderPage(a, b, c) {
  a.templateParser("jsonParser").parse({
    def: c[b - 1],
    appendTo: "#page" + b,
    mode: "view"
  });
  var d, e, f = 1,
    g = $(".z-current").width(),
    h = $(".z-current").height();
  if (imageWidth = $(".m-img").width(), imageHeight = $(".m-img").height(), g / h >= 320 / 486 ? (f = h / 486, d = (g / f - 320) / 2) : (f = g / 320, e = (h / f - 486) / 2), e && $(".edit_area").css({
      marginTop: e
    }), d && $(".edit_area").css({
      marginLeft: d
    }), tplCount == c.length && ($("#eqMobileViewport").attr("content", "width=320, initial-scale=" + f + ", maximum-scale=" + f + ", user-scalable=no"), 320 != clientWidth && clientWidth == document.documentElement.clientWidth || isWeixin() && (navigator.userAgent.indexOf("Android") > -1 || navigator.userAgent.indexOf("Linux") > -1))) {
    var i = 320 / g,
      j = 486 / h,
      k = Math.max(i, j);
    k = k > 1 ? k : 160 * k, k = parseInt(k), $("#eqMobileViewport").attr("content", "width=320, target-densitydpi=" + k)
  }
}

var tplCount = 0;
var lxlCommon = function() {
  var a = function(a) {
      var b, c, d = a.type;
      return 0 === d && (b = "fadeIn"), 1 === d && (c = a.direction, 0 === c && (b = "fadeInLeft"), 1 === c && (b = "fadeInDown"), 2 === c && (b = "fadeInRight"), 3 === c && (b = "fadeInUp")), 6 === d && (b = "wobble"), 5 === d && (b = "rubberBand"), 7 === d && (b = "rotateIn"), 8 === d && (b = "flip"), 9 === d && (b = "swing"), 2 === d && (c = a.direction, 0 === c && (b = "bounceInLeft"), 1 === c && (b = "bounceInDown"), 2 === c && (b = "bounceInRight"), 3 === c && (b = "bounceInUp")), 3 === d && (b = "bounceIn"), 4 === d && (b = "zoomIn"), 10 === d && (b = "fadeOut"), 11 === d && (b = "flipOutY"), 12 === d && (b = "rollIn"), 13 === d && (b = "lightSpeedIn"), b
    },
    b = function(a, b, c) {
      function d(a, b, f) {
        if (f.length && e < f.length) {
          a.css("animation", "");
          var g = a.get(0);
          g.offsetWidth = g.offsetWidth, a.css("animation", b[e] + " " + f[e].duration + "s ease " + f[e].delay + "s " + (f[e].countNum ? f[e].countNum : "")), "view" == c ? (f[e].count && e == f.length - 1 && a.css("animation-iteration-count", "infinite"), a.css("animation-fill-mode", "both")) : (a.css("animation-iteration-count", "1"), a.css("animation-fill-mode", "backwards")), f[e].linear && a.css("animation-timing-function", "linear"), a.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
            e++, d(a, b, f)
          })
        }
      }
      var e = 0;
      if (b.properties && b.properties.anim) {
        var f = [];
        b.properties.anim.length ? f = b.properties.anim : f.push(b.properties.anim);
        var g = $(".element-box", a);
        g.attr("element-anim", "");
        for (var h, i = [], j = [], k = 0, l = f.length; l > k; k++) null != f[k].type && -1 != f[k].type && (h = lxlCommon.convertType(f[k]), i.push(h), j.push(f[k]));
        b.properties.anim.trigger ? a.click(function() {
          d(g, h, b.properties.anim)
        }) : d(g, i, j)
      }
    };
  return {
    convertType: a,
    animation: b
  }
}();
var lxl = function() {
  function a(a) {
    m = !0;
    for (var e, f = 0, g = d._pageData.length; g > f; f++) a == d._pageData[f].id && (e = d._pageData[f].num);
    e || (e = a);
    var h = $(d.$currentPage).find(".m-img").attr("id").charAt(4),
      i = $(d.$currentPage).siblings(".main-page").find("#page" + e);
    i && (d.$activePage = $(i).parent(".main-page").get(0), h > e ? b() : e > h && c())
  }
  function b() {
    var a = 0;
    e();
    var b = setInterval(function() {
      a += 2, "0" == d._scrollMode || "1" == d._scrollMode || "2" == d._scrollMode || "6" == d._scrollMode || "7" == d._scrollMode ? r = a : ("3" == d._scrollMode || "4" == d._scrollMode || "5" == d._scrollMode) && (q = a), f(), a >= 21 && (clearInterval(b), g())
    }, 1)
  }
  function c() {
    j = !1;
    var a = 0;
    e();
    var b = setInterval(function() {
      a -= 2, "0" == d._scrollMode || "1" == d._scrollMode || "2" == d._scrollMode || "6" == d._scrollMode || "7" == d._scrollMode ? r = a : ("3" == d._scrollMode || "4" == d._scrollMode || "5" == d._scrollMode) && (q = a), f(), -21 >= a && (clearInterval(b), g())
    }, 1)
  }
  var d, e, f, g, h, i, j, k = $(window),
    l = !0,
    m = !1,
    n = mobilecheck(),
    o = 0,
    p = 0,
    q = 0,
    r = 0,
    s = !1,
    t = !1,
    u = !0,
    v = function(a, b, c, j) {
      function v(a, b, c) {
        for (var d = ["", "webkit", "moz"], e = 0, f = d.length; f > e; e++) {
          0 != e || mobilecheck() || (b = b.substring(0, 1).toLowerCase() + b.substring(1, b.length));
          var g = c instanceof Array ? c[e] : c,
            h = d[e] + b;
          a[h] = g
        }
      }

      function w(a, b, c) {
        for (var d = ["", "-webkit-", "-moz-"], e = 0; e < d.length; e++) a.css(d[e] + b, c)
      }

      function x() {
        return $(d.$currentPage).find(".page_effect.lock").get(0) ? !1 : !0
      }

      function y() {
        if (t)
          if (v(d.$currentPage.style, "Transform", "scale(1)"), "0" == b || "1" == b || "2" == b || "6" == b) {
            var a = r > 0 ? "" : "-";
            v(d.$activePage.style, "Transform", "translateY(" + a + "100%)")
          } else {
            var a = q > 0 ? "" : "-";
            v(d.$activePage.style, "Transform", "translateX(" + a + "100%)")
          }
        setTimeout(function() {
          d.$activePage.classList.remove("z-active"), d.$activePage.classList.remove("z-move"), d._isDisableFlipPage = !1
        }, 500)
      }

      function z() {
        if (Math.abs(r) > Math.abs(q) && x())
          if (r > 0) {
            if (d._isDisableFlipPrevPage) return;
            t || u ? (t = !1, u = !1, J(!0), K(!0, "bottom center", "translateY", i)) : L(!0, "translateY", i, r, d._scrollMode)
          } else if (0 > r) {
          if (d._isDisableFlipNextPage) return;
          !t || u ? (t = !0, u = !1, J(!1), K(!1, "top center", "translateY", i)) : L(!1, "translateY", i, r, d._scrollMode)
        }
      }

      function A() {
        Math.abs(r) > Math.abs(q) && Math.abs(r) > 20 ? (M("translateY", d._scrollMode), x() || $("#audio_btn").css("opacity", 0), $(document).trigger("flipend")) : (d._isDisableFlipPage = !1, y())
      }

      function B() {
        if (Math.abs(q) > Math.abs(r) && x())
          if (q > 0) {
            if (d._isDisableFlipPrevPage) return;
            t || u ? (t = !1, u = !1, J(!0), K(!0, "center right", "translateX", h)) : L(!0, "translateX", h, q, d._scrollMode)
          } else if (0 > q) {
          if (d._isDisableFlipNextPage) return;
          !t || u ? (t = !0, u = !1, J(!1), K(!1, "center left", "translateX", h)) : L(!1, "translateX", h, q, d._scrollMode)
        }
      }

      function C() {
        Math.abs(q) > Math.abs(r) && Math.abs(q) > 20 ? (M("translateX", d._scrollMode), x() || $("#audio_btn").css("opacity", 0), $(document).trigger("flipend")) : (d._isDisableFlipPage = !1, y())
      }

      function D() {
        if (Math.abs(q) > Math.abs(r) && x())
          if (q > 0) {
            if (d._isDisableFlipPrevPage) return;
            t || u ? (t = !1, u = !1, J(!0), K(!0, "", "translateX", h)) : L(!0, "translateX", h, q, d._scrollMode)
          } else if (0 > q) {
          if (d._isDisableFlipNextPage) return;
          !t || u ? (t = !0, u = !1, J(!1), K(!1, "", "translateX", h)) : L(!1, "translateX", h, q, d._scrollMode)
        }
      }

      function E() {
        childTouched = !1, Math.abs(q) > Math.abs(r) && Math.abs(q) > 20 ? (M("translateX", d._scrollMode), x() || $("#audio_btn").css("opacity", 0), $(document).trigger("flipend")) : (d._isDisableFlipPage = !1, y())
      }

      function F() {
        if (Math.abs(r) > Math.abs(q) && x())
          if (r > 0) {
            if (d._isDisableFlipNextPage) return;
            !t || u ? (t = !0, u = !1, d.$activePage && $(d.$activePage).removeClass("z-move z-active"), J(!0), v(d.$activePage.style, "Transform", "rotateX(90deg) translateY(-" + i / 2 + "px) translateZ(" + i / 2 + "px)"), v($("#con")[0].style, "Perspective", "700px"), v($("#con")[0].style, "TransformStyle", "preserve-3d")) : l = !0, d.$activePage && d.$activePage.classList.contains("main-page") && ($(d.$activePage).addClass("z-active z-move").trigger("active").css("zIndex", 1), v(d.$currentPage.style, "Transform", "rotateX(-" + r / i * 90 + "deg) translateY(" + r / 2 + "px) translateZ(" + r / 2 + "px)"), v(d.$activePage.style, "Transform", "rotateX(" + (90 - r / i * 90) + "deg) translateY(" + (-(i / 2) + r / 2) + "px) translateZ(" + (i / 2 - r / 2) + "px)"))
          } else if (0 > r) {
          if (d._isDisableFlipNextPage) return;
          !t || u ? (t = !0, u = !1, d.$activePage && $(d.$activePage).removeClass("z-move z-active"), J(!1), v(d.$activePage.style, "Transform", "rotateX(-90deg) translateY(-" + i / 2 + "px) translateZ(-" + i / 2 + "px)"), v($("#con")[0].style, "Perspective", "700px"), v($("#con")[0].style, "TransformStyle", "preserve-3d")) : l = !0, d.$activePage && d.$activePage.classList.contains("main-page") ? ($(d.$activePage).addClass("z-active z-move").trigger("active").css("zIndex", 0), v(d.$currentPage.style, "Transform", "rotateX(" + -r / i * 90 + "deg) translateY(" + r / 2 + "px) translateZ(" + -r / 2 + "px)"), v(d.$activePage.style, "Transform", "rotateX(" + (-90 - r / i * 90) + "deg) translateY(" + (i / 2 + r / 2) + "px) translateZ(" + (i / 2 + r / 2) + "px)")) : (v(d.$currentPage.style, "Transform", "translateX(0px) scale(1)"), d.$activePage = null)
        }
      }

      function G() {
        Math.abs(r) > Math.abs(q) && Math.abs(r) > 20 ? (r > 0 ? v(d.$currentPage.style, "Transform", "rotateX(-90deg) translateY(" + i / 2 + "px) translateZ(" + i / 2 + "px)") : v(d.$currentPage.style, "Transform", "rotateX(90deg) translateY(-" + i / 2 + "px) translateZ(" + i / 2 + "px)"), v(d.$currentPage.style, "zIndex", "0"), v(d.$activePage.style, "Transform", "rotateX(0deg) translateY(0px) translateZ(0px)"), v(d.$activePage.style, "zIndex", "2"), x() || $("#audio_btn").css("opacity", 0), $(document).trigger("flipend")) : (v(d.$currentPage.style, "Transition", "none"), v(d.$activePage.style, "Transition", "none"), d._isDisableFlipPage = !1, y())
      }

      function H() {
        if (Math.abs(r) > Math.abs(q) && x())
          if (r > 0) {
            if (d._isDisableFlipNextPage) return;
            !t || u ? (t = !0, u = !1, d.$activePage && $(d.$activePage).removeClass("z-move z-active"), J(!0), v($("#con")[0].style, "Perspective", "700px"), v($("#con")[0].style, "TransformStyle", "preserve-3d"), v(d.$activePage.style, "TransformOrigin", "top"), v(d.$activePage.style, "Transform", "rotateX(90deg)")) : l = !0, d.$activePage && d.$activePage.classList.contains("main-page") && ($(d.$activePage).addClass("z-active z-move").trigger("active"), v(d.$activePage.style, "Transform", "rotateX(" + (90 - r / i * 90) + "deg) "))
          } else if (0 > r) {
          if (d._isDisableFlipNextPage) return;
          !t || u ? (t = !0, u = !1, d.$activePage && $(d.$activePage).removeClass("z-move z-active"), J(!1), v(d.$activePage.style, "TransformOrigin", "bottom"), v(d.$activePage.style, "Transform", "rotateX(-90deg)"), v($("#con")[0].style, "Perspective", "700px"), v($("#con")[0].style, "TransformStyle", "preserve-3d")) : l = !0, d.$activePage && d.$activePage.classList.contains("main-page") ? ($(d.$activePage).addClass("z-active z-move").trigger("active"), v(d.$activePage.style, "Transform", "rotateX(" + (-90 - r / i * 90) + "deg) ")) : (v(d.$currentPage.style, "Transform", "translateX(0px) scale(1)"), d.$activePage = null)
        }
      }

      function I() {
        Math.abs(r) > Math.abs(q) && Math.abs(r) > 20 ? (r > 0 ? v(d.$activePage.style, "Transform", "rotateX(0deg)") : v(d.$activePage.style, "Transform", "rotateX(0deg)"), x() || $("#audio_btn").css("opacity", 0), $(document).trigger("flipend")) : (v(d.$currentPage.style, "Transition", "none"), v(d.$activePage.style, "Transition", "none"), d._isDisableFlipPage = !1, y())
      }

      function J(a) {
        m ? l = !0 : a ? d.$currentPage.previousElementSibling && d.$currentPage.previousElementSibling.classList.contains("main-page") ? d.$activePage = d.$currentPage.previousElementSibling : (d.$activePage = d._$pages.last().get(0), l = !0) : d.$currentPage.nextElementSibling && d.$currentPage.nextElementSibling.classList.contains("main-page") ? d.$activePage = d.$currentPage.nextElementSibling : (d.$activePage = d._$pages.first().get(0), l = !0)
      }

      function K(a, b, c, e) {
        if (d.$activePage && (d.$activePage.classList.remove("z-active"), d.$activePage.classList.remove("z-move")), d.$activePage && d.$activePage.classList.contains("main-page")) {
          d.$activePage.classList.add("z-active"), d.$activePage.classList.add("z-move");
          var f = a ? "-" : "";
          d.$activePage.style.webkitTransition = "none", d.$activePage.style.webkitTransform = c + "(" + f + e + "px)", d.$activePage.style.mozTransition = "none", d.$activePage.style.mozTransform = c + "(" + f + e + "px)", d.$activePage.style.transition = "none", d.$activePage.style.transform = c + "(" + f + e + "px)", $(d.$activePage).trigger("active"), b && w($(d.$currentPage), "transform-origin", b)
        } else v(d.$currentPage.style, "Transform", c + "(0px) scale(1)")
      }

      function L(a, b, c, e, f) {
        var g = a ? "-" : "";
        w($(d.$activePage), "transform", b + "(" + g + (c - Math.abs(e)) + "px)"), "1" == f || "3" == f ? w($(d.$currentPage), "transform", "scale(" + ((c - Math.abs(e)) / i).toFixed(3) + ")") : "5" == f && w($(d.$currentPage), "transform", "translateX(" + q + "px)")
      }

      function M(a, b) {
        if ("1" == b || "3" == b) w($(d.$currentPage), "transform", "scale(0.2)");
        else if ("5" == b) {
          var c = q > 0 ? "" : "-";
          w($(d.$currentPage), "transform", "translateX(" + c + h + "px)")
        } else w($(d.$currentPage), "transform", "scale(1)");
        w($(d.$activePage), "transform", a + "(0px)")
      }
      this._$app = a, this._$pages = this._$app.find(".main-page"), this.$currentPage = this._$pages.eq(0), this.$activePage = null, this._isFirstShowPage = !0, this._isInitComplete = !1, this._isDisableFlipPage = !1, this._isDisableFlipPrevPage = !1, this._isDisableFlipNextPage = !1, this._scrollMode = b, this._pageData = c, this.pageData = j, b = b, d = this, h = n ? window.innerWidth : $(".nr").width(), i = n ? window.innerHeight : $(".nr").height(),
        function() {
          k.on("scroll.elasticity", function(a) {
            a.preventDefault()
          }).on("touchmove.elasticity", function(a) {
            a.preventDefault()
          }), 
          k.delegate("img", "mousemove", function(a) {
            a.preventDefault()
          })
        }(), d._$app.on("mousedown touchstart", function(a) {
          e(a)
        }).on("mousemove touchmove", function(a) {
          f(a)
        }).on("mouseup touchend mouseleave", function(a) {
          g(a)
        }), e = function(a) {
          firstTrigger = !1, n && a && (a = event), d._isDisableFlipPage || (d.$currentPage = d._$pages.filter(".z-current").get(0), m || (d.$activePage = null), d.$currentPage && x() && (s = !0, t = !1, u = !0, q = 0, r = 0, a && "mousedown" == a.type ? (o = a.pageX, p = a.pageY) : a && "touchstart" == a.type && (o = a.touches[0].pageX, p = a.touches[0].pageY), d.$currentPage.classList.add("z-move"), v(d.$currentPage.style, "Transition", "none")))
        }, f = function(a) {
          if (n && a && (a = event), s && d._$pages.length > 1) {
            if (a && "mousemove" == a.type ? (q = a.pageX - o, r = a.pageY - p) : a && "touchmove" == a.type && (q = a.touches[0].pageX - o, r = a.touches[0].pageY - p), !firstTrigger && (Math.abs(q) > 20 || Math.abs(r) > 20)) {
              if (d.$activePage) {
                var e = $(d.$activePage).find(".m-img").attr("id").charAt(4);
                $(d.$activePage).find("li").each(function(a) {
                  for (var b = 0; b < d._pageData[e - 1].elements.length; b++) d._pageData[e - 1].elements[b].id == parseInt($(this).attr("id").substring(7), 10) && lxlCommon.animation($(this), c[e - 1].elements[b], "view")
                })
              }
              firstTrigger = !0
            }
            "0" == b || "2" == b || "1" == b ? z() : "4" == b || "3" == b ? (console.log(123), B()) : "5" == b ? D() : "6" == b ? F() : "7" == b && H()
          }
        }, g = function(a) {
          if (s && x())
            if (s = !1, d.$activePage) {
              d._isDisableFlipPage = !0;
              var c;
              c = "6" == b || "7" == b ? "cubic-bezier(0,0,0.99,1)" : "linear", d.$currentPage.style.webkitTransition = "-webkit-transform .4s " + c, d.$activePage.style.webkitTransition = "-webkit-transform .4s " + c, d.$currentPage.style.mozTransition = "-moz-transform .4s " + c, d.$activePage.style.mozTransition = "-moz-transform .4s " + c, d.$currentPage.style.transition = "transform .4s " + c, d.$activePage.style.transition = "transform .4s " + c, "0" == b || "2" == b || "1" == b ? A() : "4" == b || "3" == b ? C() : "5" == b ? E() : "6" == b ? G() : "7" == b && I()
            } else d.$currentPage.classList.remove("z-move");
          m = !1
        }, $(document).on("flipend", function(a) {
          setTimeout(function() {
            v(d.$currentPage.style, "Transition", "none"), $(d.$activePage).removeClass("z-active z-move").addClass("z-current"), $(d.$currentPage).removeClass("z-current z-move"), d._isDisableFlipPage = !1, d.$currentPage = $(d.$activePage).trigger("current"), $(d.$currentPage).trigger("hide"), utilSound.pause(), $("#report0").length && $("#report0").remove()
          }, 500)
        })
    };
  return {
    pageScroll: a,
    nextPage: c,
    prePage: b,
    app: v
  }
}();

!function(a) {
  function b() {
    var a = {};
    this.addInterval = function(b, c) {
      a[b] = c
    }, 
    this.deleteInterval = function(b) {
      a[b] && (clearInterval(a[b]), delete a[b])
    }, 
    this.clearInterval = function() {
      for (var b in a) this.deleteInterval(b)
    };
    var b = [{
      value: 1,
      desc: "轮播",
      name: "slide"
    }, {
      value: 2,
      desc: "下落",
      name: "bars"
    }, {
      value: 3,
      desc: "百页窗",
      name: "blinds"
    }, {
      value: 4,
      desc: "消隐",
      name: "blocks"
    }, {
      value: 5,
      desc: "渐变",
      name: "blocks2"
    }, {
      value: 9,
      desc: "梳理",
      name: "zip"
    }, {
      value: 11,
      desc: "翻转",
      name: "bars3d"
    }, {
      value: 13,
      desc: "立方体",
      name: "cube"
    }, {
      value: 14,
      desc: "棋盘",
      name: "tiles3d"
    }, {
      value: 16,
      desc: "飞出",
      name: "explode"
    }];
    this.getPicStyle = function(a) {
      if (void 0 === a) return b;
      for (var c = 0; c < b.length; c++)
        if (a === b[c].value) return b[c]
    }
  }
  a.utilPictures = new b
}(window),

function(a) {
  function b() {
    var a = {
        CLICK: {
          name: "click",
          value: 1
        }
      },
      b = {
        SHOW: {
          name: "show",
          value: 1
        }
      };
    this.getSendType = function(b) {
      if (void 0 === b) return a;
      for (var c in a)
        if (b === a[c].value) return a[c];
      return null
    }, 
    this.getHandleType = function(a) {
      if (void 0 === a) return b;
      for (var c in b)
        if (a === b[c].value) return b[c];
      return null
    }
  }
  a.utilTrigger = new b
}(window),

function(a) {
  function b() {
    function a() {
      b || (b = new Audio)
    }
    var b, c;
    this.play = function(d) {
      a();
      var e = d.substr(d.lastIndexOf("/") + 1),
        f = b.src.substr(d.lastIndexOf("/") + 1);
      e == f && c ? (b.pause(), c = !1) : e != f || c ? (b.src = d, b.play(), c = !0) : (b.play(), c = !0)
    }, this.pause = function() {
      b && (b.pause(), c = !1)
    }
  }
  a.utilSound = new b
}(window), 

function(a, b) {
  function c(a) {
    function b(a, b, c) {
      return a[b] || (a[b] = c())
    }
    var c = b(a, "yyShow", Object);
    return b(c, "templateParser", function() {
      var a = {};
      return function(c, d) {
        if ("hasOwnProperty" === c) throw new Error("hasOwnProperty is not a valid name");
        return d && a.hasOwnProperty(c) && (a[c] = null), b(a, c, d)
      }
    })
  }
  function d(b) {
    templateParser = c(a)
  }
  var e = a.yyShow || (a.yyShow = {});
  d(e)
}(window, document),

function(a) {
  function b(a, b, c, d) {
    var e = {},
      f = a / b,
      g = c / d;
    return f > g ? (e.width = c, e.height = c / f) : (e.height = d, e.width = d * f), e
  }

  function c(a, b) {
    if (b.trigger) {
      var c = $(a);
      b.trigger.sends && b.trigger.sends.length && $.each(b.trigger.sends, function(a, b) {
        c.bind(utilTrigger.getSendType(b.type).name, function() {
          $.each(b.handles, function(a, b) {
            var c = utilTrigger.getHandleType(b.type).name;
            $.each(b.ids, function(a, b) {
              var d = $("#inside_" + b);
              d.trigger(c)
            })
          })
        })
      }), b.trigger.receives && b.trigger.receives.length && b.trigger.receives[0].ids.length && $.each(b.trigger.receives, function(a, b) {
        var d = utilTrigger.getHandleType(b.type).name;
        "show" == d && c.hide(), c.bind(d, function() {
          "show" == d && $(this).show()
        })
      })
    }
  }

  function d(a, b) {
    if (b.sound) {
      var c = $(a);
      c.click(function() {
        utilSound.play(PREFIX_HOST + b.sound.src);
        var a = $("#media");
        a.length && $("#media").get(0).pause()
      })
    }
  }
  var e = a.templateParser("jsonParser", function() {
    function a(a) {
      return function(b, c) {
        a[b] = c
      }
    }

    function b(a, b) {
      var c = k[("" + a.type).charAt(0)](a);
      if (c) {
        var d = $('<li comp-drag comp-rotate class="comp-resize comp-rotate inside" id="inside_' + c.id + '" num="' + a.num + '" ctype="' + a.type + '"></li>');
        3 != ("" + a.type).charAt(0) && 1 != ("" + a.type).charAt(0) && d.attr("comp-resize", ""), "p" == ("" + a.type).charAt(0) && d.removeAttr("comp-rotate"), 1 == ("" + a.type).charAt(0) && d.removeAttr("comp-drag"), 2 == ("" + a.type).charAt(0) && d.addClass("wsite-text"), 4 == ("" + a.type).charAt(0) && (a.properties.imgStyle && $(c).css(a.properties.imgStyle), d.addClass("wsite-image")), 5 == ("" + a.type).charAt(0) && d.addClass("wsite-input"), 6 == ("" + a.type).charAt(0) && d.addClass("wsite-button"), 8 == ("" + a.type).charAt(0) && d.addClass("wsite-button"), "v" == ("" + a.type).charAt(0) && d.addClass("wsite-video"), d.mouseenter(function() {
          $(this).addClass("inside-hover")
        }), d.mouseleave(function() {
          $(this).removeClass("inside-hover")
        });
        var e = $('<div class="element-box">').append($('<div class="element-box-contents">').append(c));
        if (d.append(e), 5 != ("" + a.type).charAt(0) && 6 != ("" + a.type).charAt(0) || "edit" != b || $(c).before($('<div class="element" style="position: absolute; height: 100%; width: 100%;">')), a.css) {
          var f = 320 - parseInt(a.css.left);
          d.css({
            width: f
          }), "p" == a.type && d.css({
            height: f / 2
          }), d.css({
            width: a.css.width,
            height: a.css.height,
            left: a.css.left,
            top: a.css.top,
            zIndex: a.css.zIndex,
            bottom: a.css.bottom,
            transform: a.css.transform
          }), e.css(a.css).css({
            width: "100%",
            height: "100%",
            transform: "none"
          }), e.children(".element-box-contents").css({
            width: "100%",
            height: "100%"
          }), 4 != ("" + a.type).charAt(0) && "p" != ("" + a.type).charAt(0) && $(c).css({
            width: a.css.width,
            height: a.css.height
          })
        }
        return d
      }
    }

    function e(a) {
      for (var b = 0; b < a.length - 1; b++)
        for (var c = b + 1; c < a.length; c++)
          if (parseInt(a[b].css.zIndex, 10) > parseInt(a[c].css.zIndex, 10)) {
            var d = a[b];
            a[b] = a[c], a[c] = d
          }
      for (var e = 0; e < a.length; e++) a[e].css.zIndex = e + 1 + "";
      return a
    }

    function f(a, f, g) {
      f = f.find(".edit_area").css({
        overflow: "hidden"
      });
      var h, i = a.elements;
      if (i)
        for (i = e(i), h = 0; h < i.length; h++)
          if (3 == i[h].type) {
            var j = k[("" + i[h].type).charAt(0)](i[h]);
            "edit" == g && l[("" + i[h].type).charAt(0)] && l[("" + i[h].type).charAt(0)](j, i[h])
          } else {
            var o = b(i[h], g);
            if (!o) continue;
            f.append(o);
            for (var p = 0; p < n.length; p++) n[p](o, i[h], g);
            m[("" + i[h].type).charAt(0)] && (m[("" + i[h].type).charAt(0)](o, i[h]), "edit" != g && (c(o, i[h]), d(o, i[h]))), "edit" == g && l[("" + i[h].type).charAt(0)] && l[("" + i[h].type).charAt(0)](o, i[h])
          }
    }

    function g() {
      return l
    }

    function h() {
      return k
    }

    function i(a) {
      n.push(a)
    }

    function j() {
      return n
    }
    var k = {},
      l = {},
      m = {},
      n = [],
      o = containerWidth = 320,
      p = containerHeight = 486,
      q = 1,
      r = 1,
      s = {
        getComponents: h,
        getEventHandlers: g,
        addComponent: a(k),
        bindEditEvent: a(l),
        bindAfterRenderEvent: a(m),
        addInterceptor: i,
        getInterceptors: j,
        wrapComp: b,
        mode: "view",
        parse: function(a) {
          var b = $('<div class="edit_wrapper"><ul eqx-edit-destroy id="edit_area' + a.def.id + '" comp-droppable paste-element class="edit_area weebly-content-area weebly-area-active"></div>'),
            c = this.mode = a.mode;
          this.def = a.def, "view" == c && tplCount++;
          var d = $(a.appendTo);
          return containerWidth = d.width(), containerHeight = d.height(), q = o / containerWidth, r = p / containerHeight, f(a.def, b.appendTo($(a.appendTo)), c)
        }
      };
    return s
  });
  e.addInterceptor(function(a, b, c) {
    lxlCommon.animation(a, b, c)
  }), e.addComponent("1", function(a) {
    var b = document.createElement("div");
    if (b.id = a.id, b.setAttribute("class", "element comp_title"), a.content && (b.textContent = a.content), a.css) {
      var c, d = a.css;
      for (c in d) b.style[c] = d[c]
    }
    if (a.properties.labels)
      for (var e = a.properties.labels, f = 0; f < e.length; f++) $('<a class = "label_content" style = "display: inline-block;">').appendTo($(b)).html(e[f].title).css(e[f].color).css("width", 100 / e.length + "%");
    return b
  }), e.addComponent("2", function(a) {
    var b = document.createElement("div");
    return b.id = a.id, b.setAttribute("ctype", a.type), b.setAttribute("class", "element comp_paragraph editable-text"), a.content && (b.innerHTML = a.content), b.style.cursor = "default", b
  }), e.addComponent("3", function(a) {
    var b = $("#nr .edit_area")[0];
    "view" == e.mode && (b = document.getElementById("edit_area" + e.def.id)), b = $(b).parent()[0];
    var c, d = new Image;
    return a.properties.imgSrc && (c = a.properties.imgSrc, /^http.*/.test(c) ? (d.src = c, b.style.backgroundImage = "url(" + c + ")") : (d.src = PREFIX_HOST + "/" + c, b.style.backgroundImage = "url(" + PREFIX_HOST + "/" + c + ")"), b.style.backgroundOrigin = "element content-box", b.style.backgroundSize = "cover", b.style.backgroundPosition = "50% 50%"), a.properties.bgColor && (b.style.backgroundColor = a.properties.bgColor), b
  }), e.addComponent("4", function(a) {
    var b = document.createElement("img");
    return b.id = a.id, b.setAttribute("ctype", a.type), b.setAttribute("class", "element comp_image editable-image"), a.properties.src && (/^http.*/.test(a.properties.src) ? b.src = a.properties.src : b.src = PREFIX_HOST + a.properties.src), b
  }), e.addComponent("v", function(a) {
    var b = document.createElement("a");
    return b.setAttribute("class", "element video_area"), b.id = a.id, b.setAttribute("ctype", a.type), a.properties.src && b.setAttribute("videourl", a.properties.src), b
  }), e.addComponent("5", function(a) {
    var b = document.createElement("textarea");
    return b.id = a.id, b.setAttribute("ctype", a.type), b.setAttribute("class", "element comp_input editable-text"), a.properties.required && b.setAttribute("required", a.properties.required), a.properties.placeholder && b.setAttribute("placeholder", a.properties.placeholder), b.setAttribute("name", "eq[f_" + a.id + "]"), b.style.width = "100%", b
  }), e.addComponent("p", function(a) {
    if (a.properties && a.properties.children) {
      var c = 320,
        d = a.css.width || c - parseInt(a.css.left),
        e = a.css.height || d / 2;
      a.css.width = a.css.width || d, a.css.height = a.css.height || e;
      var f = $('<div id="' + a.id + '" class="slider element" ctype="' + a.type + '"></div>');
      return a.properties.bgColor && f.css("backgroundColor", a.properties.bgColor), $.each(a.properties.children, function(a, c) {
        var g = b(c.width, c.height, d, e),
          h = $('<img src="' + PREFIX_HOST + c.src + '">');
        h.css({
          margin: (e - g.height) / 2 + "px " + (d - g.width) / 2 + "px",
          width: g.width,
          height: g.height
        }), f.append(h)
      }), utilPictures.deleteInterval(a.id), f.get(0)
    }
  }), e.addComponent("6", function(a) {
    var b = document.createElement("button");
    if (b.id = a.id, b.setAttribute("ctype", a.type), b.setAttribute("class", "element comp_button editable-text"), a.properties.title) {
      var c = a.properties.title.replace(/ /g, "&nbsp;");
      b.innerHTML = c
    }
    return b.style.width = "100%", b
  }), e.addComponent("8", function(a) {
    var b = document.createElement("a");
    if (b.id = a.id, b.setAttribute("ctype", a.type), b.setAttribute("class", "element comp_anchor editable-text"), a.properties.title) {
      var c = a.properties.title.replace(/ /g, "&nbsp;");
      $(b).html(c), "view" == e.mode && $(b).attr("href", "tel:" + a.properties.number)
    }
    return b.style.cursor = "default", b.style.width = "100%", b
  }), e.addComponent("7", function(a) {
    var b = document.createElement("div");
    if (b.id = "map_" + a.id, b.setAttribute("class", "element comp_map_wrapper"), a.content && (b.textContent = a.content), a.css) {
      var c, d = a.css;
      for (c in d) b.style[c] = d[c]
    }
    return b.style.height = "250px", b
  }), e.bindAfterRenderEvent("1", function(a, b) {
    if (a = $("div", a)[0], "view" == e.mode && 1 == b.type) {
      var c = b.properties.labels;
      for (key in c) ! function(b) {
        $($(a).find(".label_content")[b]).on("click", function() {
          lxl.pageScroll(c[b])
        })
      }(key)
    }
  }), e.bindAfterRenderEvent("8", function(a, b) {
    a = $("a", a)[0];
    var c = {
      id: b.sceneId,
      num: b.properties.number
    };
    if ("view" == e.mode) {
      var d = function() {
        $.ajax({
          cache: !0,
          type: "POST",
          // url: PREFIX_HOST + "eqs/dial",
          url: "/view/dial",
          data: $.param(c),
          async: !1,
          error: function(a) {
            alert("Connection error")
          },
          success: function(a) {}
        })
      };
      a.addEventListener("click", d)
    }
  }), e.bindAfterRenderEvent("4", function(a, b) {
    "view" == e.mode && b.properties.url && $(a).click(function(a) {
      var c = b.properties.url;
      isNaN(c) ? window.open(c) : lxl.pageScroll(c)
    })
  }), e.bindAfterRenderEvent("5", function(a, b) {
    var c = mobilecheck();
    "view" == e.mode && c && parseFloat(b.css.top) >= 280 && ($(a).find("textarea").focus(function(b) {
      $(a).closest(".edit_area").css({
        top: "-150px"
      })
    }), $(a).find("textarea").blur(function(b) {
      $(a).closest(".edit_area").css({
        top: 0
      })
    }))
  }), e.bindAfterRenderEvent("v", function(a, b) {
    "view" == e.mode && $(a).click(function() {
      $(a).hide(), $("#audio_btn").hasClass("video_exist") && ($("#audio_btn").hide(), $("#media")[0].pause()), utilSound.pause(), $('<div class="video_mask page_effect lock" id="mask_' + b.id + '"></div>').appendTo($(a).closest(".m-img")), $('<a class = "close_mask" id="close_' + b.id + '"></a>').appendTo($(a).closest(".m-img")), $(b.properties.src).appendTo($("#mask_" + b.id)).attr("style", "position: absolute;top:0; min-height: 45%; max-height: 100%; top: 20%;").attr("width", "100%").removeAttr("height"), $("#close_" + b.id).bind("click", function() {
        $(a).show(), $("#mask_" + b.id).remove(), $("#close_" + b.id).remove(), $("#audio_btn").hasClass("video_exist") && $("#audio_btn").show(function() {
          $(this).hasClass("off") || $("#media")[0].play()
        })
      })
    })
  }), e.bindAfterRenderEvent("2", function(a, b) {
    for (var c = $(a).find("a[data]"), d = 0; d < c.length; d++)
      if (c[d] && "view" == e.mode) {
        $(c[d]).css("cursor", "pointer");
        var f = $(c[d]).attr("data");
        ! function(a) {
          $(c[d]).click(function(b) {
            lxl.pageScroll(a)
          })
        }(f)
      }
  }), e.bindAfterRenderEvent("6", function(a, b) {
    if (a = $("button", a)[0], "view" == e.mode) {
      var c = function(b, c) {
          var d = !0,
            e = $(a).parents(".nr"),
            f = {};
          $("textarea", e).each(function() {
            if (d) {
              if ("required" == $(this).attr("required") && "" == $(this).val().trim()) return alert($(this).attr("placeholder") + "为必填项"), void(d = !1);
              if ("502" == $(this).attr("ctype") && "" !== $(this).val().trim()) {
                var a = new RegExp(/(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/g);
                if (!a.test($(this).val())) return alert("手机号码格式错误"), void(d = !1)
              }
              if ("503" == $(this).attr("ctype") && "" !== $(this).val().trim()) {
                var b = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/g);
                if (!b.test($(this).val())) return alert("邮箱格式错误"), void(d = !1)
              }
              f[$(this).attr("name")] = $(this).val()
            }
          }), 
          d && $.ajax({
            cache: !0,
            type: "POST",
            url: "/view/save?id=" + c,
            data: $.param(f),
            async: !1,
            error: function(a) {
              alert("Connection error")
            },
            success: function(a) {
              $(b).unbind("click").click(function() {
                alert("请不要重复提交")
              }), alert("谢谢您的参与！")
            }
          })
        },
        d = e.def.sceneId;
      $(a).bind("click", function() {
        c(this, d)
      })
    }
  }), e.bindAfterRenderEvent("7", function(a, b) {
    var c = new BMap.Map("map_" + b.id, {
        enableMapClick: !1
      }),
      d = new BMap.Point(b.properties.x, b.properties.y),
      e = new BMap.Marker(d);
    c.addOverlay(e);
    var f = new BMap.Label(b.properties.markTitle, {
      offset: new BMap.Size(20, -10)
    });
    e.setLabel(f), c.disableDoubleClickZoom(), c.centerAndZoom(d, 15)
  }), e.bindAfterRenderEvent("p", function(a, b) {
    $(a).closest(".page_tpl_container ").length || ($(a).children(".element-box").css("overflow", "visible"), utilPictures.deleteInterval(b.id), new flux.slider("#" + b.id, {
      autoplay: b.properties.autoPlay,
      delay: b.properties.interval,
      pagination: !1,
      transitions: [utilPictures.getPicStyle(b.properties.picStyle).name],
      width: b.css.width,
      height: b.css.height,
      bgColor: b.properties.bgColor,
      onStartEnd: function(a) {
        utilPictures.addInterval(b.id, a)
      }
    }))
  })
}(window.yyShow),

function(a) {
  a.eqx = {}, 
  a.eqx.money = {
    config: {
      mode: 3,
      effectCallback: "editMoney",
      imageCallback: "countMoney",
      resources: [{
        url: "/view/scripts/countMoney.js",
        type: "js"
      }, {
        url: "/view/images/money/moneybg.png",
        type: "image"
      }, {
        url: "/view/images/money/moremoney.png",
        type: "image"
      }, {
        url: "/view/images/money/flymoney.png",
        type: "image"
      }, {
        url: "/view/images/money/float.png",
        type: "image"
      }, {
        url: "/view/images/money/float2.png",
        type: "image"
      }, {
        url: "/view/images/money/float3.png",
        type: "image"
      }]
    }
  }
}(window),

function() {
  function a(a) {
    resources.loaded = !0, a instanceof Array ? a.forEach(function(a) {
      b(a)
    }) : b(a)
  }

  function b(a) {
    if ("loading" != f[a.url]) {
      if (f[a.url]) return f[a.url];
      if (f[a.url] = !1, "image" == a.type) {
        var b = new Image;
        f[a.url] = "loading", b.onload = function() {
          f[a.url] = b, d() && g.forEach(function(a) {
            a()
          })
        }, b.src = a.url
      } else "js" == a.type && (f[a.url] = "loading", $.getScript(a.url, function(b, c, e) {
        f[a.url] = !0, d() && g.forEach(function(a) {
          a()
        })
      }))
    }
  }

  function c(a) {
    return f[a]
  }

  function d() {
    var a = !0;
    for (var b in f)
      if (f.hasOwnProperty(b) && (!f[b] || "loading" == f[b])) return !1;
    return a
  }

  function e(a) {
    g.push(a)
  }
  var f = {},
    g = [];
  window.resources = {
    load: a,
    get: c,
    onReady: e,
    isReady: d
  }
}(),

function(a, b) {
  function c(a, c) {
    if (!b("#report0").length) {
      var e = [];
      e[0] = '<div id="report0"></div>', e[1] = '<div id="report1"></div>', e[2] = '<div id="report2"><p><img src="/view/images/jubao_03.png" width="50px;"></p><h1>请选择举报原因</h1></div>', e[3] = '<div id="report3"><ul id="reportList"></ul></div>', e[4] = '<div id="report4"><a id="reportSubmit">提交举报</a></div>', b(e[0]).appendTo("#page" + a), b(e[1]).appendTo("#report0");
      for (var f = 2; 4 >= f; f++) b(e[f]).appendTo("#report1");
      d(c)
    }
  }

  function d(a) {
    if (g.length) return void e(g, a);
    // var c = PREFIX_HOST + "base/class/expose_types";
    var c = "/data/expose_types.json";
    b.ajax({
      type: "GET",
      url: c,
      xhrFields: {
        withCredentials: !0
      },
      crossDomain: !0
    }).then(function(b) {
      if (b.success) {
        g = b.list, e(g, a)
      }
    })
  }

  function e(a, c) {
    for (var d, e = 0, g = a.length; g > e; e++) {
      var h = '<li value="' + a[e].value + '"><span>' + a[e].name + "</span></li>";
      b(h).appendTo("#reportList")
    }
    var i = b("#reportList").find("li").eq(0);
    i.addClass("active"), d = i.val(), b("#reportList").find("li").click(function(a) {
      b(this).siblings().removeClass("active"), b(this).addClass("active"), d = b(this).val()
    }), b("#reportSubmit").click(function(a) {
      f(c, d)
    }), b("#report0").parent(".m-img").click(function(a) {
      b("#report0").remove()
    }), b("#report0").click(function(a) {
      a.stopPropagation()
    })
  }

  function f(a, c) {
    // var d = PREFIX_HOST + "eqs/expose",
    var d = "/view/expose",
      e = {
        sceneId: a,
        type: c
      };
    b.ajax({
      type: "POST",
      url: d,
      data: b.param(e),
      xhrFields: {
        withCredentials: !0
      },
      crossDomain: !0
    }).then(function(a) {
      if (a.success) b("#report0").remove(), alert("举报成功！");
      else b("#report0").remove(), alert("您已举报过此场景！");
    }, function(a) {
      b("#report0").remove()
    })
  }
  a.addReport = function(a, d) {
    var e = '<li comp-drag="" comp-rotate="" class="comp-resize comp-rotate inside wsite-text" id="inside_439881" num="1" ctype="2" comp-resize="" style="width: 320px; height: 36px; left: -250px; top: 440px; z-index: 999;"><div class="element-box" style="height: 100%; z-index: 3; width: 100%; left: 0px; top: 420px; transform: none;-webkit-animation: fadeIn 3s ease 1s both;-webkit-animation-play-state: initial;\\"><div class="element-box-contents" style="width: 100%; height: 100%;"><div id="439881" ctype="2" class="element comp_paragraph editable-text" style="cursor: default; width: 320px; height: 36px;"><div style="text-align: right;"><span style="display: inline-block; padding: 3px 10px; font-size: 14px; line-height: 1; border-radius: 10px; background-color: #888; cursor: pointer;"><font color="#ffffff">举报</font></span></div></div></div></div></li>',
      f = b("#page" + a).find(".edit_wrapper").find("ul");
    b(e).appendTo(f).click(function(b) {
      b.stopPropagation(), c(a, d)
    })
  };
  var g = []
}(window, jQuery),

function(a, b) {
  function c(a, c, d) {
    // var e = '{"id":"","sceneId":"","num":2,"name":null,"properties":null,"elements":[{"id":439880,"pageId":129810,"sceneId":16060,"num":0,"type":"3","isInput":0,"title":null,"content":null,"status":1,"css":{},"properties":{"bgColor":"#E6E9EE"}},{"id":439881,"pageId":129810,"sceneId":16060,"num":1,"type":"2","isInput":0,"title":null,"content":"<div style=\\"text-align: center;\\"><span style=\\"line-height: 1; background-color: initial;\\"><font size=\\"4\\" color=\\"#888888\\"><b>场景名称</b></font></span></div>","status":1,"css":{"height":"36","zIndex":"10","width":"320","left":"0px","top":"77px"},"properties":{}},{"id":439882,"pageId":129810,"sceneId":16060,"num":1,"type":"4","isInput":0,"title":null,"content":null,"status":1,"css":{"borderRadius":"10px","borderStyle":"solid","zIndex":"9","borderColor":"rgba(0,0,0,1)","paddingTop":"0px","height":"141","backgroundColor":"","color":"","boxShadow":"0px 0px 0px #333333","borderWidth":"0px","width":"142.13709677419354","left":"92px","paddingBottom":"0px","top":"177px"},"properties":{"height":"100px","imgStyle":{"width":142,"height":142,"marginTop":"-0.5px","marginLeft":"0px"},"width":"100px","src":"images/defaultscene.png"}},{"id":439883,"pageId":129810,"sceneId":16060,"num":1,"type":"4","isInput":0,"title":null,"content":null,"status":1,"css":{"height":"16","zIndex":"11","width":"280","left":"21px","top":"122px"},"properties":{"height":"100px","imgStyle":{"width":280,"height":73,"marginTop":"-24px","marginLeft":"0px"},"width":"100px","src":"view/images/line.png"}},{"id":439885,"pageId":129810,"sceneId":16060,"num":1,"type":"2","isInput":0,"title":null,"content":"<div style=\\"text-align: center;padding-top: 0;\\"><span style=\\"font-size: small; line-height: 1; background-color: initial;\\"><a href=\\"/link?id=16060&amp;url=' + encodeURIComponent(h) + '\\" target=\\"_blank\\"><font color=\\"#888888\\">免费创建一个场景-YiYun.XL</font></a></span></div>","status":1,"css":{"borderRadius":"0px","borderStyle":"solid","height":"30","paddingTop":"0px","borderColor":"rgba(222,220,227,1)","zIndex":"12","boxShadow":"0px 0px 0px rgba(200,200,200,0.6)","color":"","backgroundColor":"rgba(255,255,255,0)","borderWidth":"0px","width":"320","left":"1px","paddingBottom":"20px","top":"420px"},"properties":{"anim":{"type":1,"direction":3,"duration":"1","delay":"0.6"}}}]}';
    var e = '{"id":"","sceneId":"","num":2,"name":null,"properties":null,"elements":[{"id":439880,"pageId":129810,"sceneId":16060,"num":0,"type":"3","isInput":0,"title":null,"content":null,"status":1,"css":{},"properties":{"bgColor":"#E6E9EE"}},{"id":439881,"pageId":129810,"sceneId":16060,"num":1,"type":"2","isInput":0,"title":null,"content":"<div style=\\"text-align: center;\\"><span style=\\"line-height: 1; background-color: initial;\\"><font size=\\"4\\" color=\\"#888888\\"><b>场景名称</b></font></span></div>","status":1,"css":{"height":"36","zIndex":"10","width":"320","left":"0px","top":"77px"},"properties":{}},{"id":439882,"pageId":129810,"sceneId":16060,"num":1,"type":"4","isInput":0,"title":null,"content":null,"status":1,"css":{"borderRadius":"10px","borderStyle":"solid","zIndex":"9","borderColor":"rgba(0,0,0,1)","paddingTop":"0px","height":"141","backgroundColor":"","color":"","boxShadow":"0px 0px 0px #333333","borderWidth":"0px","width":"142.13709677419354","left":"92px","paddingBottom":"0px","top":"177px"},"properties":{"height":"100px","imgStyle":{"width":142,"height":142,"marginTop":"-0.5px","marginLeft":"0px"},"width":"100px","src":"images/defaultscene.png"}},{"id":439883,"pageId":129810,"sceneId":16060,"num":1,"type":"4","isInput":0,"title":null,"content":null,"status":1,"css":{"height":"16","zIndex":"11","width":"280","left":"21px","top":"122px"},"properties":{"height":"100px","imgStyle":{"width":280,"height":73,"marginTop":"-24px","marginLeft":"0px"},"width":"100px","src":"view/images/line.png"}}]}';
    var f = '{"id":81395,"pageId":"","sceneId":"","num":1,"type":"4","isInput":0,"title":null,"content":null,"status":1,"css":{"borderRadius":"%","borderStyle":"solid","height":"136","zIndex":"1000","paddingTop":"0px","borderColor":"rgba(0,0,0,1)","boxShadow":"0 0px 0px #333333","color":"#000000","backgroundColor":"rgba(0,0,0,0)","borderWidth":"0px","width":"143","left":"93px","paddingBottom":"0px","top":"182px"},"properties":{"height":"100px","imgStyle":{"width":139,"height":136,"marginTop":"0px","marginLeft":"0px"},"width":"100px","src":""}}';
    var i = '{"id":81465,"pageId":"","sceneId":"","num":1,"type":"2","isInput":0,"title":null,"content":"<div style=\\"text-align: center;\\"><font color=\\"#ffffff\\" size=\\"3\\">击此处进行编辑</font></div>","status":1,"css":{"zIndex":"102","height":"36","width":"320","left":"0px","top":"70px"},"properties":{}}';
    var m = 1;
    if (a.obj.property.lastPageId) {
      n = !0;
      b.ajax({
        type: "GET",
        url: "/getPageTpl?id=" + a.obj.property.lastPageId,
        xhrFields: {
          withCredentials: !0
        },
        crossDomain: !0,
        success: function(b) {
          if (!b.obj) {
            e = e.replace(/id=16060/, "id=" + a.obj.id);
            var d = JSON.parse(e);
            return d.num = a.list.length + 1, 
              d.elements[2].properties.src = a.obj.cover, 
              d.elements[1].content = d.elements[1].content.replace(/场景名称/, a.obj.name), 
              a.list.push(d), 
              void g(c, a)
          }
          b.obj.sceneId = a.obj.id;
          var j = JSON.parse(f);
          j.properties.src = a.obj.cover, 
          b.obj.elements.push(j);
          var k = JSON.parse(i);
          k.content = k.content.replace(/击此处进行编辑/, a.obj.name), 
          b.obj.elements.push(k);
          for (var l = 0; l < b.obj.elements.length; l++) "2" == b.obj.elements[l].type && (b.obj.elements[l].content = b.obj.elements[l].content.replace(/#gotourl#"/, h + '" target="_blank"'));
          c.push(b.obj), 
          g(c, a);
        }
      });
    } else {
      e = e.replace(/id=16060/, "id=" + a.obj.id);
      var j = JSON.parse(e);
      j.num = a.list.length + 1, 
      j.elements[2].properties.src = a.obj.cover, 
      j.elements[1].content = j.elements[1].content.replace(/场景名称/, a.obj.name), 
      a.list.push(j), 
      g(c, a);
    }
  }

  function d(a, b) {
    var c = '{"id":480292,"pageId":136042,"sceneId":16060,"num":1,"type":"2","isInput":0,"title":null,"content":"<div style=\\"text-align: center;transform: none;-webkit-animation: fadeIn 2s ease 1s both;-webkit-animation-play-state: initial;\\"><a href=\\"/link?id=16060&amp;url=' + encodeURIComponent(h) + '\\" target=\\"_blank\\" style=\\"font-size: x-small;display:block;line-height: 10px;\\"><font color=\\"#ffffff\\">' + i + '</font></a></div>","status":1,"css":{"zIndex":"1000","height":"20","width":"129","left":"97px","top":"418px","backgroundColor":"rgba(0,0,0,0.6)","borderRadius":"20px"},"properties":{"anim":{"type":0,"direction":0,"duration":2,"delay":"0"}}}';
    m = 2;
    var d = b[b.length - 1].elements;
    c = c.replace(/id=16060/, "id=" + a.obj.id), d || (d = []), d.push(JSON.parse(c)), g(b, a)
  }

  function e(a, c) {
    m = 2, b.ajax({
      type: "GET",
      url: "/getPageTpl?id=" + a.obj.property.bottomLabel.id,
      xhrFields: {
        withCredentials: !0
      },
      crossDomain: !0,
      success: function(e) {
        if (!e.obj) return void d(a, c);
        var f = e.obj.elements,
          h = 0;
        for (f.length; h < f.length; h++) {
          var i = f[h];
          if (i.sceneId = a.obj.id, i.pageId = c[c.length - 1].id, a.obj.property.bottomLabel.name && a.obj.property.bottomLabel.url && "http://" != a.obj.property.bottomLabel.url) 2 == i.type && i.content.indexOf("YiYun.XL") > 0 && (i.content = i.content.replace(/YiYun.XL/, '<a href="/link?id=' + a.obj.id + '&amp;url=' + encodeURIComponent(a.obj.property.bottomLabel.url) + '" target="_blank">' + a.obj.property.bottomLabel.name + "</a>"));
          else if (a.obj.property.bottomLabel.name) 2 == i.type && i.content.indexOf("YiYun.XL") > 0 && (i.content = i.content.replace(/YiYun.XL/, a.obj.property.bottomLabel.name));
          else if (/逸云技术支持/.test(i.content)) {
            i.content = '<div style="text-align: center;">' + i.content + "</div>";
            var j = {
              zIndex: "1000",
              height: "33",
              width: "129",
              left: "97px"
            };
            b.extend(i.css, j)
          } else 2 == i.type && i.content && (i.content = "");
          a.list[a.list.length - 1].elements.push(i), n = !0
        }
        g(c, a)
      }
    })
  }

  function f(a, b) {
    m = 0, g(b, a)
  }

  function g(c, d) {
    for (var e = [], f = !1, g = {
        bgAudio: d.obj.bgAudio
      }, h = 1; h <= c.length; h++)
      if (b('<section class="main-page"><div class="m-img" id="page' + h + '"></div></section>').appendTo(".nr"), c.length > 1 && (0 == j || 1 == j || 2 == j ? b('<section class="u-arrow-bottom"><img src="/view/images/btn01_arrow.png" /></section>').appendTo("#page" + h) : (3 == j || 4 == j || 5 == j) && b('<section class="u-arrow-right"><img src="/view/images/btn01_arrow_right.png" /></section>').appendTo("#page" + h)), 1 == h && (b(".loading").hide(), b(".main-page").eq(0).addClass("z-current")), c[h - 1].properties && !b.isEmptyObject(c[h - 1].properties) ? c[h - 1].properties.image || c[h - 1].properties.scratch ? o.scratch ? addScratchEffect(c, h) : ! function(a) {
          b.getScript("/view/scripts/scratch_effect.js", function(b, d, e) {
            o.scratch = !0, addScratchEffect(g, c, a)
          })
        }(h) : c[h - 1].properties.finger ? (e.push({
          num: h,
          finger: c[h - 1].properties.finger
        }), f || (f = !0, b.getScript("/view/scripts/lock_effect.js", function(a, d, f) {
          test(g, c, e, b(".m-img").width(), b(".m-img").height())
        }))) : c[h - 1].properties.fallingObject ? o.fallingObject ? fallingObject(c, h) : ! function(a) {
          b.getScript("/view/scripts/falling_object.js", function(b, d, e) {
            o.fallingObject = !0, fallingObject(c, a), 1 == a && playVideo(g)
          })
        }(h) : c[h - 1].properties.effect ? ! function(b) {
          resources.load(a.eqx[c[b - 1].properties.effect.name].config.resources), resources.onReady(function() {
            a[c[b - 1].properties.effect.name].doEffect(g, b, c, renderPage)
          })
        }(h) : renderPage(yyShow, h, c) : (renderPage(yyShow, h, c), 1 == h && playVideo(g)), h == c.length) {
        lxl.app(b(".nr"), d.obj.pageMode, c, d);
        if (b("img").on("dragstart", function(a) {
            a.preventDefault()
          }), !k) {
          var i = "/view/pv?id=" + d.obj.id;
          l && (i += /\?.*/.test(l) ? "&" + l.substring(1) : /\&.*/.test(l) ? l : "&" + l), 
          i += "&ad=" + m, 
          i += "&time=" + (new Date().getTime()), 
          b.ajax({
            type: "POST",
            url: i,
            xhrFields: { 
              withCredentials: !0
            },
            crossDomain: !0
          })
        }
      }
    if (d.obj.createTime > 14165028e5) {
      if (100 != d.obj.bizType && !d.obj.property.hideEqAd && 1 == d.obj.property.eqAdType) return void addReport(c.length, d.obj.id);
      100 == d.obj.bizType || d.obj.property.eqAdType || d.obj.property.hideEqAd || d.obj.property.isAdvancedUser || addReport(c.length, d.obj.id)
    }
  }
  var h, i, j, k, l, m, n = !1,
    o = (mobilecheck(), []);
  a.appendLastPage = function(a, b, g, n, o, p) {
    if (j = g, k = n, l = o, m = p, 100 == a.obj.bizType ? (h = "https://itunes.apple.com/us/app/easyshow-free-+-easy-+-exquisitely/id987351120?mt=8", i = "EasyShow") : (h = PREFIX_HOST, i = "逸云技术支持"), a.obj.createTime > 14165028e5)
      if (100 == a.obj.bizType) d(a, b);
      else if (a.obj.property.hideEqAd) f(a, b);
    else {
      if (a.obj.property && a.obj.property.eqAdType) switch (a.obj.property.eqAdType) {
        case 1:
          return void c(a, b);
        case 2:
          return void d(a, b);
        case 3:
          return void e(a, b)
      }
      a.obj.property.isAdvancedUser ? a.obj.property && a.obj.property.bottomLabel && a.obj.property.bottomLabel.id ? e(a, b) : d(a, b) : c(a, b)
    } else f(a, b)
  }
}(window, jQuery),

function(window, $) {
  function bindWeixin(a) {
    var url = location.href.split("#")[0],
      c = "/wxGetJsConfig?debug=1&url=" + encodeURIComponent(url) + "&apilist=checkJsApi,onMenuShareTimeline,onMenuShareAppMessage,onMenuShareQQ,onMenuShareWeibo&time=" + Date.now();
    $.ajax({
      type: "GET",
      url: c,
      crossDomain: !0
    }).then(function(data) {
      data && bindWeixinEvent(url, a, data)
    }, function(a) {})
  }

  function bindWeixinEvent(a, b, cfg) {
    wx.config(cfg);
    wx.ready(function() {
      var c = b.obj.name,
        d = PREFIX_HOST + b.obj.cover,
        e = b.obj.description;
      e || (e = " ");
      wx.onMenuShareTimeline({
        title: c,
        link: a,
        imgUrl: d,
        success: function() {},
        cancel: function() {}
      }), 
      wx.onMenuShareAppMessage({
        title: c,
        desc: e,
        link: a,
        imgUrl: d,
        success: function() {},
        cancel: function() {}
      }), 
      wx.onMenuShareQQ({
        title: c,
        desc: e,
        link: a,
        imgUrl: d,
        success: function() {},
        cancel: function() {}
      }), 
      wx.onMenuShareWeibo({
        title: c,
        desc: e,
        link: a,
        imgUrl: d,
        success: function() {},
        cancel: function() {}
      }), 
      $("#media").get(0).play();
    });
  }

  function getRequestUrl() {
    var a;
    return (preview ? a = "/getScenePreview?id=" + sceneId : a = "/getScenePreview?code=" + sceneId, branchid && (a += (/\?/.test(a) ? "&" : "?") + "user=" + branchid)), a += (/\?/.test(a) ? "&" : "?") + "time=" + (new Date).getTime()
  }

  function bindShare(data) {
    if (!mobilecheck()) with(window._bd_share_config = {
      common: {
        "bdText": data.obj.name,
        "bdDesc": data.obj.description,
        "bdUrl": PREFIX_HOST + "view/" + sceneId,
        "bdSnsKey": {},
        "bdMini": "2",
        "bdMiniList": false,
        "bdPic": "",
        "bdStyle": "1",
        "bdSize": "32"
      },
      share: {}
    }, document) 0[(getElementsByTagName("head")[0] || body).appendChild(createElement("script")).src = "http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=" + ~(-new Date / 36e5)]
  }

  function parseJson(a) {
    document.title = a.obj.name, 
    $("#metaDescription").attr("content", a.obj.name + ", " + a.obj.description + ", 由逸云移动场景应用自营销管家提供技术支持"), 
    $(".scene_title").html(a.obj.name), 
    pageMode = a.obj.pageMode,
    imgUrl = PREFIX_HOST + a.obj.cover, 
    shareTitle = a.obj.name, 
    descContent = a.obj.description,
    b = [];
    if (isWeixin()) bindWeixin(a);
    return a.obj.property && (a.obj.property = JSON.parse(a.obj.property) || {}), a.obj.bgAudio && (a.obj.bgAudio = JSON.parse(a.obj.bgAudio) || null), b = a.list, b.length <= 0 ? (alert("此场景不存在!"), void(window.location.href = PREFIX_HOST)) : (appendLastPage(a, b, pageMode, preview, param, ad), void bindShare(a))
  }
  var url, preview, mobileview, pageMode, branchid, ad = 0, imgUrl = "", descContent = "", shareTitle = "";
  url = /[http|https]:\/\/.*\/view\//.test(window.location.href) ? window.location.href.split("/view/")[1] : window.location.href.split("?sceneId=")[1];
  var sceneId = url.split("#")[0].split("&")[0].split("?")[0],
    param = url.split(sceneId)[1];
  if (param.indexOf("preview=preview") > 0 && (preview = !0), param.indexOf("branchid=") > 0 && (branchid = param.substring(param.indexOf("branchid=") + 9)), param.indexOf("mobileview=mobileview") > 0 && (mobileview = !0), !mobilecheck()) {
    var b = document.getElementsByTagName("head")[0],
      c = document.createElement("link");
    c.href = "/view/styles/pcviewer.css";
    c.rel = "stylesheet";
    b.appendChild(c);
    if (window == window.top) {
      setTimeout(function() {
        $("body").css("backgroundImage", "url(/view/images/pcviewbg" + Math.floor(Math.random() * 2 + 1) + ".jpg)");
        $(".phoneBox").wrap('<div class="phone_panel"></div>');
        $('<div class="ctrl_panel"><a id="pre_page" type="button" class="pre_btn btn" onclick="lxl.prePage()">上一页</a><a id="next_page" type="button" class="next_btn btn" onclick="lxl.nextPage()">下一页</a></div>').appendTo($(".phone_panel"));
        $.getScript("http://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js", function() {
          $(".phoneBox").before('<div id="code"><div>扫一扫，分享给朋友！</div><div style="text-align: center;background:#fff;padding: 10px;" id="codeImg"/><div id="view_share" class="bdsharebuttonbox"><a href="#" class="bds_more" data-cmd="more"></a><a href="#" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博"></a><a href="#" class="bds_tqq" data-cmd="tqq" title="分享到腾讯微博"></a><a href="#" class="bds_qzone" data-cmd="qzone" title="分享到QQ空间"></a><a href="#" class="bds_sqq" data-cmd="sqq" title="分享到QQ好友"></a><a href="#" class="bds_douban" data-cmd="douban" title="分享到豆瓣网"></a></div><div id="view_reg">这么漂亮的场景&nbsp;→<span><a target="_blank" href="' + PREFIX_HOST + '">我也来制作</a></span></div></div>');
          $("#codeImg").qrcode({
            render: "canvas",
            width: 200,
            height: 200,
            text: PREFIX_HOST + "view/" + sceneId
          });
        });
      }, 100);
    }
  }
  jQuery.support.cors = !0, 
  $.ajax({
    type: "GET",
    url: getRequestUrl(),
    xhrFields: {
      withCredentials: !0
    },
    crossDomain: !0
  }).done(function(a) {
    parseJson(a)
  });
}(window, jQuery);

window.flux={version:"1.4.4"},function(a){flux.slider=function(b,c){flux.browser.init(),flux.browser.supportsTransitions||window.console&&window.console.error&&console.error("Flux Slider requires a browser that supports CSS3 transitions");var d=this;this.element=a(b),this.transitions=[];for(var e in flux.transitions)this.transitions.push(e);this.options=a.extend({autoplay:!0,transitions:this.transitions,delay:4e3,pagination:!0,controls:!1,captions:!1,width:null,height:null,onTransitionEnd:null,onStartEnd:null,bgColor:""},c),this.height=this.options.height?this.options.height:null,this.width=this.options.width?this.options.width:null;var f=[];a(this.options.transitions).each(function(a,b){var c=new flux.transitions[b](this),d=!0;c.options.requires3d&&!flux.browser.supports3d&&(d=!1),c.options.compatibilityCheck&&(d=c.options.compatibilityCheck()),d&&f.push(b)}),this.options.transitions=f,this.images=new Array,this.imageLoadedCount=0,this.currentImageIndex=0,this.nextImageIndex=1,this.playing=!1,this.container=a('<div class="fluxslider"></div>').appendTo(this.element),this.surface=a('<div class="surface" style="position: relative"></div>').appendTo(this.container),this.container.bind("click",function(b){a(b.target).hasClass("hasLink")&&(window.location=a(b.target).data("href"))}),this.imageContainer=a('<div class="images loading1"></div>').css({position:"relative",overflow:"hidden"}).appendTo(this.surface),this.width&&this.height&&this.imageContainer.css({width:this.width+"px",height:this.height+"px"}),this.image1=a('<div class="image1" style="height: 100%; width: 100%"></div>').appendTo(this.imageContainer),this.image2=a('<div class="image2" style="height: 100%; width: 100%"></div>').appendTo(this.imageContainer),a(this.image1).add(this.image2).css({position:"absolute",top:"0px",left:"0px"}),this.element.find("img, a img").each(function(b,c){var e=c.cloneNode(!1),f=a(c).parent();f.is("a")&&a(e).data("href",f.attr("href")),d.images.push(e),a(c).remove()});for(var g=0;g<this.images.length;g++){var h=new Image;h.onload=function(){d.imageLoadedCount++,d.width=d.width?d.width:this.width,d.height=d.height?d.height:this.height,d.imageLoadedCount>=d.images.length&&(d.finishedLoading(),d.setupImages())},h.src=this.images[g].src}this.element.bind("fluxTransitionEnd",function(a,b){d.options.onTransitionEnd&&(a.preventDefault(),d.options.onTransitionEnd(b))}),this.options.autoplay&&this.start();var i={},j={},k=20;this.element.bind("mousedown touchstart",function(a){"touchstart"==a.type?i.left=a.originalEvent.touches[0].pageX:"mousedown"==a.type&&(i.left=a.pageX)}).bind("mouseup touchend",function(a){"touchend"==a.type?j.left=a.originalEvent.changedTouches[0].pageX:"mouseup"==a.type&&(j.left=a.pageX),j.left-i.left>k?d.prev(null,{direction:"right"}):i.left-j.left>k&&d.next(null,{direction:"left"}),d.options.autoplay&&(d.stop(),d.start())}),setTimeout(function(){a(window).focus(function(){d.isPlaying()&&d.next()})},100)},flux.slider.prototype={constructor:flux.slider,playing:!1,start:function(){var a=this;this.playing=!0,this.interval=setInterval(function(){console.log("play"),a.transition()},this.options.delay),"function"==typeof this.options.onStartEnd&&this.options.onStartEnd(this.interval)},stop:function(){this.playing=!1,clearInterval(this.interval),this.interval=null},isPlaying:function(){return this.playing},next:function(a,b){b=b||{},b.direction="left",this.showImage(this.currentImageIndex+1,a,b)},prev:function(a,b){b=b||{},b.direction="right",this.showImage(this.currentImageIndex-1,a,b)},showImage:function(a,b,c){this.setNextIndex(a),this.setupImages(),this.transition(b,c)},finishedLoading:function(){var b=this;if(this.container.css({width:this.width+"px",height:this.height+"px"}),this.imageContainer.removeClass("loading1"),this.options.pagination&&(this.pagination=a('<ul class="pagination"></ul>').css({margin:"0px",padding:"0px","text-align":"center"}),this.pagination.bind("click",function(c){c.preventDefault(),b.showImage(a(c.target).data("index"))}),a(this.images).each(function(c){var e=a('<li data-index="'+c+'">'+(c+1)+"</li>").css({display:"inline-block","margin-left":"0.5em",cursor:"pointer"}).appendTo(b.pagination);0==c&&e.css("margin-left",0).addClass("current")}),this.container.append(this.pagination)),a(this.imageContainer).css({width:this.width+"px",height:this.height+"px"}),a(this.image1).css({width:this.width+"px",height:this.height+"px"}),a(this.image2).css({width:this.width+"px",height:this.height+"px"}),this.container.css({width:this.width+"px",height:this.height+(this.options.pagination?this.pagination.height():0)+"px"}),this.options.controls){var c={padding:"4px 10px 10px","font-size":"60px","font-family":"arial, sans-serif","line-height":"1em","font-weight":"bold",color:"#FFF","text-decoration":"none",background:"rgba(0,0,0,0.5)",position:"absolute","z-index":2e3};this.nextButton=a('<a href="#">\xbb</a>').css(c).css3({"border-radius":"4px"}).appendTo(this.surface).bind("click",function(a){a.preventDefault(),b.next()}),this.prevButton=a('<a href="#">\xab</a>').css(c).css3({"border-radius":"4px"}).appendTo(this.surface).bind("click",function(a){a.preventDefault(),b.prev()});var d=(this.height-this.nextButton.height())/2;this.nextButton.css({top:d+"px",right:"10px"}),this.prevButton.css({top:d+"px",left:"10px"})}this.options.captions&&(this.captionBar=a('<div class="caption"></div>').css({background:"rgba(0,0,0,0.6)",color:"#FFF","font-size":"16px","font-family":"helvetica, arial, sans-serif","text-decoration":"none","font-weight":"bold",padding:"1.5em 1em",opacity:0,position:"absolute","z-index":110,width:"100%",bottom:0}).css3({"transition-property":"opacity","transition-duration":"800ms","box-sizing":"border-box"}).prependTo(this.surface)),this.updateCaption()},setupImages:function(){var b=this.getImage(this.currentImageIndex),c={background:'url("'+b.src+'") 50% 50% / contain no-repeat '+this.options.bgColor,zIndex:101,cursor:"auto"};a(b).data("href")?(c.cursor="pointer",this.image1.addClass("hasLink"),this.image1.data("href",a(b).data("href"))):(this.image1.removeClass("hasLink"),this.image1.data("href",null)),this.image1.css(c).children().remove(),this.image2.css({background:'url("'+this.getImage(this.nextImageIndex).src+'") 50% 50% / contain no-repeat '+this.options.bgColor,zIndex:100}),this.options.pagination&&this.pagination&&(this.pagination.find("li.current").removeClass("current"),a(this.pagination.find("li")[this.currentImageIndex]).addClass("current"))},transition:function(b,c){if(void 0==b||!flux.transitions[b]){var d=Math.floor(Math.random()*this.options.transitions.length);b=this.options.transitions[d]}var e=null;try{e=new flux.transitions[b](this,a.extend(this.options[b]?this.options[b]:{},c))}catch(f){e=new flux.transition(this,{fallback:!0})}e.run(),this.currentImageIndex=this.nextImageIndex,this.setNextIndex(this.currentImageIndex+1),this.updateCaption()},updateCaption:function(){var b=a(this.getImage(this.currentImageIndex)).attr("title");this.options.captions&&this.captionBar&&(""!==b&&this.captionBar.html(b),this.captionBar.css("opacity",""===b?0:1))},getImage:function(a){return a%=this.images.length,this.images[a]},setNextIndex:function(a){void 0==a&&(a=this.currentImageIndex+1),this.nextImageIndex=a,this.nextImageIndex>this.images.length-1&&(this.nextImageIndex=0),this.nextImageIndex<0&&(this.nextImageIndex=this.images.length-1)},increment:function(){this.currentImageIndex++,this.currentImageIndex>this.images.length-1&&(this.currentImageIndex=0)}}}(window.jQuery||window.Zepto),function(a){flux.browser={init:function(){if(void 0===flux.browser.supportsTransitions){var b=(document.createElement("div"),["-webkit","-moz","-o","-ms"]);if(flux.browser.supportsTransitions=window.Modernizr&&void 0!==Modernizr.csstransitions?Modernizr.csstransitions:this.supportsCSSProperty("Transition"),window.Modernizr&&void 0!==Modernizr.csstransforms3d)flux.browser.supports3d=Modernizr.csstransforms3d;else if(flux.browser.supports3d=this.supportsCSSProperty("Perspective"),flux.browser.supports3d&&"webkitPerspective"in a("body").get(0).style){var c=a('<div id="csstransform3d"></div>'),d=a('<style media="(transform-3d), ('+b.join("-transform-3d),(")+'-transform-3d)">div#csstransform3d { position: absolute; left: 9px }</style>');a("body").append(c),a("head").append(d),flux.browser.supports3d=9==c.get(0).offsetLeft,c.remove(),d.remove()}}},supportsCSSProperty:function(a){for(var b=document.createElement("div"),c=["Webkit","Moz","O","Ms"],d=!1,e=0;e<c.length;e++)c[e]+a in b.style&&(d=d||!0);return d},translate:function(a,b,c){return a=void 0!=a?a:0,b=void 0!=b?b:0,c=void 0!=c?c:0,"translate"+(flux.browser.supports3d?"3d(":"(")+a+"px,"+b+(flux.browser.supports3d?"px,"+c+"px)":"px)")},rotateX:function(a){return flux.browser.rotate("x",a)},rotateY:function(a){return flux.browser.rotate("y",a)},rotateZ:function(a){return flux.browser.rotate("z",a)},rotate:function(a,b){return!a in{x:"",y:"",z:""}&&(a="z"),b=void 0!=b?b:0,flux.browser.supports3d?"rotate3d("+("x"==a?"1":"0")+", "+("y"==a?"1":"0")+", "+("z"==a?"1":"0")+", "+b+"deg)":"z"==a?"rotate("+b+"deg)":""}},a(function(){flux.browser.init()})}(window.jQuery||window.Zepto),function(a){a.fn.css3=function(a){var b={},c=["webkit","moz","ms","o"];for(var d in a){for(var e=0;e<c.length;e++)b["-"+c[e]+"-"+d]=a[d];b[d]=a[d]}return this.css(b),this},a.fn.transitionEnd=function(b){for(var c=["webkitTransitionEnd","transitionend","oTransitionEnd"],d=0;d<c.length;d++)this.bind(c[d],function(d){for(var e=0;e<c.length;e++)a(this).unbind(c[e]);b&&b.call(this,d)});return this},flux.transition=function(b,c){if(this.options=a.extend({requires3d:!1,after:function(){}},c),this.slider=b,this.options.requires3d&&!flux.browser.supports3d||!flux.browser.supportsTransitions||this.options.fallback===!0){var d=this;this.options.after=void 0,this.options.setup=function(){d.fallbackSetup()},this.options.execute=function(){d.fallbackExecute()}}},flux.transition.prototype={constructor:flux.transition,hasFinished:!1,run:function(){var a=this;void 0!==this.options.setup&&this.options.setup.call(this),this.slider.image1.css({"background-image":"none"}),this.slider.imageContainer.css("overflow",this.options.requires3d?"visible":"hidden"),setTimeout(function(){void 0!==a.options.execute&&a.slider.image1.css("background-color",""),a.options.execute.call(a)},5)},finished:function(){this.hasFinished||(this.hasFinished=!0,this.options.after&&this.options.after.call(this),this.slider.imageContainer.css("overflow","hidden"),this.slider.setupImages(),this.slider.element.trigger("fluxTransitionEnd",{currentImage:this.slider.getImage(this.slider.currentImageIndex)}))},fallbackSetup:function(){},fallbackExecute:function(){this.finished()}},flux.transitions={},flux.transition_grid=function(b,c){return new flux.transition(b,a.extend({columns:6,rows:6,forceSquare:!1,setup:function(){var b=this.slider.image1.width(),c=this.slider.image1.height(),d=Math.floor(b/this.options.columns),e=Math.floor(c/this.options.rows);this.options.forceSquare&&(e=d,this.options.rows=Math.floor(c/e));for(var f=b-this.options.columns*d,g=Math.ceil(f/this.options.columns),h=c-this.options.rows*e,i=Math.ceil(h/this.options.rows),j=(this.slider.image1.height(),0),k=0,l=document.createDocumentFragment(),m=0;m<this.options.columns;m++){var n=d,k=0;if(f>0){var o=f>=g?g:f;n+=o,f-=o}for(var p=0;p<this.options.rows;p++){var q=e,r=h;if(r>0){var o=r>=i?i:r;q+=o,r-=o}var s=a('<div class="tile tile-'+m+"-"+p+'"></div>').css({width:n+"px",height:q+"px",position:"absolute",top:k+"px",left:j+"px"});this.options.renderTile.call(this,s,m,p,n,q,j,k),l.appendChild(s.get(0)),k+=q}j+=n}this.slider.image1.get(0).appendChild(l)},execute:function(){var a=this,b=this.slider.image1.height(),c=this.slider.image1.find("div.barcontainer");this.slider.image2.hide(),c.last().transitionEnd(function(){a.slider.image2.show(),a.finished()}),c.css3({transform:flux.browser.rotateX(-90)+" "+flux.browser.translate(0,b/2,b/2)})},renderTile:function(){}},c))}}(window.jQuery||window.Zepto),function(a){flux.transitions.bars=function(b,c){return new flux.transition_grid(b,a.extend({columns:10,rows:1,delayBetweenBars:40,renderTile:function(b,c,d,e,f,g){a(b).css({background:this.slider.image1.css("background"),"background-size":this.slider.width+"px "+this.slider.height+"px","background-position":"-"+g+"px 0px"}).css3({"transition-duration":"400ms","transition-timing-function":"ease-in","transition-property":"all","transition-delay":c*this.options.delayBetweenBars+"ms"})},execute:function(){var b=this,c=this.slider.image1.height(),d=this.slider.image1.find("div.tile");a(d[d.length-1]).transitionEnd(function(){b.finished()}),setTimeout(function(){d.css({opacity:"0.5"}).css3({transform:flux.browser.translate(0,c)})},50)}},c))}}(window.jQuery||window.Zepto),function(a){flux.transitions.bars3d=function(b,c){return new flux.transition_grid(b,a.extend({requires3d:!0,columns:7,rows:1,delayBetweenBars:150,perspective:1e3,renderTile:function(b,c,d,e,f,g){var i=a('<div class="bar-'+c+'"></div>').css({width:e+"px",height:"100%",position:"absolute",top:"0px",left:"0px","z-index":200,background:this.slider.image1.css("background"),"background-size":this.slider.width+"px "+this.slider.height+"px","background-position":"-"+g+"px 0px","background-repeat":"no-repeat"}).css3({"backface-visibility":"hidden"}),j=a(i.get(0).cloneNode(!1)).css({"background-image":this.slider.image2.css("background-image")}).css3({transform:flux.browser.rotateX(90)+" "+flux.browser.translate(0,-f/2,f/2)}),k=a('<div class="side bar-'+c+'"></div>').css({width:f+"px",height:f+"px",position:"absolute",top:"0px",left:"0px",background:"#222","z-index":190}).css3({transform:flux.browser.rotateY(90)+" "+flux.browser.translate(f/2,0,-f/2)+" "+flux.browser.rotateY(180),"backface-visibility":"hidden"}),l=a(k.get(0).cloneNode(!1)).css3({transform:flux.browser.rotateY(90)+" "+flux.browser.translate(f/2,0,e-f/2)});a(b).css({width:e+"px",height:"100%",position:"absolute",top:"0px",left:g+"px","z-index":c>this.options.columns/2?1e3-c:1e3}).css3({"transition-duration":"800ms","transition-timing-function":"linear","transition-property":"all","transition-delay":c*this.options.delayBetweenBars+"ms","transform-style":"preserve-3d"}).append(i).append(j).append(k).append(l)},execute:function(){this.slider.image1.css3({perspective:this.options.perspective,"perspective-origin":"50% 50%"}).css({"-moz-transform":"perspective("+this.options.perspective+"px)","-moz-perspective":"none","-moz-transform-style":"preserve-3d"});var a=this,b=this.slider.image1.height(),c=this.slider.image1.find("div.tile");this.slider.image2.hide(),c.last().transitionEnd(function(){a.slider.image1.css3({"transform-style":"flat"}),a.slider.image2.show(),a.finished()}),setTimeout(function(){c.css3({transform:flux.browser.rotateX(-90)+" "+flux.browser.translate(0,b/2,b/2)})},50)}},c))}}(window.jQuery||window.Zepto),function(a){flux.transitions.blinds=function(b,c){return new flux.transitions.bars(b,a.extend({execute:function(){var b=this,c=(this.slider.image1.height(),this.slider.image1.find("div.tile"));a(c[c.length-1]).transitionEnd(function(){b.finished()}),setTimeout(function(){c.css({opacity:"0.5"}).css3({transform:"scalex(0.0001)"})},50)}},c))}}(window.jQuery||window.Zepto),function(a){flux.transitions.zip=function(b,c){return new flux.transitions.bars(b,a.extend({execute:function(){var b=this,c=this.slider.image1.height(),d=this.slider.image1.find("div.tile");a(d[d.length-1]).transitionEnd(function(){b.finished()}),setTimeout(function(){d.each(function(b,d){a(d).css({opacity:"0.3"}).css3({transform:flux.browser.translate(0,b%2?"-"+2*c:c)})})},20)}},c))}}(window.jQuery||window.Zepto),function(a){flux.transitions.blocks=function(b,c){return new flux.transition_grid(b,a.extend({forceSquare:!0,delayBetweenBars:100,renderTile:function(b,c,d,e,f,g,h){var i=Math.floor(10*Math.random()*this.options.delayBetweenBars);a(b).css({background:this.slider.image1.css("background"),"background-size":this.slider.width+"px "+this.slider.height+"px","background-position":"-"+g+"px -"+h+"px"}).css3({"transition-duration":"350ms","transition-timing-function":"ease-in","transition-property":"all","transition-delay":i+"ms"}),void 0===this.maxDelay&&(this.maxDelay=0),i>this.maxDelay&&(this.maxDelay=i,this.maxDelayTile=b)},execute:function(){var b=this,c=this.slider.image1.find("div.tile");this.maxDelayTile.transitionEnd(function(){b.finished()}),setTimeout(function(){c.each(function(b,c){a(c).css({opacity:"0"}).css3({transform:"scale(0.8)"})})},50)}},c))}}(window.jQuery||window.Zepto),function(a){flux.transitions.blocks2=function(b,c){return new flux.transition_grid(b,a.extend({cols:12,forceSquare:!0,delayBetweenDiagnols:150,renderTile:function(b,c,d,e,f,g,h){Math.floor(10*Math.random()*this.options.delayBetweenBars),a(b).css({background:this.slider.image1.css("background"),"background-size":this.slider.width+"px "+this.slider.height+"px","background-position":"-"+g+"px -"+h+"px"}).css3({"transition-duration":"350ms","transition-timing-function":"ease-in","transition-property":"all","transition-delay":(c+d)*this.options.delayBetweenDiagnols+"ms","backface-visibility":"hidden"})},execute:function(){var b=this,c=this.slider.image1.find("div.tile");c.last().transitionEnd(function(){b.finished()}),setTimeout(function(){c.each(function(b,c){a(c).css({opacity:"0"}).css3({transform:"scale(0.8)"})})},50)}},c))}}(window.jQuery||window.Zepto),function(a){flux.transitions.cube=function(b,c){return new flux.transition(b,a.extend({requires3d:!0,barWidth:100,direction:"left",perspective:1e3,setup:function(){var b=this.slider.image1.width(),c=this.slider.image1.height();this.slider.image1.css3({perspective:this.options.perspective,"perspective-origin":"50% 50%"}),this.cubeContainer=a('<div class="cube"></div>').css({width:b+"px",height:c+"px",position:"relative"}).css3({"transition-duration":"800ms","transition-timing-function":"linear","transition-property":"all","transform-style":"preserve-3d"});var d={height:"100%",width:"100%",position:"absolute",top:"0px",left:"0px"},e=a('<div class="face current"></div>').css(a.extend(d,{background:this.slider.image1.css("background"),"background-size":this.slider.width+"px "+this.slider.height+"px"})).css3({"backface-visibility":"hidden"});this.cubeContainer.append(e);var f=a('<div class="face next"></div>').css(a.extend(d,{background:this.slider.image2.css("background-image")})).css3({transform:this.options.transitionStrings.call(this,this.options.direction,"nextFace"),"backface-visibility":"hidden"});this.cubeContainer.append(f),this.slider.image1.append(this.cubeContainer)},execute:function(){var a=this;this.slider.image1.width(),this.slider.image1.height(),this.slider.image2.hide(),this.cubeContainer.transitionEnd(function(){a.slider.image2.show(),a.finished()}),setTimeout(function(){a.cubeContainer.css3({transform:a.options.transitionStrings.call(a,a.options.direction,"container")})},50)},transitionStrings:function(a,b){var c=this.slider.image1.width(),d=this.slider.image1.height(),e={up:{nextFace:flux.browser.rotateX(-90)+" "+flux.browser.translate(0,d/2,d/2),container:flux.browser.rotateX(90)+" "+flux.browser.translate(0,-d/2,d/2)},down:{nextFace:flux.browser.rotateX(90)+" "+flux.browser.translate(0,-d/2,d/2),container:flux.browser.rotateX(-90)+" "+flux.browser.translate(0,d/2,d/2)},left:{nextFace:flux.browser.rotateY(90)+" "+flux.browser.translate(c/2,0,c/2),container:flux.browser.rotateY(-90)+" "+flux.browser.translate(-c/2,0,c/2)},right:{nextFace:flux.browser.rotateY(-90)+" "+flux.browser.translate(-c/2,0,c/2),container:flux.browser.rotateY(90)+" "+flux.browser.translate(c/2,0,c/2)}};return e[a]&&e[a][b]?e[a][b]:!1}},c))}}(window.jQuery||window.Zepto),function(a){flux.transitions.tiles3d=function(b,c){return new flux.transition_grid(b,a.extend({requires3d:!0,forceSquare:!0,columns:5,perspective:600,delayBetweenBarsX:200,delayBetweenBarsY:150,renderTile:function(b,c,d,e,f,g,h){var i=a("<div></div>").css({width:e+"px",height:f+"px",position:"absolute",top:"0px",left:"0px",background:this.slider.image1.css("background"),"background-size":this.slider.width+"px "+this.slider.height+"px","background-position":"-"+g+"px -"+h+"px","background-repeat":"no-repeat","-moz-transform":"translateZ(1px)"}).css3({"backface-visibility":"hidden"}),j=a(i.get(0).cloneNode(!1)).css({"background-image":this.slider.image2.css("background-image")}).css3({transform:flux.browser.rotateY(180),"backface-visibility":"hidden"});a(b).css({"z-index":(c>this.options.columns/2?500-c:500)+(d>this.options.rows/2?500-d:500)}).css3({"transition-duration":"800ms","transition-timing-function":"ease-out","transition-property":"all","transition-delay":c*this.options.delayBetweenBarsX+d*this.options.delayBetweenBarsY+"ms","transform-style":"preserve-3d"}).append(i).append(j)},execute:function(){this.slider.image1.css3({perspective:this.options.perspective,"perspective-origin":"50% 50%"});var a=this,b=this.slider.image1.find("div.tile");this.slider.image2.hide(),b.last().transitionEnd(function(){a.slider.image2.show(),a.finished()}),setTimeout(function(){b.css3({transform:flux.browser.rotateY(180)})},50)}},c))}}(window.jQuery||window.Zepto),function(a){flux.transitions.turn=function(b,c){return new flux.transition(b,a.extend({requires3d:!0,perspective:1300,direction:"left",setup:function(){var b=a('<div class="tab"></div>').css({width:"50%",height:"100%",position:"absolute",top:"0px",left:"left"==this.options.direction?"50%":"0%","z-index":101}).css3({"transform-style":"preserve-3d","transition-duration":"1000ms","transition-timing-function":"ease-out","transition-property":"all","transform-origin":"left"==this.options.direction?"left center":"right center"}),c=(a("<div></div>").appendTo(b).css({background:this.slider.image1.css("background"),"background-size":this.slider.width+"px "+this.slider.height+"px","background-position":("left"==this.options.direction?"-"+this.slider.image1.width()/2:0)+"px 0",width:"100%",height:"100%",position:"absolute",top:"0",left:"0","-moz-transform":"translateZ(1px)"}).css3({"backface-visibility":"hidden"}),a("<div></div>").appendTo(b).css({background:this.slider.image2.css("background"),"background-size":this.slider.width+"px "+this.slider.height+"px","background-position":("left"==this.options.direction?0:"-"+this.slider.image1.width()/2)+"px 0",width:"100%",height:"100%",position:"absolute",top:"0",left:"0"}).css3({transform:flux.browser.rotateY(180),"backface-visibility":"hidden"}),a("<div></div>").css({position:"absolute",top:"0",left:"left"==this.options.direction?"0":"50%",width:"50%",height:"100%",background:this.slider.image1.css("background"),"background-size":this.slider.width+"px "+this.slider.height+"px","background-position":("left"==this.options.direction?0:"-"+this.slider.image1.width()/2)+"px 0","z-index":100})),d=a('<div class="overlay"></div>').css({position:"absolute",top:"0",left:"left"==this.options.direction?"50%":"0",width:"50%",height:"100%",background:"#000",opacity:1}).css3({"transition-duration":"800ms","transition-timing-function":"linear","transition-property":"opacity"}),e=a("<div></div>").css3({width:"100%",height:"100%"}).css3({perspective:this.options.perspective,"perspective-origin":"50% 50%"}).append(b).append(c).append(d);this.slider.image1.append(e)},execute:function(){var a=this;this.slider.image1.find("div.tab").first().transitionEnd(function(){a.finished()}),setTimeout(function(){a.slider.image1.find("div.tab").css3({transform:flux.browser.rotateY("left"==a.options.direction?-179:179)}),a.slider.image1.find("div.overlay").css({opacity:0})},50)}},c))}}(window.jQuery||window.Zepto),function(a){flux.transitions.slide=function(b,c){return new flux.transition(b,a.extend({direction:"left",setup:function(){var b=this.slider.image1.width(),c=this.slider.image1.height(),d=a('<div class="current"></div>').css({height:c+"px",width:b+"px",position:"absolute",top:"0px",left:"0px",background:this.slider["left"==this.options.direction?"image1":"image2"].css("background")}).css3({"backface-visibility":"hidden"}),e=a('<div class="next"></div>').css({height:c+"px",width:b+"px",position:"absolute",top:"0px",left:b+"px",background:this.slider["left"==this.options.direction?"image2":"image1"].css("background")}).css3({"backface-visibility":"hidden"});this.slideContainer=a('<div class="slide"></div>').css({width:2*b+"px",height:c+"px",position:"relative",left:"left"==this.options.direction?"0px":-b+"px","z-index":101}).css3({"transition-duration":"600ms","transition-timing-function":"ease-in","transition-property":"all"}),this.slideContainer.append(d).append(e),this.slider.image1.append(this.slideContainer)},execute:function(){var a=this,b=this.slider.image1.width();"left"==this.options.direction&&(b=-b),this.slideContainer.transitionEnd(function(){a.finished()}),setTimeout(function(){a.slideContainer.css3({transform:flux.browser.translate(b)})},50)}},c))}}(window.jQuery||window.Zepto),function(a){flux.transitions.explode=function(b,c){return new flux.transition_grid(b,a.extend({columns:6,forceSquare:!0,delayBetweenBars:30,perspective:800,requires3d:!0,renderTile:function(b,c,d,e,f,g,h){var i=Math.floor(10*Math.random()*this.options.delayBetweenBars);a(b).css({background:this.slider.image1.css("background"),"background-size":this.slider.width+"px "+this.slider.height+"px","background-position":"-"+g+"px -"+h+"px"}).css3({"transition-duration":"500ms","transition-timing-function":"ease-in","transition-property":"all","transition-delay":i+"ms"}),void 0===this.maxDelay&&(this.maxDelay=0),i>this.maxDelay&&(this.maxDelay=i,this.maxDelayTile=b)},execute:function(){this.slider.image1.css3({perspective:this.options.perspective,"perspective-origin":"50% 50%"}).css({"-moz-transform":"perspective("+this.options.perspective+"px)","-moz-perspective":"none","-moz-transform-style":"preserve-3d"});var b=this,c=this.slider.image1.find("div.tile");this.maxDelayTile.transitionEnd(function(){b.slider.image1.css3({"transform-style":"flat"}),b.finished()}),setTimeout(function(){c.each(function(b,c){a(c).css({opacity:"0"}).css3({transform:flux.browser.translate(0,0,700)+" rotate3d("+(Math.round(2*Math.random())-1)+", "+(Math.round(2*Math.random())-1)+", "+(Math.round(2*Math.random())-1)+", 90deg) "})})},50)}},c))}}(window.jQuery||window.Zepto);

$.easing.jswing = $.easing.swing;
$.extend($.easing,{def:"easeOutQuad",swing:function(a,b,c,d,e){return $.easing[$.easing.def](a,b,c,d,e)},easeInQuad:function(a,b,c,d,e){return d*(b/=e)*b+c},easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c},easeInOutQuad:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b+c:-d/2*(--b*(b-2)-1)+c},easeInCubic:function(a,b,c,d,e){return d*(b/=e)*b*b+c},easeOutCubic:function(a,b,c,d,e){return d*((b=b/e-1)*b*b+1)+c},easeInOutCubic:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b+c:d/2*((b-=2)*b*b+2)+c},easeInQuart:function(a,b,c,d,e){return d*(b/=e)*b*b*b+c},easeOutQuart:function(a,b,c,d,e){return-d*((b=b/e-1)*b*b*b-1)+c},easeInOutQuart:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b*b+c:-d/2*((b-=2)*b*b*b-2)+c},easeInQuint:function(a,b,c,d,e){return d*(b/=e)*b*b*b*b+c},easeOutQuint:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c},easeInOutQuint:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b*b*b+c:d/2*((b-=2)*b*b*b*b+2)+c},easeInSine:function(a,b,c,d,e){return-d*Math.cos(b/e*(Math.PI/2))+d+c},easeOutSine:function(a,b,c,d,e){return d*Math.sin(b/e*(Math.PI/2))+c},easeInOutSine:function(a,b,c,d,e){return-d/2*(Math.cos(Math.PI*b/e)-1)+c},easeInExpo:function(a,b,c,d,e){return 0==b?c:d*Math.pow(2,10*(b/e-1))+c},easeOutExpo:function(a,b,c,d,e){return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c},easeInOutExpo:function(a,b,c,d,e){return 0==b?c:b==e?c+d:(b/=e/2)<1?d/2*Math.pow(2,10*(b-1))+c:d/2*(-Math.pow(2,-10*--b)+2)+c},easeInCirc:function(a,b,c,d,e){return-d*(Math.sqrt(1-(b/=e)*b)-1)+c},easeOutCirc:function(a,b,c,d,e){return d*Math.sqrt(1-(b=b/e-1)*b)+c},easeInOutCirc:function(a,b,c,d,e){return(b/=e/2)<1?-d/2*(Math.sqrt(1-b*b)-1)+c:d/2*(Math.sqrt(1-(b-=2)*b)+1)+c},easeInElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(0==b)return c;if(1==(b/=e))return c+d;if(g||(g=.3*e),h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return-(h*Math.pow(2,10*(b-=1))*Math.sin(2*(b*e-f)*Math.PI/g))+c},easeOutElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(0==b)return c;if(1==(b/=e))return c+d;if(g||(g=.3*e),h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*b)*Math.sin(2*(b*e-f)*Math.PI/g)+d+c},easeInOutElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(0==b)return c;if(2==(b/=e/2))return c+d;if(g||(g=1.5*.3*e),h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return 1>b?-.5*h*Math.pow(2,10*(b-=1))*Math.sin(2*(b*e-f)*Math.PI/g)+c:.5*h*Math.pow(2,-10*(b-=1))*Math.sin(2*(b*e-f)*Math.PI/g)+d+c},easeInBack:function(a,b,c,d,e,f){return void 0==f&&(f=1.70158),d*(b/=e)*b*((f+1)*b-f)+c},easeOutBack:function(a,b,c,d,e,f){return void 0==f&&(f=1.70158),d*((b=b/e-1)*b*((f+1)*b+f)+1)+c},easeInOutBack:function(a,b,c,d,e,f){return void 0==f&&(f=1.70158),(b/=e/2)<1?d/2*b*b*(((f*=1.525)+1)*b-f)+c:d/2*((b-=2)*b*(((f*=1.525)+1)*b+f)+2)+c},easeInBounce:function(a,b,c,d,e){return d-$.easing.easeOutBounce(a,e-b,0,d,e)+c},easeOutBounce:function(a,b,c,d,e){return(b/=e)<1/2.75?7.5625*d*b*b+c:2/2.75>b?d*(7.5625*(b-=1.5/2.75)*b+.75)+c:2.5/2.75>b?d*(7.5625*(b-=2.25/2.75)*b+.9375)+c:d*(7.5625*(b-=2.625/2.75)*b+.984375)+c},easeInOutBounce:function(a,b,c,d,e){return e/2>b?.5*$.easing.easeInBounce(a,2*b,0,d,e)+c:.5*$.easing.easeOutBounce(a,2*b-e,0,d,e)+.5*d+c}});