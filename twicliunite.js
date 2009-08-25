
/* http://www.json.org/json2.js compressed by JSMin */
if(!this.JSON){this.JSON={};}
(function(){function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+
partial.join(',\n'+gap)+'\n'+
mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+
mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());

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

var webserver;
window.onload = function () {
  webserver = opera.io.webserver
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
      opera.postError('requesting : '+url);
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
          opera.postError('received : '+count);
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
  }
  response.setStatusCode(200);
  response.setResponseHeader( 'Content-Type', 'text/plain' );
  response.write(redirects[shortUrl]);
  response.close();
}

