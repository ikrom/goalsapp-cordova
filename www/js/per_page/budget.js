/* global variables */
var url = "http://goalsapp.heliohost.org/";

/* initializer */
$( document ).ready( function() {
  refresh();
} );

function checkInput() {
  return ($('#inputEmail').val() != "" && $('#inputPassword').val() != "" && $('#inputUsername').val() != "" && $('#smallImage').attr('src') != "img/photo.png");
}

function changeSubmitButton() {
  if(checkInput()){
    $('#ini').attr('src','img/icon_done2.png');
  } else {
    $('#ini').attr('src','img/icon_done.png');
  }
}

function refresh() {
  if(localStorage.getItem('USERNAME') != null){
    alert(localStorage.getItem('USERNAME') + ' was logged in');
    //window.location.href = "select_kapal.html";
    alert("go to home page");
  }
  $('#inputEmail').on('input',function () {
    changeSubmitButton();
  });
  $('#inputPassword').on('input',function () {
    changeSubmitButton();
  });
  $('#inputUsername').on('input',function () {
    changeSubmitButton();
  });
  $('#inputEmail').on('keyup',function () {
    changeSubmitButton();
  });
  $('#inputPassword').on('keyup',function () {
    changeSubmitButton();
  });
  $('#inputUsername').on('keyup',function () {
    changeSubmitButton();
  });
}

function Submit() {
  if ( checkInput() ) {
    var dataToBeSent = {
      'TYPE'      : 'register',
      'EMAIL'     : $('#inputEmail').val(),
      'PASSWORD'  : $('#inputPassword').val(),
      'FOTO'      : $('#smallImage').attr('src'),
      'USERNAME'  : $('#inputUsername').val()
    };
    SpinnerPlugin.activityStart("Register...");
    $.post(url, dataToBeSent, function(data, textStatus) {
      if(data.status == '300'){
        alert(data.message);
      } else {
        alert('Welcome ' + data.data[0].USERNAME);
        localStorage.setItem('EMAIL', data.data[0].EMAIL);
        localStorage.setItem('AKUN_ID', data.data[0].AKUN_ID);
        localStorage.setItem('USERNAME', data.data[0].USERNAME);
        localStorage.setItem('REKENING', data.data[0].REKENING);
        localStorage.setItem('FOTO', data.data[0].FOTO);
        $('.text-form').css('font-family','Neris-LightItalic');
        window.location.href = "budget.html";
      }
      SpinnerPlugin.activityStop();
    }, "json");
  }
  else {
    alert('semua data harus terisi!');
  }
}