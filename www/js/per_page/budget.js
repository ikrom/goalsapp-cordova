/* global variables */
var url = "http://goalsapp.heliohost.org/";

/* initializer */
$( document ).ready( function() {
  refresh();
} );

function checkInput() {
  return ($('#inputWallet').val() != "" && $('#inputCredit').val() != "");
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
  $('#username_title').html(localStorage.getItem('USERNAME'));
  $('#inputWallet').on('input',function () {
    changeSubmitButton();
  });
  $('#inputCredit').on('input',function () {
    changeSubmitButton();
  });
  $('#inputWallet').on('keyup',function () {
    changeSubmitButton();
  });
  $('#inputCredit').on('keyup',function () {
    changeSubmitButton();
  });
}

function Submit() {
  if ( checkInput() ) {
    var dataToBeSent = {
      'TYPE'      : 'budget',
      'AKUN_ID'     : localStorage.getItem('AKUN_ID'),
      'REKENING'  : String(Number($('#inputWallet').val()) + Number($('#inputCredit').val()))
    };
    SpinnerPlugin.activityStart("Add Budget...");
    $.post(url, dataToBeSent, function(data, textStatus) {
      alert(data.message);
      if(data.status != '300'){
        // window.location.href = "budget.html";
        window.location.href = "addgoals.html";
      }
      SpinnerPlugin.activityStop();
    }, "json");
  }
  else {
    alert('semua data harus terisi!');
  }
}