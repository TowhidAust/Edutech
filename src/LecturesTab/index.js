import Database from "../Database";
import ResourceBox from "./ResourceBox";
import VerticalNavBar from "./VerticalNavBar";

import './lecture_.css';

class Lectures {
    init() {
        let i = 1;
        let inputJSON = Database.getState().UserClass;
        //console.log(inputJSON);
        // find the grades
        for (let grade in inputJSON) {
            let gradesJSON = inputJSON[grade];
            //  now find the subject JSON
            for (let subject in gradesJSON) {
                let subjectJSON = gradesJSON[subject];
                // let streamsJSON = subjectJSON.Streams;
                let resourceJSON = subjectJSON['Resources'];
                //console.log("this is resource json", resourceJSON);
                let myVerticalNavBar = new VerticalNavBar();
                let myResourceBox = new ResourceBox();
                if (i == 1) {
                    myResourceBox.init(grade, subject, resourceJSON, "active_");
                    myVerticalNavBar.init(grade, subject, "arrowActive_");
                    i++;
                } else {
                    myResourceBox.init(grade, subject, resourceJSON, "inactive_");
                    myVerticalNavBar.init(grade, subject, "arrowInactive_");
                    i++;
                }
            }
        }

        this.bindModals();
    }

    reload(){
        $('#Lecture_Tab_F').empty();
        $('#lecturesTabPaneCont').empty();

        this.init();
        this.bindModals();
    }

    bindModals() {
        // modal for add new resource
        $("#addNewLecture").click(function () {

            let grade = $(this).attr('data-grade');
            let subject = $(this).attr('data-subject');

            $('#newLectureNameInput').val('');
            $('#newLectureURLInput').val('');

            $('#lectureTab_modal_addNewResource_Title').text(`Creating new Resource for ${grade} ${subject}`);

            $('#modal_lectureTab_addNewResource_saveChanges').attr('data-grade', grade);
            $('#modal_lectureTab_addNewResource_saveChanges').attr('data-subject', subject);

            $('#modal-addNewResource').modal('show');
            return false;
        });

        $(".editLecture ").click(function () {

            let grade = $(this).attr('data-grade');
            let subject = $(this).attr('data-subject');
            let key = $(this).attr('data-keyIndex');
            let resourceName = $(this).attr('data-name');
            let resourceURL = $(this).attr('data-URL');

            $('#editedLectureNameInput').val('');
            $('#editedLectureURLInput').val('');

            $('#lectureTab_modal_editResource_Title').text(`Editing Resource for ${grade} ${subject}`);

            $('#editedLectureNameInput').attr('placeholder', `${resourceName} (Leave blank to keep old)`);
            $('#editedLectureURLInput').attr('placeholder', `${resourceURL} (Leave blank to keep old)`);

            $('#modal_lectureTab_editResource_saveChanges').attr('data-grade', grade);
            $('#modal_lectureTab_editResource_saveChanges').attr('data-subject', subject);
            $('#modal_lectureTab_editResource_saveChanges').attr('data-keyIndex', key);
            $('#modal_lectureTab_editResource_saveChanges').attr('data-oldURL', resourceURL);
            $('#modal_lectureTab_editResource_saveChanges').attr('data-oldName', resourceName);

            $('#modal-editResource').modal('show');
            return false;
        });
    }
}

export default new Lectures();
