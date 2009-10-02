/* "foobar RT @hoge : blah blah..." into "<q>blah blah... (<a>@hoge</a>)<q> foobar" */
(function(){
  var re = /^([\s\S]*?)RT\s*(<[aA].*?>@\w+<\/[aA]>)[:\s]*(\S[\s\S]*)$/;

  function semanticRT(html){
    return html.replace(re, function(str, $1, $2, $3){
      return ' <q class="retweet">' + semanticRT($3) + ' <cite>(via ' + $2 + ')</cite></q> ' + $1;
    })
  }

  function betterRT(elem){
    var st = elem.getElementsByClassName('status')[0];
    if (!re.test(st.innerHTML)) return;
    st.innerHTML = semanticRT(st.innerHTML);
  }

  registerPlugin({
    newMessageElement : betterRT
  });
})()

