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
Author: Gordon Williams (gw@pur3.co.uk)
**/

var serial_lib=(function() {
  
  var connectionInfo;
  var readListener;
  
  var startListening=function(callback) {
    if (!connectionInfo || !connectionInfo.connectionId) {
      throw new "You must call openSerial first!";
    }
    readListener=callback;
    onCharRead();
  };

  var onCharRead=function(readInfo) {
    if (!readListener || !connectionInfo) {
      return;
    }
    if (readInfo && readInfo.bytesRead>0 && readInfo.data) {
      onRead(readInfo.data);
    }
    chrome.serial.read(connectionInfo.connectionId, 128, onCharRead);
  };

  var getPorts=function(callback) {
    chrome.serial.getPorts(callback);
  };
  
  var openSerial=function(serialPort, callback) {
    chrome.serial.open(serialPort, {bitrate: 9600}, 
      function(cInfo) {
        onOpen(cInfo, callback);
    });
  };
  
  var onOpen=function(cInfo, callback) {
    if (!cInfo || !cInfo.connectionId || cInfo.connectionId<0) {
      console.log(cInfo);
      throw "could not find device (connectionInfo="+cInfo+")";
    } else {
      connectionInfo=cInfo;
      console.log(cInfo);
      if (callback) callback(cInfo);
    }
  };
  
  var writeSerial=function(str) {
    chrome.serial.write(connectionInfo.connectionId, str2ab(str), onWrite); 
  };
  
  var onWrite=function(obj) {
  };
  
  var onRead=function(readInfo) {
    if (readListener) readListener(readInfo);
  };

  var str2ab=function(str) {
    var buf=new ArrayBuffer(str.length);
    var bufView=new Uint8Array(buf);
    for (var i=0; i<str.length; i++) {
      bufView[i]=str.charCodeAt(i);
    }
    return buf;
  };
 
 
  var closeSerial=function(callback) {
   if (connectionInfo) {
     chrome.serial.close(connectionInfo.connectionId, 
      function(result) {
        onClose(result, callback);
      });
    }
  };
  
  var onClose = function(result, callback) {
   connectionInfo=null;
   if (callback) callback(result);
  };
  
  var isConnected = function() {
    return connectionInfo!=null && connectionInfo.connectionId>=0;
  };

  return {
    "getPorts": getPorts,
    "openSerial": openSerial,
    "isConnected": isConnected,
    "startListening": startListening,
    "writeSerial": writeSerial,
    "closeSerial": closeSerial
  };
})();
