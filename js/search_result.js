'use strict'


let temp_no_hit = `<div class="row center-block">
            <h2 class="text-center text-muted">見つかりませんでした！</h2>
        </div>` ;


let temp_profile_section = `  <div class="col-sm-4">
                                <div class="profile whi">
                                    <img src="%profileImg" alt="" width="200" height="200" class=""img-rounded>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <p id="information"><span id="name"><a href="">%userName</a></span><br>
                                                <span><a href="">@%userId</a></span></p>
                                        </div>

                                        <div class="col-sm-6">
                                            <button class="btn btn-default" value="%userId">フォローする</button>
                                        </div>
                                    </div>
                                    <p>%profileText</p>
                                    <!-- <img src="img/home.jpg" alt="" id="home_jpg"> -->
                                </div>
                            </div>` ;


let temp_tw_section = ` <div class="row">
                <div class="col-sm-3" id="tes"></div>

                <div class="col-sm-9">
                    <div class="hea">
                        <div class="row">
                            <div class="col-sm-2"></div>
                            <div class="col-sm-9">
                                <div class="der"></div>
                                <div class="tweet">
                                    <img src="%profileImg" alt="" class="propro img_rounded">
                                    <p id="www"><font size="2" color="gray">%retwUserName</font></p>
                                    <div class="uee">
                                        <p class=""><span class="name_h"><a href="">%userName</a></span>
                                        <span class="id_h"><a href="">@%userId</a></span></p>
                                    </div>
                                    <div class="tui">
                                        <p class="ter">%tweetText</p>
                                    </div>
                                    <img src="%twImg" alt="" class="propro img_rounded" style="display:%imgdisp;">
                                </div>
                            </div>
                            <div class="col-sm-1"></div>
                        </div>

                    </div>
                </div>
            </div>` ;

// 検索キーワードの取り出し
// 配列のJSONが入っている。
let searchQueries = sessionStorage.getItem('searchQueries');
let searchMode = 'tweet';

console.log(searchQueries);

if (!searchQueries){
    // 検索ワードが見つからなければエラー
    console.log('NO SEARCH QUERY IN SESSION STORAGE');
    $('#search_word').css('display','none');
    $('#search_error').css('display','block');
    // return;
} else {
    // 検索ワードを表示
    let search_words = JSON.parse(searchQueries).join(' ');
    console.log(search_words);
    $('#display_search_word').text(search_words);
    $('#search_error').css('display','none');
}

// ツイートの検索 ページ遷移時
$.ajax({
    type:'GET',
    url:'./php/searchTweet.php',
    dataType:'JSON',
    data:{
        'search_queries':searchQueries,
        'index':0
    }
}).done(function(data, textStatus, jqXHR){
    console.log(data);
    if (typeof data === 'object'){
        // オブジェクトで帰ってきたら


        // つぎの検索結果インデックスを格納
        sessionStorage.setItem('search_profile_next_index',data.next_index);

        // ツイート内容の表示
        let tweets = data.tweets;

        if(tweets.length > 0){
            // 検索結果があれば
             // console.dir(tweets);
            // ひとつずつappendして表示
            tweets.forEach(function(tweet,index,array){
                // console.dir(tweet);
                let result = temp_tw_section.replace(/%profileImg/,tweet.tw_profile_img);
                
                result = result.replace(/%userName/,tweet.tw_user_name);
                result = result.replace(/%userId/,tweet.tw_user_usrId);
                result = result.replace(/%tweetText/,tweet.tw_text);

                if (tweet.tw_img){
                    // 写真があるなら
                    result = result.replace(/%twImg/,tweet.tw_img);
                    result = result.replace(/%imgdisp/,'inline');
                } else {
                    result = result.replace(/%twImg/,'./tw_imgs/noimg.png');
                    result = result.replace(/%imgdisp/,'none');
                }

                //リツイートだったときは、リツイートした人の名前を表示
                if (tweet.retw_user_name !== null)  result = result.replace(/%retwUserName/,tweet.retw_user_name+'さんがリツイート');
                // そうじゃなければカラ文字
                else result = result.replace(/%retwUserName/,'');

                // console.log(result);

                // メインに表示
                $('main').append(result);
            });
        
        } else {
            // 検索結果がないなら
            // メインに表示　検索結果なし
                $('main').append(temp_no_hit);
        }
       

    }


}).fail(function(data, textStatus, jqXHR){
    console.log(data);
    console.dir(textStatus);
    console.dir(jqXHR);
    window.location.href = './session_error.html';

});


// ツイート検索ボタンが押された時

