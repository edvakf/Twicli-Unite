/* auto suggest reply names */
  /*
(function(){
  var maxSaveNum = 30;
  var list = readCookie('replies');
  var savedList = list ? list.split(',') : [];
  list = list ? list.split(',') : [];

  function addToSavedList(name) {
    var n = savedList.length;
    while(--n) {
      if (savedList[n] === name) {
        savedList.splice(n, 1);
        break;
      }
    }
    savedList.push(name);
    if (savedList.lenght > maxSaveNum) savedList.shift();
    writeCookie('replies', savedList.join(','));
  }

  function addToList(name, appendToStart) {
    var n = list.length, lname;
    while(lname = list[--n]) {
      if (lname == name) break;
    }
    if (n < 0) list.push(name);
  }

  function findNamesFromNode(elem, tw) {
    setTimeout(function(){
      addToList(tw.user.name);
      var links = elem.getElementsByTagName('a');
      for(var i=0; i<links.length; i++) {
        if (/switchUser\('(.+?)'\)/.test(links[i].onclick)) {
          addToList(RegExp.$1);
        }
      }
    }, 100);
  }

  function findNamesFromPost(message) {
    setTimeout(function(){
      message.replace(/@(\w[\d\w]*)/g, function($0, $1) {
        addToList($1);
        addToSavedList($1);
      });
    }, 100);
  }

  registerPlugin({
    newMessageElement : findNamesFromNode,
    post : findNamesFromPost
  });

})()

*/
