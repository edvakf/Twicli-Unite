
(function(func) {

if (window.addEventListener) addEventListener('scroll', func,false);
else if (window.attachEvent) attachEvent('onscroll', func)

})(function(){

  if (selected_menu !== $('TL')) return;

  // twicli is BackCompat, so document.documentElement.scrollHeight should always be less than document.body.scrollHeight
  // it's just for the sake of it
  if (Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) !== window.innerHeight + window.pageYOffset) return;

  if (!$("get_old")) return;

  getNext($("get_old"));

})
