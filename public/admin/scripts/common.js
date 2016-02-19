// global var
var isIE = $.browser.msie,
  isIE6 = isIE && (7 > $.browser.version),
  isIE7 = isIE && (8 > $.browser.version),
  isIE8 = isIE && (9 > $.browser.version),
  prefixStr = document.domain.toLowerCase().replace("www.", "").replace(".", "_") + "_",
  currentUrl = window.location.href,
  gotoUrl = encodeURIComponent(window.location.pathname + window.location.search),
  filename = window.location.pathname,
  filename = filename.substr(filename.lastIndexOf("/") + 1, filename.length);

// init xl obj
var xl = {
  go: function(url) {
    window.location.href = url;
  },
  back: function() {
    window.history.back(-1);
  },
  refresh: function() {
    window.location.reload();
  },
  confirm: function(s) {
    var url = (arguments.length > 1) ? arguments[1] : currentUrl;
    if (confirm(s)) xl.go(url);
  },
  isN: function(s) {
    switch (typeof(s)) {
      case 'string':
        return s.trim().length == 0 ? true : false;
        break;
      case 'number':
        return s == 0;
        break;
      case 'object':
        return s == null;
        break;
      case 'array':
        return s.length == 0;
        break;
      default:
        return true;
    }
  },
  urlArg: function(s) {
    var url = (arguments.length > 1) ? arguments[1] : window.location.search;
    var r = url.substring(1).match(new RegExp("(^||&)" + s + "=([^&]*)(&|$)"));
    if (r != null) return unescape(r[2]);
    return "";
  },
  getNow: function(o) {
    $(o).html(((arguments.length > 1) ? arguments[1] : "") + new Date().format("yyyy年M月d日 星期w"));
  },
  msgTip: {
    _timer: null,
    show: function(msg, type, timeout) {
      var tip = '<div id="msgtip">{s}</div>',
        s = '<span class="{type}">{msg}</span>',
        typeClass = {
          0: "err",
          1: "suc",
          2: "loading",
          3: "info"
        };
      s = s.replace("{type}", typeClass[type]);
      s = s.replace("{msg}", msg);
      tip = tip.replace("{s}", s);
      var o = $("#msgtip");
      if (o.length > 0) {
        o.html(s);
      } else {
        $("body").append(tip);
        o = $("#msgtip");
      }
      o.css("left", (($(window).width() - o.width()) / 2) + "px").animate({
        top: "5px"
      }, "fast").show();
      timeout = (typeof(timeout) == 'undefined') ? 1000 : timeout * 1000;
      if (timeout) {
        clearInterval(xl.msgTip._timer);
        xl.msgTip._timer = setInterval(function() {
          xl.msgTip.hide();
        }, timeout);
      } else {
        xl.msgTip.hide();
      }
    },
    hide: function() {
      $("#msgtip").animate({
        top: "-22px"
      }, "fast").fadeOut("fast");
      clearInterval(xl.msgTip._timer);
    }
  },
  showTip: function(s, f, t) {
    var f = arguments[1] || 0,
      t = arguments[2] || 3;
    top.xl.msgTip.show(s, f, t);
  },
  getIds: function() {
    var arr = "";
    $("input:checkbox[name='id']").each(function() {
      if (this.checked) arr += $(this).val() + ",";
    });
    if (arr.lastIndexOf(",") != -1) arr = arr.rdel(1);
    if (arr == "") {
      xl.showTip("未选中任何记录！", 0);
      return '';
    } else {
      return arr;
    }
  },
  callback: function(data) {
    xl.showTip(data.msg, data.code);
    if (data.success) {
      data.url && setTimeout(function() {
        data.url === true ? xl.refresh() : xl.go(data.url);
      }, 300);
    }
  },
  init: function() {
    // $(window).on("error", function() { return true; });
    // is ie6 goto ie6update
    if (isIE6) xl.go('/link?act=ie6update');
    $('a[href="#"]').each(function() {
      $(this).attr('href', 'javascript:;');
    });
    if (isIE8) $('a').attr('hidefocus', 'true');
    $('img[alt="#"]').each(function() {
      $(this).attr('alt', '');
    });
    $('.pagenum').keydown(function(e){
      return checkNumber(e);
    });
    // load date
    // xl.getNow("#now_date");
  }
};

