'use strict'

$.ajax({
    'type':'GET',
    'url':'./php/logout.php'

}).done(function(data, textStatus, jqXHR){
    console.log(data);

}).fail(function(data, textStatus, jqXHR){
    console.log(data);
});