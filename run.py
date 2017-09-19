#!/usr/bin/python
from camera import Camera
from server import WebServer

PORT = 8080
RESOLUTION = 'VGA'
QUALITY = 30
FRAMERATE = 30

cam = Camera(RESOLUTION,QUALITY,FRAMERATE)
ws = WebServer(cam,PORT,'0.0.0.0')
# start camera Thread
cam.start()
#blocking
ws.start()
cam.stop()
