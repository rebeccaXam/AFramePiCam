import os
import tornado.ioloop
import tornado.web
import tornado.websocket

class StreamHandler(tornado.web.RequestHandler):
    def __init__(self, *args, **kwargs):
        self.cam = kwargs.pop('cam')
        super(StreamHandler, self).__init__(*args, **kwargs)

    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def get(self):
        ioloop = tornado.ioloop.IOLoop.current()
        self.set_header('Cache-Control', 'no-store, no-cache, must-revalidate, pre-check=0, post-check=0, max-age=0')
        self.set_header('Connection', 'close')
        self.set_header('Content-Type', 'multipart/x-mixed-replace;boundary=frame')
        self.set_header('Pragma', 'no-cache')
        while self.cam.running and not self._finished:
            try:
                self.write(b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + self.cam.current_frame + b'\r\n')
                yield tornado.gen.Task(self.flush)
            except Exception as ex: 
		print(ex)
            self.cam.newframe_notify.wait()
            self.cam.newframe_notify.clear()
        print('Request {0} finished!'.format(self.request))

class WSHandler(tornado.websocket.WebSocketHandler):

    def open(self):
        print('[WS] Connection was opened.')

    def on_message(self, message):
        print('[WS] Incoming message:', message)

    def on_close(self):
        print('[WS] Connection was closed.')

class WebServer():

    def __init__(self, cam, port, address=""):
	self.cam = cam
	self.port = port
	self.address = address

    def start(self):
        try:
            application = tornado.web.Application([
                (r"/aframe/(.*)", tornado.web.StaticFileHandler, {"path":os.path.join(os.path.dirname(__file__), "static")}),
                (r'/ws', WSHandler),
		(r'/stream', StreamHandler,{'cam':self.cam}),
            ])
            self.http_server = tornado.httpserver.HTTPServer(application)
            self.http_server.listen(self.port,self.address)
            self.main_loop = tornado.ioloop.IOLoop.instance()

            print("Tornado Server started")
            self.main_loop.start()

        except:
            print("Tornado Server stopped.")
