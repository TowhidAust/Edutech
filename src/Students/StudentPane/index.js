
import { decodeString } from "../../misc";
import Database from "../../Database";
import store from "../../store";
import AcceptedStudentCard from "./AcceptedStudentCard";
import PendingStudentCard from "./PendingStudentCard";

class StudentPane {

    init(grade, subject, batchName, status){

        let gradeSplit = grade.split(" ").join('');
        let batchSplit = decodeString(batchName).split(" ").join('');

        let MainHTML_Content = this.mainTabPane_HTML_Content(grade, subject, batchName);

        if (status == "active"){

            $('.studentTabMainPaneParent').append(/*html*/`
                <div class="tab-pane active" id="${subject}${gradeSplit}${batchSplit}Studenttab">

                    ${MainHTML_Content}

                </div>
            `);

        }

        else if (status == "inactive"){

            $('.studentTabMainPaneParent').append(/*html*/`
                <div class="tab-pane" id="${subject}${gradeSplit}${batchSplit}Studenttab">

                    ${MainHTML_Content}

                </div>
            `);
        }

        this.bindEvents(grade, subject, batchName);
    }


    mainTabPane_HTML_Content(grade, subject, batchName){

        let gradeSplit = grade.split(" ").join('');
        let batchSplit = decodeString(batchName).split(" ").join('');

        let totalCapacity = Database.getState()['UserClass'][grade][subject]['Streams'][batchName]['TotalSeats'];
        let filledSeats = Database.getState()['UserClass'][grade][subject]['Streams'][batchName]['FilledSeats'];


        return (/*html*/`
            <div class="panel panel-primary" style="border-color: white;">

                <div class="panel-heading">
                    <div class="panel-title">
                        <h4 style="font-size: 2em;">${decodeString(batchName)} ${filledSeats}/${totalCapacity}</h4>
                        <span>${subject} ${grade}</span>
                    </div>

                    <div class="panel-options">
                        <ul class="list-inline links-list pull-right">
                            <li>
                                <button type="button" id="acceptedButton_${batchSplit}_${subject}_${gradeSplit}" class="btn btn-default btn-icon">
                                    ACCEPTED
                                    <i class="entypo-check"></i>
                                </button>
                            </li>
                            <li class="sep"></li>
                            <li>
                                <button id="pendingButton_${batchSplit}_${subject}_${gradeSplit}" type="button"
                                    class="btn btn-default btn-icon">
                                    PENDING
                                    <i class="entypo-attention"></i>
                                </button>
                            </li>
                        </ul>

                    </div>
                </div>

                <div class="panel-body" style="padding-bottom: 0;">
                    <div class="tab-content">
                        <div class="tab-pane mainAcceptedPane active" id="Accepted_${batchSplit}_${subject}_${gradeSplit}">

                            <div class="panel panel-primary" id="acceptedPanel" style="border:none;">

                                <div class="panel-heading" style="border-bottom: none;">

                                    <div class="panel-options" style="width:100%;">

                                        <form class="navbar-form navbar-left" role="search" style="padding-left:0;">
                                            <div class="form-group">
                                                <input type="text" class="form-control" placeholder="Search">
                                            </div>
                                            <button type="submit" class="btn btn-default">
                                                <i class="entypo-search"></i>
                                            </button>
                                        </form>

                                        <ul class="list-inline links-list pull-right">
                                            <li><a href="#">Roll Call<i class="entypo-feather"></i></a></li>
                                            <li class="sep"></li>
                                            <li><a href="#">Message All<i class="entypo-mail"></i></a></li>
                                            <li class="sep"></li>
                                            <li><a href="#">Exam<i class="entypo-book-open"></i></a></li>
                                            <li class="sep"></li>
                                            <li><a href="#" id="collapseAcceptedPanel">Collapse<i id="acceptedPanelCollapseIcon" class="entypo-down-open"></i></a></li>
                                        </ul>
                                    </div>

                                </div>

                                <div class="panel-body" style="padding-left:0;">

                                        ${function(){
                                            //call the accpeted student cards here
                                            //loop through AcceptedStudents JSON and create student card for each
                                            let finalHTML = '';
                                            let acceptedStudentJSON = Database.getNestedData(['UserClass', grade, subject, 'Streams', batchName, 'AcceptedStudents']);

                                            for (let uniqueKey in acceptedStudentJSON){

                                                let studentName = acceptedStudentJSON[uniqueKey]['StudentName'];
                                                let studentEmail = acceptedStudentJSON[uniqueKey]['StudentEmail'];
                                                let studentInstitution = acceptedStudentJSON[uniqueKey]['StudentInstitution'];
                                                let studentUID = acceptedStudentJSON[uniqueKey]['StudentUID'];
                                                let studentNumber = acceptedStudentJSON[uniqueKey]['StudentNumber'];
                                                let avatarLink = acceptedStudentJSON[uniqueKey]['avatarLink'];

                                                let newStudentCard = new AcceptedStudentCard();
                                                let outputHTML = newStudentCard.init(studentUID, studentName, studentEmail, studentInstitution, studentNumber, avatarLink);

                                                finalHTML = finalHTML + outputHTML;
                                            }

                                            return finalHTML;
                                        }()}

                                </div>

                            </div>


                        </div>

                        <div class="tab-pane mainPendingPane" id="Pending_${batchSplit}_${subject}_${gradeSplit}">

                            <div class="panel panel-primary" style="border:none;">

                                <div class="panel-heading" style="border-bottom: none;">

                                    <div class="panel-options" style="width:100%;">

                                        <form class="navbar-form navbar-left" role="search" style="padding-left:0;">
                                            <div class="form-group">
                                                <input type="text" class="form-control" placeholder="Search">
                                            </div>
                                            <button type="submit" class="btn btn-default">
                                                <i class="entypo-search"></i>
                                            </button>
                                        </form>

                                    </div>

                                </div>

                                <div class="panel-body" style="padding-left:0;">

                                    ${function(){
                                        //call the pending student cards here
                                        //loop through PendingStudents JSON and create student card for each
                                        let finalHTML = '';
                                        let pendingStudentJSON = Database.getNestedData(['UserClass', grade, subject, 'Streams', batchName, 'PendingStudents']);

                                        for (let uniqueKey in pendingStudentJSON){

                                            let studentName = pendingStudentJSON[uniqueKey]['StudentName'];
                                            let studentEmail = pendingStudentJSON[uniqueKey]['StudentEmail'];
                                            let studentInstitution = pendingStudentJSON[uniqueKey]['StudentInstitution'];
                                            let studentUID = pendingStudentJSON[uniqueKey]['StudentUID'];
                                            let studentNumber = pendingStudentJSON[uniqueKey]['StudentNumber'];
                                            let avatarLink = pendingStudentJSON[uniqueKey]['avatarLink'];

                                            let newStudentCard = new PendingStudentCard();
                                            let outputHTML = newStudentCard.init(studentUID, studentName, studentEmail, studentInstitution, studentNumber, avatarLink, uniqueKey, grade, subject, batchName);
                                            newStudentCard.events();

                                            finalHTML = finalHTML + outputHTML;
                                        }

                                        return finalHTML;
                                    }()}

                                </div>

                            </div>

                        </div>
                    </div>

                </div>

            </div>
        `);
    }

    bindEvents(grade, subject, batchName){

        let gradeSplit = grade.split(" ").join('');
        let batchSplit = decodeString(batchName).split(" ").join('');

        $('#' + `pendingButton_${batchSplit}_${subject}_${gradeSplit}`).click(function(event){

            event.stopImmediatePropagation();
            event.stopPropagation();

            $('#' + `Accepted_${batchSplit}_${subject}_${gradeSplit}`).removeClass('active');
            $('#' + `Pending_${batchSplit}_${subject}_${gradeSplit}`).addClass('active');

            return false;
        });

        $('#' + `acceptedButton_${batchSplit}_${subject}_${gradeSplit}`).click(function(event){

            event.stopImmediatePropagation();
            event.stopPropagation();

            $('#' + `Pending_${batchSplit}_${subject}_${gradeSplit}`).removeClass('active');
            $('#' + `Accepted_${batchSplit}_${subject}_${gradeSplit}`).addClass('active');

            return false;
        });

    }
}

export default StudentPane;