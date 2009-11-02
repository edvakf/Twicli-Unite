(function(){
  var _updateCount = window.updateCount;
  var requesting = false;
  var cache = {};
  var fst = $('fst');

  window.updateCount = function(){
    if (!requesting && /((https?:\/\/[^\s]+?)(;;;|；；；))/.test(fst.value)) {
      var command = RegExp.$1;
      var originalUrl = RegExp.$2;
      if (cache[originalUrl]) {
        setTimeout(function(){
          fst.value = fst.value.replace(command, cache[originalUrl]);
          _updateCount();
        },100);
      } else {
        var requestUrl = './shorten?url='+encodeURIComponent(originalUrl);
        var xhr = new XMLHttpRequest;
        xhr.open('GET', requestUrl, true);
        requesting = true;
        xhr.onload = function(){ 
          requesting = false;
          var newUrl = xhr.responseText;
          if (fst.value.indexOf(command) >= 0 && newUrl) {
            fst.value = fst.value.replace(command, newUrl);
            cache[newUrl] = originalUrl;
            _updateCount();
          }
        };
        xhr.send(null);
      }
    }
    _updateCount();
  }

  registerPlugin({
    post: function(){ cache = {} }
  })
})();
