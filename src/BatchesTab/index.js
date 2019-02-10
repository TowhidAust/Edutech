import BatchBox from "./batchbox";
import Database from "../Database";
import VerticalNavBar from "./VerticalNavBar";
import "./batches_.css";
import { decodeString } from '../misc';
import WarningPopup from '../WarningPopup';

// This is the main class for batchBox
// Using for loop we are accessing the firebase database JSONS
class Batch {

  init() {
    // This is the whole JSON declared in database.js
    let inputJSON = Database.getState().UserClass;
    let i = 1;
    // find the grades
    for (let grade in inputJSON) {
      let gradesJSON = inputJSON[grade];
      //  now find the subject JSON
      for (let subject in gradesJSON) {
        let subjectJSON = gradesJSON[subject];
        let streamsJSON = subjectJSON.Streams;
        // declaring the object of the VerticalNavBar and print the box.
        let myVerticalNavBar = new VerticalNavBar();
        let myBatchBox = new BatchBox();
        if (i == 1) {
          myBatchBox.init(grade, subject, streamsJSON, "active");
          myVerticalNavBar.init(
            grade,
            subject,
            "active"
          );
          i++;
        } else {
          myBatchBox.init(
            grade,
            subject,
            streamsJSON,
            "inactive"
          );
          myVerticalNavBar.init(
            grade,
            subject,
            "inactive"
          );
          i++;
        }
      }
    }
  }

  reload(){
    $('#Batches_Tab_F').empty();
    $('.batch_InfoCard_F').empty();

    this.init();
    this.setupModals();
  }

