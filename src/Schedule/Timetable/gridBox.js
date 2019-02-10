
import Database from '../../Database';
import Timetable from '../Timetable';
import { hexToRgbA, ConvertHourTimeToMinutes, ConvertMinutesToHour, CraftTimingArray, encodeString } from '../../misc';
import SuccessPopup from '../../SuccessPopup';
import Tooltip from '../../Tooltip/';

import Notifications from '../../TopBar/Notifications';

class gridBox {

    constructor(sTime, eTime, day, batchName, subject, grade, color_, keyIndex){

        //console.log(`making new timetable grid box at: ${sTime} ${eTime} ${day} for ${batchName}`);

        this.Current_UID = Database.getState()['UID'];

        this.className = sTime.split(".")[1] + eTime.split(".")[1] + day.split(".")[1];
        this._className = "#" + this.className;
        this.sTimeClassName = 'sTime' + this.className;
        this.eTimeClassName = 'eTime' + this.className;   

        this.sTime = sTime;
        this.eTime = eTime;
        this.day = day;
        this.batchName = batchName;
        this.subject = subject;
        this.grade = grade;
        this.color_ = color_;
        this.keyIndex = keyIndex;
        
        this.offsetStartTime = $(this.sTime).offset();

        this.offsetEndTime = $(this.eTime).offset();
        this.offsetDay = $(this.day).offset();


        // getting the coordinates
        this.y1 = this.offsetStartTime.top;
        this.y2 = this.offsetEndTime.top;

        this.dx1 = this.offsetDay.left;

        // starting $ ending time converts into hours here
        this.startStimeHour;
        var p = this.sTime.split(".")[1];
        var remainderStart = parseFloat(p % 60);
        var q = parseFloat(p - remainderStart);
        if (remainderStart == 0) {
            this.startStimeHour = parseFloat(q / 60) + ":" + remainderStart + "0";
        } else {
            this.startStimeHour = parseFloat(q / 60) + ":" + remainderStart;
        }

        this.endEtimeHour;
        var m = this.eTime.split(".")[1];
        var remainderEnd = parseFloat(m % 60);
        var n = parseFloat(m - remainderEnd);
        if (remainderEnd == 0) {
            this.endEtimeHour = parseFloat(n / 60) + ":" + remainderEnd + "0";
        } else {
            this.endEtimeHour = parseFloat(n / 60) + ":" + remainderEnd;
        }

        this.calcHeight = this.y2 - this.y1;

        this.newPos = new Object();
        this.newPos.left = this.dx1;
        this.newPos.top = this.y1;
        //print(`Setting positions of ${batchName} for day ${day} with top: ${y1} and left: ${dx1}`);

        this.parentWidth = $(".day").innerWidth();
        this.parentHeight = $(".td-time-width").innerHeight();

        if (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) {
            this.parentWidth = String(parseInt(this.parentWidth) + 3);
        }

        this.place_timeTableGrid(); //place the timetable grid onto the DOM
        this.setCSS_Property();     //now set all its css property
        this.Drag();                //Set the draggable event
        this.Resize();              //Set up resize event
        this.directEdit();           //setup left click event to show modal window
        this.filterEndingTime_inModal(); //when starting time is chosen in the direct edit modal it should filter out those times in the ending time select
    }

    place_timeTableGrid() {

        // the div which will be displayed according to pixel position 
        $(".Timetable").append(/*html*/`
            <div class="timetableONEBOX" id="${this.className}" style="position: absolute; visibility: hidden; color:white; cursor: move;">
                <div style="position: relative; width: 100%;">
                    <div>
                        <div style="display:inline-block; font-size:1em; width: 100%;">
                            <span class="${this.sTimeClassName}">${this.startStimeHour} - </span>
                            <span class="${this.eTimeClassName}">${this.endEtimeHour}</span>
                        </div>	  
                        <span style="font-size: 1.5em; font-weight: 500; width: 100%; display:inline-block;">${this.batchName}</span> 
                        <span style=font-size:0.8em; width: 100%;">${this.grade} | ${this.subject}</span>
                    </div>
                </div>

                <i class="entypo-pencil gridBoxEdit tooltip-primary" id="${this.sTimeClassName}DEDIT" data-subject="${this.subject}" data-grade="${this.grade}" data-batch="${this.batchName}" data-sTime="${this.startStimeHour}" data-eTime="${this.endEtimeHour}" data-day="${this.day}" data-keyindex="${this.keyIndex}" data-color="${this.color_}" data-gridboxClassName="${this._className}" data-ownUID="${this.Current_UID}" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"></i>
            </div>
        `);

        Tooltip.bind('.gridBoxEdit');
    }

