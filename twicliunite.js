/* Tweets class (timeline cache) */
function Tweets(){
  this.cache = [];
};
Tweets.prototype = {
  default_fetch_num : 50,
  maximum_cache_length : 200,
  fetch : function(n){
    if (!n || n < 0) n = this.default_fetch_num;
    return this.cache.slice(-n).reverse();
  },
  store : function(tw){
    var id = tw['id'];
    var n = this.cache.length;
    if (n === 0 || id > this.cache[n-1]['id']) {
      this.cache.push(tw);
    } else {
      for(;--n>0;) {
        item_id = this.cache[n]['id'];
        if (id == item_id) {
          break;
        } else if (id < item_id) {
          this.cache.splice(n+1,0,tw);
          break;
        }
      }
    }
    this.cache = this.cache.slice(-this.maximum_cache_length);
  }
}
var tweets = new Tweets();

window.onload = function () {
  var webserver = opera.io.webserver
  if (webserver){
    webserver.addEventListener('getcache', get_cache, false);
    webserver.addEventListener('setcache', set_cache, false);
    webserver.addEventListener('nr_favs.js', nr_favs, false);
    webserver.addEventListener('resolveurl', resolve_url, false);
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


// for favotter.js
var favotter_updated_at = 0;
var favs = [];
function nr_favs(e){
  var response = e.connection.response;
  var showFavs = function(){
    response.setStatusCode(200);
    response.setResponseHeader( 'Content-Type', 'text/javascript' );
    response.write('favEntries({' + favs.join('') + '});');
    response.close()
  };

  if (new Date - favotter_updated_at > 1000*60*20) { // cache favs up to 20 minutes
    favotter_updated_at = new Date;
    favs = [];
    var favotter_url = "http://favotter.matope.com/home.php?page="
    var total_pages = 10;
    var count = 0;

    for (var i=0;i<total_pages;i++) (function(j){
      var url = favotter_url + (j+1);
      var xhr = new XMLHttpRequest;
      xhr.open('GET', url, true);
      //opera.postError('requesting : '+url);
      xhr.onreadystatechange = function(){
        //opera.postError('readyState : '+xhr.readyState);
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            xhr.responseText.replace(
              /posted at <a[^>]*?href="status.php\?id=(\d+)"[^>]*?><abbr[^>]*?>[^<]*?<\/abbr><\/a><span[^>]*?> (\d+) favs by/g, 
              function(match, $1, $2){favs.push('"'+$1+'":'+$2+',');}
            );
          }
          if (++count === total_pages) showFavs();
          //opera.postError('received : '+count);
        }
      };
      xhr.send(null);
    })(i);
  } else {
    showFavs();
  }
}


// for unite_longer_url.js
var redirects = {};
var time = new Date;
// clear cache every 6 hours
setInterval(function(){if(new Date-time>1000*60*60*6){time=new Date;redirects={}}},1000*60*10);

function get_redirect2(url){
  opera.postError(url);
  var api = 'http://atsushaa.appspot.com/untiny/get?url=';
  var xhr = new XMLHttpRequest;
  xhr.open('GET', api + encodeURIComponent(url),false);
  xhr.onload = function(){
    opera.postError(xhr.responseText);
    var redir = JSON.parse(xhr.responseText);
    if (redir[url]) {
      opera.postError(redir[url]);
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
      opera.postError(redirects[shortUrl]);
      get_redirect2(shortUrl);
    }
  }
  response.setStatusCode(200);
  response.setResponseHeader( 'Content-Type', 'text/plain' );
  response.write(redirects[shortUrl]);
  response.close();
}

