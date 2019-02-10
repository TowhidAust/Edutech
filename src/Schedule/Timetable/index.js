
import Database from '../../Database';
import gridBox from './gridBox';
import { decodeString } from '../../misc';

import './timetable.css';

class Timetable {

    constructor(){

    }

    init(){
        //hide the home tab
        $('.Dashboard_').css('display', 'none');
        //show the timetable
        $('.Schedule_').css('display', 'block');

        $('.month_').removeClass('active');
        $('#Month').removeClass('active');

        $('.week_').addClass('active');
        $('#Week').addClass('active');

        let tableData = Database.getState();

        //now need to loop through the tabledata to get to each batch timings
        let grade;
        for (grade in tableData['UserClass']) {
            let subject;
            for (subject in tableData['UserClass'][grade]) {
                let batch;
                for (batch in tableData['UserClass'][grade][subject]['Streams']) {
                    let timingJSON = tableData['UserClass'][grade][subject]['Streams'][batch]['Timings'];
                    let color = tableData['UserClass'][grade][subject]['Streams'][batch]['StreamColor'];

                    //now that we have the timing JSON call the function to inject created timing boxes into the DOM
                    this.Populate_Timetable(timingJSON, subject, grade, batch, color);
                }
            }
        }

        //show the home tab
        $('.Dashboard_').css('display', 'block');
        //hide the timetable
        $('.Schedule_').css('display', 'none');

        //this.headingScrollFix();
    }


    Populate_Timetable(timingJSON, subject, grade, batchName, color) {
        let key;
        for (key in timingJSON) {
            let value = timingJSON[key];
            // splitting the json strings to get the class names in the function called timeTableGrid()
            // getting the start time 
            var getStimeHour = parseInt(value.split(' ')[1].split(':')[0]);
            var getStimeMint = parseInt(value.split(' ')[1].split(':')[1]);
            var sTime = "." + parseInt((getStimeHour * 60) + getStimeMint);

            // getting the end time
            var getEndTimeHour = parseInt(value.split(' ')[3].split(':')[0]);
            var getEndTimeMint = parseInt(value.split(' ')[3].split(':')[1]);
            var eTime = "." + parseInt((getEndTimeHour * 60) + getEndTimeMint);
            // getting the day
            var getDay = "." + value.split(' ')[0];
            // making a gridBox object for the timing provided
            let decodedBatchName = decodeString(batchName);
            let New_gridBox = new gridBox(sTime, eTime, getDay, decodedBatchName, subject, grade, color, key);
        }
    }

    // scroll to fixed heading of the table
    headingScrollFix() {
        $(window).scroll(function () {
            let scroll = $(document).scrollTop();
            if (scroll > 230) {
                $(".Sticky_Table_Header").css({
                    "visibility": "visible",
                    "position": "sticky",
                    "top": "0",
                    "z-index": "102",
                });
            } else {
                $(".Sticky_Table_Header").css("visibility", "hidden");
            }
        });
    }

}


export default new Timetable();