$('#btn_search_tweet').on('click',function(ev){

    if (!searchQueries){
        // 検索ワードが見つからなければエラー
        console.log('NO SEARCH QUERY IN SESSION STORAGE');
        $('#search_word').css('display','none');
        $('#search_error').css('display','block');
        return false;
    } else {
        // 検索ワードを表示
        let search_words = JSON.parse(searchQueries).join(' ');
        console.log(search_words);
        $('#display_search_word').text(search_words);
        $('#search_error').css('display','none');
    }

    

    // ツイートの検索 ボタン選択時
    $.ajax({
        type:'GET',
        url:'./php/searchTweet.php',
        dataType:'JSON',
        data:{
            'search_queries':searchQueries,
            'index':0
        }
    }).done(function(data, textStatus, jqXHR){
        console.log(data);
        if (typeof data === 'object'){
            // オブジェクトで帰ってきたら

            // main 要素を一回からにする
            $('main').empty();

            // つぎの検索結果インデックスを格納
            sessionStorage.setItem('search_tweet_next_index',data.next_index);
            let tweets = data.tweets;
            if(tweets.length > 0){
            // 検索結果があれば
                // console.dir(tweets);
                // ひとつずつappendして表示
                tweets.forEach(function(tweet,index,array){
                    // console.dir(tweet);
                    let result = temp_tw_section.replace(/%profileImg/,tweet.tw_profile_img);
                    
                    result = result.replace(/%userName/,tweet.tw_user_name);
                    result = result.replace(/%userId/,tweet.tw_user_usrId);
                    result = result.replace(/%tweetText/,tweet.tw_text);

                    if (tweet.tw_img){
                        // 写真があるなら
                        result = result.replace(/%twImg/,tweet.tw_img);
                        result = result.replace(/%imgdisp/,'inline');
                    } else {
                        result = result.replace(/%twImg/,'./tw_imgs/noimg.png');
                        result = result.replace(/%imgdisp/,'none');
                    }

                    //リツイートだったときは、リツイートした人の名前を表示
                    if (tweet.retw_user_name !== null)  result = result.replace(/%retwUserName/,tweet.retw_user_name+'さんがリツイート');
                    // そうじゃなければカラ文字
                    else result = result.replace(/%retwUserName/,'');

                    // console.log(result);

                    // メインに表示
                    $('main').append(result);
                });
            
            } else {
                // 検索結果がないなら
                // メインに表示　検索結果なし
                    $('main').append(temp_no_hit);
            }
        }

    }).fail(function(data, textStatus, jqXHR){
        console.log(data);
        console.dir(textStatus);
        console.dir(jqXHR);
        window.location.href = './session_error.html';
    });
});


//  プロファイル検索ボタンが押された時

$('#btn_search_profile').on('click',function(ev){

    if (!searchQueries){
        // 検索ワードが見つからなければエラー
        console.log('NO SEARCH QUERY IN SESSION STORAGE');
        $('#search_word').css('display','none');
        $('#search_error').css('display','block');
        return false;
    } else {
        // 検索ワードを表示
        let search_words = JSON.parse(searchQueries).join(' ');
        console.log(search_words);
        $('#display_search_word').text(search_words);
        $('#search_error').css('display','none');
    }

    

    // ツイートの検索 ボタン選択時
    $.ajax({
        type:'GET',
        url:'./php/searchProfile.php',
        dataType:'JSON',
        data:{
            'search_queries':searchQueries,
            'index':0
        }
    }).done(function(data, textStatus, jqXHR){
        console.log(data);
        if (typeof data === 'object'){
            // オブジェクトで帰ってきたら

            // main 要素を一回からにする
             $('main').empty();

            // つぎの検索結果インデックスを格納
            sessionStorage.setItem('search_profile_next_index',data.next_index);
            let profiles = data.profiles;

            if(profiles.length > 0){
                // 検索結果があれば
                 // ツイート内容の表示
                // console.dir(tweets);
                // ひとつずつappendして表示
                profiles.forEach(function(profile,index,array){
                    // console.dir(tweet);
                    let result = temp_profile_section.replace(/%profileImg/,profile.profile_img);
                    
                    result = result.replace(/%userName/,profile.user_name);
                    result = result.replace(/%userId/,profile.user_usrId);
                    result = result.replace(/%profileText/,profile.profile_text);

                    // console.log(result);

                    // メインに表示
                    $('main').append(result);
                    
                });
            
            } else {
                // 検索結果がないなら
                // メインに表示　検索結果なし
                    $('main').append(temp_no_hit);
            }
           
        }

    }).fail(function(data, textStatus, jqXHR){
        console.log(data);
        console.dir(textStatus);
        console.dir(jqXHR);
        // window.location.href = './session_error.html';
    });
});



// 検索ボタンをした時

$('#btnSearch').on('click',function(ev){

    ev.preventDefault();

    let searchString = $('#inputSearch').val();

    if (!searchString) return false;
    // 検索文字列がないなら戻る。

    // 文字列を空白で区切って
    let searchQueries = searchString.split(' ');

    // 検索キーワードをセッションストレージに格納
    sessionStorage.setItem('searchQueries',JSON.stringify(searchQueries));
    
    // 検索ページに飛ぶ
    window.location.href = './search_result.html';
});