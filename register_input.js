// 'use strict'

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
    }

    if (!$('#mail_adrs').val() || $('#mail_adrs').val() === ''){
        $('#error_email').text('メールアドレスが入力されていません。');
        errorFlag = true;
    }

    if (!$('#user_pwd').val() || $('#user_pwd').val() === ''){
        $('#error_user_pwd').text('パスワードが入力されていません。');
        errorFlag = true;
    }

    if (!$('#user_name').val() || $('#user_name').val() === ''){
        $('#error_user_name').text('ニックネームが入力されていません。');
        errorFlag = true;
    }

    if (errorFlag) return;

    let formData = new FormData();

    formData.append($('#user_id').prop('name'),$('#user_id').val());
    formData.append($('#mail_adrs').prop('name'),$('#mail_adrs').val());
    formData.append($('#user_pwd').prop('name'),$('#user_pwd').val());
    formData.append($('#user_name').prop('name'),$('#user_name').val());

    // 自己紹介文があれば、formdataにセット
    if($('#profile_text').val() && $('#profile_text').val() !== ''){
        formData.append($('#profile_text').prop('name'),$('#profile_text').val());
    }
    // 
    if($('#profile_img').val() && $('#profile_img').val() !== ''){
        formData.append($('#profile_img').prop('name'),$('#profile_img').prop('files')[0]);
    }

    $.ajax({
        type:'POST',
        url:'./registeration_input.php',
        data:formData,
        cache       : false,
        contentType : false,
        processData : false

    }).done(function(data, textStatus, jqXHR){
        console.log(data);
        if (data === 'RECEIVE_OK'){
            // 登録内容のアップロードが成功したら
            window.location.href = './registration_confirm.html';
        
        } else {
            $('#error_ajax').text('登録できませんでした。')
        }

    }).fail(function(jqXHR, textStatus, errorThrown){
        $('#error_ajax').text('サーバーとの通信に失敗しています。')
    });
});