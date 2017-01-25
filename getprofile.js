let myId;

        //読み込み時にajax起動:profle dataを読み込む
		$.ajax({
                type:"GET",
                // data:,
                // dataType:'json',
                // processData:false,
                url:'./getProfileTest.php'
            }).done(function(data){
                    console.log(data);
                    let pfD = JSON.parse(data);
                    // console.log(abc);
                    $("#my_name").attr('my_name',pfD.user_name);
                    $("#my_id").attr('my_id',pfD.user_id);
                    myId = pfD.id;
                    console.log(myId);


                    //個人のtweetdataを読み込む
                    $.ajax({
                        type:'GET',
                        url:'./getTweet.php',
                        data:{
                            'user_id':myId
                        }
                    }).done(function(data){
                        // console.log(data);
                        let twD = JSON.parse(data);
                        console.dir(twD[0].tw_text);

                    }).fail(function(data){
                        console.log('error')
                    });
            })
            .fail(function(data){
                    console.log(data);
        });
        /*---------------------------------------------------------*/

        
