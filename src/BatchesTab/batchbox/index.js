

import { CraftTimingArray, validColor, encodeString, decodeString, isOnlyWhitespace, isNumber } from '../../misc';
import Database from '../../Database';
import Notifications from '../../TopBar/Notifications';
import Batch from '../../BatchesTab/';
import SuccessPopup from '../../SuccessPopup';
import WarningPopup from '../../WarningPopup';
import Tooltip from '../../Tooltip';

// in this class we are creating a batchbox in a tab pane.
class BatchBox {

    init(grade, subject, streamsJSON, visibility) {

        let gradeSplit = grade.split(" ").join("");

        let bacthBox_ADD_String = this.returnAddBatchBox_String(subject, grade);

        //the if statements here are for setting up the tab-pane to be active or not, everything else in the code is the same
        if (visibility == "active") {
            $(".batch_InfoCard_F").prepend( /* html */ `
            <div class="tab-pane tabpaneBatchTab active" id="${subject}${gradeSplit}batchtab">
                <!-- for loop below -->
                    <div class="panel panel-primary" style="border-color: white;">
                        <div class="panel-heading">
                            <div class="panel-title">
                                <h4 style="font-size: 2em; margin-bottom: 2%;">Batch Configurations</h4>
                                <span style="color: #949494; font-weight: 400;">Here you will find all your batches and their timings. You can edit the timings of already created batches or just create new ones from scratch. You can also edit other useful variables such as batch name, capacity, tution and color. Have fun and customise your batches to your heart's content!</span>
                            </div>
                        </div>
                        <div class="panel-body" style="padding-top:0;" id="${subject}${gradeSplit}batchtabPanel">
                            ${bacthBox_ADD_String}
                    
                        </div>
                    </div>
            </div>
        `);
        } else if (visibility == "inactive") {
            $(".batch_InfoCard_F").prepend( /* html */ `
            <div class="tab-pane tabpaneBatchTab" id="${subject}${gradeSplit}batchtab">
                <!-- for loop below -->
                <div class="panel panel-primary" style="border-color: white;">
                    <div class="panel-heading">
                        <div class="panel-title">
                            <h4 style="font-size: 2em; margin-bottom: 2%;">Batch Configurations</h4>
                            <span style="color: #949494; font-weight: 400;">Here you will find all your batches and their timings. You can edit the timings of already created batches or just create new ones from scratch. You can also edit other useful variables such as batch name, capacity, tution and color. Have fun and customise your batches to your heart's content!</span>
                        </div>
                    </div>
                    <div class="panel-body" style="padding-top:0;" id="${subject}${gradeSplit}batchtabPanel">
                        ${bacthBox_ADD_String}
                
                    </div>
                </div>
            </div>
        `);
        }

        // now add the batchbox card into the tabpane
        for (let batches_ in streamsJSON) {
            let inputStreamJSON = streamsJSON[batches_];
            let timingsJSON = inputStreamJSON["Timings"];
            let streamColor = inputStreamJSON["StreamColor"];
            let filledSeats = inputStreamJSON["FilledSeats"];
            let totalSeats = inputStreamJSON["TotalSeats"];
            let tution = inputStreamJSON["Tution"];
            let batches = decodeString(batches_); //batchName after decoding

            $("#" + `${subject}${gradeSplit}batchtabPanel`).prepend( /*html*/ `
                
                <div class="col-sm-6 batchCol">
                    <div class="tile-stats Tile_Custom" style = "background-color: ${streamColor}">
                        <div class="icon"><i class="entypo-graduation-cap"></i></div>
                        <div class="Overlay">
                            <button type="button" class="btn btn-primary btn-block Button_Add_Timings" data-subject="${subject}" data-grade="${grade}" data-batch="${encodeString(batches)}">Add New Timings</button>
                        </div>
                        <div class="HeadlineCustom">
                            <div class="batchcardTitle">
                                <h3>${batches}&nbsp</h3>
                                <span style="display:inline-block; margin-top:4%;"><i class="entypo-pencil editBatchName tooltip-primary" data-subject="${subject}" data-grade="${grade}" data-batch="${encodeString(batches)}" data-toggle="tooltip" data-placement="right" title="" data-original-title="Edit Name"></i></span>
                            </div>
                        <div class="Icon tooltip-primary" data-toggle="tooltip" data-placement="left" title="" data-original-title="Delete Batch">
                            <span style="margin-right:1%;"><i class="entypo-cancel batchDelete" data-subject="${subject}" data-grade="${grade}" data-batch="${encodeString(batches)}"></i></span>
                
                        </div>
                        </div>
                        <div class="infoContainer">
                            <div class="batchCardInfo">
                                <span>Capacity: ${filledSeats}/${totalSeats} &nbsp</span>
                                <span style="display:inline-block; margin-top: -2%;"><i class="entypo-pencil editCapacity tooltip-primary" data-subject="${subject}" data-grade="${grade}" data-batch="${encodeString(batches)}" data-filledseats="${filledSeats}" data-totalseats=${totalSeats} data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit Total Seats"></i></span>
                            </div>
                            <div class="batchCardInfo">
                                <span>Tution: ${tution} BDT &nbsp</span>
                                <span style="display:inline-block; margin-top: -2%;"><i class="entypo-pencil editTution tooltip-primary" data-subject="${subject}" data-grade="${grade}" data-batch="${encodeString(batches)}" data-tution="${tution}" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit Tution"></i></span>
                            </div>
                            <div class="batchCardInfo">
                                <span>Color: ${streamColor} &nbsp</span>
                                <span style="display:inline-block; margin-top: -2%;"><i class="entypo-pencil editColor tooltip-primary" data-subject="${subject}" data-grade="${grade}" data-batch="${encodeString(batches)}" data-color="${streamColor}" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit Color"></i></span>
                            </div>
                        </div>

                        <div class="Timings Timings_ForLoop_Custom">
                            ${(function(){
                                //loop through and add the timings for this batch
                                let outputString = '';
                                for (let timings in timingsJSON) {
                                    let workingString =  (/*html*/`
                                        <li>
                                            <span style="width: 40%; display: inline-block;">${timingsJSON[timings]}</span>  
                                            <span style="display:inline-block;">
                                                <i class="entypo-pencil editOneBatchTiming tooltip-primary" data-keyIndex="${timings}"  data-subject="${subject}" data-grade="${grade}" data-batch="${batches}" data-toggle="tooltip" data-placement="left" title="" data-original-title="Edit Timing"></i>
                                            </span>
                                            <span style="display:inline-block;">
                                                <i class="entypo-trash tooltip-primary deleteOneBatchTiming" data-keyIndex="${timings}"  data-subject="${subject}" data-grade="${grade}" data-batch="${batches}" data-toggle="tooltip" data-placement="right" title="" data-original-title="Delete Timing"></i>
                                            </span>
                                        </li>
                                    `)

                                    outputString = outputString + workingString;
                                    }

                                    return outputString;
                            })()}
                        </div>
                        <div class="Overlay_Space"></div>
                    </div>
                </div> 
                  
            `);

        }

        this.bindFilterEndingTimes();
        this.bindAddNewTimingSaveChanges();
        this.bindDeleteOneTimingEvent();
        this.bindChangeColorEvent();
        this.bindChangeNameEvent();
        this.bindChangeCapacityEvent();
        this.bindChangeTutionEvent();
        this.bindEditOneTimingEvent();
        this.bindAddOptionalTiming();
        this.bindAddnewBatchSaveChanges();
        this.bindDeleteEntireBatch();
        this.bindTooltips();
    }

