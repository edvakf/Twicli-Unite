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


// use cache
(function(){
 
  var initialized = false;
  var unite_path = location.href.replace(/[^/]*$/,'');
  var first_real_update = false;
  
  function get_cache(){
    if (initialized) return;
    initialized = true;
    first_real_update = true;
    
    var timeline = null;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', unite_path+'getcache'+'?timestamp='+(+new Date), false);
    xhr.onload = function(){
      timeline = JSON.parse(xhr.responseText);
    }
    xhr.send();

    if (timeline !== null && timeline.length) {
      twShow(timeline);
    }
  }

  var queue = [];
  var timer = null;
  function set_cache(node, tw, node_id){
    if (selected_menu !== $('TL')) return;
    queue.push(tw);
    if (!timer) {
      timer = setTimeout(function(){
        var xhr = new XMLHttpRequest();
        xhr.open('POST',unite_path+'setcache',true);
        xhr.send(JSON.stringify(queue));
        queue = [];
        timer = null;
      },150);
    }
  }

  function fav_cache(id, fav_state){ // fav_state = 0 -> not favorite, 1 -> favorite, -1 -> pending
    if (fav_state !== -1) {
      var tw = ($((selected_menu.id == "TL" ? "tw" : "tw2c") + "-" + id)).tw;
      tw.favorited = !!fav_state;
      var xhr = new XMLHttpRequest();
      xhr.open('POST',unite_path+'setcache',true);
      xhr.send(JSON.stringify([tw]));
    }
  }

  function skip_auth() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', unite_path+'storage?key=accounts_verify_credentials', false);
    xhr.onload = function(){
      if (xhr.status == 200) {
        var auth_orig = auth;
        auth = function(){ auth = auth_orig }; // fake the original function
        setTimeout( function(){
          twAuth(JSON.parse(xhr.responseText));
        }, 0);
      } else {
        var twAuth_orig = twAuth;
        twAuth = function(a) {
          twAuth_orig(a);
          if (a.error) return;
          var xhr = new XMLHttpRequest();
          xhr.open('POST', unite_path+'storage?key=accounts_verify_credentials', true);
          xhr.send(JSON.stringify(a));
        }
      }
    }
    xhr.send(null);
  }

  function clear_very_old_cache(tw) {
    if (!first_real_update) return;
    first_real_update = false;
    if (tw.length >= 199) {
      var old = $("get_old").previousSibling;
      //if(confirm('Cached timeline is very old. Do you want to remove it?')) old.parentNode.removeChild(old);
      old.parentNode.removeChild(old);
    }
  }

  registerPlugin({
    update : get_cache,
    newMessageElement : set_cache,
    init : skip_auth,
    fav : fav_cache,
    noticeUpdate : clear_very_old_cache
  })
})();

