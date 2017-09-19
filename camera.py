#!/usr/bin/python
import os, io, threading, picamera
from picamera import PiCamera

class Camera(object):
    running = True
    current_frame = None
    thread = None
    camera = None

    def __init__(self, resolution="VGA",quality=50,framerate=60):
        self.resolution = resolution
        self.quality = quality
        self.framerate = framerate
        self.newframe_notify = threading.Event()

    def outputs(self):
        stream = io.BytesIO()
        while self.running:
            yield stream
            stream.seek(0)
            self.current_frame = stream.getvalue()
            self.newframe_notify.set()
            stream.seek(0)
            stream.truncate()
        self.current_frame = None

    def start(self):
        if self.thread: return
        self.running = True
        self.thread = threading.Thread(name="CameraThread", target=self._run)
        self.thread.daemon = True
        self.thread.start()

    def stop(self):
        if not self.thread: return
        self.running = False
        self.thread.join()
        self.thread = None

    def _run(self):
        try:
            self.camera = picamera.PiCamera()
            self.camera.resolution = self.resolution
            self.camera.framerate = self.framerate
            self.camera.capture_sequence(self.outputs(), 'jpeg', use_video_port=True, quality=self.quality)
        finally:
            self.camera.close()
            print('Camera closed!')
