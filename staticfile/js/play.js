var videoElement = document.getElementById('videoElement');
var flvPlayer = flvjs.createPlayer({
    type: 'flv',
    url: '<%=urlHix+course.URL%>.flv',
    isLive: true
});
if (flvjs.isSupported()) {
    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load(); //加载
}

function flv_start() {
    flvPlayer.play();
}

function flv_pause() {
    flvPlayer.pause();
}

function flv_destroy() {
    flvPlayer.pause();
    flvPlayer.unload();
    flvPlayer.detachMediaElement();
    flvPlayer.destroy();
    flvPlayer = null;
}