    returnAddBatchBox_String(subject, grade) {

        //this returns as an HTML string the add batch box html content to be used up there in the code^^^

        return ( /* html */ `
        <div class="col-sm-6 batchCol">
            <div class="tile-stats Tile_Custom_add Tile_Custom_AddNewBatch">
            <div class="Icon_Plus"><div> <i class="entypo-plus"></i> </div></div>
            <div class="Overlay2">
                <button style="margin-top:2%;" data-subject="${subject}" data-grade="${grade}" type="button" class="btn btn-blue AddNewBatch_Button"><i class="entypo-plus"></i>
                    Add
                    New
                    Batch</button>
            </div>
            <div class="HeadlineCustom">
                <div class="batchcardTitle">
                    <h3>Batch1</h3>
                </div>
                <div class="Icon"><span><i class="entypo-cancel"></i></span></div>
            </div>
            <div class="infoContainer" style="opacity: 0;">
                <div class="batchCardInfo">Capacity: 31/50</div>
                <div class="batchCardInfo">Tution: 4500 BDT</div>
                <div class="batchCardInfo">Color: #234233</div>
            </div>

            <!-- this below timings is hidden using css -->
            <div class="Timings">
                <li>Friday 8:00-12:00 <i class="entypo-trash"></i> </li>
                <li>Friday 8:00-12:00 <i class="entypo-trash"></i> </li>
                <li>Friday 8:00-12:00 <i class="entypo-trash"></i> </li>
            </div>
            <div class="Overlay_Space"></div>
            </div>
        </div>
      `)
    }

