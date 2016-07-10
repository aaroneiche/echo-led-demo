# Echo LED Control Demo

This project is a simple demo of controlling an WS2811 RGB LED strand with an Amazon Echo.

## Components

_secure.js_ is the application. It runs a webserver, listens for requests coming from an Amazon Echo,
carries out the request (a color change) and generates/sends a response. Because of the SSL requirement of
Echo interactions, the web server is HTTPS only. You will need to provide certificates (Key, Certificate, and CA) In this file you must configure which serial port to use, and the certificates. You'll need to turn on port forwarding on your router at home to get requests to your computer (or Raspberry Pi or whatever you run this on.)

_arduino.ino_ is Arduino firmware. It receives serial data (through whatever port you define) and writes out the RGB data to the WS2811 strand. It depends on [Adafruit's NeoPixel library](https://github.com/adafruit/Adafruit_NeoPixel).

## Setting up an Echo
In order to make all this work, you're going to need to setup your Amazon Echo with a skill to interact with your server. Here are some settings information

__Skill Type__: Custom Interaction Model

__Name__: Whatever you want to call it.

__Invocation Name__: I used _Oberon_ because it was unique phonically, and I enjoyed commanding a magical King. I'd prefer you not use _Oberon_ or if you do, don't publish a skill using it.

#### Interaction Model
This is where all the important info for the skill goes
##### Intent Schema
```
{
    "intents": [
     {
         "intent":  "SetColor",
         "slots": [
           {
             "name":"color",
             "type":"LIST_OF_COLORS"
           }
         ]
     },
     {
          "intent": "Lights",
          "slots": [
              {
                "name":"channel",
                "type":"CHANNEL_VAL"
              },
              {
                "name":"to",
                "type":"ON_OFF"
              }              
          ]
     }
  ]
}
```
##### Custom Slot Types
```
CHANNEL_VAL	1 | 2 | 3
LIST_OF_COLORS	blue | red | green | yellow | orange | purple | white
ON_OFF	ON | OFF
```

##### Sample Utterances
```
SetColor change color
SetColor change the color
SetColor change color to {color}
SetColor change the color to {color}
SetColor set color to {color}
SetColor set the color to {color}

Lights turn {to} the lights
Lights turn {to} light {channel}
```

#### Configuration
You'll need to use an HTTPS endpoint (because you can't plug your Arduino into a Lamba function) I have a domain I point back home - you should be able to use a dynamic DNS domain.

#### SSL certificate
As mentioned above, you'll need an SSL cert. Amazon didn't seem to respect _Let's Encrypt_ certificates when I built this, it may have changed since then. You can use a Self signed certificate though because you're only running this at home and not publishing the skill.

Everything else in the config is there for published skills. Once you get it setup, you can test commands against your server.



This project is detailed [at this blog post](https://aaroneiche.com/2016/01/03/weekend-project-amazon-echo-led-control/), and a video demonstrating the project can be found at [Youtube](https://www.youtube.com/watch?v=5xa14FRIol0).
