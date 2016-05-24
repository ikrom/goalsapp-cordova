/* global variables */
var url = "http://goalsapp.heliohost.org/";

/* initializer */
$( document ).ready( function() {
  refresh();
} );

function checkInput() {
  return ($('#inputNumber').val() != "");
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
  $('#inputNumber').on('input',function () {
    changeSubmitButton();
  });
  $('#inputNumber').on('keyup',function () {
    changeSubmitButton();
  });
}

function Submit() {
  if ( checkInput() ) {
    localStorage.setItem('transactionNumber',$('#inputNumber').val());
    window.location.href = "transaksi2.html";
  }
  else {
    alert('semua data harus terisi!');
  }
}