    refreshTab(subject, grade){
        //now reload the batchTab
        Batch.reload();

        //set the active tab to the one we were one previously
        $('.navBatchTabLI').removeClass('active');
        $('.tabpaneBatchTab').removeClass('active');
        let gradeSplit = grade.split(" ").join("");
        $(`#${subject}${gradeSplit}batchNavLI`).addClass('active');
        $(`#${subject}${gradeSplit}batchtab`).addClass('active');
    }

    bindAddNewTimingSaveChanges(){
        $('#modal_batchTab_newTimings_saveChanges').click(function(event){

            event.stopPropagation();
            event.stopImmediatePropagation();

            //get all needed variables
            let grade = $(this).attr('data-grade');
            let subject = $(this).attr('data-subject');
            let batchName = $(this).attr('data-batch');

            let myStore = Database.getState();
            let timingJSON = myStore['UserClass'][grade][subject]['Streams'][batchName]['Timings'];

            let lastTimingIndex = 0;

            let key;
            for (key in timingJSON){
                lastTimingIndex = key;
            }

            lastTimingIndex++;

            let chosenDay = $('#batchTab_addTiming_Day').val();
            let chosenSTime = $('#sTime_batchTimingDirect').val();
            let chosenETime = $('#eTime_batchTimingDirect').val();

            //now enter this new entry into firebase database
            let newTiming = chosenDay + ' ' + chosenSTime + ' - ' + chosenETime;

            let data = {
                [lastTimingIndex]: newTiming
            }

            //update the store with this new timing
            let response = Database.update(['UserClass', grade, subject, 'Streams', batchName, 'Timings'], data);

            response.then(function(){
                //notify the user of success     
                let newSuccessPopup = new SuccessPopup();
                newSuccessPopup.init(`${newTiming}`, `${decodeString(batchName)} Timing Changed`);

                let newNotif = new Notifications();
                newNotif.add('Timetable', `${decodeString(batchName)} timing was changed`);

                //now reload the batchTab
                BatchBox.prototype.refreshTab(subject, grade);

            });


            $("#modal-batchTab_newTiming").modal("hide");
            return false;
        })
    }

