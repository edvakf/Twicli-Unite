(function(){
  var _updateCount = window.updateCount;
  var requesting = false;

  window.updateCount = function(){
    var fst = $('fst');
    if (!requesting && /((https?:\/\/[^\s]+?)(;;;|；；；))/.test(fst.value)) {
      var command = RegExp.$1;
      var originalUrl = RegExp.$2;
      if (originalUrl.indexOf('http://j.mp/') === 0 || originalUrl.indexOf('http://bit.ly/') === 0) {
        var requestUrl = './resolveurl?url='+encodeURIComponent(originalUrl);
      } else {
        var requestUrl = './shorten?url='+encodeURIComponent(originalUrl);
      }
      var xhr = new XMLHttpRequest;
      xhr.open('GET', requestUrl, true);
      requesting = true;
      xhr.onload = function(){ 
        requesting = false;
        if (fst.value.indexOf(command) >= 0) {
          var newUrl = xhr.responseText;
          if (newUrl) {
            try { newUrl = decodeURI(newUrl) } catch(e) {}
          } else {
            newUrl = originalUrl;
          }
          fst.value = fst.value.replace(command, newUrl);
        }
        _updateCount();
      };
      xhr.send(null);
    }
    _updateCount();
  }
})();
