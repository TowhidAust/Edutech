import store from "../store";
import Timetable from '../Schedule/Timetable';
import Batch from '../BatchesTab';

import './Sidebar_.css';
import Graphs from "../Graphs";

class SideBar {

    init(){
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.IconEvents();
    }

    initializeElements() {
      // Load the username in the left sudepanel
      $(".username").text(store.getState().UserName);
    }

    IconEvents() {

        $('#dashboardButton').click(function () {

            $('#mainHeading').text('Dashboard');
            $('.Batches_').css('display', 'none');
            $('.Student_').css('display', 'none');
            $('.Schedule_').css('display', 'none');
            $('.Video_').css('display', 'none');
            $('.Lecture_').css('display', 'none');
            $('.Settings_').css('display', 'none');
            $('.Notes_').css('display', 'none');

            $('.Dashboard_').fadeIn('fast');
            $('hr').show();

            return false
        });

        $('#batchesButton').click(function () {

            $('#mainHeading').text('Batches');
            $('.Dashboard_').css('display', 'none');
            $('.Student_').css('display', 'none');
            $('.Schedule_').css('display', 'none');
            $('.Video_').css('display', 'none');
            $('.Lecture_').css('display', 'none');
            $('.Settings_').css('display', 'none');
            $('.Notes_').css('display', 'none');
            $('hr').show();
            //now reload the batchTab
            Batch.reload();

            $('.Batches_').fadeIn('fast');

            return false
        });

        $('#studentButton').click(function () {

            $('#mainHeading').text('Students');
            $('.Dashboard_').css('display', 'none');
            $('.Batches_').css('display', 'none');
            $('.Schedule_').css('display', 'none');
            $('.Video_').css('display', 'none');
            $('.Lecture_').css('display', 'none');
            $('.Settings_').css('display', 'none');
            $('.Notes_').css('display', 'none');
            $('hr').show();

            $('.Student_').fadeIn('fast');

            return false
        });

        $('#ScheduleButton').click(function () {

            $('#mainHeading').text('Schedule');
            $('.Dashboard_').css('display', 'none');
            $('.Batches_').css('display', 'none');
            $('.Student_').css('display', 'none');
            $('.Video_').css('display', 'none');
            $('.Lecture_').css('display', 'none');
            $('.Settings_').css('display', 'none');
            $('.Notes_').css('display', 'none');
            $('hr').hide();

            //reload the timetable gridboxes and set the tab to week
            $('.month_').removeClass('active');
            $('#Month').removeClass('active');

            $('.week_').addClass('active');
            $('#Week').addClass('active');

            //reload the timetable
            $('.timetableONEBOX').remove();
            Timetable.init();

            //hide the home tab
            $('.Dashboard_').css('display', 'none');

            $('.Schedule_').fadeIn('fast');

            return false
        });

        $('#videoButton').click(function () {

            $('#mainHeading').text('Video');
            $('.Dashboard_').css('display', 'none');
            $('.Batches_').css('display', 'none');
            $('.Student_').css('display', 'none');
            $('.Schedule_').css('display', 'none');
            $('.Lecture_').css('display', 'none');
            $('.Settings_').css('display', 'none');
            $('.Notes_').css('display', 'none');
            $('hr').show();

            $('.Video_').fadeIn('fast');

            return false
        });

        $('#lectureButton').click(function () {

            $('#mainHeading').text('Lectures');
            $('.Dashboard_').css('display', 'none');
            $('.Batches_').css('display', 'none');
            $('.Student_').css('display', 'none');
            $('.Schedule_').css('display', 'none');
            $('.Video_').css('display', 'none');
            $('.Settings_').css('display', 'none');
            $('.Notes_').css('display', 'none');
            $('hr').show();

            $('.Lecture_').fadeIn('fast');

            return false
        });

        $('#settingsButton').click(function () {

            $('#mainHeading').text('Settings');
            $('.Dashboard_').css('display', 'none');
            $('.Batches_').css('display', 'none');
            $('.Student_').css('display', 'none');
            $('.Schedule_').css('display', 'none');
            $('.Video_').css('display', 'none');
            $('.Lecture_').css('display', 'none');
            $('.Notes_').css('display', 'none');
            $('hr').hide();

            $('.Settings_').fadeIn('fast');

            return false
        });

        $('#notesButton').click(function () {
            $('#mainHeading').text('Notes');

            $('.Dashboard_').css('display', 'none');
            $('.Batches_').css('display', 'none');
            $('.Student_').css('display', 'none');
            $('.Schedule_').css('display', 'none');
            $('.Video_').css('display', 'none');
            $('.Lecture_').css('display', 'none');
            $('.Settings_').css('display', 'none');
            $('hr').show();

            $('.Notes_').fadeIn('fast');

            return false; 
        });

        // reload barChart
        $(".sidebar-collapse , #dashboardButton").click(function () { 
            setTimeout(function () {
                $(".svg-bar").remove();
                $(".bar_title").remove();
                Graphs.init();
                $('.Dashboard_').css('display', 'none');
                $('.Dashboard_').css('display', 'block');
            }, 700)          
        });
        $("#dashboardButton").click(function () { 
            setTimeout(function () {
                $(".svg-bar").remove();
                $(".bar_title").remove();
                Graphs.init();
                // $('.Dashboard_').css('display', 'none');
                // $('.Dashboard_').css('display', 'block');
            }, 600)          
        });
       

        $('.sidebar-collapse').click(function () {
            setTimeout(function () {
                //if Week tab is active and it is being displayed currently on the screen
                if (($('.week_').hasClass('active')) && ($('.Schedule_').css('display') == 'block')) {
                    //reload the timetable
                    $('.timetableONEBOX').remove();
                    Timetable.init();

                    //hide the home tab
                    $('.Dashboard_').css('display', 'none');
                    //show the timetable
                    $('.Schedule_').css('display', 'block');
                }

                if (($('.month_').hasClass('active')) && ($('.Schedule_').css('display') == 'block')) {
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
            }, 700);
        });

        $('.sidebarBtn').click(function () {

            $('.sidebarBtn').css('border', 'none');

            $(this).css('border-right', '5px solid gray');

            return false
        })
    }

}

export default new SideBar();