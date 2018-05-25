//统一 requestAnimationFrame

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

var _modal={},_win;


var _common = (function () {

    function init() {
        init_sel();
        _win = init_win();
        mouse_tip("[data-tip]","tip",8,0);
        init_modal();
        $(".h-item.login").on("click",function(){
            _modal.Login();
        });
        $(".h-item.register").on("click",function(){
            _modal.Register();
        });
        $(".forget_modal").on("click",function(){
            _modal.Login(1);
            _modal.ResetPw();
        });
    }

    //初始化select
    function init_sel() {
        var sel = $(".dpSelect");
        if (!sel || sel.length <= 0) {
            return;
        }
        sel.each(function () {
            var that = $(this),
                text = that.find(".text"),
                list = that.find(".hd-block"),
                input = that.find(".value");

            text.on("click", function () {
                that.toggleClass("active");
            });

            list.on("click", ".item", function () {
                var dom = $(this);
                text.find(">span").text(dom.text());
                input.val(dom.data("val"));
                that.removeClass("active");
            });

            $(document).on("click", function (e) {
                var target = $(e.toElement || e.target).closest(".dpSelect");
                if (target.length <= 0 || !target.is(that)) {
                    that.removeClass("active");
                }
            });
        });
    }


    // 初始化浮动窗口
    function init_win() {
        var wins = $(".window");

        function initWin(name, isClose) {

            var dom = wins.filter("." + name);
            if (dom.length <= 0) {
                return;
            }
            if (isClose) {
                close(dom);
            } else {
                open(dom);
            }
        }
        function open(dom) {

            dom.show();
            requestAnimationFrame(function () {
                dom.addClass("active");
            });
        }
        function close(dom) {
            dom.removeClass("active");
            setTimeout(function () {
                dom.hide();
            }, 300);
        }
        $(".has-window").on("click", function (e) {
            wins.removeClass("active").hide();
            var that = $(this),
                name = that.data("win"),
                twin = wins.filter("." + name);
            if (twin.length <= 0) {
                return;
            }
            tw = that.outerWidth(),
                th = that.outerHeight(),
                to = that.offset(),
                tot = to.top,
                tol = to.left,
                ww = twin.width();
            twin.css({
                left: to.left - ww + tw + 6,
                top: to.top + th + 12
            });
            initWin(name);
            return false;

        });
        $(document).on("click", function (e) {
            var target = $(e.target || e.toElement).closest(".window");
            if (target.length <= 0) {
                wins.each(function () {
                    close($(this));
                });
                return;
            }
            wins.each(function () {
                var that = $(this);
                if (!target.is(that)) {
                    close(that);
                }
            });
        });
        $(".notice-container").mCustomScrollbar({theme:"com"});
        return initWin;
    }

    //初始化弹层
    function init_modal(){
        _modal.ChangePhone=get_modal("m-edit-phone");
        _modal.ResetPw=get_modal("m-reset-password");
        _modal.EditPw=get_modal("m-edit-password");
        _modal.ResetEm=get_modal("m-edit-email");
        _modal.Login=get_modal("m-login");
        _modal.Register=get_modal("m-register");
        _modal.Exit=get_modal("m-exit");
        _modal.Problem=get_modal("m-problem-new");
        function get_modal(name){
            var dom=$(".modal."+name );
            if(dom.length<=0)return;
            dom.open=function(){
                open_modal($(this));
            };
            dom.close=function(){
                close_modal($(this));
            };
            dom.fresh=function(){

            }
            dom.find(".close").on("click",function(){
                close_modal(dom);
            });
            dom.find(".cancel").on("click",function(){
                close_modal(dom);
            });
            return function(close,callback){
                if(close){
                    dom.close();
                    if(typeof(callback)=="function"){
                        callback();
                    }
                }else{
                    dom.open();
                    if(typeof(callback)=="function"){
                        callback();
                    }
                }
            };
            function open_modal(m){
                m.show();
                setTimeout(function(){
                    m.addClass("active");
                    fresh_modal(m);
                },50);
            }
            function fresh_modal(m){
                var that=m.find(".modal-info-main")||m.find(".modal-main");
                that.height("auto");
                var mh=that.outerHeight();

                if(mh%2!=0){
                    that.outerHeight(mh+1);
                }
            }
            function close_modal(m){
                m.removeClass("active");
                setTimeout(function(){
                    m.hide();
                },300);
            }
        }


        change_step();

    }

    // 弹层切换步骤
    function change_step(){
        var menu=$(".page-step");
        if(menu&&menu.length){
            menu.each(function(){
                var that=$(this);
                var blocks=that.siblings(".changed-block");
                blocks.find(".step-next").on("click",function(){
                    that.find(".item.active").next().addClass("active");
                    blocks.filter(".active").next().addClass("active").prev().removeClass("active");
                });
            });
        }
    }

    /*表单错误显示*/
    function input_error_show(dom,text){
        if(dom.length<=0)return;
        var err_tip=dom.siblings(".error-info");
        if(err_tip.length<=0){
            err_tip=$('<div class="error-info"></div>');
            dom.after(err_tip);
        }
        err_tip.html('<i class="iconfont">&#xe630;</i>'+text);
        dom.addClass("error");
    }
    /*表单错误取消*/
    function input_error_hide(dom,text){
        if(dom.length<=0)return;
        dom.removeClass("error");
    }

    /*成功tips提示*/
    function success_tips(text,time){
        if(!time){
            time=2000
        }
        var html=$('<div class="uc-success-tip"><h6><i class="iconfont">&#xe71e;</i><span>' +
            text +
            '</span></h6></div>');
        $("body").append(html);
        setTimeout(function(){
            html.addClass("active");
            setTimeout(function(){
                html.removeClass("active");
                setTimeout(function(){
                    html.remove();
                },300);
            },time);
        },50);
    }

    /*自定义tips*/
    function mouse_tip(selector,tip,fix_x,fix_y){
        var dom,
            live_on=false;
        if(typeof(selector)=='string')
        {
            dom=$(selector);
            live_on=true;
        }
        if(typeof(selector)=="object")
        {
            dom=selector;
        }
        if(dom.length<=0)
            return;
        tip=tip?tip:"tip";
        fix_x=fix_x?parseInt(fix_x):10;
        fix_y=fix_y?parseInt(fix_y):10;
        var m_tip=$(".mouse_tip");
        if(m_tip.length<=0){
            m_tip=$("<div class='mouse_tip'></div>");
            $("body").append(m_tip);
        }
        if(live_on) {
            $(document).on("mousemove mouseleave", selector, function (e) {
                if (e.type == "mousemove") {
                    dom_show($(this),e);
                }
                else {
                    m_tip.hide();
                }

            });
        }else{
            dom.on("mousemove mouseleave", function (e) {
                if (e.type == "mousemove") {
                    dom_show($(this),e);
                }
                else {
                    m_tip.hide();
                }
            });
        }
        function dom_show(dom,e){
            var text=dom.data(tip),html="",
                top = $(document).scrollTop();
            if(!text)
                return;
            text=text.split("|");
            if(text.length>0){
                $.each(text,function(){
                    if(this.length>0){
                        html+="<br/>"+this;
                    }
                });
                html=html.replace("<br/>","");
            }
            m_tip.html(html);
            m_tip.show().css("left", e.pageX + fix_x).css("top", e.pageY - top + fix_y);
        }
    }



    return {
        init: init
    }
}());

$(function () {
    _common.init();

    var footer_height = $(".u-fooer").height(),
        header_height = $(".header").height(),
        window_height = $(window).height(),
        menu_height = window_height-footer_height-header_height;
        if (menu_height<=711) {
          $(".menu_bar").height(711);
        }else {
          $(".menu_bar").height(menu_height);
        }


    if ($(".footer").length > 0) {

      var body_height = $("body").height(),
          window_height = $(window).height(),
          header_height = $(".header").height(),
          footer_height = $(".fooer").height(),
          section_height = window_height-footer_height-header_height;
          if (body_height < window_height) {
            console.log("999");
            $(".section").height(section_height);
          }
    }

});
