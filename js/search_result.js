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
                                            <button class="btn %btnColor btnFollow" value="%userId">%ForUF</button>
                                        </div>
                                    </div>
                                    <p>%profileText</p>
                                    <!-- <img src="img/home.jpg" alt="" id="home_jpg"> -->
                                </div>
                            </div>` ;


let temp_tw_section = `<div class="row">
                <div class="col-sm-3" id="tes"></div>

                <div class="col-sm-9">
                    <div class="hea">
                        <div class="row">
                            <div class="col-sm-2"></div>
                            <div class="col-sm-9">
                                <div class="der"></div>
                                <div class="tweet">
                                    <div class="row_child retweet" id="retweeted_container" style="display:%retwDsp">
                                        <i class="fa fa-retweet" aria-hidden="true" id="retweeted"></i>
                                        <p class="retweet"><font size="2" color="gray">%retwUserName</font></p>
                                    </div>
                                    <p id="retweet_text" class="retweet" style="display:%retwDsp">%retwText</p>
                                    <img src="%profileImg" alt="" class="propro img-rounded">
                                    <div class="uee">
                                        <p class=""><span class="name_h"><a href="">%userName</a></span>
                                        <span class="id_h"><a href="">@%userId</a></span></p>
                                    </div>
                                    <div class="tui">
                                        <p class="ter">%tweetText</p>
                                    </div>
                                    <img src="%twImg" alt="" class="propro img-rounded" style="display:%imgdisp;">
                                    <input type="hidden" id="hiddenval" value="%twId">
                                    <div class="row_child retweet">
                                        <span class="fa fa-retweet retweet_icon" aria-hidden="true" id="retweet_icon"></span>
                                        <p id="retweet_count">%retweetCount</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-1"></div>
                        </div>

                    </div>
                </div>
            </div>` ;

// hidden val 受け渡し用一時変数
let tweetId = 0;

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
                result = result.replace(/%twId/,tweet.id);
                result = result.replace(/%retweetCount/,tweet.retw_count);

                if (tweet.tw_img){
                    // 写真があるなら
                    result = result.replace(/%twImg/,tweet.tw_img);
                    result = result.replace(/%imgdisp/,'inline');
                } else {
                    result = result.replace(/%twImg/,'./tw_imgs/noimg.png');
                    result = result.replace(/%imgdisp/,'none');
                }

                //リツイートだったときは、リツイートした人のとコメントを表示
                if (tweet.retw_user_name !== null){
                    result = result.replace(/%retwUserName/,tweet.retw_user_name+'さんがリツイート');

                    console.log('--- retw ----');
                    console.log(tweet.retw_text);
                    // コメントがあるときは入れる
                    if (tweet.retw_text !== null)   result = result.replace(/%retwText/,tweet.retw_text);
                    
                    // ないときはカラ文字
                    else result = result.replace(/%retwText/,'');

                    // リツイート表示
                    result = result.replace(/%retwDsp/,'block');

                } else {
                    // リツイートがないときは非表示

                        result = result.replace(/%retwUserName/,'');
                        result = result.replace(/%retwText/,'');
                        result = result.replace(/%retwDsp/,'none');

                }

                let $result = $(result);
                
                // リツイート用のイベント登録
                $result.find('.retweet_icon').on('click',function(ev){
                    
                    // let $parent = $(this).parent();
                    // let $hidden = $parent.siblings() 
                    console.log($(this).parent().siblings('#hiddenval').attr('value'));
                    console.log('retwicon pushed');
                    
                    tweetId = $(this).parent().siblings('#hiddenval').attr('value');

                    $('#retw_pop_back').fadeIn();
                    $('#retw_pop').fadeIn();
                    // Modal OFF event
                    $('#retw_pop_back').on("click", function() {
                            $('#retweetarea').val('');
                        $('#retw_img_file').val('');
                        $('#retw_pre_img').prop('src','');
                        $('#retw_pop_back').fadeOut();
                        $('#retw_pop').fadeOut();
                        $('#retweetbtn').prop('disabled', true);
                        $('#retw_cnt_text').text('140');
                    });

                });
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
                    result = result.replace(/%twId/,tweet.id);
                    result = result.replace(/%retweetCount/,tweet.retw_count);

                    if (tweet.tw_img){
                        // 写真があるなら
                        result = result.replace(/%twImg/,tweet.tw_img);
                        result = result.replace(/%imgdisp/,'inline');
                    } else {
                        result = result.replace(/%twImg/,'./tw_imgs/noimg.png');
                        result = result.replace(/%imgdisp/,'none');
                    }

                    //リツイートだったときは、リツイートした人のとコメントを表示
                    if (tweet.retw_user_name !== null){
                        result = result.replace(/%retwUserName/,tweet.retw_user_name+'さんがリツイート');

                        console.log('--- retw ----');
                        console.log(tweet.retw_text);
                        // コメントがあるときは入れる
                        if (tweet.retw_text !== null)   result = result.replace(/%retwText/,tweet.retw_text);
                        
                        // ないときはカラ文字
                        else result = result.replace(/%retwText/,'');

                        // リツイート表示
                        result = result.replace(/%retwDsp/,'block');

                    } else {
                        // リツイートがないときは非表示

                         result = result.replace(/%retwUserName/,'');
                         result = result.replace(/%retwText/,'');
                         result = result.replace(/%retwDsp/,'none');

                    }

                    let $result = $(result);
                    
                    // リツイート用のイベント登録
                    $result.find('.retweet_icon').on('click',function(ev){
                        
                        // let $parent = $(this).parent();
                        // let $hidden = $parent.siblings() 
                        console.log($(this).parent().siblings('#hiddenval').attr('value'));
                        console.log('retwicon pushed');
                        
                        tweetId = $(this).parent().siblings('#hiddenval').attr('value');

                        $('#retw_pop_back').fadeIn();
                        $('#retw_pop').fadeIn();
                        // Modal OFF event
                        $('#retw_pop_back').on("click", function() {
                                $('#retweetarea').val('');
                            $('#retw_img_file').val('');
                            $('#retw_pre_img').prop('src','');
                            $('#retw_pop_back').fadeOut();
                            $('#retw_pop').fadeOut();
                            $('#retweetbtn').prop('disabled', true);
                            $('#retw_cnt_text').text('140');
                        });

                    });
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

    // プロファイルの検索 ボタン選択時
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
            let loginId = Number(sessionStorage.getItem('loginId'));
            if(profiles.length > 0){
                // 検索結果があれば
                 // ツイート内容の表示
                // console.dir(tweets);
                // ひとつずつappendして表示
                
                profiles.forEach(function(profile,index,array){

                    // if (profile.id == loginId){
                    //     // 取得したのが自分のIDなら飛ばす。
                    //     continue prof;
                    // }
                    // console.dir(tweet);
                    let result = temp_profile_section.replace(/%profileImg/,profile.profile_img);
                    
                    result = result.replace(/%userName/,profile.user_name);
                    result = result.replace(/%userId/,profile.user_usrId);
                    result = result.replace(/%profileText/,profile.profile_text);
                    // console.log(profile.follow_ids);
                    // // フォローしているプロファイル化を調べる。
                    // if ( profile.follow_ids.indexOf(loginId) == -1){
                    //     // フォローしていないなら
                    //     result = result.replace(/%ForUF/,'フォローする');
                    //     result = result.replace(/%btnColor/,'btn-info');
                    // } else {
                    //     // フォローしているなら
                    //     result = result.replace(/%ForUF/,'フォロー解除');
                    //     result = result.replace(/%btnColor/,'btn-default');
                    // }

                    // let $result = $(result);


                    
                    // // フォロー用のイベント登録
                    // $result.find('.btnFollow').on('click',function(ev){
                        
                        
                    //     let follow_id = $(this).attr('value');

                    //     $.ajax({
                    //         type:'GET',
                    //         url:'./php/addFollow.php',
                    //         data:{
                    //             'follow_id':follow_id
                    //         }

                    //     }).done(function(data, textStatus, jqXHR){

                    //         if (data === 'FOLLOW_OK'){
                    //             $(this).text('フォロー中');
                    //             $(this).attr('class','btn btn-default btnFollow')
                    //         } else if (data === 'UNFOLLOW_OK'){
                    //             $(this).text('フォローする');
                    //             $(this).attr('class','btn btn-info btnFollow')
                    //         }

                    //     }).fail(function(data, textStatus, jqXHR){

                    //     });


                    // });

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

// ツイート画像が選択された時
$('#tw_img_file').on('change',function(ev){
    console.log('selected');
    // console.log($('#profile_img').val());
    console.dir(ev);
    let file = ev.currentTarget.files[0];
    console.dir(file);
    let fileReader = new FileReader();

    fileReader.onload = function(){
        let dataUri = this.result;
        $('#tw_pre_img').prop('src',dataUri);
    };

    fileReader.readAsDataURL(file);
});

//ツイートをするとき
$('#tweetbtn').on('click',function(ev){

    // ツイート内容が空なら何もしない
    if (!$('#tweetarea').val() || $('#tweetarea').val() === '') return;   

    let formData = new FormData();

    formData.append($('#tweetarea').prop('name'),$('#tweetarea').val());
    
    // ファイルがあれば、formdataにセット
    if($('#tw_img_file').val() && $('#tw_img_file').val() !== ''){
        console.log('file exists');
        formData.append($('#tw_img_file').prop('name'),$('#tw_img_file').prop('files')[0]);
    }

    $.ajax({
        type:'POST',
        url:'./php/tweet.php',
        data:formData,
        cache       : false,
        contentType : false,
        processData : false

    }).done(function(data, textStatus, jqXHR){
        console.log(data);
        if (data === 'REGISTER_OK'){
            // 送信OKならリフレッシュ
            window.location.href = './home.html';
            
    
        } else if (data === 'FILE_INVALID'){
            $('#error_ajax_tw').text('無効なファイル形式です。');
        }else {
            $('#error_ajax_tw').text('登録できませんでした。');
        }

    }).fail(function(jqXHR, textStatus, errorThrown){
        $('#error_ajax_tw').text('サーバーとの通信に失敗しています。');
    });

});

// // リツイートするとき
$('#retweetbtn').on('click',function(ev){

    console.log('retweet pushed');
    console.dir(ev);

    let tw_comment ="";
    // リツイートコメントがあるなら
    if ($('#retweetarea').val() && $('#retweetarea').val() !== ''){
        tw_comment = $('#retweetarea').val();
    }

    $.ajax({
        type:'POST',
        url:'./php/retweet.php',
        data:{
            'retw_text': tw_comment,
            'tw_id':tweetId
        }
    }).done(function(data, textStatus, jqXHR){
        console.log(data);
        if (data === 'REGISTER_OK'){
            // 送信OKならリフレッシュ
            window.location.href = './home.html';
            
        }else {
            $('#error_ajax_retw').text('登録できませんでした。');
        }

    }).fail(function(jqXHR, textStatus, errorThrown){
        $('#error_ajax_retw').text('サーバーとの通信に失敗しています。');
    });

});

// Modal OFF event
$("#retw_close").on("click", function() {
    $('#retweetarea').val('');
    $('#retw_img_file').val('');
    $('#retw_pre_img').prop('src','');
    $('#retw_pop_back').fadeOut();
    $('#retw_pop').fadeOut();
    $('#retweetbtn').prop('disabled', true);
    $('#retw_cnt_text').text('140');
});

//Count text
$('#retweetarea').on('keydown keyup change', function() {
    let count = $(this).val().length;
    count = 140 - count;
    $('#retw_cnt_text').text(count);
    if (count < 140 && count > 0) {
        $('#retweetbtn').prop('disabled', false);
    } else if (count < 0) {
        $('#retw_cnt_text').css("color", "red");
        $('#retweetbtn').prop('disabled', true);
    }
});