// default load
$(function() {
  xl.init();
  switch (filename) {
    case 'login':
      $('#frmLogin').submit(function() {
        var o = $(this);
        var user = $('#user');
        if ($.trim(user.val()) == '') {
          xl.showTip('请输入帐号！');
          user.focus().select();
          return false;
        }
        var pwd = $('#pwd');
        if ($.trim(pwd.val()) == '') {
          xl.showTip('请输入密码！');
          pwd.focus().select();
          return false;
        }
        $.post(o.attr('action'), o.serialize(), function(x) { xl.callback(x); }, 'json');
        return false;
      });
      break;
    case 'index':
      $('a.logout').click(function() {
        if (confirm('您确定要退出吗？')) return;
        return false;
      });
      // 点击切换按钮
      $('.icon-menu').click(function() {
        $('body').toggleClass('lay-mini');
        if (!$('body').hasClass('lay-mini') && $(window).width() > 800) {
          $('#main-nav').show();
          $('.nav-right').show();
        } else {
          $('#main-nav').hide();
          if (($('.main-top').width() - 42) < $('.nav-right').width()) {
            $('.nav-right').hide();
          } else {
            $('.nav-right').show();
          }
        }
      });
      loadMenuTree(true); //加载管理首页左边导航菜单
      mainPageResize(); //主页面响应式
      $(window).resize(function() {
        // 延迟执行，防止多次触发
        setTimeout(function() {
          mainPageResize(); //主页面响应式
          popMenuTreeResize(); //快捷菜单的设置
        }, 100);
      });
      break;
    default:
      initContentTab(); //初始化TAB
      $(".toolbar").ruleLayoutToolbar();
      $(".imglist").ruleLayoutImgList();
      $(".content-tab").ruleLayoutTab();
      $(".tab-content").ruleLayoutContent();
      //$(".table-container").ruleLayoutTable();
      $(".page-footer").ruleLayoutFooter();
      //窗口尺寸改变时
      $(window).resize(function() {
        //延迟执行,防止多次触发
        setTimeout(function() {
          $("#floatHead").children("div").width($("#floatHead").width());
          $(".toolbar").ruleLayoutToolbar();
          $("#floatHead").height($("#floatHead").children("div").outerHeight());
          $(".imglist").ruleLayoutImgList();
          $(".content-tab").ruleLayoutTab();
          $(".tab-content").ruleLayoutContent();
          //$(".table-container").ruleLayoutTable();
          $(".page-footer").ruleLayoutFooter();
        }, 200);
      });
      break;
  }
  // 加载布局与皮肤插件
  $('#floatHead').xlSmartFloat();
  $('.rule-single-select').xlSingleSelect();
  $('.rule-multi-radio').xlMultiRadio();
  $('.rule-single-checkbox').xlSingleCheckbox();
  $('.rule-multi-checkbox').xlMultiCheckbox();
  $('.rule-multi-porp').xlMultiCheckbox2();
  $('.rule-date-input').ruleDateInput();
});

