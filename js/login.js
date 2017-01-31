'use strict'

// ログインのポップアップ
$('#btnLogin').on('click',function(ev){
    $('#login_back').fadeIn();
    $('#loginPopUp').fadeIn();
});

$('#login_back').on('click', function(ev){
    $(this).fadeOut()
    $('#loginPopUp').fadeOut();
});


$('#btnSubmit').on('click',function(ev){

    console.log('push');;
    if ( !$('#emailOrUsrId').val() || $('#emailOrUsrId').val() === '' ||
         !$('#UsrPwd').val() || $('#UsePwd').val() === '' ){
        $('#error_message').text('メールアドレス、ユーザIDまたはパスワードが入力されていません。');
    
    } else{
        console.log('form data valid');
        let emailOrUsrId = $('#emailOrUsrId').val();
        let usrPwd = $('#UsrPwd').val();
        console.log(emailOrUsrId);
        console.log(usrPwd);


        $.ajax({
            type:'POST',
            url:'./php/login.php',
            data:{
                'user_id_OR_email' : emailOrUsrId,
                'user_pwd' : usrPwd
            }
        }).done(function(res){
            console.log('ajax return'); 
            console.log(res);   
            let resAry = JSON.parse(res); 
            if (resAry['status'] === 'LOGIN_OK'){

                // ログインできたらidを保存してホーム画面に
                sessionStorage.setItem('loginId',resAry['id']);
                window.location.href = './home.html';

            } else if (res === 'NO_USER_FOUND' || res === 'VERIFY_NG'){

                $('#error_message').text('メールアドレス、ユーザIDまたはパスワードが間違っています。');

            } else{
                $('#error_message').text('ログインできませんでした。');
            }
        });
    }
});
