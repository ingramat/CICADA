$(function() {
    // Modal ON event
    $('.btnC').on('click', function() {
        $('#modal-overlay').fadeIn();
        $('#modal').fadeIn();
        // Modal OFF event
        $('#modal-overlay').on("click", function() {
             $('#tweetarea').val('');
            $('#tw_img_file').val('');
            $('#pre_img').prop('src','');
            $('#modal-overlay').fadeOut();
            $('#modal').fadeOut();
            $('#tweetbtn').prop('disabled', true);
            $('#cnt_text').text('140');
        });
    });

    // Modal OFF event
    $("#close").on("click", function() {
        $('#tweetarea').val('');
        $('#tw_img_file').val('');
        $('#pre_img').prop('src','');
        $('#modal-overlay').fadeOut();
        $('#modal').fadeOut();
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
