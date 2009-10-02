/* replace short URLs with original URLs */
(function(){
  var re = /^http:\/\/(?:tinyurl\.com|bit\.ly|is\.gd|u\.nu|icio\.us|tr\.im|cli\.gs|twurl\.nl|url\.ie|j\.mp)\//;

  function resolveUrl(url){
    requestUrl = location.href.replace(/[^\/]*$/,'resolveurl') + '?url=' + encodeURIComponent(url);
    var xhr = new XMLHttpRequest();
    xhr.open('GET',requestUrl, true);
    /*
    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          replaceUrl(url, xhr.responseText);
        }
      }
    }
    */
    xhr.onload = function(){
      replaceUrl(url, xhr.responseText);
    }
    xhr.send(url);
  }

  function replaceUrl(shortUrl, longUrl){
    if (!longUrl) return;
    Array.prototype.forEach.call(
      document.querySelectorAll('a[href="'+shortUrl+'"]'),
      function(link){
        link.href = longUrl;
        if (link.textContent == shortUrl) {
          try{
            var decoded = decodeURI(longUrl);
          }catch(e){
            var decoded = longUrl;
          }
          if (decoded.length > 200) {
            link.textContent = decoded.slice(0,200)+'...';
          } else {
            link.textContent = decoded;
          }
        }
      }
    );
  }

  function findShortUrls(elem){
    Array.prototype.forEach.call(
      elem.querySelectorAll('.status > a'),
      function(a){
        if (re.test(a.href)) {
          setTimeout(function(){resolveUrl(a.href)},0);
        }
      }
    );
  }

  registerPlugin({
    newMessageElement : findShortUrls
  });

})()

