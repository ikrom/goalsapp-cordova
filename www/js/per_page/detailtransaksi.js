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
    alert('You must logged in first');
    window.location.href = "login.html";
  }
}

function GetData() {
  // $('#loading').show();
  var inflow = 0;
  var outflow = 0;
  var day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  var month = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  var firstDay = new Date(y, m, 1);
  // var lastDay = new Date(y, m + 1, 0);
  var lastDay = new Date();
  var tanggal;
  $('#showMonth').html(month[m]);
  for (var i = firstDay; i <= lastDay;i.setDate(i.getDate() + 1)) {
    tanggal = i.getFullYear() + '-' + Number(i.getMonth()+1) + '-' + i.getDate();
    // console.log(tanggal);
    var dataToBeSent = {
      'TYPE'      : 'get_transaksi_day',
      'AKUN_ID'   : localStorage.getItem('AKUN_ID'),
      'TANGGAL'   : tanggal
    };
    // SpinnerPlugin.activityStart("Get List Transaksi...");
    $('#loading').show();
    $.ajax({
      type: 'POST',
      url: url,
      data: dataToBeSent,
      success: 
      function(data, textStatus) {
        
        if(data.status != '300')
        {
          // alert(data.message);
          var transaction_item = '', transaction_item_utama = '';
          var total = 0;
          $.each( data.data, function( i, item ) {
            var foto;
            var id;
            var jenis;
            var jumlah;
            var kategori;
            var kategori_transaksi_id;
            var nama_transaksi;
            var in_or_out;
            // console.log('-----');
            // console.log(tanggal);
            // console.log(this);
            $.each( this, function( j, item2 ) {
              if(j == 'ID') id = item2;
              else if(j == 'JENIS') jenis = item2;
              else if(j == 'NAMA_TRANSAKSI') nama_transaksi = item2;
              else if(j == 'FOTO') foto = item2;
              else if(j == 'JUMLAH') jumlah = item2;
              else if(j == 'KATEGORI') kategori = item2;
            } );
            
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
            transaction_item += '<div class="detail-daily">';
            transaction_item +=   '<div class="row inside item-detail">';
            transaction_item +=     '<div class="transaction-img img-daily"><img src="' + foto + '"></div>';
            transaction_item +=     '<div class="transaction-category category-daily"><span class="category detail">' + kategori + '</span><span class="note">' + nama_transaksi + '</span></div>';
            transaction_item +=     '<div class="transaction-money">' + Number(jumlah).formatMoney(0,'.','.') + '</div>';
            transaction_item +=     '<div class="transaction-arrow"><img src="' + in_or_out + '"></div>';
            transaction_item +=   '</div>';
            transaction_item += '</div>';
            // alert(transaction_item);
            // $('#contentTransaction').prepend(transaction_item);
          } );
          transaction_item_utama = '<div class="row inside">';
          transaction_item_utama +=   '<div class="transaction-date">' + (i.getDate() < 10 ? '0' : '') + i.getDate() + '</div>';
          transaction_item_utama +=   '<div class="transaction-day">' + day[i.getDay()] + '</div>';
          transaction_item_utama +=   '<div class="transaction-money">' + Math.abs(Number(total)).formatMoney(0,'.','.') + '</div>';
          transaction_item_utama +=   '<div class="transaction-arrow"><img src="' + (total < 0 ? 'img/expense.png': 'img/income.png') + '"></div>';
          transaction_item_utama += '</div>';
          $('#contentTransaction').prepend(transaction_item_utama+transaction_item);
        }
      }
      ,
      dataType: 'json',
      async:false
    }).done(function () {
      // SpinnerPlugin.activityStop();
      $('#loading').hide();
    });
  }
  $('#showTotalInflow').html(inflow);
  $('#showTotalOutflow').html(outflow);
  $('#showTotal').html(Math.abs(Number(inflow)-Number(outflow)));
  if(Number(inflow)-Number(outflow) < 0){
    $('#totalTransactionMonthIndicator').attr('src','img/expense.png');
  } else{
    $('#totalTransactionMonthIndicator').attr('src','img/income.png');
  }
}