  setupModals(){

    $(".Button_Add_Timings").click(function() {
        //extract all the needed variables from its attribute
        let grade = $(this).attr('data-grade');
        let subject = $(this).attr('data-subject');
        let batchName = $(this).attr('data-batch');
    
        //change the variables in modal to updated ones
        $('#batchTab_modal_newTiming_Title').text(`Adding new timings for ${decodeString(batchName)}`);
        $('#modal_batchTab_newTimings_saveChanges').attr('data-grade', grade);
        $('#modal_batchTab_newTimings_saveChanges').attr('data-subject', subject);
        $('#modal_batchTab_newTimings_saveChanges').attr('data-batch', batchName);
    
        $("#modal-batchTab_newTiming").modal("show");
    
        return false;
    });

    //Modal for adding a new batch
    $(".AddNewBatch_Button").click(function() {

      //extract all the needed variables from its attribute
      let grade = $(this).attr('data-grade');
      let subject = $(this).attr('data-subject');

      $('.optionalTimingsROW').empty();

      $('#addnewBatch_TITLE').text(`Creating new batch for ${subject} (${grade})`);

      $('#addnewBatchSaveChanges_Button').attr('data-grade', grade);
      $('#addnewBatchSaveChanges_Button').attr('data-subject', subject);

      $("#modal-createNewBatch").modal("show");
    });

    //modal for changing the color
    $(".editColor").click(function() {

      //extract all the needed variables from its attribute
      let grade = $(this).attr('data-grade');
      let subject = $(this).attr('data-subject');
      let batchName = $(this).attr('data-batch');
      let color = $(this).attr('data-color');

      $('#batchTab_modal_newColor_Title').text(`Color change for ${decodeString(batchName)}`);
      $('#directColorChangeModalField').attr('value', color);
      $('#directColorChangeModalField').val(color);
      $('#colorPreviewColorChange').css('background', color);

      $('#modal_batchTab_changeColor_saveChanges').attr('data-grade', grade);
      $('#modal_batchTab_changeColor_saveChanges').attr('data-subject', subject);
      $('#modal_batchTab_changeColor_saveChanges').attr('data-batch', batchName);
      $('#modal_batchTab_changeColor_saveChanges').attr('data-color', color);

      $("#modal-changeColor").modal("show");
    });

    //modal change for changing name
    $(".editBatchName").click(function() {

      //extract all the needed variables from its attribute
      let grade = $(this).attr('data-grade');
      let subject = $(this).attr('data-subject');
      let batchName = $(this).attr('data-batch');

      $('#newBatchNameInput').val('');

      $('#batchTab_modal_newBatchName_Title').text(`Name change for ${decodeString(batchName)}`);

      $('#modal_batchTab_changeName_saveChanges').attr('data-grade', grade);
      $('#modal_batchTab_changeName_saveChanges').attr('data-subject', subject);
      $('#modal_batchTab_changeName_saveChanges').attr('data-batch', batchName);

      $("#modal-changeBatchName").modal("show");
    });

    //modal change for changing capacity
    $(".editCapacity").click(function() {

      //extract all the needed variables from its attribute
      let grade = $(this).attr('data-grade');
      let subject = $(this).attr('data-subject');
      let batchName = $(this).attr('data-batch');
      let filledSeats = $(this).attr('data-filledseats');
      let totalSeats = $(this).attr('data-totalseats');

      $('#batchTab_modal_newCapacity_Title').text(`Capacity change for ${decodeString(batchName)} | ${filledSeats}/${totalSeats}`);

      $('#newBatchCapacity').attr('min', filledSeats);

      $('#modal_batchTab_changeCapacity_saveChanges').attr('data-grade', grade);
      $('#modal_batchTab_changeCapacity_saveChanges').attr('data-subject', subject);
      $('#modal_batchTab_changeCapacity_saveChanges').attr('data-batch', batchName);
      $('#modal_batchTab_changeCapacity_saveChanges').attr('data-filledseats', filledSeats);
      $('#modal_batchTab_changeCapacity_saveChanges').attr('data-totalseats', totalSeats);

      $("#modal-changeCapacity").modal("show");
    });

    //modal change for changing tution
    $(".editTution").click(function() {

      //extract all the needed variables from its attribute
      let grade = $(this).attr('data-grade');
      let subject = $(this).attr('data-subject');
      let batchName = $(this).attr('data-batch');
      let tution = $(this).attr('data-tution');

      $('#batchTab_modal_newTution_Title').text(`Tution change ${decodeString(batchName)} | Currently: ${tution} BDT`);

      $('#modal_batchTab_changeTution_saveChanges').attr('data-grade', grade);
      $('#modal_batchTab_changeTution_saveChanges').attr('data-subject', subject);
      $('#modal_batchTab_changeTution_saveChanges').attr('data-batch', batchName);
      $('#modal_batchTab_changeTution_saveChanges').attr('data-tution', tution);

      $("#modal-changeTution").modal("show");
    });

    //modal change for changing tution
    $(".editOneBatchTiming").click(function() {

      //extract all the needed variables from its attribute
      let grade = $(this).attr('data-grade');
      let subject = $(this).attr('data-subject');
      let batchName = $(this).attr('data-batch');
      let keyIndex = $(this).attr('data-keyIndex');

      $('#DirectEditTime_batchTab').text(`Time change for ${decodeString(batchName)}`);

      $('#modal_batchTab_changeTiming_saveChanges').attr('data-grade', grade);
      $('#modal_batchTab_changeTiming_saveChanges').attr('data-subject', subject);
      $('#modal_batchTab_changeTiming_saveChanges').attr('data-batch', batchName);
      $('#modal_batchTab_changeTiming_saveChanges').attr('data-keyIndex', keyIndex);

      $("#modal-changeTiming").modal("show");
    });

    //modal change for changing tution
    $(".batchDelete").click(function() {

      //extract all the needed variables from its attribute
      let grade = $(this).attr('data-grade');
      let subject = $(this).attr('data-subject');
      let batchName = $(this).attr('data-batch');

      $('#batchTab_modal_deleteBatch_Title').text(`Deleting Batch ${decodeString(batchName)}`);

      $('#modal_batchTab_deleteBatch_saveChanges').attr('data-grade', grade);
      $('#modal_batchTab_deleteBatch_saveChanges').attr('data-subject', subject);
      $('#modal_batchTab_deleteBatch_saveChanges').attr('data-batch', batchName);

      let newWarningPopup = new WarningPopup();
      newWarningPopup.init(`Permanent data deletion`, `Caution Advised`); 

      $("#modal-deleteBatch").modal("show");
    });
  }
}

export default new Batch();
