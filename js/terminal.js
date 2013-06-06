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
  var displayData = [];
  
  var serial_devices=document.querySelector(".serial_devices");
  var termText = [ "" ];
  var termCursorX = 0;
  var termCursorY = 0;
  
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
    $("#terminalfocus").focus(function() { $("#terminal").addClass('focus'); } ).blur(function() { $("#terminal").removeClass('focus'); } );
    $("#terminalfocus").keypress(function(e) { 
      e.preventDefault();
      var ch = String.fromCharCode(e.which);
      console.log("Press "+ch);
      if (serial_lib.isConnected())
        serial_lib.writeSerial(ch); 
    }).keydown(function(e) { 
      var ch = undefined;
      if (e.ctrlKey) {
        if (e.keyCode == 'C'.charCodeAt(0)) ch = String.fromCharCode(3); // control C
      }
      if (e.keyCode == 8) ch = "\x08";
      if (e.keyCode == 38) ch = String.fromCharCode(27)+String.fromCharCode(91)+String.fromCharCode(65); // up
      if (e.keyCode == 40) ch = String.fromCharCode(27)+String.fromCharCode(91)+String.fromCharCode(66); // down
      if (e.keyCode == 39) ch = String.fromCharCode(27)+String.fromCharCode(91)+String.fromCharCode(67); // right
      if (e.keyCode == 37) ch = String.fromCharCode(27)+String.fromCharCode(91)+String.fromCharCode(68); // left

      if (ch!=undefined) {
        e.preventDefault();
        console.log("Press "+e.keyCode+" = '"+ch+"'");
        if (serial_lib.isConnected())
          serial_lib.writeSerial(ch);
      } 
    });;

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
      var selected = -1;
      for (var i=0; i<items.length; i++) {
         serial_devices.options.add(new Option(items[i], items[i]));
         if (i==0 || (/usb/i.test(items[i])  && /tty/i.test(items[i]))) {
           selected = i;
         }
      }
      if (selected) logSuccess("auto-selected "+items[selected]);
      serial_devices.options.selectedIndex = selected;
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

  function getSubString(str, from, len) {
    if (len == undefined) {
      return str.substr(from, len);
    } else {
      var s = str.substr(from, len);
      while (s.length < len) s+=" ";
      return s;
    }
  }
  
  var handleReceivedCharacter = function (/*char*/ch) {
        console.log("IN = "+ch);
        if (ch == 13) { // carriage return
          termCursorX = 0;           
        } else if (ch == 10) { // new line
          termCursorX = 0; termCursorY++;
          termText.splice(termCursorY,0,"");
        } else if (ch == 8) { // backspace
          if (termCursorX>0) termCursorX--;
        } else {
          termText[termCursorY] = getSubString(termText[termCursorY],0,termCursorX) + String.fromCharCode(ch) + getSubString(termText[termCursorY],termCursorX+1);
          termCursorX++;
        }        
  }
  var updateTerminal = function() {        
        var t = [];
        for (y in termText) {
          var line = termText[y];
          if (y == termCursorY)
            line = getSubString(line,0,termCursorX) + "<span class='termCursor'>" + getSubString(line,termCursorX,1) + "</span>" + getSubString(line,termCursorX+1);
          t.push("<div class='termLine' lineNumber='"+y+"'>"+line+"</div>");
        }
        
        $("#terminal").html(t.join(""));
        var cursorpos = $("#terminal .termLine[lineNumber="+termCursorY+"]").position().top;
        var height = $("#terminal").height();
        var scrollpos = $("#terminal").scrollTop();
        if (cursorpos > height+scrollpos) $("#terminal").scrollTop(cursorpos-height);
        if (cursorpos < scrollpos) $("#terminal").scrollTop(cursorpos);
  }

  var onRead=function(readData) {
    // Add data to our buffer
    var bufView=new Uint8Array(readData);
    for (var i=0;i<bufView.length;i++) displayData.push(bufView[i]);
    // If we haven't had data after 100ms, update the HTML
    if (displayTimeout != null) window.clearTimeout(displayTimeout);
      displayTimeout = window.setTimeout(function() {
        for (i in displayData) 
          handleReceivedCharacter(displayData[i]);
        updateTerminal();
        displayData = [];
        displayTimeout = null;
      }, 100);
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

