/* global variables */
var url = "http://goalsapp.heliohost.org/";
var fotoganti = false;
/* initializer */
$( document ).ready( function() {
  refresh();
} );

function checkInput() {
  return ($('#inputEmail').val() != "" && $('#inputPassword').val() != "");
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
  $('#inputEmail').on('input',function () {
    changeSubmitButton();
  });
  $('#inputPassword').on('input',function () {
    changeSubmitButton();
  });
  $('#inputEmail').on('keyup',function () {
    changeSubmitButton();
  });
  $('#inputPassword').on('keyup',function () {
    changeSubmitButton();
  });
  GetData();
}

function GetData() {
  // alert('get data');
  var dataToBeSent = {
    'TYPE'      : 'get_account',
    'AKUN_ID'     : localStorage.getItem('AKUN_ID')
  };
  // SpinnerPlugin.activityStart("Get Data...");
  $.post(url, dataToBeSent, function(data, textStatus) {
    if(data.status == '300'){
      alert(data.message);
    } else {
      $('#inputEmail').val(data.data[0].EMAIL);
      $('#inputPassword').val(data.data[0].PASSWORD);
      $('#smallImage').attr('src',data.data[0].FOTO);
      $('.text-form').css('font-family','Neris-LightItalic');
    }
    $('#showLoading').html('Update');
    // SpinnerPlugin.activityStop();
  }, "json");
}

function Submit() {
  if ( checkInput() ) {
    if(fotoganti){
      var dataToBeSent = {
        'TYPE'      : 'update_account',
        'AKUN_ID'   : localStorage.getItem('AKUN_ID'),
        'EMAIL'     : $('#inputEmail').val(),
        'PASSWORD'  : $('#inputPassword').val(),
        'FOTO'      : $('#smallImage').attr('src'),
        'UPDATE_FOTO': 1
      };
    } else {
      var dataToBeSent = {
        'TYPE'      : 'update_account',
        'AKUN_ID'   : localStorage.getItem('AKUN_ID'),
        'EMAIL'     : $('#inputEmail').val(),
        'PASSWORD'  : $('#inputPassword').val(),
        'UPDATE_FOTO': 0
      };
    }
    // window.location.href = "goals.html";
    
    SpinnerPlugin.activityStart("Update...");
    $.post(url, dataToBeSent, function(data, textStatus) {
      if(data.status == '300'){
        alert(data.message);
      } else {
        localStorage.setItem('EMAIL', data.data[0].EMAIL);
        // localStorage.setItem('AKUN_ID', data.data[0].AKUN_ID);
        // localStorage.setItem('USERNAME', data.data[0].USERNAME);
        // localStorage.setItem('REKENING', data.data[0].REKENING);
        // localStorage.setItem('FOTO', data.data[0].FOTO);
        $('.text-form').css('font-family','Neris-LightItalic');
        window.location.href = "goals.html";
      }
      SpinnerPlugin.activityStop();
    }, "json");
    
  }
  else {
    alert('semua data harus terisi!');
  }
}