/**
Copyright 2012 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Author: Renato Mangini (mangini@chromium.org)
Author: Luis Leao (luisleao@gmail.com)
**/

(function() {
  
  var btnOpen=document.querySelector(".open");
  var btnClose=document.querySelector(".close");
  var logArea=document.querySelector(".log");
  var statusLine=document.querySelector("#status");
  var displayTimeout = null;
  var displayData = "";
  
  var serial_devices=document.querySelector(".serial_devices");
  
  var logObj=function(obj) {
    console.log(obj);
  }
  var logSuccess=function(msg) {
    log("<span style='color: green;'>"+msg+"</span>");
  };
  var logError=function(msg) {
    statusLine.className="error";
    statusLine.textContent=msg;
    log("<span style='color: red;'>"+msg+"</span>");
  };
  var log=function(msg) {
    console.log(msg);
    logArea.innerHTML=msg+"<br/>"+logArea.innerHTML;
  };
  
  var init=function() {
    if (!serial_lib) throw "You must include serial.js before";

    flipState(true);
    
    btnOpen.addEventListener("click", openSerial);
    btnClose.addEventListener("click", closeSerial);
    document.querySelector(".refresh").addEventListener("click", refreshPorts);

    $("#terminal").click(function() { $("#terminalfocus").focus(); });
    $("#terminalfocus").keypress(function(e) { 
      e.preventDefault();
      var ch = String.fromCharCode(e.which);
      console.log("Press "+ch);
      if (serial_lib.isConnected())
        serial_lib.writeSerial(ch); 
    });

    refreshPorts();
  };
  
  var addEventToElements=function(eventType, selector, listener) {
    var elems=document.querySelectorAll(selector);
    
    for (var i=0; i<elems.length; i++) {
      (function() {
        var c=i;
        elems[i].addEventListener(eventType, function(e) {
          listener.apply(this, [e, c]);
        });
      })();
    }
  };

  var convertToChars=function(i) {
    var ch=i.toString(16);
    if (ch.length==1) return "0"+ch;
    return ""+ch;
  };
  
  var flipState=function(deviceLocated) {
    btnOpen.disabled=!deviceLocated;
    btnClose.disabled=deviceLocated;
  };
  
  var refreshPorts=function() {
    while (serial_devices.options.length > 0)
      serial_devices.options.remove(0);
    
    serial_lib.getPorts(function(items) {
      logSuccess("got "+items.length+" ports");
      var selected = false;
      for (var i=0; i<items.length; i++) {
         serial_devices.options.add(new Option(items[i], items[i]));
         if (i==1 || /usb/i.test(items[i]) && /tty/i.test(items[i])) {
           serial_devices.selectionIndex=i;
           selected = true;
         }
      }
      if (selected) logSuccess("auto-selected "+items[serial_devices.selectionIndex]);
    });
  };
  
  var openSerial=function() {
    var serialPort=serial_devices.options[serial_devices.options.selectedIndex].value;
    if (!serialPort) {
      logError("Invalid serialPort");
      return;
    }
    statusLine.className="on";
    statusLine.textContent="Connecting";
    flipState(true);
    serial_lib.openSerial(serialPort, onOpen);
  };
  
  var onOpen=function(cInfo) {
    logSuccess("Device found (connectionId="+cInfo.connectionId+")");
    flipState(false);
    statusLine.textContent="Connected";
    serial_lib.startListening(onRead);
  };
  
  var writeSerial=function(writeString) {
    if (!serial_lib.isConnected()) {
      return;
    }
    if (!writeString) {
      logError("Nothing to write");
      return;
    }
    if (writeString.charAt(writeString.length-1)!=='\n') {
      writeString+="\n"; 
    }
    serial_lib.writeSerial(writeString); 
  }
  
  var onRead=function(readData) {
    displayData += readData;
    if (displayTimeout != null) window.clearTimeout(displayTimeout);
      displayTimeout = window.setTimeout(function() {
        console.log("Received '"+displayData+"'");
        $("#terminal").html($("#terminal").html() + displayData);
        displayData = "";
        displayTimeout = null;
      }, 500);
  }

  var closeSerial=function() {
   serial_lib.closeSerial(onClose);
  };
  
  var onClose = function(result) {
   flipState(true);
   statusLine.textContent="Hover here to connect";
   statusLine.className="";
  }
  
  
  init();
})();

