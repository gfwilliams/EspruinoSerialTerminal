chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('main.html', {width: 1024, height: 600});
});
