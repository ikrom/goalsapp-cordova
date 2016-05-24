/* global variables */
var url = "http://goalsapp.heliohost.org/";
var jumlah_nabung, target_id, nama_barang, saldo;
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
  GetData();
} );

function gotoHome() {
  window.location.href = "goals.html";
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
}

function GetData() {
  var inflow = 0;
  var outflow = 0;
  var dayArray = ['','monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday','sunday'];
  var monthArray = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  var total = 0;
  var day = -1, lastDay = -1;
  var foto;
  var id;
  var jenis;
  var jumlah;
  var kategori;
  var kategori_transaksi_id;
  var nama_transaksi;
  var in_or_out;
  var transaction_item = '', transaction_item_utama = '';

  var date = new Date(), m = date.getMonth();
  
  var dataToBeSent = {
    // 'TYPE'      : 'get_transaksi_day',
    'TYPE'      : 'get_transaksi_month',
    'AKUN_ID'   : localStorage.getItem('AKUN_ID'),
    // 'TANGGAL'   : tanggal
    'MONTH'     : Number(m+1)
  };
  // SpinnerPlugin.activityStart("Get List Transaksi...");
  $.ajax({
    type: 'POST',
    url: url,
    data: dataToBeSent,
    success: 
    function(data, textStatus) {
      
      if(data.status != '300')
      {
        // alert(data.message);
        total = 0;
        $.each( data.data, function( i, item ) 
        {
          // console.log('-----');
          // console.log(tanggal);
          // console.log(this);
          $.each( this, function( j, item2 ) {
            if(j == 'DAY') day = item2;
            else if(j == 'ID') id = item2;
            else if(j == 'JENIS') jenis = item2;
            else if(j == 'NAMA_TRANSAKSI') nama_transaksi = item2;
            else if(j == 'FOTO') foto = item2;
            else if(j == 'JUMLAH') jumlah = item2;
            else if(j == 'KATEGORI') kategori = item2;
          } );

          // alert(day + ' ' + total);
          
          if(lastDay == -1){
            lastDay = day;
          }

          if(day != lastDay){
            var temp = new Date(date.getFullYear(),date.getMonth(),lastDay);
            temp = temp.getDay();
            transaction_item_utama = '<div class="row inside">';
            transaction_item_utama +=   '<div class="transaction-date">' + (lastDay < 10 ? '0' : '') + lastDay + '</div>';
            transaction_item_utama +=   '<div class="transaction-day">' + dayArray[temp] + '</div>';
            transaction_item_utama +=   '<div class="transaction-money">' + (Math.abs(Number(total))) + '</div>';
            transaction_item_utama +=   '<div class="transaction-arrow"><img src="' + (total < 0 ? 'img/expense.png': 'img/income.png') + '"></div>';
            transaction_item_utama += '</div>';
            // alert(transaction_item);
            $('#contentTransaction').after('<div class="no-padding daily">' + transaction_item_utama + transaction_item + '</div>');
            transaction_item = '';
            total = 0;
          }

          if(jenis == 1) {
            in_or_out = 'img/expense.png';
            total -= Number(jumlah);
            outflow += Number(jumlah);
          }
          else if(jenis == 2) {
            in_or_out = 'img/income.png';
            total += Number(jumlah);
            inflow += Number(jumlah);
          }
          else if(kategori_transaksi_id == 14) {
            in_or_out = 'img/income.png';
            total += Number(jumlah);
            inflow += Number(jumlah);
          }
          else {
            in_or_out = 'img/expense.png';
            total -= Number(jumlah);
            outflow += Number(jumlah);
          }
          
          lastDay = day;
          transaction_item += '<div class="detail-daily">';
          transaction_item +=   '<div class="row inside item-detail">';
          transaction_item +=     '<div class="transaction-img img-daily">' + day + '<img src="' + foto + '"></div>';
          transaction_item +=     '<div class="transaction-category category-daily"><span class="category detail">' + kategori + '</span><span class="note">' + nama_transaksi + '</span></div>';
          transaction_item +=     '<div class="transaction-money">' + Number(jumlah).formatMoney(0,'.','.') + '</div>';
          transaction_item +=     '<div class="transaction-arrow"><img src="' + in_or_out + '"></div>';
          transaction_item +=   '</div>';
          transaction_item += '</div>';
          // alert(transaction_item);
        } );
      }
    }
    ,
    dataType: 'json',
    async:true
  }).done(function () {
    // SpinnerPlugin.activityStop();
    var temp = new Date(date.getFullYear(),date.getMonth(),day);
    temp = temp.getDay();
    transaction_item_utama = '<div class="row inside">';
    transaction_item_utama +=   '<div class="transaction-date">' + (day < 10 ? '0' : '') + day + '</div>';
    transaction_item_utama +=   '<div class="transaction-day">' + dayArray[temp] + '</div>';
    transaction_item_utama +=   '<div class="transaction-money">' + Math.abs(Number(total)).formatMoney(0,'.','.') + '</div>';
    transaction_item_utama +=   '<div class="transaction-arrow"><img src="' + (total < 0 ? 'img/expense.png': 'img/income.png') + '"></div>';
    transaction_item_utama += '</div>';
    // alert(transaction_item);
    $('#contentTransaction').after('<div class="no-padding daily">' + transaction_item_utama + transaction_item + '</div>');
    $('#showMonth').html(monthArray[m]);
    $('#showTotalInflow').html(inflow);
    $('#showTotalOutflow').html(outflow);
    $('#showTotal').html(Math.abs(Number(inflow)-Number(outflow)));
    if(Number(inflow)-Number(outflow) < 0){
      $('#totalTransactionMonthIndicator').attr('src','img/expense.png');
    } else{
      $('#totalTransactionMonthIndicator').attr('src','img/income.png');
    }
    // $('#showLoading').html('');
  }).fail(function () {
    swal(
      "", 
      "Koneksi Gagal", 
      "error");
  });
}