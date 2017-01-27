'use strict'

// プロファイルデータをGET

$.ajax({
    type:'GET',
    url:'./php/getProfile.php',
    dataType:'JSON'

}).done(function(data, textStatus, jqXHR){
    console.log(data);
    if (typeof data === 'object'){
        //オブジェクトで帰ってきてたら

        //イメージ画像の指定
        $('.login_user_profile_img').each(function(){
            $(this).prop('src',data.profile_img);
        });

        // ユーザ名の挿入
        $('.login_user_name').each(function(){
            $(this).text(data.user_name);
        });

        // ユーザIDの挿入
        $('.login_user_id').each(function(){
            $(this).text('id:'+data.user_id);
        });

        // ツイート数の挿入
        if (data.tw_count !== null) $('#tweet_count').text(data.tw_count);
        else $('#tweet_count').text('0');

         // フォローの数の挿入
        if (data.follow_count !== null) $('#follow_count').text(data.follow_count);
        else $('#follow_count').text('0');

         // フォロワーの数の挿入
        if (data.follower_count !== null) $('#follower_count').text(data.follower_count);
        else $('#follower_count').text('0');

        // ツイートデータをGET
        console.log('------tweet get -----');
        $.ajax({
            type:'GET',
            url:'./php/getTweet.php',
            dataType:'JSON',
            data:{'index':0}

        }).done(function(data, textStatus, jqXHR){
            console.log(data);
            if (typeof data === 'object'){
                //オブジェクトで帰ってきてたら

                //イメージ画像の指定
                $('.login_user_profile_img').each(function(){
                    $(this).prop('src',data.profile_img);
                });

                // ユーザ名の挿入
                $('.login_user_name').each(function(){
                    $(this).text(data.user_name);
                });

                // ユーザIDの挿入
                $('.login_user_id').each(function(){
                    $(this).text('id:'+data.user_id);
                });

                // ツイート数の挿入
                if (data.tw_count !== null) $('#tweet_count').text(data.tw_count);
                else $('#tweet_count').text('0');

                 // フォローの数の挿入
                if (data.follow_count !== null) $('#follow_count').text(data.follow_count);
                else $('#follow_count').text('0');

                 // フォロワーの数の挿入
                if (data.follower_count !== null) $('#follower_count').text(data.follower_count);
                else $('#follower_count').text('0');
            } else {

            }

        }).fail(function(data, textStatus, jqXHR){
            console.log(data);
        });
        
    } else {

    }

}).fail(function(data, textStatus, jqXHR){
    console.log(data);
});

    <div class="row">
    <div class="col-sm-4"></div>
    <div class="col-sm-4">
        <div class="der"></div>
        <div class="tweet">
        <img src="" alt="" class="propro" name="tw_user_img">
        <div class="uee">
            <p class=""><span class="name_h"><a href="" name="tw_user_name" ></a></span>
            <span class="id_h"><a href="" name="tw_user_id">id:tomtom</a></span></p>
        </div>
        <div class="tui">
            <p class="ter">インドなう</p>
        </div>
        </div>
        <div class="col-sm-4"></div>
    </div>
    </div>
