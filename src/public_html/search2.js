var test_n = 0;
var twsj_page = 0;
var twsj_query = '';
function twsjSearch(q) {
	twsj_page = 1;
	twsj_query = q;
	update_ele2 = loadXDomainScript('http://pcod.no-ip.org/yats/search?seq=' + (seq++) +
							'&query=' + encodeURIComponent(q) + '&json=twsjSearchShow', update_ele2);
	$("loading").style.display = "block";
}
function twsjSearchShow(res) {
	var tmp = $("tmp");
	if (tmp) tmp.parentNode.removeChild(tmp);
	var result = res.map(function(a){
		var d = new Date;
		d.setTime(Date.parse(a.time.replace(/-/g,'/')));
		a.url.match(/status\/(\d+)/);
		return { id: RegExp.$1, text: a.content, created_at: d,
					user: {screen_name:a.user, name: a.user, profile_image_url: a.image} };
	});
	if (twsj_page++ == 1) $('tw2c').innerHTML = '';
	twShowToNode(result, $("tw2c"), false, twsj_page > 1);
	if (res.length > 0) {
		var next = document.createElement("div");
		next.id = "next";
		next.onclick = function(){getNext(this);};
		next.innerHTML = "▽";
		$("tw2c").appendChild(next);
	}
	get_next_func = function(){
		update_ele2 = loadXDomainScript('http://pcod.no-ip.org/yats/search?page=' + twsj_page +
							'&query=' + twsj_query + '&seq=' + (seq++) + '&json=twsjSearchShow', update_ele2);
	}
}

registerPlugin({
	miscTab: function(ele) {
		var e = document.createElement("div");
		e.innerHTML = '<form onSubmit="twsjSearch($(\'searchj_q\').value); return false;"><a target="twitter" href="http://pcod.no-ip.org/yats/">Twitter search (yats)</a>: <input type="text" size="15" id="searchj_q"><input type="image" src="go.png"></form>';
		ele.appendChild(e);
		var hr = document.createElement("hr");
		hr.className = "spacer";
		ele.appendChild(hr);
	}
});
