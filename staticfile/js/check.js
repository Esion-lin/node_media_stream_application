function flashChecker() {
    var hasFlash = 0;         //是否安装了flash
    var flashVersion = 0; //flash版本
    var isIE = /*@cc_on!@*/0;      //是否IE浏览器

    if (isIE) {
        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if (swf) {
            hasFlash = 1;
            VSwf = swf.GetVariable("$version");
            flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
        }
    } else {
        if (navigator.plugins && navigator.plugins.length > 0) {
            var swf = navigator.plugins["Shockwave Flash"];
            if (swf) {
                hasFlash = 1;
                var words = swf.description.split(" ");
                for (var i = 0; i < words.length; ++i) {
                    if (isNaN(parseInt(words[i]))) continue;
                    flashVersion = parseInt(words[i]);
                }
            }
        }
    }
    return {f: hasFlash, v: flashVersion};
}

var fls = flashChecker();
var s = "";
if (fls.f) {
    document.getElementsByClassName("openFlash")[0].style.display = "none";
    document.getElementsByClassName("openFlashTips")[0].style.display = "none";
    //alert("您安装了flash,当前flash版本为: " + fls.v + ".x");
}
else {
    document.getElementsByClassName("openFlash")[0].style.display = "block";
    document.getElementsByClassName("openFlashTips")[0].style.display = "block";
    //alert("您没有安装flash");
}