// set cookie
function addCookie(objName, objValue, objHours) {
  var str = objName + '=' + escape(objValue);
  if (objHours > 0) { //为0时不设定过期时间，浏览器关闭时cookie自动消失
    var date = new Date();
    var ms = objHours * 3600 * 1000;
    date.setTime(date.getTime() + ms);
    str += '; expires=' + date.toGMTString();
  }
  document.cookie = str;
}
// get cookie
function getCookie(objName) {
  var arrStr = document.cookie.split('; ');
  for (var i = 0; i < arrStr.length; i++) {
    var temp = arrStr[i].split('=');
    if (temp[0] == objName) return unescape(temp[1]);
  }
  return '';
}
// 全选取消按钮函数
function checkAll(chkobj) {
  if ($(chkobj).text() == '全选') {
    $(chkobj).children('span').text('取消');
    $('.checkall input:enabled').prop('checked', true);
  } else {
    $(chkobj).children('span').text('全选');
    $('.checkall input:enabled').prop('checked', false);
  }
}
// 只允许输入数字
function checkNumber(e) {
  var keynum = window.event ? e.keyCode : e.which;
  if ((48 <= keynum && keynum <= 57) || keynum == 8 || keynum == 13) {
    return true;
  } else {
    return false;
  }
}
// 只允许输入小数
function checkForFloat(obj, e) {
  var isOK = false;
  var key = window.event ? e.keyCode : e.which;
  if ((key > 95 && key < 106) || //小键盘上的0到9  
    (key > 47 && key < 60) || //大键盘上的0到9  
    (key == 110 && obj.value.indexOf('.') < 0) || //小键盘上的.而且以前没有输入.  
    (key == 190 && obj.value.indexOf('.') < 0) || //大键盘上的.而且以前没有输入.  
    key == 8 || key == 9 || key == 46 || key == 37 || key == 39) {
    isOK = true;
  } else {
    if (window.event) { //IE
      e.returnValue = false; //event.returnValue=false 效果相同.    
    } else { //Firefox 
      e.preventDefault();
    }
  }
  return isOK;
}
// 检查短信字数
function checktxt(obj, txtId) {
  var txtCount = $(obj).val().length;
  if (txtCount < 1) return false;
  var smsLength = Math.ceil(txtCount / 62);
  $('#' + txtId).html('您已输入<b>' + txtCount + '</b>个字符，将以<b>' + smsLength + '</b>条短信扣取费用。');
}
// 四舍五入函数
function ForDight(Dight, How) {
  return Math.round(Dight * Math.pow(10, How)) / Math.pow(10, How);
}
// 导航菜单显示和隐藏
function mainPageResize() {
  var docWidth = $(window).width();
  if (docWidth > 800) {
    $("body").removeClass("lay-mini");
    $("#main-nav").show();
    $(".nav-right").show();
  } else {
    $("body").addClass("lay-mini");
    $("#main-nav").hide();
  }
}
// 加载管理首页左边导航菜单
function loadMenuTree(_islink) {
  // 判断是否跳转链接
  var islink = false;
  if (arguments.length == 1 && _islink) islink = true;
  // $.ajax({
  //   type: "post",
  //   url: "/admin/index/nav_list?rnd=" + Math.random(),
  //   dataType: "html",
  //   success: function(data, textStatus) {
  //     // 将得到的数据插件到页面中
  //     $("#sidebar-nav").html(data);
  //     $("#pop-menu .list-box").html(data);
  //     // 初始化导航菜单
  //     initMenuTree(islink);
  //     initPopMenuTree();
  //   }
  // });
  $("#pop-menu .list-box").html($("#sidebar-nav").html());
  initMenuTree(islink);
  initPopMenuTree();
}
// 初始化导航菜单
function initMenuTree(islink) {
  var navObj = $("#main-nav");
  var navGroupObj = $("#sidebar-nav .list-group");
  var navItemObj = $("#sidebar-nav .list-group .list-wrap");
  //先清空NAV菜单内容
  navObj.html('');
  navGroupObj.each(function(i) {
    //添加菜单导航
    var navHtml = $('<a>' + $(this).children("h1").attr("title") + '</a>').appendTo(navObj);
    //默认选中第一项
    if (i == 0) {
      $(this).show();
      navHtml.addClass("selected");
    }
    //为菜单添加事件
    navHtml.click(function() {
      navObj.children("a").removeClass("selected");
      $(this).addClass("selected");
      navGroupObj.hide();
      navGroupObj.eq(navObj.children("a").index($(this))).show();
    });
    //首先隐藏所有的UL
    $(this).find("ul").hide();
    //绑定树菜单事件.开始
    $(this).find("ul").each(function(j) { //遍历所有的UL
      //遍历UL第一层LI
      $(this).children("li").each(function() {
        var liObj = $(this);
        var spanObj = liObj.children("a").children("span");
        //判断是否有子菜单和设置距左距离
        var parentIconLenght = liObj.parent().parent().children("a").children(".icon").length; //父节点的左距离
        //设置左距离
        var lastIconObj;
        for (var n = 0; n <= parentIconLenght; n++) { //注意<=
          lastIconObj = $('<i class="icon"></i>').insertBefore(spanObj); //插入到span前面
        }

        //如果有下级菜单
        if (liObj.children("ul").length > 0) {
          liObj.children("a").removeAttr("href"); //删除链接，防止跳转
          liObj.children("a").append('<b class="expandable close"></b>'); //最后插件一个+-
          //如果a有自定义图标则将图标插入，否则使用默认的样式
          if (typeof(liObj.children("a").attr("icon")) != "undefined") {
            lastIconObj.append('<img src="' + liObj.children("a").attr("icon") + '" />')
          } else {
            lastIconObj.addClass("folder");
          }
          //隐藏下级的UL
          liObj.children("ul").hide();
          //绑定单击事件
          liObj.children("a").click(function() {
            //如果菜单已展开则闭合
            if ($(this).children(".expandable").hasClass("open")) {
              //设置自身的右图标为+号
              $(this).children(".expandable").removeClass("open");
              $(this).children(".expandable").addClass("close");
              //隐藏自身父节点的UL子菜单
              $(this).parent().children("ul").slideUp(300);
            } else {
              //搜索所有同级LI且有子菜单的右图标为+号及隐藏子菜单
              $(this).parent().siblings().each(function() {
                if ($(this).children("ul").length > 0) {
                  //设置自身的右图标为+号
                  $(this).children("a").children(".expandable").removeClass("open");
                  $(this).children("a").children(".expandable").addClass("close");
                  //隐藏自身子菜单
                  $(this).children("ul").slideUp(300);
                }
              });
              //设置自身的右图标为-号
              $(this).children(".expandable").removeClass("close");
              $(this).children(".expandable").addClass("open");
              //显示自身父节点的UL子菜单
              $(this).parent().children("ul").slideDown(300);
            }
          });

        } else {
          //如果a有自定义图标则将图标插入，否则使用默认的样式
          if (typeof(liObj.children("a").attr("icon")) != "undefined") {
            lastIconObj.append('<img src="' + liObj.children("a").attr("icon") + '" />');
          } else if (typeof(liObj.children("a").attr("href")) == "undefined" || liObj.children("a").attr("href").length < 2) { //如果没有链接
            liObj.children("a").removeAttr("href");
            lastIconObj.addClass("folder");
          } else {
            lastIconObj.addClass("file");
          }
          if (typeof(liObj.children("a").attr("href")) != "undefined") {
            //绑定单击事件
            liObj.children("a").click(function() {
              //删除所有的选中样式
              navGroupObj.find("ul li a").removeClass("selected");
              //删除所有的list-group选中样式
              navGroupObj.removeClass("selected");
              //删除所有的main-nav选中样式
              navObj.children("a").removeClass("selected");
              //自身添加样式
              $(this).addClass("selected");
              //设置父list-group选中样式
              $(this).parents(".list-group").addClass("selected");
              //设置父main-nav选中样式
              navObj.children("a").eq(navGroupObj.index($(this).parents(".list-group"))).addClass("selected");
              //隐藏所有的list-group
              navGroupObj.hide();
              //显示自己的父list-group
              $(this).parents(".list-group").show();
              //保存到cookie
              if (typeof($(this).attr("navid")) != "undefined") {
                addCookie("xl_back_nav", $(this).attr("navid"), 240);
              }
            });
          }
        }

      });
      //显示第一个UL
      if (j == 0) {
        $(this).show();
        //展开第一个菜单
        if ($(this).children("li").first().children("ul").length > 0) {
          $(this).children("li").first().children("a").children(".expandable").removeClass("close");
          $(this).children("li").first().children("a").children(".expandable").addClass("open");
          $(this).children("li").first().children("ul").show();
        }
      }
    });
    //绑定树菜单事件.结束
  });
  //定位或跳转到相应的菜单
  linkMenuTree(islink);
}
// 定位或跳转到相应的菜单
function linkMenuTree(islink, navid) {
  var navObj = $("#main-nav");
  var navGroupObj = $("#sidebar-nav .list-group");
  var navItemObj = $("#sidebar-nav .list-group .list-wrap");

  //读取Cookie,如果存在该ID则定位到对应的导航
  var cookieObj;
  var argument = arguments.length;
  if (argument == 2) {
    cookieObj = navGroupObj.find('a[navid="' + navid + '"]');
  } else {
    cookieObj = navGroupObj.find('a[navid="' + getCookie("xl_back_nav") + '"]');
  }
  if (cookieObj.length > 0) {
    //显示所在的导航和组
    //删除所有的选中样式
    navGroupObj.find("ul li a").removeClass("selected");
    //删除所有的list-group选中样式
    navGroupObj.removeClass("selected");
    //删除所有的main-nav选中样式
    navObj.children("a").removeClass("selected");
    //自身添加样式
    cookieObj.addClass("selected");
    //设置父list-group选中样式
    cookieObj.parents(".list-group").addClass("selected");
    //设置父main-nav选中样式
    navObj.children("a").eq(navGroupObj.index(cookieObj.parents(".list-group"))).addClass("selected");
    //隐藏所有的list-group
    navGroupObj.hide();
    //显示自己的父list-group
    cookieObj.parents(".list-group").show();
    //遍历所有的LI父节点
    cookieObj.parents("li").each(function() {
      //搜索所有同级LI且有子菜单的右图标为+号及隐藏子菜单
      $(this).siblings().each(function() {
        if ($(this).children("ul").length > 0) {
          //设置自身的右图标为+号
          $(this).children("a").children(".expandable").removeClass("open");
          $(this).children("a").children(".expandable").addClass("close");
          //隐藏自身子菜单
          $(this).children("ul").hide();
        }
      });
      //设置自身的右图标为-号
      if ($(this).children("ul").length > 0) {
        $(this).children("a").children(".expandable").removeClass("close");
        $(this).children("a").children(".expandable").addClass("open");
      }
      //显示自身的UL
      $(this).children("ul").show();
    });
    //检查是否需要保存到cookie
    if (argument == 2) {
      addCookie("xl_back_nav", navid, 240);
    }
    //检查是否需要跳转链接
    if (islink == true && cookieObj.attr("href") != "" && cookieObj.attr("href") != "#") {
      frames["mainframe"].location.href = cookieObj.attr("href");
    }
  } else if (argument == 2) {
    //删除所有的选中样式
    navGroupObj.find("ul li a").removeClass("selected");
    //保存到cookie
    addCookie("xl_back_nav", "", 240);
  }
}
// 初始化快捷导航菜单
function initPopMenuTree() {
  //遍历及加载事件
  $("#pop-menu .pop-box .list-box li").each(function() {
    var linkObj = $(this).children("a");
    linkObj.removeAttr("href");
    if ($(this).children("ul").length > 0) { //如果无下级菜单
      linkObj.addClass("nolink");
    } else {
      linkObj.addClass("link");
      linkObj.click(function() {
        linkMenuTree(true, linkObj.attr("navid")); //加载函数
      });
    }
  });
  //设置快捷菜单容器的大小
  popMenuTreeResize();
}
// 设置快捷菜单容器的大小
function popMenuTreeResize() {
  //计算容器的宽度
  var groupWidth = $("#pop-menu .list-box .list-group").outerWidth();
  var divWidth = $("#pop-menu .list-box .list-group").length * groupWidth;
  var winWidth = $(window).width();
  if (divWidth > winWidth) {
    var groupCount = Math.floor(winWidth / groupWidth);
    if (groupCount > 0) {
      groupWidth = groupWidth * groupCount;
    }
  } else {
    groupWidth = divWidth;
  }
  $("#pop-menu .pop-box").width(groupWidth);
  //只有显示的时候才能设置高度
  if ($("#pop-menu").css("display") == "block") {
    setPopMenuHeight();
  }
}
// 设置快捷菜单的高度
function setPopMenuHeight() {
  //计算容器的高度
  var divHeight = $(window).height() * 0.6;
  var groupHeight = 0;
  $("#pop-menu .list-box .list-group").each(function() {
    if ($(this).height() > groupHeight) {
      groupHeight = $(this).height();
    }
  });
  if (divHeight > groupHeight) {
    divHeight = groupHeight;
  }
  $("#pop-menu .list-box .list-group").height(groupHeight);
  $("#pop-menu .pop-box").height(divHeight);
}
// 快捷菜单的显示与隐藏
function togglePopMenu() {
  if ($("#pop-menu").css("display") == "none") {
    $("#pop-menu").show();
    //只有显示的时候才能设置高度
    setPopMenuHeight();
    //设置导航滚动条
    $("#pop-menu .list-box").niceScroll({
      touchbehavior: false,
      cursorcolor: "#ccc",
      cursoropacitymax: 0.6,
      cursorwidth: 5,
      autohidemode: false
    });
  } else {
    $("#pop-menu").hide();
    $("#pop-menu .list-box").getNiceScroll().remove();
  }
}
// 初始化Tab事件
function initContentTab() {
  var parentObj = $(".content-tab");
  var tabObj = $('<div class="tab-title"><span>' + parentObj.find("ul li a.selected").text() + '</span><i></i></div>');
  parentObj.children().children("ul").before(tabObj);
  parentObj.find("ul li a").click(function() {
    var tabNum = $(this).parent().index("li")
      //设置点击后的切换样式
    $(this).parent().parent().find("li a").removeClass("selected");
    $(this).addClass("selected");
    tabObj.children("span").text($(this).text());
    //根据参数决定显示内容
    $(".tab-content").hide();
    $(".tab-content").eq(tabNum).show();
    $(".page-footer").ruleLayoutFooter();
  });
}
// 可以自动关闭的提示，基于artdialog插件
function jsprint(msgtitle, url, callback) {
  var d = dialog({
    content: msgtitle
  }).show();
  setTimeout(function() {
    d.close().remove();
  }, 2000);
  if (url == 'back') {
    frames['mainframe'].history.back(-1);
  } else if (url != '') {
    frames['mainframe'].location.href = url;
  }
  //执行回调函数
  if (arguments.length == 3) {
    callback();
  }
}
// 弹出一个Dialog窗口，基于artdialog插件
function jsdialog(msgtitle, msgcontent, url, callback) {
  var d = dialog({
    title: msgtitle,
    content: msgcontent,
    okValue: '确定',
    ok: function() {},
    onclose: function() {
      if (url == 'back') {
        history.back(-1);
      } else if (url != '') {
        location.href = url;
      }
      //执行回调函数
      if (argnum == 5) {
        callback();
      }
    }
  }).showModal();
}
// 打开一个最大化的Dialog，基于artdialog插件
function ShowMaxDialog(tit, url) {
  dialog({
    title: tit,
    url: url
  }).showModal();
}
// 初始化验证表单，基于Validform插件
$.fn.initValidform = function() {
  return $(this).each(function() {
    $(this).Validform({
      tiptype: function(msg, o, cssctl) {
        if (!o.obj.is("form")) {
          //定位到相应的Tab页面
          if (o.obj.is(o.curform.find(".Validform_error:first"))) {
            var tabobj = o.obj.parents(".tab-content"); //显示当前的选项
            var tabindex = $(".tab-content").index(tabobj); //显示当前选项索引
            if (!$(".content-tab ul li").eq(tabindex).children("a").hasClass("selected")) {
              $(".content-tab ul li a").removeClass("selected");
              $(".content-tab ul li").eq(tabindex).children("a").addClass("selected");
              $(".tab-content").hide();
              tabobj.show();
            }
          }
          //页面上不存在提示信息的标签时，自动创建;
          if (o.obj.parents("dd").find(".Validform_checktip").length == 0) {
            o.obj.parents("dd").append("<span class='Validform_checktip' />");
            o.obj.parents("dd").next().find(".Validform_checktip").remove();
          }
          var objtip = o.obj.parents("dd").find(".Validform_checktip");
          cssctl(objtip, o.type);
          objtip.text(msg);
        }
      },
      showAllError: true,
      beforeSubmit: function(o) {
        $.post(o.attr('action'), o.serialize(), function(x) { xl.callback(x); }, 'json');
        return false;
      }
    });
  });
};
// 日期控件，基于webdateinput插件
$.fn.ruleDateInput = function() {
  var dateInput = function(parentObj) {
    parentObj.wrap('<div class="date-input"></div>');
    parentObj.before('<i></i>');
  };
  return $(this).each(function() {
    dateInput($(this));
  });
};
// 工具栏响应式
$.fn.ruleLayoutToolbar = function() {
  var fun = function(parentObj) {
    //先移除事件和样式
    parentObj.removeClass("mini");
    parentObj.removeClass("list");
    parentObj.find(".l-list").css("display", "");
    parentObj.find(".menu-btn").unbind("click");
    //声明变量
    var rightObj = parentObj.find(".r-list");
    var objWidth = parentObj.width();
    var rightWidth = 0;
    var iconWidth = 0;
    var menuWidth = 0;
    //计算宽度
    parentObj.find(".icon-list li").each(function() {
      iconWidth += $(this).width();
    });
    parentObj.find(".menu-list").children().each(function() {
      menuWidth += $(this).width();
    });
    if (rightObj.length > 0) {
      rightWidth = rightObj.width();
    }

    //判断及设置相应的样式和事件
    if ((iconWidth + rightWidth) < objWidth && menuWidth < objWidth && (iconWidth + menuWidth + rightWidth) > objWidth) {
      parentObj.addClass("list");
    } else if ((iconWidth + rightWidth) > objWidth || menuWidth > objWidth || (iconWidth + menuWidth + rightWidth) > objWidth) {
      parentObj.addClass("mini");
      var listObj = parentObj.find(".l-list");
      parentObj.find(".menu-btn").click(function(e) {
        e.stopPropagation();
        if (listObj.is(":hidden")) {
          listObj.show();
        } else {
          listObj.hide();
        }
      });
      listObj.click(function(e) {
        if (parentObj.hasClass("mini")) {
          e.stopPropagation();
        }
      });
      $(document).click(function(e) {
        if (parentObj.hasClass("mini")) {
          listObj.hide();
        }
      });
    }
  };
  return $(this).each(function() {
    fun($(this));
  });
}
// 图文列表排列响应式
$.fn.ruleLayoutImgList = function() {
  var fun = function(parentObj) {
    var divWidth = parentObj.width();
    var liSpace = parseFloat(parentObj.find("ul li").css("margin-left"));
    var rankCount = Math.floor((divWidth + liSpace) / 235);
    var liWidth = ((divWidth + liSpace) / rankCount) - liSpace;
    parentObj.find("ul li").width(liWidth);
  };
  return $(this).each(function() {
    fun($(this));
  });
}
// 内容页TAB表头响应式
$.fn.ruleLayoutTab = function() {
  var fun = function(parentObj) {
    parentObj.removeClass("mini"); //计算前先清除一下样式
    tabWidth = parentObj.width();
    liWidth = 0;
    parentObj.find("ul li").each(function() {
      liWidth += $(this).outerWidth();
    });
    if (liWidth > tabWidth) {
      parentObj.addClass("mini");
    } else {
      parentObj.removeClass("mini");
    }
  };
  return $(this).each(function() {
    fun($(this));
  });
}
// 内容页TAB内容响应式
$.fn.ruleLayoutContent = function() {
  var fun = function(parentObj) {
    parentObj.removeClass("mini"); //计算前先清除一下样式
    var contentWidth = $("body").width() - parentObj.find("dl dt").eq(0).outerWidth();
    var dlMaxWidth = 0;
    parentObj.find("dl dd").children().each(function() {
      if ($(this).outerWidth() > dlMaxWidth) {
        dlMaxWidth = $(this).outerWidth();
      }
    });
    parentObj.find("dl dd table").each(function() {
      if (parseFloat($(this).css("min-width")) > dlMaxWidth) {
        dlMaxWidth = parseFloat($(this).css("min-width"));
      }
    });
    if (dlMaxWidth > contentWidth) {
      parentObj.addClass("mini");
    } else {
      parentObj.removeClass("mini");
    }
  };
  return $(this).each(function() {
    fun($(this));
  });
}
// 表格处理事件
$.fn.ruleLayoutTable = function() {
  var fun = function(parentObj) {
    var tableWidth = parentObj.children("table").outerWidth();
    var minWidth = parseFloat(parentObj.children("table").css("min-width"));
    if (minWidth > tableWidth) {
      parentObj.children("table").width(minWidth);
    } else {
      parentObj.children("table").css("width", "");
    }
  };
  return $(this).each(function() {
    fun($(this));
  });
}
// 页面底部按钮事件
$.fn.ruleLayoutFooter = function() {
  var fun = function(parentObj) {
    var winHeight = $(window).height();
    var docHeight = $(document).height();
    if (docHeight > winHeight) {
      parentObj.find(".btn-wrap").css("position", "fixed");
    } else {
      parentObj.find(".btn-wrap").css("position", "static");
    }
  };
  return $(this).each(function() {
    fun($(this));
  });
}
