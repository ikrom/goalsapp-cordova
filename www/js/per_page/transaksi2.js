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

function checkInput() {
  return (localStorage.getItem('transactionNumber') != undefined && localStorage.getItem('transactionNumber') != "" && $('#inputNote').val() != "" && $('#inputDate').val() != "" && $('#showCategoryTitle').val() != '');
}

function changeSubmitButton() {
  if(checkInput()){
    $('#ini').attr('src','img/icon_done2.png');
  } else {
    $('#ini').attr('src','img/icon_done.png');
  }
}

function saveLocalStorage() {
  localStorage.setItem('transactionNote',$('#inputNote').val());
  localStorage.setItem('transactionDate',$('#inputDate').val());
  localStorage.setItem('transactionWith',$('#inputWith').val());
  localStorage.setItem('transactionCash',$('#inputCash').val());
  localStorage.setItem('transactionLocation',$('#inputLocation').val());
  localStorage.setItem('transactionReminder',$('#inputReminder').val());
}

function loadLocalStorage() {
  $('#showTransactionNumber').html('Rp. ' + Number(localStorage.getItem('transactionNumber')).formatMoney(2,'.',','));
  if(localStorage.getItem('transactionNote') != '') $('#inputNote').val(localStorage.getItem('transactionNote'));
  if(localStorage.getItem('transactionDate') != '') $('#inputDate').val(localStorage.getItem('transactionDate'));
  if(localStorage.getItem('transactionWith') != '') $('#inputWith').val(localStorage.getItem('transactionWith'));
  if(localStorage.getItem('transactionCash') != '') $('#inputCash').val(localStorage.getItem('transactionCash'));
  if(localStorage.getItem('transactionLocation') != '') $('#inputLocation').val(localStorage.getItem('transactionLocation'));
  if(localStorage.getItem('transactionReminder') != '') $('#inputReminder').val(localStorage.getItem('transactionReminder'));
  if(localStorage.getItem('transactionCategory') != '') $('#showCategoryTitle').val(localStorage.getItem('transactionCategory'));
  // alert(localStorage.getItem('transactionCategoryPic'));
  if(localStorage.getItem('transactionCategoryPic') != null) $('#showCategoryPic').attr('src',localStorage.getItem('transactionCategoryPic'));
}

function removeStorage() {
  localStorage.removeItem('transactionNumber');
  localStorage.removeItem('transactionNote');
  localStorage.removeItem('transactionDate');
  localStorage.removeItem('transactionWith');
  localStorage.removeItem('transactionCash');
  localStorage.removeItem('transactionReminder');
  localStorage.removeItem('transactionCategory');
  localStorage.removeItem('transactionCategoryPic');
  localStorage.removeItem('KATEGORI_TRANSAKSI_ID');
  localStorage.removeItem('JENIS');
}

function select_transaction() {
  saveLocalStorage();
  window.location.href = "transaksi3.html";
}

function refresh() {
  if(localStorage.getItem('USERNAME') == null){
    // alert('You must logged in first');
    swal(
        "", 
        "You must logged in first", 
        "error");
    window.location.href = "login.html";
  }
  GetData();

  var now = new Date();
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
  $('#inputDate').val(today);

  $('#inputNote').on('input',function () {
    changeSubmitButton();
  });
  $('#inputDate').on('input',function () {
    changeSubmitButton();
  });
  $('#showCategoryTitle').on('input',function () {
    changeSubmitButton();
  });
  $('#inputNote').on('keyup',function () {
    changeSubmitButton();
  });
  $('#inputDate').on('keyup',function () {
    changeSubmitButton();
  });
  $('#showCategoryTitle').on('keyup',function () {
    changeSubmitButton();
  });
}

function GetData() {
  var current_date = '';
  var today = new Date();
  var dd = today.getDate();
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd='0'+dd
  } 

  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  var mm = month[today.getMonth()];

  current_date = dd+' '+mm+' '+yyyy;
  $('#showDate').html(current_date);
  loadLocalStorage();
}

function Submit() {
  if ( checkInput() ) {
    var dataToBeSent = {
      'TYPE'      : 'add_transaksi',
      'AKUN_ID'   : localStorage.getItem('AKUN_ID'),
      'NAMA'     : $('#inputNote').val(),
      'REKENING'  : localStorage.getItem('REKENING'),
      'KATEGORI_TRANSAKSI_ID'      : localStorage.getItem('KATEGORI_TRANSAKSI_ID'),
      'JENIS'   : localStorage.getItem('JENIS'),
      'JUMLAH' : localStorage.getItem('transactionNumber'),//$('#inputCash').val(),
      'TANGGAL'  : $('#inputDate').val(),
      'NOTE' : $('#inputNote').val(),
      'WITH': $('#inputWith').val(),
      'LOCATION': $('#inputLocation').val(),
      'REMINDER': $('#inputReminder').val()
    };
    // console.log(dataToBeSent);
    SpinnerPlugin.activityStart("Add Transaction...");
    $.post(url, dataToBeSent, function(data, textStatus) {
      // alert(data.message);
      if(data.status != '300'){
        swal(
          "", 
          data.message, 
          "success");
        localStorage.setItem('REKENING',data.rekening);
        removeStorage();
        window.location.href = "goals.html";
      } else {
        swal(
          "", 
          data.message, 
          "error");
      }
      SpinnerPlugin.activityStop();
    }, "json");
  }
  else {
    // alert('semua data harus terisi!');
    swal(
      "", 
      "semua data harus terisi!", 
      "error");
  }
}