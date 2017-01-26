'use strict'

// let testData = new ProfileData(1,'test01','test01','test01','test01@tes.ts',null,
                            // 'test01です。よろしく！',null,[2],'2017-01-19 18:43:52',0);

$('#submit').on('click',function(ev){

    console.log('pushed');

    $.ajax({
        type:"GET",
        url:'../GetTest.php',
        // data:{'profile':JSON.stringify(testData)},
        success: function(data){
            console.log(data);
            $("#display").append(data);
        }
    });
    
    // $.ajax({
    //     type:"POST",
    //     url:'../class_test.php',
    //     data:{'profile':JSON.stringify(testData)},
    //     success: function(data){
    //         console.log(data);
    //         $("#display").append(data);
    //         data2 = JSON.parse(data);
    //         data2.user_name
    // });


});



