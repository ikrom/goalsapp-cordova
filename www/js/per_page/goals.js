/* global variables */
var url = "http://goalsapp.heliohost.org/";

/* initializer */
$( document ).ready( function() {
  refresh();
  GetData();
} );

function checkInput() {
  return ($('#inputNama').val() != "" && $('#inputHarga').val() != "" && $('#inputDate').val() != "" && $('#smallImage').attr('src') != "img/thing.png");
}

function changeSubmitButton() {
  if(checkInput()){
    $('#ini').attr('src','img/icon_done2.png');
  } else {
    $('#ini').attr('src','img/icon_done.png');
  }
}

function refresh() {
  if(localStorage.getItem('USERNAME') == null){
    alert('You must logged in first');
    window.location.href = "login.html";
  }
  $('#inputNama').on('input',function () {
    changeSubmitButton();
  });
  $('#inputHarga').on('input',function () {
    changeSubmitButton();
  });
  $('#inputDate').on('input',function () {
    changeSubmitButton();
  });
  $('#inputNama').on('keyup',function () {
    changeSubmitButton();
  });
  $('#inputHarga').on('keyup',function () {
    changeSubmitButton();
  });
  $('#inputDate').on('keyup',function () {
    changeSubmitButton();
  });
}

function GetData() {
  var dataToBeSent = {
    'TYPE'      : 'list_target',
    'AKUN_ID'   : localStorage.getItem('AKUN_ID')
  };
  // SpinnerPlugin.activityStart("Get List Goal...");
  $.post(url, dataToBeSent, function(data, textStatus) {
    alert(data.message);
    var goal_item = '';
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
        goal_item = '<div><div id="goals' + id + '" class="test-circle"></div><div class="goal-text">' + Math.ceil(progress) + '% on progress</div><div class="goal-text goal-name">' + nama + '</div></div>';
        // $(goal_item).appendTo('#content_goals');
        $('#content_goals').prepend(goal_item);
        $('#goals' + id).css("background-image", "url(" + foto + ") center no-repeat");
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
    }
    // SpinnerPlugin.activityStop();
  }, "json");
}