    bindFilterEndingTimes(){
        $('#sTime_batchTimingDirect').change(function(event){
           
            event.stopPropagation();
            event.stopImmediatePropagation();

            let chosenSTime = $('#sTime_batchTimingDirect').val();

            let firstInteger = chosenSTime.split(':')[0];
            let secondInteger = chosenSTime.split(':')[1];

            if (secondInteger=='00'){
                let totalNewTimingArr = CraftTimingArray(parseInt(firstInteger));
                totalNewTimingArr.shift();

                $('#eTime_batchTimingDirect').empty();

                for (let i = 0; i < totalNewTimingArr.length; i++){
                    $('#eTime_batchTimingDirect').append(/*html*/`
                        <option value="${totalNewTimingArr[i]}">${totalNewTimingArr[i]}</option>
                    `)
                }

            }
            else if(secondInteger=='30'){
                let totalNewTimingArr = CraftTimingArray(parseInt(firstInteger));
                totalNewTimingArr.shift();
                totalNewTimingArr.shift();

                $('#eTime_batchTimingDirect').empty();

                for (let i = 0; i < totalNewTimingArr.length; i++){
                    $('#eTime_batchTimingDirect').append(/*html*/`
                        <option value="${totalNewTimingArr[i]}">${totalNewTimingArr[i]}</option>
                    `)
                }
            } 
           
            return false;
        });

        $('#sTime_batchTimingDirect_edit').change(function(event){
           
            event.stopPropagation();
            event.stopImmediatePropagation();

            let chosenSTime = $('#sTime_batchTimingDirect_edit').val();

            let firstInteger = chosenSTime.split(':')[0];
            let secondInteger = chosenSTime.split(':')[1];

            if (secondInteger=='00'){
                let totalNewTimingArr = CraftTimingArray(parseInt(firstInteger));
                totalNewTimingArr.shift();

                $('#eTime_batchTimingDirect_edit').empty();

                for (let i = 0; i < totalNewTimingArr.length; i++){
                    $('#eTime_batchTimingDirect_edit').append(/*html*/`
                        <option value="${totalNewTimingArr[i]}">${totalNewTimingArr[i]}</option>
                    `)
                }

            }
            else if(secondInteger=='30'){
                let totalNewTimingArr = CraftTimingArray(parseInt(firstInteger));
                totalNewTimingArr.shift();
                totalNewTimingArr.shift();

                $('#eTime_batchTimingDirect_edit').empty();

                for (let i = 0; i < totalNewTimingArr.length; i++){
                    $('#eTime_batchTimingDirect_edit').append(/*html*/`
                        <option value="${totalNewTimingArr[i]}">${totalNewTimingArr[i]}</option>
                    `)
                }
            } 
           
            return false;
        });

        $('#optionalSTimeBatch_Select').change(function(event){
           
            event.stopPropagation();
            event.stopImmediatePropagation();

            let chosenSTime = $('#optionalSTimeBatch_Select').val();

            let firstInteger = chosenSTime.split(':')[0];
            let secondInteger = chosenSTime.split(':')[1];

            if (secondInteger=='00'){
                let totalNewTimingArr = CraftTimingArray(parseInt(firstInteger));
                totalNewTimingArr.shift();

                $('#optionalETimeBatch_Select').empty();

                for (let i = 0; i < totalNewTimingArr.length; i++){
                    $('#optionalETimeBatch_Select').append(/*html*/`
                        <option value="${totalNewTimingArr[i]}">${totalNewTimingArr[i]}</option>
                    `)
                }

            }
            else if(secondInteger=='30'){
                let totalNewTimingArr = CraftTimingArray(parseInt(firstInteger));
                totalNewTimingArr.shift();
                totalNewTimingArr.shift();

                $('#optionalETimeBatch_Select').empty();

                for (let i = 0; i < totalNewTimingArr.length; i++){
                    $('#optionalETimeBatch_Select').append(/*html*/`
                        <option value="${totalNewTimingArr[i]}">${totalNewTimingArr[i]}</option>
                    `)
                }
            } 
           
            return false;
        });
    }

    bindEditOneTimingEvent(){

        $('#modal_batchTab_changeTiming_saveChanges').click(function(event){

            event.stopPropagation();
            event.stopImmediatePropagation();

            //get all needed variables
            let grade = $(this).attr('data-grade');
            let subject = $(this).attr('data-subject');
            let batchName = $(this).attr('data-batch');
            let keyIndex = $(this).attr('data-keyIndex');

            let newDay = $('#batchTab_addTiming_Day_edit').val();
            let new_sTime = $('#sTime_batchTimingDirect_edit').val();
            let new_eTime = $('#eTime_batchTimingDirect_edit').val();
            
            //now enter this new entry into firebase database
            let newTiming = newDay + ' ' + new_sTime + ' - ' + new_eTime;

            let data = {
                [keyIndex]: newTiming
            }

            //update the store with this new timing
            let response = Database.update(['UserClass', grade, subject, 'Streams', batchName, 'Timings'], data);

            response.then(function(){
                //notify the user of success    
                let newSuccessPopup = new SuccessPopup();
                newSuccessPopup.init(`${newTiming}`, `${decodeString(batchName)} Timing Changed`);

                let newNotif = new Notifications();
                newNotif.add('Batches', `${decodeString(batchName)} timing was changed`);

                //now reload the batchTab
                BatchBox.prototype.refreshTab(subject, grade);
            });

            $("#modal-changeTiming").modal("hide");
            return false;
        });
    }