    Drag(){
        //this will attach drag events to the gridBox
        $(this._className).draggable({
            cursor: "move",
            snap: ".border",
            containment: "parent",
            grid: [this.parentWidth, this.parentHeight],
            scroll: false,
            start: function () {
                //disable scrolling when dragging boxes
                //$('.MainTimeTableCont').css('overflow', 'hidden');
            },
            stop: function () {
                //re-enable scrolling
                //$('.MainTimeTableCont').css('overflow', 'auto');
                //first need to find the pixel positions of each week day
                let newX = $(this).offset().left;

                let newYstart = $(this).position().top;
                let newYend = $(this).position().top + $(this).innerHeight();

                let timingsArray_inMins = [420, 450, 480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780, 810, 840, 870, 900, 930, 960, 990, 1020, 1050, 1080, 1110, 1140, 1170, 1200, 1230, 1260, 1290, 1320, 1350, 1380, 1410, 1440];
                let fullTimingArray_y_offsets = [$('.420').position().top, $('.450').position().top, $('.480').position().top, $('.510').position().top, $('.540').position().top, $('.570').position().top, $('.600').position().top, $('.630').position().top, $('.660').position().top, $('.690').position().top, $('.720').position().top, $('.750').position().top, $('.780').position().top, $('.810').position().top, $('.840').position().top, $('.870').position().top, $('.900').position().top, $('.930').position().top, $('.960').position().top, $('.990').position().top, $('.1020').position().top, $('.1050').position().top, $('.1080').position().top, $('.1110').position().top, $('.1140').position().top, $('.1170').position().top, $('.1200').position().top, $('.1230').position().top, $('.1260').position().top, $('.1290').position().top, $('.1320').position().top, $('.1350').position().top, $('.1380').position().top, $('.1410').position().top, $('.1440').position().top];
                let fullDay_x_offsets = [$('.sunday').offset().left, $('.monday').offset().left, $('.tuesday').offset().left, $('.wednesday').offset().left, $('.thursday').offset().left, $('.friday').offset().left, $('.saturday').offset().left];
                let daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                
                let dayIndex = 0;
                let startTimeIndex = 0;
                let endTimeIndex = 0;

                let grade = $(this).attr('data-grade');
                let subject = $(this).attr('data-subject');
                let batchName = $(this).attr('data-batch');
                let keyIndex = $(this).attr('data-keyindex');
                let Current_UID = $(this).attr('data-ownUID');

                let sTimeClassName = $(this).attr('data-sTimeClassName');
                let eTimeClassName = $(this).attr('data-eTimeClassName');

                console.log(`New X Position: ${parseInt(newX)}`);
                console.log(`Full Day Offsets: ${fullDay_x_offsets}`);

                for (let i = 0; i < fullDay_x_offsets.length; i++) {

                    let difference_between_pos = parseInt(newX) - parseInt(fullDay_x_offsets[i]);

                    if ((difference_between_pos > -5) && (difference_between_pos < 5)) {
                        dayIndex = i;
                    }
                }

                for (let z = 0; z < fullTimingArray_y_offsets.length; z++) {
                    if ((fullTimingArray_y_offsets[z] - newYstart) < 15) {
                        startTimeIndex = z;
                    }
                }

                for (let q = 0; q < fullTimingArray_y_offsets.length; q++) {
                    if ((fullTimingArray_y_offsets[q] - newYend) < 15) {
                        endTimeIndex = q;
                    }
                }

                let newChosenDay = daysArray[dayIndex];

                let newStartTime = ConvertMinutesToHour(timingsArray_inMins[startTimeIndex]);
                let newEndTime = ConvertMinutesToHour(timingsArray_inMins[endTimeIndex])
                console.log(`New Day Dragged to: ${newChosenDay} with start time: ${newStartTime} and ending time: ${newEndTime}`);

                //rewrite the timing cosmetically on front end and update the classes
                $('.' + sTimeClassName).text(newStartTime + ' - ');
                $('.' + eTimeClassName).text(newEndTime);

                $('.' + sTimeClassName).attr('class', `sTime${timingsArray_inMins[startTimeIndex]}${timingsArray_inMins[endTimeIndex]}${newChosenDay}`);
                $('.' + eTimeClassName).attr('class', `eTime${timingsArray_inMins[startTimeIndex]}${timingsArray_inMins[endTimeIndex]}${newChosenDay}`);

                //rewrite the id and meta data in this box to match the new timings
                $(this).attr('id', timingsArray_inMins[startTimeIndex] + timingsArray_inMins[endTimeIndex] + newChosenDay);
                $(this).attr('data-sTime', newStartTime);
                $(this).attr('data-eTime', newEndTime);
                $(this).attr('data-day', '.' + newChosenDay);
                $(this).attr('data-sTimeClassName', `sTime${timingsArray_inMins[startTimeIndex]}${timingsArray_inMins[endTimeIndex]}${newChosenDay}`);
                $(this).attr('data-eTimeClassName', `eTime${timingsArray_inMins[startTimeIndex]}${timingsArray_inMins[endTimeIndex]}${newChosenDay}`);

                //rewrite the attributes of the edit gridbox direct pencil button
                $('#' + sTimeClassName + 'DEDIT').attr('data-sTime', newStartTime);
                $('#' + sTimeClassName + 'DEDIT').attr('data-eTime', newEndTime);
                $('#' + sTimeClassName + 'DEDIT').attr('data-day', '.' + newChosenDay);
                $('#' + sTimeClassName + 'DEDIT').attr('data-gridboxClassName', `#${timingsArray_inMins[startTimeIndex]}${timingsArray_inMins[endTimeIndex]}${newChosenDay}`);
                $('#' + sTimeClassName + 'DEDIT').attr('id', `sTime${timingsArray_inMins[startTimeIndex]}${timingsArray_inMins[endTimeIndex]}${newChosenDay}DEDIT`);

                //now update this in firebase
                //now enter this new entry into firebase database
                let newTiming = newChosenDay + ' ' + newStartTime + ' - ' + newEndTime;
                let encodedBatchName = encodeString(batchName);

                let data = {
                    [keyIndex]: newTiming
                }

                //update the database with this new timing
                let response = Database.update(['UserClass', grade, subject, 'Streams', encodedBatchName, 'Timings'], data);

                response.then(function(){

                    let newSuccessPopup = new SuccessPopup();
                    newSuccessPopup.init(`${newTiming}`, `${batchName} Timing Changed`);

                    let newNotif = new Notifications();
                    newNotif.add('Timetable', `${batchName} timing was changed`);
                });
            }
        });
    }

