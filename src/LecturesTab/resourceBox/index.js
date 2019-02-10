

import { encodeString, decodeString, isOnlyWhitespace } from '../../misc';
import Tooltip from '../../Tooltip';
import Lectures from '../../LecturesTab';
import Database from '../../Database';
import Notifications from '../../TopBar/Notifications';
import SuccessPopup from '../../SuccessPopup/';
import WarningPopup from '../../WarningPopup';


// creating the tab pane and includes the resouces inside it. 
class ResourceBox {

    init(grade, subject, resourceJSON, visibility) {

        let gradeSplit = grade.split(" ").join('');
        if (visibility == "active_") {
            $("#lecturesTabPaneCont").append( /*html*/ `
                <div class="tab-pane tabpaneLectureTab active" id="${subject}${gradeSplit}lecturetab">
                    ${this.ReturnMainHTML(grade, subject, resourceJSON)}
                </div>
        `);
        } 
        
        else if (visibility == "inactive_") {
            $("#lecturesTabPaneCont").append( /*html*/ `
                <div class="tab-pane tabpaneLectureTab" id="${subject}${gradeSplit}lecturetab">
                    ${this.ReturnMainHTML(grade, subject, resourceJSON)}
                </div>
        `);
        }

        this.bindLectureClickEvent();
        this.bindTooltips();
        this.bindConfirmEditEvent();
        this.bindDeleteEvent();
        this.bindConfirmNewResource();
    }