    bindDeleteOneTimingEvent(){

        $('.deleteOneBatchTiming').click(function(event){

            //clicking on deleting a timing from a batch

            event.stopPropagation();
            event.stopImmediatePropagation();

            $(this).parent().animate({opacity: 0, marginLeft: '50%'}, 300);

            //get all needed variables
            let grade = $(this).attr('data-grade');
            let subject = $(this).attr('data-subject');
            let batchName = encodeString($(this).attr('data-batch'));
            let keyIndex = $(this).attr('data-keyIndex');

            //update the database
            let response = Database.remove(['UserClass', grade, subject, 'Streams', batchName, 'Timings', keyIndex]);

            response.then(function(){
                //notify the user of success     
                let newSuccessPopup = new SuccessPopup();
                newSuccessPopup.init(`Database Updated for ${decodeString(batchName)}`, `Timing removed successfully`);

                let newNotif = new Notifications();
                newNotif.add('Batches', `Timing removed from ${decodeString(batchName)}`);

                //now reload the batchTab
                BatchBox.prototype.refreshTab(subject, grade);
            });

            return false;
        });
    }

    bindChangeColorEvent(){

        $('#modal_batchTab_changeColor_saveChanges').click(function(event){

            event.stopPropagation();
            event.stopImmediatePropagation();
            
            //get all needed variables
            let grade = $(this).attr('data-grade');
            let subject = $(this).attr('data-subject');
            let batchName = $(this).attr('data-batch');
            let oldColor = $(this).attr('data-color');

            let newColor = $('#directColorChangeModalField').val();

            let isColorCorrect = validColor(newColor);

            if (isColorCorrect && (newColor!='')){

                let data = {
                    StreamColor: newColor
                }

                let response = Database.update(['UserClass', grade, subject, 'Streams', batchName], data);
    
                response.then(function(){
                    //notify the user of success     
                    
                    let newSuccessPopup = new SuccessPopup();
                    newSuccessPopup.init(`From ${oldColor} to ${newColor}`, `${decodeString(batchName)} Color was Changed`);
    
                    let newNotif = new Notifications();
                    newNotif.add('Batches',  `${decodeString(batchName)} Color was Changed`);
    
                    //now reload the batchTab
                    BatchBox.prototype.refreshTab(subject, grade);
                });
            }

            $("#modal-changeColor").modal("hide");
            
            return false;
        });
    }

    bindChangeNameEvent(){

        $('#modal_batchTab_changeName_saveChanges').click(function(event){

            event.stopPropagation();
            event.stopImmediatePropagation();
            
            //get all needed variables
            let grade = $(this).attr('data-grade');
            let subject = $(this).attr('data-subject');
            let batchName = $(this).attr('data-batch');

            let newName_ = $('#newBatchNameInput').val();
            
            if ((newName_) && (isOnlyWhitespace(newName_)==false)){
                
                newName_.split(' ').join('');
                let newName = encodeString(newName_);

                //check to see if written batchName already exists
                let existingJSON;
                if (Database.getState()['UserClass'][grade][subject]['Streams']){
                    existingJSON = Database.getState()['UserClass'][grade][subject]['Streams'][newName];
                }
                else{
                    existingJSON = undefined;
                }

                //show warning if batch name already exists
                if (existingJSON){

                    let newWarningPopup = new WarningPopup();
                    newWarningPopup.init(`Name already exists in database`, `Existing Batch Error`);

                    return false;
                }

                $("#modal-changeBatchName").modal("hide");
    
                //rename the batchname in database
                let response = Database.changeKey(['UserClass', grade, subject, 'Streams'], batchName, newName);
    
                response.then(function () {
                    let newSuccessPopup = new SuccessPopup();
                    newSuccessPopup.init(`From ${decodeString(batchName)} to ${decodeString(newName)}`, `Batch Name Updated`);

                    let newNotif = new Notifications();
                    newNotif.add('Batches', `From ${decodeString(batchName)} to ${decodeString(newName)}`);

                    //now reload the batchTab
                    BatchBox.prototype.refreshTab(subject, grade);
                });

            }
            
            else {
                let newWarningPopup = new WarningPopup();
                newWarningPopup.init(`Cannot accept empty fields`, `Empty Field Error`);
            }

            return false
        });
    }

