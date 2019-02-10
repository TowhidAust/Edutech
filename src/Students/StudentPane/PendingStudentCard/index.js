

import { decodeString } from "../../../misc";
import Database from "../../../Database";
import SuccessPopup from "../../../SuccessPopup";
import Notifications from "../../../TopBar/Notifications";

class PendingStudentCard {

    init(studentUID, studentName, studentEmail, studentInstitution, studentNumber, avatarLink, pushKey, grade, subject, batchName){

        return (/*html*/`

        <div class="member-entry studentCard">

            <a href="extra-timeline.html" class="member-img">
                <img src="${avatarLink}" class="img-rounded"
                    style="border-radius: 5em;" />
                <i class="entypo-forward"></i>
            </a>

            <div class="member-details">
                <h4 style="margin-left: 2%; margin-bottom: 0;">
                    <a href="extra-timeline.html">${decodeString(studentName)}</a>

                </h4>

                <!-- Details with Icons -->
                <div class="row info-list" style="margin-bottom: 0.5%;">

                    <div class="col-sm-12" style="padding-left: 0;">

                        <div class="col-sm-4">

                            <i class="entypo-mail"></i>
                            <a href="#">${decodeString(studentEmail)}</a>
                        </div>

                        <div class="col-sm-4">
                            <i class="entypo-briefcase"></i>
                            <a href="#">${decodeString(studentInstitution)}</a>
                        </div>

                        <div class="col-sm-4">
                            <i class="entypo-phone"></i>
                            <a href="#">${decodeString(studentNumber)}</a>
                        </div>

                    </div>

                </div>

                <div class="row info-list">

                    <div class="col-sm-12" style="padding-left: 0;">

                        <div class="col-sm-6">
                            <button data-subject="${subject}" data-grade="${grade}" data-batch="${batchName}" data-key="${pushKey}" data-name="${studentName}" data-email="${studentEmail}" data-number="${studentNumber}" data-institution="${studentInstitution}" data-UID="${studentUID}" data-avatar="${avatarLink}" type="button" class="btn btn-default btn-sm btn-block btn-icon acceptStudentBTN">ACCEPT<i
                                    class="entypo-check"></i></button>
                        </div>

                        <div class="col-sm-6">
                            <button data-subject="${subject}" data-grade="${grade}" data-batch="${batchName}" data-key="${pushKey}" data-name="${studentName}" data-email="${studentEmail}" data-number="${studentNumber}" data-institution="${studentInstitution}" data-UID="${studentUID}" data-avatar="${avatarLink}"  type="button" class="btn btn-default btn-sm btn-block btn-icon dismissStudentBTN">DISMISS<i class="entypo-cancel"></i></button>
                        </div>

                    </div>

                </div>


            </div>

        </div>


        `);
    }

    events(){

        $('.acceptStudentBTN').click(function(event){

            event.stopImmediatePropagation();
            event.stopPropagation();

            let subject = $(this).attr('data-subject');
            let grade = $(this).attr('data-grade');
            let batchName = $(this).attr('data-batch')

            let studentName = $(this).attr('data-name');
            let studentEmail = $(this).attr('data-email');
            let studentInstitution = $(this).attr('data-institution');
            let studentUID = $(this).attr('data-UID');
            let studentNumber = $(this).attr('data-number');
            let avatarLink = $(this).attr('data-avatar');
            let pushKey = $(this).attr('data-key');

            let data = {
                StudentEmail : studentEmail,
                StudentInstitution : studentInstitution,
                StudentName : studentName,
                StudentNumber : studentNumber,
                StudentUID : studentUID,
                avatarLink : avatarLink
            }

            let response = Database.update(['UserClass', grade, subject, 'Streams', batchName, 'AcceptedStudents', studentUID], data);

            response.then(function(){

                let response = Database.remove(['UserClass', grade, subject, 'Streams', batchName, 'PendingStudents', pushKey]);

                response.then(function(){

                    let newSuccessPopup = new SuccessPopup();
                    newSuccessPopup.init(`${studentName} into ${batchName}`, `Student Accepted`);
    
                    let newNotif = new Notifications();
                    newNotif.add('Students',  `${studentName} accepted into ${batchName}`);

                    //increment the filled seats by 1
                    let currentFilledSeats = Database.getState()['UserClass'][grade][subject]['Streams'][batchName]['FilledSeats'];
                    let newFilledSeats = parseInt(currentFilledSeats) + 1;

                    let data = {
                        FilledSeats : newFilledSeats
                    }

                    Database.update(['UserClass', grade, subject, 'Streams', batchName], data);

                });
            });

            return false;
        });

        $('.dismissStudentBTN').click(function(event){

            event.stopImmediatePropagation();
            event.stopPropagation();

            let subject = $(this).attr('data-subject');
            let grade = $(this).attr('data-grade');
            let batchName = $(this).attr('data-batch');
            let studentName = $(this).attr('data-name');

            let pushKey = $(this).attr('data-key');

            let response = Database.remove(['UserClass', grade, subject, 'Streams', batchName, 'PendingStudents', pushKey]);

            response.then(function(){

                let newSuccessPopup = new SuccessPopup();
                newSuccessPopup.init(`${studentName} from ${batchName}`, `Student Rejected`);

                let newNotif = new Notifications();
                newNotif.add('Students',  `${studentName} rejected from ${batchName}`);

            });

            return false;
        });

    }
}


export default PendingStudentCard;