    Resize(){
        $(this._className).resizable({
            maxHeight: 10000,
            maxWidth: this.parentWidth,
            minHeight: this.parentHeight,
            minWidth: this.parentWidth,
            grid: this.parentHeight,
            start: function (event, ui) {
                event.preventDefault();
                event.stopPropagation();

                return false;
            },
            resize: function (event, ui) {
                event.preventDefault();
                event.stopPropagation();

                return false;
            },
            stop: function (event, ui) {
                event.preventDefault();
                event.stopPropagation();

                let parentHeight = $(".td-time-width").innerHeight();
                let totalInnerHeight = $(this).innerHeight();
                let grade = $(this).attr('data-grade');
                let subject = $(this).attr('data-subject');
                let batchName = $(this).attr('data-batch');
                let keyIndex = $(this).attr('data-keyindex');

                let sTimeClassName = $(this).attr('data-sTimeClassName');
                let eTimeClassName = $(this).attr('data-eTimeClassName');

                let currentDay = $(this).attr('data-day').split('.')[1];

                let numberOfSteps = parseInt(totalInnerHeight / parentHeight);
                //console.log(`Calculated number of steps: ${numberOfSteps}`);

                let startStimeHour = $(this).attr('data-sTime');

                let startTimeInMinutes = ConvertHourTimeToMinutes(startStimeHour);
                let newClassDuration_minutes = (numberOfSteps / 2) * 60;
                let classEndInMinutes = startTimeInMinutes + newClassDuration_minutes;
                let newClassEndInHour = ConvertMinutesToHour(classEndInMinutes);

                //reqrite the timing cosmetically on front end and update the classes
                $('.' + sTimeClassName).text(startStimeHour + ' - ');
                $('.' + eTimeClassName).text(newClassEndInHour);

                $('.' + sTimeClassName).attr('class', `sTime${startTimeInMinutes}${classEndInMinutes}${currentDay}`);
                $('.' + eTimeClassName).attr('class', `eTime${startTimeInMinutes}${classEndInMinutes}${currentDay}`);

                //rewrite the id and meta data in this box to match the new timings
                
                $(this).attr('id', startTimeInMinutes + classEndInMinutes + currentDay);
                $(this).attr('data-sTime', startStimeHour);
                $(this).attr('data-eTime', newClassEndInHour);
                $(this).attr('data-sTimeClassName', `sTime${startTimeInMinutes}${classEndInMinutes}${currentDay}`);
                $(this).attr('data-eTimeClassName', `eTime${startTimeInMinutes}${classEndInMinutes}${currentDay}`);

                //rewrite the attributes of the edit gridbox direct pencil button
                $('#' + sTimeClassName + 'DEDIT').attr('data-sTime', startStimeHour);
                $('#' + sTimeClassName + 'DEDIT').attr('data-eTime', newClassEndInHour);
                $('#' + sTimeClassName + 'DEDIT').attr('data-day', '.' + currentDay);
                $('#' + sTimeClassName + 'DEDIT').attr('id', `sTime${startTimeInMinutes}${classEndInMinutes}${currentDay}DEDIT`);

                console.log(`Resized to Start: ${startStimeHour} || End: ${newClassEndInHour} on day: ${currentDay}`);

                //now enter this new entry into firebase database
                let newTiming = currentDay + ' ' + startStimeHour + ' - ' + newClassEndInHour;
                let encodedBatchName = encodeString(batchName);

                let data = {
                    [keyIndex]: newTiming
                }

                 //update the database with this new timing
                let response = Database.update(['UserClass', grade, subject, 'Streams', encodedBatchName, 'Timings'], data);

                response.then(function(){

                    let newSuccessPopup = new SuccessPopup();
                    newSuccessPopup.init(`${newTiming}`, `${batchName} Timing Changed`);

                    let newNotif = new Notifications();
                    newNotif.add('Timetable', `${batchName} timing was changed`);
                });

                return false;
            }
        });
    }

