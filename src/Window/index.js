
import Timetable from "../Schedule/Timetable";


class WindowEvents {

    init(){
        this.AttachWindowResizeEvents();
    }

    AttachWindowResizeEvents() {
        $(window).bind('resize', function (event) {

            if (event.target == window) {
                console.log('window resized!');

                //if Week tab is active and it is being displayed currently on the screen
                if ( ($('.week_').hasClass('active')) && ($('.Schedule_').css('display') == 'block') ) {
                    //reload the timetable
                    $('.timetableONEBOX').remove();
                    Timetable.init();

                    //hide the home tab
                    $('.Dashboard_').css('display', 'none');
                    //show the timetable
                    $('.Schedule_').css('display', 'block');
                }

                if ( ($('.month_').hasClass('active')) && ($('.Schedule_').css('display') == 'block') ) {
                    //reload the timetable
                    $('.timetableONEBOX').remove();
                    Timetable.init();

                    //hide the home tab
                    $('.Dashboard_').css('display', 'none');
                    //show the timetable
                    $('.Schedule_').css('display', 'block');
                    
                    $('.week_').removeClass('active');
                    $('#Week').removeClass('active');

                    $('.month_').addClass('active');
                    $('#Month').addClass('active');
                }

            }
        });
    }
}

export default new WindowEvents();
