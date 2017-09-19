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
   
    var r = cameraEl.getAttribute('rotation');
    if(!camrotation || camrotation.x != r.x || camrotation.y != r.y || camrotation.z != r.z){
       camrotation = r;
       var plane = document.querySelector('#streamPlane');
       if (!plane_old)plane_old = plane.getAttribute('position'); 
       plane.setAttribute('position',{x:0,y:0,z:0});
       plane.setAttribute('rotation',r); 
       var rx = toRadians(r.x);
       var ry = toRadians(r.y);
       var rz = toRadians(r.z);
       var rxc = Math.cos(rx); 
       var rxs = Math.sin(rx);
       var ryc = Math.cos(ry); 
       var rys = Math.sin(ry);
       var rzc = Math.cos(rz); 
       var rzs = Math.sin(rz);             
       var x = plane_old.x*ryc*rzc + plane_old.y*(-rxc*rzs+rxs*rys*rzc) + plane_old.z*(rxs*rzs+rxc*rys*rzc);
       var y = plane_old.x*(ryc*rzs) + plane_old.y*(rxc*rzc+rxs*rys*rzs) + plane_old.z*(-rxs*rzc+rxc*rys*rzs);
       var z = plane_old.x*-rys + plane_old.y*rxs*ryc + plane_old.z*rxc*ryc;
       plane.setAttribute('position',{x:x,y:y,z:z}); /// calc new position

       if(ws.isOpen){
           ws.send(JSON.stringify({'rotation':r}));
       }
    }

    /*var p = cameraEl.getAttribute('position');
    if(!campos || campos.x != p.x || campos.y != p.y || campos.z != p.z){
       campos = p;
       console.log(p);
       if(ws.isOpen){
           ws.send(JSON.stringify({'position':p}));
       }
    }*/
  }
});
