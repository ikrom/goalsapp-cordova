/* global variables */
var url = "http://goalsapp.heliohost.org/";

/* initializer */
$( document ).ready( function() {
  refresh();
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

function Submit() {
  if ( checkInput() ) {
    var dataToBeSent = {
      'TYPE'      : 'add_goal',
      'AKUN_ID'   : localStorage.getItem('AKUN_ID'),
      'NAMA'     : $('#inputNama').val(),
      'HARGA'  : $('#inputHarga').val(),
      'FOTO'      : $('#smallImage').attr('src'),
      'DUE_DATE'  : $('#inputDate').val()
    };
    SpinnerPlugin.activityStart("Add Goal...");
    $.post(url, dataToBeSent, function(data, textStatus) {
      alert(data.message);
      if(data.status != '300'){
        window.location.href = "goals.html";
      }
      SpinnerPlugin.activityStop();
    }, "json");
  }
  else {
    alert('semua data harus terisi!');
  }
}