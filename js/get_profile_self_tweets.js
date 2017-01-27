'use strict'



let temp_tw_section = ` <div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
                    <div class="der"></div>
                    <div class="tweet">
                        <img src="%profileImg" alt="" class="propro">
                        <div class="uee">
                            <p class=""><span class="name_h"><a href="">%retwUserName</a></p>
                            <p class=""><span class="name_h"><a href="">%userName</a></span>
                            <span class="id_h"><a href="">@%userId</a></span></p>
                        </div>
                        <div class="tui">
                            <p class="ter">%tweetText</p>
                        </div>
                    </div>
                    <div class="col-sm-4"></div>
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
            data:{'index':0 }

        }).done(function(data, textStatus, jqXHR){
            console.log(data);
            if (typeof data === 'object'){
                //オブジェクトで帰ってきてたら

                // ツイート内容の表示
                let tweets = data.tweets;
                console.dir(tweets);
                // ひとつずつappendして表示
                tweets.forEach(function(tweet,index,array){
                    console.dir(tweet);
                    let result = temp_tw_section.replace(/%profileImg/,tweet.tw_profile_img);
                    result = result.replace(/%retwUserName/,tweet.retw_user_name+'さんがリツイート');
                    result = result.replace(/%userName/,tweet.tw_user_name);
                    result = result.replace(/%userId/,tweet.tw_user_usrId);
                    result = result.replace(/%tweetText/,tweet.tw_text);

                    console.log(result);

                    $('#tweets_container').append(result);

                });
            }
            //     //イメージ画像の指定
            //     $('.login_user_profile_img').each(function(){
            //         $(this).prop('src',data.profile_img);
            //     });

            //     // ユーザ名の挿入
            //     $('.login_user_name').each(function(){
            //         $(this).text(data.user_name);
            //     });

            //     // ユーザIDの挿入
            //     $('.login_user_id').each(function(){
            //         $(this).text('id:'+data.user_id);
            //     });

            //     // ツイート数の挿入
            //     if (data.tw_count !== null) $('#tweet_count').text(data.tw_count);
            //     else $('#tweet_count').text('0');

            //      // フォローの数の挿入
            //     if (data.follow_count !== null) $('#follow_count').text(data.follow_count);
            //     else $('#follow_count').text('0');

            //      // フォロワーの数の挿入
            //     if (data.follower_count !== null) $('#follower_count').text(data.follower_count);
            //     else $('#follower_count').text('0');
            // } else {

            // }

        }).fail(function(data, textStatus, jqXHR){
            console.log(data);
        });
        
    } else {

    }

}).fail(function(data, textStatus, jqXHR){
    console.log(data);
});


// let myId; 
 
//         //読み込み時にajax起動:profle dataを読み込む 
//     $.ajax({ 
//                 type:"GET", 
//                 url:'./getProfileTest.php' 
//             }).done(function(data){ 
//                     console.log(data); 
//                     let pfD = JSON.parse(data); 
//                     $("#my_name").attr('my_name',pfD.user_name); 
//                     $("#my_id").attr('my_id',pfD.user_id); 
//                     myId = pfD.id; 
//                     //個人のtweetdataを読み込む 
//                     $.ajax({ 
//                         type:'GET', 
//                         url:'./getTweet.php', 
//                         data:{ 
//                             'user_id':myId 
//                         } 
//                     }).done(function(data){ 
//                         // console.log(data); 
//                         //data配列内をforEachで一つづつ取り出す 
//                         /* 
//                         data.forEach((tweet,index,array) => { 
//                             //それらをラップする親要素を作成 
//                             $parentElem = $('<div></div>'); 
 
//                                 //各プロパティの値を格納する子要素を作成 
//                                 $name = $('<div></div>'); 
//                                 $message = $('<div></div>'); 
 
//                                 //作成した子要素に値を格納 
//                                 $name.text(tweet.name); 
//                                 $message.text(tweet.messate); 
 
//                                 //styleをつけるためのclass名をつける 
//                                 $name.addClass('user_name'); 
//                                 $message.addClass('user_name'); 
 
//                                 //styleをつける 
//                                 // $name.css({ 
//                                 //     'color': '#ccc', 
//                                 //     'font-size': '1.6rem' 
//                                 // }); 
//                                 // $message.text(tweet.messate); 
 
//                                 //作成した親要素に、子要素を格納 
//                                 $parentElem.append($name); 
//                                 $parentElem.append($message); 
 
 
//                             //親要素を$('#tweets-wrapper')へappend 
//                             $('#tweets-wrapper').append($parentElem); 
 
//                         });*/ 
 
//                         let twDs = JSON.parse(data); 
//                         let twD; 
//                         twDs.forEach((ele,i,array)=>{ 
//                             $grandparentElem = $('<div class="tweet-wrapper"></div>'); 
//                             $parentElem = $('<div class="userinfo"></div>'); 
//                             $tweetarea = $('<div class="tweet-area"></div>'); 
//                             $tweeticon = $('<div class="tweet-icon"></div>'); 
 
 
 
//                             twD = ele; 
//                             console.log(twD); 
//                             console.log(i); 
 
//                             $username = $('<div class="username"></div>'); 
//                             $userimg = $('<div class="userimg"></div>'); 
//                             $userid = $('<div class="userid"></div>'); 
//                             $tweetdate = $('<div class="timestamp"></div>'); 
//                             $tweettext = $('<div class="tweet-conetnt"></div>'); 
 
//                             $userid.text(twD.tw_user_id); 
//                             $tweetdate.text(twD.tw_date); 
//                             $tweettext.text(twD.tw_text); 
 
//                             $parentElem.append($userimg); 
//                             $parentElem.append($username); 
//                             $parentElem.append($userid); 
//                             $parentElem.append($tweetdate); 
//                             $tweetarea.append($tweettext); 
 
//                             $grandparentElem.append($parentElem); //1 
//                             $grandparentElem.append($tweetarea); //2 
//                             $grandparentElem.append($tweeticon); //3 
 
//                             $('#tweets-wrapper').append($grandparentElem); 
//                         }); 
 
 
 
//                         console.dir(twDs[0].tw_text); 
//                         // twD の 
//                         // $('#tweets-wrapper').prepend("<div class='aaa'>submit</div>"); 
//                     }).fail(function(data){ 
//                         console.log('error') 
//                     }); 
//             }) 
//             .fail(function(data){ 
//                     console.log(data); 
//         }); 

