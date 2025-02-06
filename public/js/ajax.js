$(document).ready(function () {
  console.log("xxx");
  $("#username").on('keyup', function (e) {
      e.preventDefault();
      var data = $('#username').val();
      console.log(data);
      $.ajax({
          url: '/checkUN',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ username: data }),
          success: function (response) {
              $('#unresult').html('username is ' + response);

              if (response == 'taken') {
                  $('#unresult').css("color", "red");
              }
              else if (response=='available')
              {
                  $('#unresult').css("color", "green");
              }
          },
          error:function(err){

          }
      });
  });
});

$(document).ready(function () {
  $("#email").on('keyup', function (e) {
     e.preventDefault();
      var data = $('#email').val();
      console.log(data);
      $.ajax({
          url: '/checkEmail',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ email: data }),
          success: function (res) {
              $('#emailresult').html('email is ' + res);

              if (res == 'taken') {
                  $('#emailresult').css("color", "red");
              }
              else {
                  $('#emailresult').css("color", "green");
              }
          },
          error:function(err){

          }
      });
  });
});