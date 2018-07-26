var ws = new WebSocket("ws://"+location.host+"/ws");
ws.isOpen = false;

ws.onopen = function()
{
    ws.isOpen = true;
    console.log('Websocket open!');
};

ws.onmessage = function(evt)
{
    console.log(evt);
};

ws.onclose = function()
{
    ws.isOpen = false;
    console.log("Websocket closed!");
};

window.onbeforeunload = function(event)
{
    ws.close();
};

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

var camrotation = null; 
var campos = null;
var plane_old = null;
AFRAME.registerComponent('draw-canvas-rectangles', {
  schema: {type: 'selector'},

  init: function () {
    var canvas = this.canvas = this.data;
    var ctx = this.ctx = canvas.getContext('2d');
    var img = document.getElementById('videoStream');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  },

  tick: function (t) {
    var img = document.getElementById('videoStream');
    this.ctx.drawImage(img, 0, 0, this.canvas.width,this.canvas.height);
    var cameraEl = this.el.sceneEl.camera.el;

    /*var p = cameraEl.getAttribute('position');
    var r = cameraEl.getAttribute('rotation');
    if(ws.isOpen){
           ws.send(JSON.stringify({'position':p}));
	   ws.send(JSON.stringify({'rotation':r}));
    }*/
  }
});