    directEdit(){

        $('.gridBoxEdit').click(function(event){

            event.stopPropagation();
            event.stopImmediatePropagation();
            
            $('#modal-timechange').modal('show');

            console.log('gridBox Edit clicked!');
    
            //setup all the variables needed
            let subject = $(this).attr('data-subject');
            let grade = $(this).attr('data-grade');
            let batchName = $(this).attr('data-batch');
            let sTime = $(this).attr('data-sTime');
            let eTime = $(this).attr('data-eTime');
            let day_ = $(this).attr('data-day').split('.')[1];
            let keyIndex = $(this).attr('data-keyindex');
            let color_ = $(this).attr('data-color');
            let gridboxClassName = $(this).attr('data-gridboxClassName');
            let Current_UID = $(this).attr('data-ownUID');

            //set the attributes of the enter button
            $('#directTimingChange').attr('data-subject', subject);
            $('#directTimingChange').attr('data-grade', grade);
            $('#directTimingChange').attr('data-batch', batchName);
            $('#directTimingChange').attr('data-sTime', sTime);
            $('#directTimingChange').attr('data-eTime', eTime);
            $('#directTimingChange').attr('data-day', day_);
            $('#directTimingChange').attr('data-keyindex', keyIndex);
            $('#directTimingChange').attr('data-color', color_);
            $('#directTimingChange').attr('data-gridboxClassName', gridboxClassName);
            $('#directTimingChange').attr('data-ownUID', Current_UID);

            //set the default values to the ones existing currently
            $('#directChange_day').val(day_);
            $('#directChange_sTime').val(sTime);

            let firstInteger = sTime.split(':')[0];
            let secondInteger = sTime.split(':')[1];

            if (secondInteger=='00'){
                let totalNewTimingArr = CraftTimingArray(parseInt(firstInteger));

                $('#directChange_eTime').empty();

                for (let i = 0; i < totalNewTimingArr.length; i++){
                    $('#directChange_eTime').append(/*html*/`
                        <option value="${totalNewTimingArr[i]}">${totalNewTimingArr[i]}</option>
                    `)
                }
            }
            else if(secondInteger=='30'){
                let totalNewTimingArr = CraftTimingArray(parseInt(firstInteger));
                totalNewTimingArr.shift();

                $('#directChange_eTime').empty();

                for (let i = 0; i < totalNewTimingArr.length; i++){
                    $('#directChange_eTime').append(/*html*/`
                        <option value="${totalNewTimingArr[i]}">${totalNewTimingArr[i]}</option>
                    `)
                }
            }

            $('#directChange_eTime').val(eTime);

            //when the enter button is clicked proceed with changing the time
            $('#directTimingChange').click(function(event){

                event.stopPropagation();
                event.stopImmediatePropagation();

                let subject = $(this).attr('data-subject');
                let grade = $(this).attr('data-grade');
                let batchName = $(this).attr('data-batch');
                let keyIndex = $(this).attr('data-keyindex');

                let newDay = $('#directChange_day').val();
                let new_sTime = $('#directChange_sTime').val();
                let new_eTime = $('#directChange_eTime').val();

                let encodedBatchName = encodeString(batchName);

                //now enter this new entry into firebase database
                let newTiming = newDay + ' ' + new_sTime + ' - ' + new_eTime;

                console.log(`Writing new timing to: ${newTiming}`);

                let data = {
                    [keyIndex]: newTiming
                }

                //update the database with this new timing
                let response = Database.update(['UserClass', grade, subject, 'Streams', encodedBatchName, 'Timings'], data);

                response.then(function(){
                    let newSuccessPopup = new SuccessPopup();
                    newSuccessPopup.init(`${newTiming}`, `${batchName} Timing Changed`);

                    let newNotif = new Notifications();
                    newNotif.add('Timetable', `${batchName} timing was changed`);

                    //remove the gridbox from the DOM and repaint it // reload the entire timetable
                    $('.timetableONEBOX').remove();
                    Timetable.init();
                    //hide the home tab
                    $('.Dashboard_').css('display', 'none');
                    //show the timetable
                    $('.Schedule_').css('display', 'block');
                });

                $('#modal-timechange').modal('hide');

                return false;
            });
    
            return false;
        }); 
    }

