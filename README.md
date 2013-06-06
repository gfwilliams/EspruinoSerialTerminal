EspruinoSerialTerminal
======================

A Simple Web-Based Serial Terminal for writing Espruino code

This is a Chromium Web App that uses chome.serial to access your PC's serial port: http://developer.chrome.com/apps/serial.html

It implements basic VT100 terminal features (up/down/left/right/etc) - enough for you to write code using the Espruino JavaScript interpreter on a Microcontroller (http://www.espruino.com)

Currently, it's a bit of a mess inside - quickly hacked together from the Chrome example. Please, if you have some free time, help me make this better!


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
* In the Top Left, make sure the correct serial port is chosen (usually ttyUSB0/ttyACM0 on linux)
* Click the 'Play' (connect) button

Features that would be nice
----------------------------
* Make Copy and Paste work!
* Option to use a Baud rate other than the default 9600
* A syntax-highlighted JavaScript editor (CodeMirror?) that has a 'Send to espruino button'
* Make it prettier/easier to use

Features that would be epic
----------------------------
* Some kind of arrangement so projects on the Espruino site could immediately be loaded
* Implement the STM32 bootloader protocol so you can flash Espruino over the internet!
* Use the Mozilla sound API to fake a serial port over the Audio Link
