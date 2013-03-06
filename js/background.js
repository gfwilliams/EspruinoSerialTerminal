chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('main.html',
     {width: 800, height: 600, type: 'shell'});
});
