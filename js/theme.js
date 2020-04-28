/*!
 * default v1.0.0 
 * Copyright 2015 quanfon.
*/

$(function () {

    /** SIDEBAR FUNCTION **/
    $('.sidebar-left').on("click", "ul.sidebar-menu li a", function () {
        "use strict";
        $('.sidebar-left li').removeClass('active');
        $(this).closest('li').addClass('active');
        var checkElement = $(this).next();
        if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
            $(this).closest('li').removeClass('active');
            checkElement.slideUp('fast');
        }
        if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
            $('.sidebar-left ul.sidebar-menu ul:visible').slideUp('fast');
            checkElement.slideDown('fast');
        }
        if ($(this).closest('li').find('ul').children().length == 0) {
            return true;
        } else {
            return false;
        }
    });

    //show active menu highlight	 
    $(".sidebar-left ul.sidebar-menu li a").each(function () {
        $this = $(this);
        var subRole = $this.attr("data-role");
        var pagesubRole = $("body").attr("role");

        if (pagesubRole.indexOf(subRole) != -1) {
            $this.parent().parent().parent().siblings().removeClass('active');
            $this.parent().parent().parent().addClass('active');
            $this.parent().parent().show();
            $this.parent().siblings().removeClass("active");
            $this.parent().addClass("active");
        }

    });

    /** END SIDEBAR FUNCTION **/

    $(window).on("load resize", function () {
        if ($(this).width() < 1000) {
            $(".sidebar-left").toggleClass("toggle");
            $(".page-content").toggleClass("toggle");
        } else {
            $(".sidebar-left").removeClass("toggle");
            $(".page-content").removeClass("toggle");
        }


    });

    /** BUTTON TOGGLE FUNCTION **/
    $(".open-left").click(function (e) {
        e.stopPropagation();
        $(".sidebar-left").toggleClass("toggle");
        $(".page-content").toggleClass("toggle");

    });
    /** END BUTTON TOGGLE FUNCTION **/

    /* container-fluid min-height*/
    var window_height = $(window).height();
    var iframe_height = (window_height - 190) + "px"; //container-fluid最小高度
    $(".container-fluid").css("min-height", iframe_height);


});

/*fullscreen*/

function toggle_fullscreen() {
    var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
    if (fullscreenEnabled) {
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            launchIntoFullscreen(document.documentElement);
        } else {
            exitFullscreen();
        }
    }
}

// Thanks to http://davidwalsh.name/fullscreen

function launchIntoFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

/*end fullscreen*/


//	隐藏显示

function showMovePop(dd, moveWidth) {//要显示的图层以及宽度
    $(dd).fadeIn();
    var moveDiv = dd + " " + ".pop-inner";
    //alert(moveDiv);
    tipsWindown(moveDiv, moveWidth); //可拖动图层
}

function showPop(dd) {//要显示的图层以及宽度
    //"use strict";
    $(dd).fadeIn();
    $("body").addClass("modal-open");
}


function hidePop(dd) {
    //"use strict";
    $(dd).fadeOut();
    //$("body").removeClass("modal-open");	
    //$(dd).modal("hide");
}

function togglePop(dd) {//要显示的图层以及宽度
    //"use strict";
    $(dd).toggle();
}


function hideModal(div) {
    $(div).modal('hide');
    //$("#editCategory").modal('show');
}

//修改按钮点击时判断	
function editeItem(div) {
    var checkLength = $("#exampleTable input[type='checkbox']:checked").length;
    if (checkLength == 1) {
        $(div).modal('show');
    } else {
        $("#tip-public").show();
        $(".tip-content").text("请选择一个要修改的");
        var closeWindown = function () {
            $("#tip-public").fadeOut("slow");
        }
        //setTimeout(closeWindown, 3000);
    }
}

//删除按钮点击时判断			
function delItem(div) {
    var checkLength = $("#exampleTable input[type='checkbox']:checked").length;
    if (checkLength >= 1) {
        $(div).modal('show');
    } else {
        $("#tip-public").show();
        $(".tip-content").text("请至少选择一个记录");
        var closeWindown = function () {
            $("#tip-public").fadeOut("slow");
        }
        //setTimeout(closeWindown, 3000);
    }
}
