$(function() {
    // Modal ON event
    $('.btnC').on('click', function() {
        $('#tw_pop_back').fadeIn();
        $('#tw_pop').fadeIn();
        // Modal OFF event
        $('#tw_pop_back').on("click", function() {
             $('#tweetarea').val('');
            $('#tw_img_file').val('');
            $('#tw_pre_img').prop('src','');
            $('#tw_pop_back').fadeOut();
            $('#tw_pop').fadeOut();
            $('#tweetbtn').prop('disabled', true);
            $('#cnt_text').text('140');
        });
    });

    // Modal OFF event
    $("#tw_close").on("click", function() {
        $('#tweetarea').val('');
        $('#tw_img_file').val('');
        $('#tw_pre_img').prop('src','');
        $('#tw_pop_back').fadeOut();
        $('#tw_pop').fadeOut();
        $('#tweetbtn').prop('disabled', true);
        $('#cnt_text').text('140');
    });

    //Count text
    $('#tweetarea').on('keydown keyup change', function() {
        let count = $(this).val().length;
        count = 140 - count;
        $('#cnt_text').text(count);
        if (count < 140 && count > 0) {
            $('#tweetbtn').prop('disabled', false);
        } else if (count < 0) {
            $('#cnt_text').css("color", "red");
            $('#tweetbtn').prop('disabled', true);
        }
    });
});
