
var debug = false;
function log(e) {
  if (debug) opera.postError(e);
}

/* Tweets class (timeline cache) */
function Tweets(){
  this.cache = {};
  this.ids = [];
  this.num = 100;
};
Tweets.prototype = {
  fetch : function(n){
    if (!n || n < 0) n = this.num;
    var cache = this.cache;
    log(this.ids.map(function(id){return cache[id].text}).join('\n'))
    return this.ids.map(function(id){return cache[id]}).reverse();
  },
  store : function(tws) {
    //log('storing ' +tws.length+' tweets');
    log(tws.map(function(tw){return tw.text}).join('\n'));
    var t = new Date;
    var cache = this.cache;
    var ids = this.ids;

    tws.forEach(function(tw) {
      var id = tw.id;
      if (!cache[id]) ids.push(id);
      cache[id] = tw;
    });
    ids.sort();

    while (ids.length > this.num) {
      cache[ids[0]] = null;
      ids.splice(0,1);
    }
    this.ids = ids;
    this.cache = cache;
    log(['time taken : '+(new Date-t), 'cache length : '+ids.length].join('\n'));
  }
}
var tweets = new Tweets();

window.onload = function () {
  var webserver = opera.io.webserver
  if (webserver){
    webserver.addEventListener('getcache', wrap_handler(get_cache), false);
    webserver.addEventListener('setcache', wrap_handler(set_cache), false);
    webserver.addEventListener('resolveurl', wrap_handler(resolve_url), false);
    webserver.addEventListener('shorten', wrap_handler(shorten), false);
    webserver.addEventListener('storage', wrap_handler(storage), false);
  }
}

function wrap_handler(handler) {
  return function(e) {
    log(e.connection.request.uri);
    if (e.connection.isOwner) {
      try {
        handler(e);
      } catch(err) {
        log(err);
        if (!e.connection.isClosed) server_error(e);
      }
    } else {
      forbidden(e);
    }
    log('end : '+e.connection.request.uri);
  }
}

function server_error(e) {
  var res = e.connection.response;
  res.setStatusCode('500', 'Server Error');
  res.write('Server Error');
  res.close();
}

function not_found(e){
  var res = e.connection.response;
  res.setStatusCode('404', 'Not found');
  res.write('Not found');
  res.close();
}

function forbidden(e){
  var res = e.connection.response;
  log(e.connection.isLocal);
  log(res);
  log(res.setStatusCode);
  res.setStatusCode('403', 'Forbidden');
  res.write('Owner only');
  res.close();
}

function get_cache(e){
  var res = e.connection.response;
  res.setStatusCode(200);
  res.setResponseHeader( 'Content-Type', 'application/json' );
  res.write(JSON.stringify(tweets.fetch()));
  res.close();
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

