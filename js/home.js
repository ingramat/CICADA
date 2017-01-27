'use strict'

let temp_tw_section = ` <div class="row">
                <div class="col-sm-3" id="tes"></div>

                <div class="col-sm-9">
                    <div class="hea">
                        <div class="row">
                            <div class="col-sm-2"></div>
                            <div class="col-sm-9">
                                <div class="der"></div>
                                <div class="tweet">
                                    <img src="%profileImg" alt="" class="propro">
                                    <p id="www"><font size="2" color="gray">%retwUserName</font></p>
                                    <div class="uee">
                                        <p class=""><span class="name_h"><a href="">%userName</a></span>
                                        <span class="id_h"><a href="">@%userId</a></span></p>
                                    </div>
                                    <div class="tui">
                                        <p class="ter">%tweetText</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-1"></div>
                        </div>

                    </div>
                </div>
            </div>` ;


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
            data:{'index':0,
                  'follow':JSON.stringify(data.follow_ids)
             }
        }).done(function(data, textStatus, jqXHR){
            console.log(data);
            if (typeof data === 'object'){
                //オブジェクトで帰ってきてたら

                // ツイート内容の表示
                let tweets = data.tweets;
                // console.dir(tweets);
                // ひとつずつappendして表示
                tweets.forEach(function(tweet,index,array){
                    // console.dir(tweet);
                    let result = temp_tw_section.replace(/%profileImg/,tweet.tw_profile_img);
                    
                    result = result.replace(/%userName/,tweet.tw_user_name);
                    result = result.replace(/%userId/,tweet.tw_user_usrId);
                    result = result.replace(/%tweetText/,tweet.tw_text);

                    //リツイートだったときは、リツイートした人の名前を表示
                    if (tweet.retw_user_name !== null)  result = result.replace(/%retwUserName/,tweet.retw_user_name+'さんがリツイート');
                    // そうじゃなければカラ文字
                    else result = result.replace(/%retwUserName/,'');

                    // console.log(result);

                    $('#tweets_container').append(result);

                });
            }

        }).fail(function(data, textStatus, jqXHR){
            console.log(data);
            console.log(textStatus);
            console.log(jqXHR);
            window.location.href = './session_error.html';
        });
        
    } else {

    }

}).fail(function(data, textStatus, jqXHR){
    console.log(data);
    console.dir(textStatus);
    console.dir(jqXHR);
    window.location.href = './session_error.html';
});



// 検索ボタンをした時

$('#btnSearch').on('click',function(ev){

    let searchString = $('#inputSearch').val();

    if (!searchString) return;
    // 検索文字列がないなら戻る。

    // 文字列を空白で区切って
    let searchQueries = searchString.split(' ');

    $.ajax({
        type:'GET',
        url:'./php/getProfile.php',
        dataType:'JSON',
        data:{
            'search_queries':JSON.stringify(searchQueries)
        }
    }).done(function(data, textStatus, jqXHR){



    }).fail(function(data, textStatus, jqXHR){

    });

});