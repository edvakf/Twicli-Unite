
function updateCount() {
  setFstHeight($("fst").value.length ? Math.max($("fst").scrollHeight+8,30) : 30);
  if (no_counter) return;
  $("counter-div").style.display = "block";
  $("counter").innerHTML = 140 - footer.length - $("fst").value.length;
}