    bindChangeCapacityEvent(){

        $('#modal_batchTab_changeCapacity_saveChanges').click(function(event){

            event.stopPropagation();
            event.stopImmediatePropagation();
            
            //get all needed variables
            let grade = $(this).attr('data-grade');
            let subject = $(this).attr('data-subject');
            let batchName = $(this).attr('data-batch');
            let totalSeats = $(this).attr('data-totalseats');

            let newCapacity = $('#newBatchCapacity').val();

            if (!isNumber(newCapacity)){

                let newWarningPopup = new WarningPopup();
                newWarningPopup.init(`Integers/Float accepted only`, `Invalid Number`);

                return false
            }

            if (newCapacity){

                $("#modal-changeCapacity").modal("hide");
    
                let data = {
                    TotalSeats: newCapacity
                }

                //update the database with this new capacity
                let response = Database.update(['UserClass', grade, subject, 'Streams', batchName], data);
    
                response.then(function(){
                    //notify the user of success     
                    let newSuccessPopup = new SuccessPopup();
                    newSuccessPopup.init(`From ${totalSeats} to ${newCapacity}`, `${decodeString(batchName)} Capacity was Changed`);
    
                    let newNotif = new Notifications();
                    newNotif.add('Batches', `${decodeString(batchName)} Capacity was Changed`);
    
                    BatchBox.prototype.refreshTab(subject, grade);
                });
            }

            else {
                let newWarningPopup = new WarningPopup();
                newWarningPopup.init(`Cannot accept empty fields`, `Empty Field Error`);
            }
            
            return false;
        });
    }

    bindChangeTutionEvent(){

        $('#modal_batchTab_changeTution_saveChanges').click(function(event){

            event.stopPropagation();
            event.stopImmediatePropagation();
            
            //get all needed variables
            let grade = $(this).attr('data-grade');
            let subject = $(this).attr('data-subject');
            let batchName = $(this).attr('data-batch');
            let tution = $(this).attr('data-tution');

            let newTution = $("#newBatchTution").val();

            console.log(isNumber(newTution));

            if (!isNumber(newTution)){

                let newWarningPopup = new WarningPopup();
                newWarningPopup.init(`Integers/Float accepted only`, `Invalid Number`);

                return false
            }

            if (newTution){
    
                let data = {
                    Tution: newTution
                }

                //update the store with this new tution
                let response = Database.update(['UserClass', grade, subject, 'Streams', batchName], data);

                $("#modal-changeTution").modal("hide");
    
                response.then(function(){
                    //notify the user of success     
                    let newSuccessPopup = new SuccessPopup();
                    newSuccessPopup.init(`From ${tution} to ${newTution}`, `${decodeString(batchName)} Tution was Changed`);
    
                    let newNotif = new Notifications();
                    newNotif.add('Batches', `${decodeString(batchName)} Tution was Changed`);
    
                    //now reload the batchTab
                    BatchBox.prototype.refreshTab(subject, grade);
                });
            }

            else{
                let newWarningPopup = new WarningPopup();
                newWarningPopup.init(`Cannot accept empty fields`, `Empty Field Error`);
            }

            
            return false;
        });
    }

    bindAddOptionalTiming(){

        $('.addOptionalTimingButton').click(function(event){

            event.stopPropagation();
            event.stopImmediatePropagation();

            let sTime = $('#optionalSTimeBatch_Select').val();
            let eTime = $('#optionalETimeBatch_Select').val();
            let cDay = $('#optionalDayBatch_Select').val();

            $('.optionalTimingsROW').append( /*html*/`         
                <div class="Timings_Holder" data-day="${cDay}" data-sTime="${sTime}" data-eTime="${eTime}">
                    <div class="DaySTimeETime">${cDay} ${sTime} - ${eTime}</div>
                    <div class="Delete_IconOptionalTimings" style="margin-left:2%;"><i class="far fa-trash-alt optionalDeleteTimings"></i></div>
                </div>
            `);

            BatchBox.prototype.bindDeleteOptionalTimings();

            return false
        });
    }

    bindDeleteOptionalTimings(){

        $('.Delete_IconOptionalTimings').click(function(event){

            event.stopPropagation();
            event.stopImmediatePropagation();

            $(this).parent().animate({marginLeft:'50%', opacity: 0}, 300, function(){
                $(this).remove();
            });

            return false;
        });
    }

