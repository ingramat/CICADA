$(function() {
    // Modal ON event
    $('.btnC').on('click', function() {
        $('#modal-overlay').fadeIn();
        $('#modal').fadeIn();
        // Modal OFF event
        $('#modal-overlay').on("click", function() {
            $('#modal-overlay').fadeOut();
            $('#modal').fadeOut();
        });
    });

    // Modal OFF event
    $("#close").on("click", function() {
        $('#modal-overlay').fadeOut();
        $('#modal').fadeOut();
    });

    //Count text
    $('#tweetarea').on('keydown keyup change', function() {
        var count = $(this).val().length;
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
