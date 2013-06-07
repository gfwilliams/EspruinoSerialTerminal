#!/bin/bash
cd `dirname $0`
cd ..
rm -f EspruinoSerialTerminal.zip
zip EspruinoSerialTerminal.zip main.html manifest.json css/*.css css/ui-lightness/*.css css/ui-lightness/images/* img/*.png js/*.js