    ReturnMainHTML(grade, subject, resourceJSON){

        let colorArray = ['#f56954', '#00a65a', '#00c0ef', '#0073b7', '#00b29e', '#ba79cb', '#ec3b83', '#ffa812', '#6c541e'];

        return(/*html*/`
            <div class="panel panel-primary" style="border-color: white;">
                <!-- panel head -->
                <div class="panel-heading">
                    <div class="panel-title">
                        <h4 style="font-size: 2em; margin-bottom: 2%;">Lecture Notes, Slides and Resources</h4>
                        <span>Class notes easily accessible by students has been experimentally proven to accelerate their learning.</span>
                    </div>
                    <div class="panel-options">
                        <ul class="list-inline links-list pull-right">
                            <li>
                                <button type="button" id="addNewLecture" class="btn btn-default btn-icon icon-left" data-grade="${grade}" data-subject="${subject}">
                                    ADD NEW RESOURCE
                                    <i class="entypo-plus"></i>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- panel body -->
                <div class="panel-body" style="display: block;">
                    <div class="row">


                        ${function(){
                            let outputString = '';
                            let i = 0;
                            //console.log(resourceJSON)
                            for (let pushKey in resourceJSON){

                                let innerResourceJSON = resourceJSON[pushKey];

                                let resourceName = innerResourceJSON['ResourceName'];
                                let resourceURL = decodeString(innerResourceJSON['ResourceURL']);

                                let workingString = /*html*/ `
                                    <div class="col-md-6 Margin">
                                        <div class="LinkDiv" style="background: ${colorArray[i]}" data-link="${resourceURL}">
                                            <div class="Link">
                                                <a href="${resourceURL}" target="_blank" style="color: white;">
                                                    ${decodeString(resourceName)} </a>
                                            </div>
                                            <div class="lectureBtnCont">
                                                <div class="Button_Edit">
                                                    <i class="entypo-pencil editLecture tooltip-primary" data-subject="${subject}" data-grade="${grade}" data-keyIndex="${pushKey}" data-name="${resourceName}" data-URL="${resourceURL}" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"></i>
                                                </div>
                                                <div class="Button_Delete" style="margin-left:10%;">
                                                    <i class="entypo-trash deleteLecture tooltip-primary" data-subject="${subject}" data-grade="${grade}" data-keyIndex="${pushKey}" data-name="${resourceName}" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;

                                outputString = outputString + workingString;

                                i++;
                                if (i>(colorArray.length-1)){
                                    i = 0;
                                }

                            }

                            return outputString;
                        } ()}

                    </div>
                </div>
            </div>
        `);
    }

    refreshTab(subject, grade){
        //now reload the batchTab
        Lectures.reload();

        //set the active tab to the one we were one previously
        $('.navLectureTabLI').removeClass('active');
        $('.tabpaneLectureTab').removeClass('active');
        let gradeSplit = grade.split(" ").join("");
        $(`#${subject}${gradeSplit}lectureNavLI`).addClass('active');
        $(`#${subject}${gradeSplit}lecturetab`).addClass('active');
    }

    bindLectureClickEvent(){

        $('.LinkDiv').click(function(event){

            event.stopPropagation();
            event.stopImmediatePropagation();

            let linkURL = $(this).attr('data-link');

            window.open(linkURL, '_blank');
            return false
        });

    }

    bindTooltips(){
        Tooltip.bind('.editLecture');
        Tooltip.bind('.deleteLecture');
    }

    bindConfirmEditEvent(){

        $('#modal_lectureTab_editResource_saveChanges').click(function(event){

            event.stopImmediatePropagation();
            event.stopPropagation();

            let grade = $(this).attr('data-grade');
            let subject = $(this).attr('data-subject');
            let key = $(this).attr('data-keyIndex');
            let oldName = $(this).attr('data-oldName');
            let oldURL = $(this).attr('data-oldURL');

            let newResourceName = $('#editedLectureNameInput').val();
            let newResourceURL = $('#editedLectureURLInput').val();

            if (!newResourceName || isOnlyWhitespace(newResourceName)){
                newResourceName = oldName;
            }

            if (!newResourceURL || isOnlyWhitespace(newResourceURL)){
                newResourceURL = oldURL;
            }


            let data = {
                ResourceName: newResourceName,
                ResourceURL: newResourceURL
            }

            //update the store with this new data
            let response = Database.update(['UserClass', grade, subject, 'Resources', key], data);

            $("#modal-editResource").modal("hide");

            response.then(function(){

                let newSuccessPopup = new SuccessPopup();
                newSuccessPopup.init(`In ${subject} ${grade}`, `${decodeString(oldName)} Resource was edited`);

                let newNotif = new Notifications();
                newNotif.add('Lecture', `${decodeString(oldName)} Resource was edited`);

                ResourceBox.prototype.refreshTab(subject, grade);
            })

            return false;
        });
    }

    bindDeleteEvent(){

        $('.deleteLecture').click(function(event){

            event.stopImmediatePropagation();
            event.stopPropagation();

            let grade = $(this).attr('data-grade');
            let subject = $(this).attr('data-subject');
            let key = $(this).attr('data-keyIndex');
            let oldName = $(this).attr('data-name');

            let response = Database.remove(['UserClass', grade, subject, 'Resources', key]);

            $("#modal-editResource").modal("hide");

            response.then(function(){
                let newSuccessPopup = new SuccessPopup();
                newSuccessPopup.init(`In ${subject} ${grade}`, `${decodeString(oldName)} Resource was deleted`);

                let newNotif = new Notifications();
                newNotif.add('Lecture', `${decodeString(oldName)} Resource was deleted`);

                ResourceBox.prototype.refreshTab(subject, grade);
            })

            return false;
        });
    }

    bindConfirmNewResource(){

        $('#modal_lectureTab_addNewResource_saveChanges').click(function(event){
            event.stopImmediatePropagation();
            event.stopPropagation();

            let grade = $(this).attr('data-grade');
            let subject = $(this).attr('data-subject');

            let teacherName = Database.getState()['UserName'];

            let chosenName = $('#newLectureNameInput').val();
            let chosenURL = $('#newLectureURLInput').val();

            if ((!chosenName) || (!chosenURL) || (isOnlyWhitespace(chosenName)) || (isOnlyWhitespace(chosenURL))){

                let newWarningPopup = new WarningPopup();
                newWarningPopup.init(`Cannot accept empty fields`, `Empty Field Error`);

                return false;
            }
            $("#modal-addNewResource").modal("hide");

            //DATABASE CODE STARTS
            let data = {
                ResourceGrade : grade,
                ResourceName : encodeString(chosenName),
                ResourceSubject : subject,
                ResourceTeacher : teacherName,
                ResourceURL : encodeString(chosenURL)
            }

            let response = Database.push(['UserClass', grade, subject, 'Resources'], data);

            response.then(function(){

                let newSuccessPopup = new SuccessPopup();
                newSuccessPopup.init(`In ${subject} ${grade}`, `New Resource ${chosenName} added`);

                let newNotif = new Notifications();
                newNotif.add('Lecture', `New Resource ${chosenName} added`);

                ResourceBox.prototype.refreshTab(subject, grade);
            });


            return false
        });
    }
}

export default ResourceBox;