/* Tweets class (timeline cache) */
function Tweets(){
  this.cache = [];
};
Tweets.prototype = {
  default_fetch_num : 50,
  max_cache_length : 100,
  fetch : function(n){
    if (!n || n < 0) n = this.default_fetch_num;
    return this.cache.slice(-n).reverse();
  },
  store : function(tws){
    var cache = this.cache.concat(tws).sort(function(a,b){
      var aid = a['id'], bid = b['id'];
      if (aid>bid) return 1;
      if (aid<bid) return -1;
      return 0;
    })
    var n = cache.length;
    while(--n) {
      if (cache[n]['id'] == cache[n-1]['id']) {
        cache.splice(n,1);
      }
    }
    this.cache = cache.slice(-this.max_cache_length);
  },
}
var tweets = new Tweets();

window.onload = function () {
  var webserver = opera.io.webserver
  if (webserver){
    webserver.addEventListener('getcache', get_cache, false);
    webserver.addEventListener('setcache', set_cache, false);
    webserver.addEventListener('resolveurl', resolve_url, false);
    webserver.addEventListener('shorten', shorten, false);
    webserver.addEventListener('storage', storage, false);
  }
}

function get_cache(e){
  var response = e.connection.response;
  response.setStatusCode(200);
  response.setResponseHeader( 'Content-Type', 'application/json' );
  response.write(JSON.stringify(tweets.fetch()));
  response.close();
}

function set_cache(e){
  var request = e.connection.request;
  tweets.store(JSON.parse(request.body));
  var response = e.connection.response;
  response.close();
}

// for unite_longer_url.js
var redirects = {};
var time = new Date;
// clear cache every 6 hours
setInterval(function(){if(new Date-time>1000*60*60*6){time=new Date;redirects={}}},1000*60*10);

function get_redirect2(url){
  var api = 'http://atsushaa.appspot.com/untiny/get?url=';
  var xhr = new XMLHttpRequest;
  xhr.open('GET', api + encodeURIComponent(url),false);
  xhr.onload = function(){
    var redir = JSON.parse(xhr.responseText);
    if (redir[url]) {
      redirects[url] = redir[url];
    } else {
      redirects[url] = '';
    }
  }
  xhr.send(null);
}

function get_redirect(url){
  var xhr = new XMLHttpRequest;
  xhr.open('HEAD',url,false);
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4) {
      if (xhr.status >= 300 && xhr.status < 400) {
        redirects[url] = xhr.getResponseHeader('location');
      } else {
        redirects[url] = '';
      }
    }
  }
  xhr.send(null);
}

function resolve_url(e){
  var request = e.connection.request;
  var shortUrl = request.getItem('url')[0];

  var response = e.connection.response;

  if (typeof(redirects[shortUrl]) === 'undefined') {
    get_redirect(shortUrl);
    if (/[^!-~]/.test(redirects[shortUrl])) {
      get_redirect2(shortUrl);
    }
  }
  response.setStatusCode(200);
  response.setResponseHeader( 'Content-Type', 'text/plain' );
  response.write(redirects[shortUrl]);
  response.close();
}

function shorten(e){
  var request = e.connection.request;
  var result = null;
  var url = request.getItem('url');
  if (url) {
    url = url[0];
    var xhr = new XMLHttpRequest;
    xhr.open('GET', 'http://j.mp/?url='+encodeURIComponent(url), false);
    xhr.onload = function(){ if(/<input id="shortened-url" value="(.+?)"/.test(xhr.responseText)) result = RegExp.$1 };
    xhr.send(null);
  }
  var response = e.connection.response;
  response.setResponseHeader( 'Content-Type', 'text/plain' );
  response.write(result || '');
  response.close();
}

var KVS = {};
function storage(e){
  var request = e.connection.request;
  var response = e.connection.response;
  var key = request.getItem('key');
  if (!key.length) return not_found(e);
  key = key[0];
  if (request.method === "POST" && request.body) {
    KVS[key] = request.body;
    response.close();
  } else {
    if (!KVS[key]) return not_found(e);
    response.write(KVS[key]);
    response.close();
  }
}

function not_found(e){
  var response = e.connection.response;
  response.setStatusCode('404', 'Not found');
  response.write('Not found');
  response.close();
}
