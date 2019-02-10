

$('#collapseAcceptedPanel').click(function(){

    let currentState = $('#acceptedPanel').hasClass('panel-collapse');
    
    if (currentState==true){
        $('.deleteStudentCard').fadeIn(600);
        $('.member-img').animate({'width': '7%'}, 600);
        $('#acceptedPanel').removeClass('panel-collapse');
        $('#acceptedPanelCollapseIcon').attr('class', 'entypo-down-open');
        $('.info-list').fadeIn(600);
    }
    else{
        $('.deleteStudentCard').fadeOut(600);
        $('.member-img').animate({'width': '3.5%'}, 600);
        $('#acceptedPanel').addClass('panel-collapse');
        $('#acceptedPanelCollapseIcon').attr('class', 'entypo-left-open');
        $('.info-list').fadeOut(600);
    }

    return false
});

