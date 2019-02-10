

import { decodeString } from "../../../misc";

class AcceptedStudentCard {

    init(studentUID, studentName, studentEmail, studentInstitution, studentNumber, avatarLink){
        return (/*html*/`
            <div class="member-entry studentCard">

                <i class="entypo-cancel deleteStudentCard tooltip-primary" data-toggle="tooltip" data-placement="left" title="" data-original-title="Delete Student"></i>

                <a href="extra-timeline.html" class="member-img">
                    <img src="${avatarLink}" class="img-rounded" style="border-radius: 5em;" />
                    <i class="entypo-forward"></i>
                </a>

                <div class="member-details">

                    <h4 class="studentHeading">
                        <a href="extra-timeline.html">${decodeString(studentName)}</a>
                        <i class="entypo-chat mailStudentCard tooltip-primary" data-toggle="tooltip" data-placement="top" title="" data-original-title="Direct Message"></i>
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

                            <div class="col-sm-3">
                                <button type="button" class="btn btn-default btn-sm btn-block btn-icon tooltip-primary"
                                    data-toggle="tooltip" data-placement="top"
                                    title="" data-original-title="Click to accept tution for this month">Pending:
                                    JAN 2019<i class="entypo-check"></i></button>
                            </div>

                            <div class="col-sm-3">
                                <button onclick="jQuery('#modal-attendance').modal('show');"
                                    type="button" class="btn btn-default btn-sm btn-block btn-icon">Attendance<i
                                        class="entypo-users"></i></button>
                            </div>

                            <div class="col-sm-3">
                                <button onclick="jQuery('#modal-paymentHistory').modal('show');"
                                    type="button" class="btn btn-default btn-sm btn-block btn-icon">Payment
                                    History<i class="entypo-credit-card"></i></button>
                            </div>

                            <div class="col-sm-3">
                                <button onclick="jQuery('#modal-examAttendance').modal('show');"
                                    type="button" class="btn btn-default btn-sm btn-block btn-icon">Exam
                                    Results<i class="entypo-graduation-cap"></i></button>
                            </div>

                        </div>

                    </div>


                </div>

            </div>
        
        
        
        `);
    }

}


export default AcceptedStudentCard;