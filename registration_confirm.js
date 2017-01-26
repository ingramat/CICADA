'use strict'

$.ajax({
    type:'GET',
    url:'./getTempRegistration.php',
    dataType:'json'
}).done(function(data, textStatus, jqXHR){
    console.log(data);
    if (data !== 'NO_SESSION_DATA'){
        
        
        $('#user_id').text(data.user_id);
        $('#user_name').text(data.user_name);
        $('#mail_adrs').text(data.mail_adrs);

        if (data.profile_img !== '' || data.profile_img){
            // プロファイル画像があるなら。
            $('#profile_img').prop('src',data.profile_img);
        
        } else {
            // ないならデフォルト画像
            $('#profile_img').prop('src','./profile_imgs/default.png');
        }

        if (data.profile_text !== '' || data.profile_text){
            // 自己紹介文があるなら。
            $('#profile_text').text(data.profile_text);
        
        } else {
            // ないならデフォルト文章
            $('#profile_text').text("こんにちは！");
        }

     } else {
        $('#dipslay_text').text('一時ファイルの取得に失敗しました。');
        $('#btnRegistConfirm').css('disabled','true');
    }

}).fail(function(data, textStatus, jqXHR){
    $('#dipslay_text').text('一時ファイルの取得に失敗しました。');
    $('#btnRegistConfirm').css('disabled','true');
});


$('#btnBack').on('click',function(ev){
    window.location.href = './register.html';
});

$('#btnRgistConfirm').on('click',function(ev){

});