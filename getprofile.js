//読み込み時にajax起動
		$.ajax({
                type:"GET",
                // data:,
                // dataType:'json',
                // processData:false,
                url:'./getProfileTest.php'
            }).done(function(data){
                    console.log(data);
                    let abc = JSON.parse(data);
                    console.log(abc);
                    $("#my_name").attr('my_name',abc.user_name);
                    $("#my_id").attr('my_id',abc.user_id);
                    $('main').append(data);
            })
            .fail(function(data){
                    console.log(data);
        });
