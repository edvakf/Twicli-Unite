/* replace short URLs with original URLs */
(function(list){
  var re = new RegExp('^http://(?:'+list.join('|').replace(/\./g,'\\.')+')/');

  function resolveUrl(url){
    var requestUrl = './resolveurl?url=' + encodeURIComponent(url);
    var xhr = new XMLHttpRequest();
    xhr.open('GET',requestUrl, true);
    xhr.onload = function(){
      replaceUrl(url, xhr.responseText);
    }
    xhr.send(url);
  }

  function replaceUrl(shortUrl, longUrl){
    // if longUrl doesn't exist or longUrl is still a short URL
    if (!longUrl || re.test(longUrl)) return;
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

})([
"0rz.tw","2tu.us","307.to","6url.com","a.gg","a.nf","a2n.eu","ad.vu","adf.ly"
,"adjix.com","alturl.com","atu.ca","azqq.com","b23.ru","b65.com","bacn.me"
,"bit.ly","bloat.me","budurl.com","buk.me","canurl.com","chilp.it","clck.ru"
,"cli.gs","cliccami.info","clipurl.us","clop.in","cort.as","cuturls.com"
,"decenturl.com","digg.com","doiop.com","dwarfurl.com","easyurl.net"
,"eepurl.com","ewerl.com","ff.im","fff.to","fhurl.com","flingk.com","flq.us"
,"fly2.ws","fwd4.me","fwdurl.net","g8l.us","gl.am","go.9nl.com","goshrink.com"
,"hex.io","href.in","htxt.it","hugeurl.com","hurl.ws","icanhaz.com","idek.net"
,"is.gd","jijr.com","j.mp","kissa.be","kl.am","klck.me","korta.nu","l9k.net"
,"liip.to","liltext.com","lin.cr","linkgap.com","liurl.cn","ln-s.net","ln-s.ru"
,"lnkurl.com","lru.jp","lu.to","lurl.no","memurl.com","merky.de","migre.me"
,"minilien.com","moourl.com","myurl.in","nanoref.com","nanourl.se","netnet.me"
,"ni.to","nn.nf","notlong.com","nutshellurl.com","o-x.fr","offur.com","omf.gd"
,"onsaas.info","ow.ly","parv.us","peaurl.com","ping.fm","piurl.com","plumurl.com"
,"plurl.me","pnt.me","poprl.com","post.ly","ptiturl.com","qlnk.net","qurlyq.com"
,"r.im","rb6.me","rde.me","reallytinyurl.com","redir.ec","redirects.ca"
,"redirx.com","ri.ms","rickroll.it","rubyurl.com","s3nt.com","s7y.us","shink.de"
,"short.ie","short.to","shortenurl.com","shorterlink.com","shortlinks.co.uk"
,"shoturl.us","shredurl.com","shrinkify.com","shrinkr.com","shrinkurl.us"
,"shrtnd.com","shurl.net","shw.me","smallr.com","smurl.com","sn.im","sn.vc"
,"snadr.it","snipr.com","snipurl.com","snurl.com","sp2.ro","spedr.com","srnk.net"
,"srs.li","starturl.com","surl.co.uk","ta.gd","tcrn.ch","tgr.me","tighturl.com"
,"tiny.cc","tiny.pl","tinylink.com","tinyurl.com","to.ly","togoto.us","tr.im"
,"tra.kz","trunc.it","tubeurl.com","twitclicks.com","twitterurl.net"
,"twiturl.de","twurl.cc","twurl.nl","u.mavrev.com","u.nu","u76.org","ub0.cc"
,"ulu.lu","updating.me","ur1.ca","url.az","url.co.uk","url.ie","urlborg.com"
,"urlbrief.com","urlcut.com","urlcutter.com","urlhawk.com","urlkiss.com"
,"urlpire.com","urlvi.be","urlx.ie","virl.com","wapurl.co.uk","wipi.es","x.se"
,"xil.in","xrl.in","xrl.us","xurl.jp","xzb.cc","yatuc.com","yep.it","yfrog.com"
,"zi.ma","zurl.ws","zz.gd","zzang.kr","icio.us"
])
