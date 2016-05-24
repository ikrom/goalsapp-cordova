/* global variables */
var url = "http://goalsapp.heliohost.org/";
Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };
/* initializer */
$( document ).ready( function() {
  refresh();
} );

function refresh() {
  if(localStorage.getItem('USERNAME') == null){
    alert('You must logged in first');
    window.location.href = "login.html";
  }
  GetData();
}

function Submit() {
  window.location.href = "goals.html";
}

function GetData() {
  $('#showUsername').html(localStorage.getItem('USERNAME'));
  var dataToBeSent = {
    'TYPE'      : 'get_target',
    'TARGET_ID'   : localStorage.getItem('TARGET_ID')
  };
  // SpinnerPlugin.activityStart("Get Data...");
  $.post(url, dataToBeSent, function(data, textStatus) {
    // alert(data.message);
    if(data.status != '300'){
      $('#showPhoto').attr('src',data.data[0].FOTO);
      $('#showNamaGoal').html(data.data[0].NAMA);
      $('#showHargaGoal').html(data.data[0].HARGA);
      $('#showDueDate').html(data.data[0].DUE_DATE);
      var date1 = new Date(data.data[0].DUE_DATE);
      var date2 = new Date();
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
      // alert(diffDays);
      $('#showNeededSave').html('Rp. ' + Math.ceil(Number(data.data[0].HARGA)/Number(diffDays)).formatMoney(2,',','.'));
    }
    // SpinnerPlugin.activityStop();
  }, "json");
}