    bindAddnewBatchSaveChanges(){

        $('#addnewBatchSaveChanges_Button').click(function(event){

            event.stopPropagation();
            event.stopImmediatePropagation();

            let grade = $(this).attr('data-grade');
            let subject = $(this).attr('data-subject');

            let newBatchName = $('#newBatchName_input').val();
            let newCapacity = $('#newTotalCapacity_input').val();
            let newTution = $('#newTution_input').val();
            let newColor = $('#newBatchColor_input').val();

            
            let Current_UID = Database.getState()['UID'];
            let teacherName = Database.getState()['UserName'];
            
            //if empty fields exist then notify user
            if ((!newBatchName) || (isOnlyWhitespace(newBatchName)==true) || (!newCapacity) || (!newTution) || (!newColor)){
                let newWarningPopup = new WarningPopup();
                newWarningPopup.init(`Cannot accept empty fields`, `Empty Field Error`); 
                
                return false;
            }

            if ((!isNumber(newCapacity)) || (!isNumber(newTution))){

                let newWarningPopup = new WarningPopup();
                newWarningPopup.init(`Integers/Float accepted only`, `Invalid Number`);

                return false
            }
            
            newBatchName.split(' ').join('');
            let newName = encodeString(newBatchName);

            //check to see if written batchName already exists
            let existingJSON;
            if (Database.getState()['UserClass'][grade][subject]['Streams']){
                existingJSON = Database.getState()['UserClass'][grade][subject]['Streams'][newName];
            }
            else{
                existingJSON = undefined;
            }

            //show warning if batch name already exists
            if (existingJSON){

                let newWarningPopup = new WarningPopup();
                newWarningPopup.init(`Name already exists in database`, `Existing Batch Error`);

                return false;
            }
            
            let timingJSON = {};

            let k = 0;
            $('.optionalTimingsROW').children('.Timings_Holder').each(function(){

                let thisDay = $(this).attr('data-day');
                let thisSTime = $(this).attr('data-sTime');
                let thisETime = $(this).attr('data-eTime');

                let craftedTime = `${thisDay} ${thisSTime} - ${thisETime}`;

                timingJSON[k] = craftedTime;
                k++;
            });

            //ENTER THE DATA INTO THE DATABASE
            let data = {
                'BatchName': newName,
                'FilledSeats': 0,
                'Grade': grade,
                'StreamColor': newColor,
                'Subject': subject,
                'TeacherName': teacherName,
                'TeacherUID': Current_UID,
                'Timings': timingJSON,
                'TotalSeats': newCapacity,
                'Tution': newTution
            }

            //update the store with this new data
            let response = Database.update(['UserClass', grade, subject, 'Streams', newName], data);

            response.then(function(){
                //notify the user of success     
                let newSuccessPopup = new SuccessPopup();
                newSuccessPopup.init(`In ${subject} ${grade}`, `New batch ${decodeString(newName)} added`);

                let newNotif = new Notifications();
                newNotif.add('Batches', `New batch ${decodeString(newName)} added`);

                BatchBox.prototype.refreshTab(subject, grade);
            });

            $("#modal-createNewBatch").modal("hide");
            return false;
        });
    }

    bindDeleteEntireBatch(){

        $('#modal_batchTab_deleteBatch_saveChanges').click(function(event){

            event.stopPropagation();
            event.stopImmediatePropagation();

            //get all needed variables
            let grade = $(this).attr('data-grade');
            let subject = $(this).attr('data-subject');
            let batchName = $(this).attr('data-batch');

            //update the store with this new removal
            let response = Database.remove(['UserClass', grade, subject, 'Streams', batchName]);

            response.then(function(){
                let newSuccessPopup = new SuccessPopup();
                newSuccessPopup.init(`${decodeString(batchName)} removed from database`, `Batch deleted successfully`);

                let newNotif = new Notifications();
                newNotif.add('Batches', `${decodeString(batchName)} removed from database`);

                //now reload the batchTab
                BatchBox.prototype.refreshTab(subject, grade);
            });

            $("#modal-deleteBatch").modal("hide");
            return false;
        });
    }

    bindTooltips(){
        Tooltip.bind($('.Icon'));
        Tooltip.bind($('.editBatchName'));
        Tooltip.bind($('.editCapacity'));
        Tooltip.bind($('.editTution'));
        Tooltip.bind($('.editColor'));
        Tooltip.bind($('.editOneBatchTiming'));
        Tooltip.bind($('.deleteOneBatchTiming'));
    }
}

export default BatchBox;
