EspruinoSerialTerminal
======================

A Simple Web-Based Serial Terminal - designed for writing code on microcontroller that use the Espruino JavaScript interpreter (http://www.espruino.com) - but useful for a bunch of other stuff too!

[![ScreenShot](https://raw.github.com/gfwilliams/EspruinoSerialTerminal/master/README.png)](http://youtu.be/4O5xKfazAWI)

This is a Chromium Web App that uses chome.serial to access your PC's serial port: http://developer.chrome.com/apps/serial.html

It implements basic VT100 terminal features (up/down/left/right/etc) - enough for you to write code using the Espruino, but not a whole bunch more.

Currently, it's a bit of a mess inside - quickly hacked together from the Chrome example and hence under their Apache licence. Please, if you have some free time, help me make this better!


Installing
----------

* Download the files in EspruinoSerialTerminal to a directory on your PC
* Install Chome Web Browser
* Click the menu icon in the top right
* Click 'Settings'
* Click 'Extensions' on the left
* Click 'Load Unpackaged Extension'
* Navigate to the Directory where you downloaded EspruinoSerialTerminal and click Ok
* Job Done. It'll now appear as an app, but you can start it easily right now by clicking the 'Launch' link on the extensions page

Using
-----

* Run the Web app
* If you've only just plugged your device in, press the refresh button
* In the Top Left, make sure the correct serial port is chosen (usually: Highest COM# number on Windows, tty.usbmodem/ttys000 on Mac, ttyUSB0/ttyACM0 on linux)
* Click the 'Play' (connect) button
* Click in the gray terminal window and start typing away!

Features that would be nice
----------------------------
* Make Copy and Paste work!
* Option to use a Baud rate other than the default 9600
* Better auto-detection of the correct serial device
* More complete VT100 emulation
* A syntax-highlighted JavaScript editor (CodeMirror?) that has a 'Send to espruino button'
* Make it prettier/easier to use

Features that would be epic
----------------------------
* Some kind of arrangement so projects on the Espruino site could immediately be loaded
* Implement the STM32 bootloader protocol so you can flash Espruino over the internet!
* Use the Mozilla sound API to fake a serial port over the Audio Link for non-Chrome devices
