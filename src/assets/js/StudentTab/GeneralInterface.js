

$('#acceptedButton_Alpha_Chemistry_ALEVEL').click(function(){

    $('#Pending_Alpha_Chemistry_ALEVEL').fadeOut('fast', ()=>{
        $('#Accepted_Alpha_Chemistry_ALEVEL').fadeIn('slow');
    });

    return false
});



$('#pendingButton_Alpha_Chemistry_ALEVEL').click(function(){
    
    $('#Accepted_Alpha_Chemistry_ALEVEL').fadeOut('fast', ()=>{
        $('#Pending_Alpha_Chemistry_ALEVEL').fadeIn('slow');
    });

    return false
});
