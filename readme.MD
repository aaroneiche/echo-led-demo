# Echo LED Control Demo

This project is a simple demo of controlling an RGB LED strand with an Amazon Echo.

## Parts

_secure.js_ is the application. It runs a webserver, listens for requests coming from an Amazon Echo,
carries out the request (a color change) and generates/sends a response. Because of the SSL requirement of
Echo interactions, the web server is HTTPS only. You will need to provide certificates (Key, Certificate, and CA) In this file you must configure which serial port to use, and the certificates.

_arduino.ino_ is Arduino firmware. It receives serial data (through whatever port you define) and writes out the RGB data to the WS2811 strand. It depends on [Adafruit's NeoPixel library](https://github.com/adafruit/Adafruit_NeoPixel).

This project is detailed [at this blog post](https://aaroneiche.com/2016/01/03/weekend-project-amazon-echo-led-control/), and a video demonstrating the project can be found at [Youtube](https://www.youtube.com/watch?v=5xa14FRIol0).
