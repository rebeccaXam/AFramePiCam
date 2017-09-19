# AFramePiCam
Project the video stream of the Raspberry Pi camera onto a plane in A-Frame VR.

# Install
This demo dependents on [Tornado Web Server](http://www.tornadoweb.org/en/stable/) and the [picamera](http://picamera.readthedocs.io/en/release-1.13/)
Please install on the Raspberry Pi:
```
apt-get install python-picamera
pip install tornado
```
Enable your camera in the raspi-config:
```
raspi-config
```
and check if the camera is working with
```
raspistill -o test.jpg
```
Checkout this repository on the Raspberry Pi:
```
git clone https://github.com/rebeccaXam/AFramePiCam.git
```

# Run
To run the server on the Raspberry Pi:
```
cd AFramePiCam
python run.py
```
Press CTRL+C to stop the server.

# A-Frame site
```
http://<raspberryIP>:8080/aframe/index.html
```
The video stream is on:
```
http://<raspberryIP>:8080/stream
```
The websocket to exchange messages between the A-Frame and the PI:
```
ws://<raspberryIP>:8080/ws
```

Enjoy ;)
