let myId;

        //読み込み時にajax起動:profle dataを読み込む
		$.ajax({
                type:"GET",
                url:'./getProfileTest.php'
            }).done(function(data){
                    console.log(data);
                    let pfD = JSON.parse(data);
                    $("#my_name").attr('my_name',pfD.user_name);
                    $("#my_id").attr('my_id',pfD.user_id);
                    myId = pfD.id;
                    //個人のtweetdataを読み込む
                    $.ajax({
                        type:'GET',
                        url:'./getTweet.php',
                        data:{
                            'user_id':myId
                        }
                    }).done(function(data){
                        // console.log(data);
                        //data配列内をforEachで一つづつ取り出す
                        /*
                        data.forEach((tweet,index,array) => {
                            //それらをラップする親要素を作成
                            $parentElem = $('<div></div>');

                                //各プロパティの値を格納する子要素を作成
                                $name = $('<div></div>');
                                $message = $('<div></div>');

                                //作成した子要素に値を格納
                                $name.text(tweet.name);
                                $message.text(tweet.messate);

                                //styleをつけるためのclass名をつける
                                $name.addClass('user_name');
                                $message.addClass('user_name');

                                //styleをつける
                                // $name.css({
                                //     'color': '#ccc',
                                //     'font-size': '1.6rem'
                                // });
                                // $message.text(tweet.messate);

                                //作成した親要素に、子要素を格納
                                $parentElem.append($name);
                                $parentElem.append($message);


                            //親要素を$('#tweets-wrapper')へappend
                            $('#tweets-wrapper').append($parentElem);

                        });*/

                        let twDs = JSON.parse(data);
                        let twD;
                        twDs.forEach((ele,i,array)=>{
                            $grandparentElem = $('<div class="tweet-wrapper"></div>');
                            $parentElem = $('<div class="userinfo"></div>');
                            $tweetarea = $('<div class="tweet-area"></div>');
                            $tweeticon = $('<div class="tweet-icon"></div>');



                            twD = ele;
                            console.log(twD);
                            console.log(i);

                            $username = $('<div class="username"></div>');
                            $userimg = $('<div class="userimg"></div>');
                            $userid = $('<div class="userid"></div>');
                            $tweetdate = $('<div class="timestamp"></div>');
                            $tweettext = $('<div class="tweet-conetnt"></div>');

                            $userid.text(twD.tw_user_id);
                            $tweetdate.text(twD.tw_date);
                            $tweettext.text(twD.tw_text);

                            $parentElem.append($userimg);
                            $parentElem.append($username);
                            $parentElem.append($userid);
                            $parentElem.append($tweetdate);
                            $tweetarea.append($tweettext);

                            $grandparentElem.append($parentElem); //1
                            $grandparentElem.append($tweetarea); //2
                            $grandparentElem.append($tweeticon); //3

                            $('#tweets-wrapper').append($grandparentElem);
                        });



                        console.dir(twDs[0].tw_text);
                        // twD の
                        // $('#tweets-wrapper').prepend("<div class='aaa'>submit</div>");
                    }).fail(function(data){
                        console.log('error')
                    });
            })
            .fail(function(data){
                    console.log(data);
        });
        /*---------------------------------------------------------*/