    filterEndingTime_inModal(){

        $('#directChange_sTime').change(function(event){

            event.stopPropagation();
            event.stopImmediatePropagation();

            let chosenSTime = $('#directChange_sTime').val();

            let firstInteger = chosenSTime.split(':')[0];
            let secondInteger = chosenSTime.split(':')[1];

            if (secondInteger=='00'){
                let totalNewTimingArr = CraftTimingArray(parseInt(firstInteger));
                totalNewTimingArr.shift();

                $('#directChange_eTime').empty();

                for (let i = 0; i < totalNewTimingArr.length; i++){
                    $('#directChange_eTime').append(/*html*/`
                        <option value="${totalNewTimingArr[i]}">${totalNewTimingArr[i]}</option>
                    `)
                }

            }
            else if(secondInteger=='30'){
                let totalNewTimingArr = CraftTimingArray(parseInt(firstInteger));
                totalNewTimingArr.shift();
                totalNewTimingArr.shift();

                $('#directChange_eTime').empty();

                for (let i = 0; i < totalNewTimingArr.length; i++){
                    $('#directChange_eTime').append(/*html*/`
                        <option value="${totalNewTimingArr[i]}">${totalNewTimingArr[i]}</option>
                    `)
                }
            }

            return false;
        })
    }

    
    setCSS_Property(){
        //this will set the css property of the grid box after it has been injected

        let hexColor = hexToRgbA(this.color_, '0.8');

        $(this._className).offset(this.newPos);
        $(this._className).css("height", this.calcHeight);
        $(this._className).css("width", this.parentWidth);
        $(this._className).css("z-index", "101");
        $(this._className).css("background", hexColor);
        $(this._className).css("text-align", "center");
        $(this._className).css("visibility", "visible");
        $(this._className).css("display", "flex");
        $(this._className).css("justify-content", "center");
        $(this._className).css("align-items", "center");
        $(this._className).attr('data-sTime', this.startStimeHour);
        $(this._className).attr('data-eTime', this.endEtimeHour);
        $(this._className).attr('data-day', this.day);
        $(this._className).attr('data-subject', this.subject);
        $(this._className).attr('data-grade', this.grade);
        $(this._className).attr('data-batch', this.batchName);
        $(this._className).attr('data-keyindex', this.keyIndex);
        $(this._className).attr('data-color', this.color_);
        $(this._className).attr('data-ownUID', this.Current_UID);
        $(this._className).attr('data-sTimeClassName', this.sTimeClassName);
        $(this._className).attr('data-eTimeClassName', this.eTimeClassName);
    }

}

export default gridBox;