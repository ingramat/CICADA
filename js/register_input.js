'use strict'

//戻ってきた時に、一時登録データを読みだす。
$.ajax({
    type:'GET',
    url:'./php/getTempRegistration.php',
    dataType:'json'
}).done(function(data, textStatus, jqXHR){
    console.log(data);
    if (data !== 'NO_SESSION_DATA'){
        
        
        $('#user_id').val(data.user_id);
        $('#user_name').val(data.user_name);
        $('#mail_adrs').val(data.mail_adrs);

        if (data.profile_img !== null || data.profile_img){
            // プロファイル画像があるなら。
            $('#pre_img').prop('src',data.profile_img);
        }

        if (data.profile_text !== '' || data.profile_text){
            // 自己紹介文があるなら。
            $('#profile_text').val(data.profile_text);
        
        } 

     } 

}).fail(function(data, textStatus, jqXHR){
    //  $('#error_ajax').text('一時ファイルの取得に失敗しました。');
});


// 読み込み画像のプレビュー
$('#profile_img').on('change.inputFile',function(ev){
    console.log('selected');
    // console.log($('#profile_img').val());
    console.dir(ev);
    let file = ev.currentTarget.files[0];
    console.dir(file);
    let fileReader = new FileReader();

    fileReader.onload = function(){
        let dataUri = this.result;
        $('#pre_img').prop('src',dataUri);
    };

    fileReader.readAsDataURL(file);

    // console.dir($('input[name=profile_img]').eq(0));
    // console.dir($('#profile_img').eq(0));
});

$('#btnRegisterInput').on('click',function(ev){
    
    let errorFlag = false;

    if (!$('#user_id').val() || $('#user_id').val() === ''){
        $('#error_user_id').text('ユーザーIDが入力されていません。');
        errorFlag = true;
    } else{
        $('#error_user_id').text('');
    }

    if (!$('#mail_adrs').val() || $('#mail_adrs').val() === ''){
        $('#error_email').text('メールアドレスが入力されていません。');
        errorFlag = true;
    } else{
        $('#error_email').text('');
    }

    if (!$('#user_pwd').val() || $('#user_pwd').val() === ''){
        $('#error_user_pwd').text('パスワードが入力されていません。');
        errorFlag = true;
    } else{
        $('#error_user_pwd').text('');
    }

    if (!$('#user_name').val() || $('#user_name').val() === ''){
        $('#error_user_name').text('ニックネームが入力されていません。');
        errorFlag = true;
    } else{
        $('#error_user_name').text('');
    }

    if (errorFlag) return;
    

    let formData = new FormData();

    formData.append($('#user_id').prop('name'),$('#user_id').val());
    formData.append($('#mail_adrs').prop('name'),$('#mail_adrs').val());
    formData.append($('#user_pwd').prop('name'),$('#user_pwd').val());
    formData.append($('#user_name').prop('name'),$('#user_name').val());

    // 自己紹介文があれば、formdataにセット
    if($('#profile_text').val() && $('#profile_text').val() !== ''){
        console.log('profile text exists');
        formData.append($('#profile_text').prop('name'),$('#profile_text').val());
    }
    // ファイルがあれば、formdataにセット
    if($('#profile_img').val() && $('#profile_img').val() !== ''){
        console.log('file exists');
        formData.append($('#profile_img').prop('name'),$('#profile_img').prop('files')[0]);
    }

    $.ajax({
        type:'POST',
        url:'./php/registeration_input.php',
        data:formData,
        cache       : false,
        contentType : false,
        processData : false

    }).done(function(data, textStatus, jqXHR){
        console.log(data);
        if (data === 'RECEIVE_OK'){
            // 登録内容のアップロードが成功したら
            window.location.href = './registration_confirm.html';
        
        } else if (data === 'FILE_INVALID'){
            $('#error_ajax').text('無効なファイル形式です。');
        } else if (data === 'ALREADY_EXISTS'){
            $('#error_ajax').text('そのユーザー名もしくはメールアドレスはすでに登録されています。');
        } else {
            $('#error_ajax').text('登録できませんでした。');
        }

    }).fail(function(jqXHR, textStatus, errorThrown){
        $('#error_ajax').text('サーバーとの通信に失敗しています。');
    });
});