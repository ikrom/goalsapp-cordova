/* global variables */
var url = "http://goalsapp.heliohost.org/";

/* initializer */
$( document ).ready( function() {
  refresh();
} );

function refresh() {
  if(localStorage.getItem('USERNAME') != null){
    // alert(localStorage.getItem('USERNAME') + ' was logged in');
    swal(localStorage.getItem('USERNAME') + ' was logged in');
    //window.location.href = "select_kapal.html";
    window.location.href = "goals.html";
  }
  $('#inputEmail').on('input',function () {
    if($('#inputEmail').val() != "" && $('#inputPassword').val() != ""){
      $('#ini').attr('src','img/icon_done2.png');
    } else {
      $('#ini').attr('src','img/icon_done.png');
    }
  });
  $('#inputPassword').on('input',function () {
    if($('#inputEmail').val() != "" && $('#inputPassword').val() != ""){
      $('#ini').attr('src','img/icon_done2.png');
    } else {
      $('#ini').attr('src','img/icon_done.png');
    }
  });
  $('#inputEmail').on('keyup',function () {
    if($('#inputEmail').val() != "" && $('#inputPassword').val() != ""){
      $('#ini').attr('src','img/icon_done2.png');
    } else {
      $('#ini').attr('src','img/icon_done.png');
    }
  });
  $('#inputPassword').on('keyup',function () {
    if($('#inputEmail').val() != "" && $('#inputPassword').val() != ""){
      $('#ini').attr('src','img/icon_done2.png');
    } else {
      $('#ini').attr('src','img/icon_done.png');
    }
  });
}

function Submit() {
  if ( $('#inputEmail').val() != "" && $('#inputPassword').val() != "" ) {
    var dataToBeSent = {
      'TYPE'     : 'login',
      'EMAIL' : $('#inputEmail').val(),
      'PASSWORD' : $('#inputPassword').val()
    };
    SpinnerPlugin.activityStart("Login...");
    $.post(url, dataToBeSent, function(data, textStatus) {
      if(data.status == '300'){
        // alert(data.message);
        swal(
          "", 
          data.message, 
          "error");
      } else {
        // alert('Welcome ' + data.data[0].USERNAME);
        swal('Welcome ' + data.data[0].USERNAME);
        localStorage.setItem('EMAIL', data.data[0].EMAIL);
        localStorage.setItem('AKUN_ID', data.data[0].AKUN_ID);
        localStorage.setItem('USERNAME', data.data[0].USERNAME);
        localStorage.setItem('REKENING', data.data[0].REKENING);
        localStorage.setItem('FOTO', data.data[0].FOTO);
        window.location.href = "goals.html";
      }
      SpinnerPlugin.activityStop();
    }, "json");
  }
  else {
    // alert('email dan password harus terisi!');
    swal(
        "", 
        "email dan password harus terisi!", 
        "error");
  }
}