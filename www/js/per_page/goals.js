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

function itungJumlahNabung() {
  var activeSlide = $('#content_goals').find('.slick-active');
  target_id = activeSlide.find('.target_id').val();
  nama_barang = activeSlide.find('.nama_barang').val();
  saldo = activeSlide.find('.saldo').val();
  var due_date = activeSlide.find('.due_date').val();
  var harga = activeSlide.find('.harga').val();

  var date1 = new Date(due_date);
  var date2 = new Date();
  var timeDiff = Math.abs(date2.getTime() - date1.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  jumlah_nabung = Math.ceil((Number(harga)-Number(saldo))/Number(diffDays));
  $('#showNabungConstant').html('Rp. ' + Number(jumlah_nabung).formatMoney(2,',','.'));
}

function nabungTetap() {
  submitNabung(jumlah_nabung,target_id,nama_barang,saldo);
}

function nabungCustom() {
  jumlah_nabung = $('#inputNabung').val();
  submitNabung(jumlah_nabung,target_id,nama_barang,saldo);
}

function add_transaction() {
  window.location.href = "transaksi1.html";
}

function submitNabung(jumlah_nabung,target_id,nama_barang,saldo_awal) {
  
  var dataToBeSent = {
    'TYPE'      : 'add_nabung',
    'AKUN_ID'   : localStorage.getItem('AKUN_ID'),
    'TARGET_ID' : target_id,
    'NAMA_BARANG': nama_barang,
    'REKENING'  : localStorage.getItem('REKENING'),
    'SALDO_AWAL': saldo_awal,
    'JUMLAH_NABUNG': jumlah_nabung,
    'TANGGAL' : new Date()
  };

  SpinnerPlugin.activityStart("Submit Data...");
  $.post(url, dataToBeSent, function(data, textStatus) {
    alert(data.message);
    if(data.status != '300'){
      SpinnerPlugin.activityStop();
      localStorage.setItem('REKENING',data.rekening);
      window.location.href = "goals.html";
    } else {
      SpinnerPlugin.activityStop();
    }
  }, "json");
}

function checkInput() {
  return ($('#inputNama').val() != "" && $('#inputHarga').val() != "" && $('#inputDate').val() != "" && $('#smallImage').attr('src') != "img/thing.png");
}

function refresh() {
  if(localStorage.getItem('USERNAME') == null){
    alert('You must logged in first');
    window.location.href = "login.html";
  }
}

function GetData() {

  $('#showRekening').html('Rp. '+Number(localStorage.getItem('REKENING')).formatMoney(2, ',', '.'));
  var dataToBeSent = {
    'TYPE'      : 'list_target',
    'AKUN_ID'   : localStorage.getItem('AKUN_ID')
  };
  SpinnerPlugin.activityStart("Get Data...");
  $.post(url, dataToBeSent, function(data, textStatus) {
    // alert(data.message);
    var goal_item = '';
    goal_item = '<div><a href="addgoalshome.html"><div id="goals999" class="test-circle" style="margin-top: -45px;background: url(\'img/add_goals.png\') center no-repeat;background-size: 50px;background-position: 52% 54%;"></div><div class="goal-text"></div></a><div class="goal-text goal-name">Add Goals</div></div>';
    
    $('#content_goals').prepend(goal_item);
    
    if(data.status != '300'){
      $.each( data.data, function( i, item ) {
        var id;
        var nama;
        var harga;
        var saldo;
        var foto;
        var due_date;
        console.log(this);
        $.each( this, function( j, item2 ) {
          if(j == 'TARGET_ID') id = item2;
          else if(j == 'NAMA') nama = item2;
          else if(j == 'FOTO') foto = item2;
          else if(j == 'HARGA') harga = Number(item2);
          else if(j == 'SALDO') saldo = Number(item2);
          else if(j == 'DUE_DATE') due_date = item2;
        } );
        // alert(harga + ' ' + saldo);
        var progress = 100*(1 - ((harga-saldo)/harga));
        goal_item = '<div><input type="hidden" class="target_id" value="' + id + '"><input type="hidden" class="nama_barang" value="' + nama + '"><input type="hidden" class="saldo" value="' + saldo + '"><input type="hidden" class="due_date" value="' + due_date + '"><input type="hidden" class="harga" value="' + harga + '"><div id="goals' + id + '" class="test-circle" style="margin-top: -45px;background: url(\'' + foto + '\') center no-repeat;background-size: 50px;background-position: 52% 54%;"></div><div class="goal-text">' + Math.ceil(progress) + '% on progress</div><div class="goal-text goal-name">' + nama + '</div></div>';
        // $(goal_item).appendTo('#content_goals');
        $('#content_goals').prepend(goal_item);
        // $('#goals' + id).css("background-image", "url(" + foto + ") center no-repeat");
      } );
      $('.goal-content').slick({
        dots: true  ,
        infinite: false
      });
      $.each( data.data, function( i, item ) {
        var id;
        var nama;
        var harga;
        var saldo;
        var foto;
        var due_date;
        console.log(this);
        $.each( this, function( j, item2 ) {
          if(j == 'TARGET_ID') id = item2;
          else if(j == 'HARGA') harga = Number(item2);
          else if(j == 'SALDO') saldo = Number(item2);
        } );
        var progress = 100*(1 - ((harga-saldo)/harga));
        $("#goals" + id).circliful({
          animation: 1,
          animationStep: 5,
          foregroundBorderWidth: 10,
          foregroundColor: "#F8D720",
          backgroundBorderWidth: 10,
          backgroundColor: "#BDBDBD",
          percent: progress,
          textSize: 28,
          textStyle: 'font-size: 12px;',
          textColor: '#E9E9E8',
          targetColor: '#E9E9E8',
          multiPercentage: 1,
          percentages: [10, 20, 30]
        });
      } );
      $("#goals999").circliful({
        animation: 1,
        animationStep: 5,
        foregroundBorderWidth: 10,
        foregroundColor: "#F8D720",
        backgroundBorderWidth: 10,
        backgroundColor: "#BDBDBD",
        percent: 0,
        textSize: 28,
        textStyle: 'font-size: 12px;',
        textColor: '#E9E9E8',
        targetColor: '#E9E9E8',
        multiPercentage: 1,
        percentages: [10, 20, 30]
      });
    }
    SpinnerPlugin.activityStop();
    var dataToBeSent = {
      'TYPE'      : 'get_transaksi',
      'AKUN_ID'   : localStorage.getItem('AKUN_ID')
    };
    SpinnerPlugin.activityStart("Get List Goal...");
    $.post(url, dataToBeSent, function(data, textStatus) {
      // alert(data.message);
      var transaction_item = '';
      if(data.status != '300'){
        $.each( data.data, function( i, item ) {
          var id;
          var jenis;
          var nama;
          var jumlah;
          var foto;
          var kategori;
          var kategori_transaksi_id;
          var in_or_out;
          console.log(this);
          $.each( this, function( j, item2 ) {
            if(j == 'ID') id = item2;
            else if(j == 'JENIS') jenis = item2;
            else if(j == 'NAMA_TRANSAKSI') nama = item2;
            else if(j == 'FOTO') foto = item2;
            else if(j == 'JUMLAH') jumlah = item2;
            else if(j == 'KATEGORI') kategori = item2;
          } );
          if(jenis == 1) in_or_out = 'img/expense.png';
          else if(jenis == 2) in_or_out = 'img/income.png';
          else if(kategori_transaksi_id == 14) in_or_out = 'img/income.png';
          else in_or_out = 'img/expense.png';
          // alert(harga + ' ' + saldo);
          transaction_item = '<div class="row detail-transaction no-padding"><div class="transaction-img"><img src="' + foto + '"></div><div class="transaction-category"><span class="category">' + kategori + '</span><br>' + nama + '</div><div class="transaction-price">' + jumlah + '</div><div class="transaction-arrow"><img src="' + in_or_out + '"></div></div>';
          $(transaction_item).appendTo('#contentTransaction');
        } );
      }
      SpinnerPlugin.activityStop();
    }, "json");
  }, "json");
}