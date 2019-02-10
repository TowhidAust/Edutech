import { createEventElementForEventPane } from "./elementMaker";
import { iterateData, decodeString, getDataAttributes } from "../../misc";
import calendar from "./index";
import WarningPopup from "../../WarningPopup";
import SuccessPopup from "../../SuccessPopup";

class CalendarSidepanel {
  init() {
    // Insert available grade values to the new event form
    iterateData(grade => {
      $("#new-event-grade").append(
      /*html*/ `<option value="${grade.name}">${grade.name}</option>`
      );
    });
  }

  initializeEventListeners() {
    $("#new-event-button").click(function () {
      $("#events").fadeOut("fast", () => $("#new-event-form").fadeIn("fast"));
    });

    $('#EventStartTime_ID').change(function() {
      let [ hour, minute ] = $(this).val().trim().split(':');

      let $endTimeSelector = $('#EventEndTime_ID');
      $endTimeSelector.children('option').not(':first').remove();

      while(!(hour == 23 && minute == 30)) {
        if (Number(minute) === 0) minute = 30;
        else if (Number(minute) === 30) {
          minute = 0;
          hour = Number(hour) + 1;
        }

        minute = (minute < 10) ? '0' + minute : minute; // if minute is less than 10, add padding to make it look nice
        $endTimeSelector.append(/*html*/`<option value="${hour}:${minute}">${hour}:${minute}</option>`);
      }
    });

    $("#add-event-button").click(formSubmissionEvent => {
      // NOTE: The 'this' keyword in an arrow function is assigned lexically.
      //       So, here, it is not the element selected by jQuery.
      
      formSubmissionEvent.preventDefault();
      let name = $("#new-event-name").val();

      let date = $("#new-event-date").val();
      let start = $("#EventStartTime_ID").val();
      let end = $("#EventEndTime_ID").val();

      let startTime = new Date(`${date} ${start}`).getTime();
      let endTime = new Date(`${date} ${end}`).getTime();

      let grade = $("#new-event-grade").val();
      let subject = $("#new-event-subject").val();
      let batch = $("#new-event-batch").val();

      let event = { name, startTime, endTime };
      let warning = new WarningPopup();

      if (!name || !start || !end || !grade || !subject || !batch || !date) {
        warning.init("Please fill up all the fields of the form before clicking on 'ADD'", 'Missing data in form');
        return;
      }

      calendar
        .createNewEvent({ ...event, grade, subject, batchName: batch })
        .then(() => {
          $("#new-event-form").fadeOut("fast", () => $("#events").fadeIn("fast"));
          let success = new SuccessPopup;
          success.init('New event created', 'Success');
          this.clearNewEventForm();
        })
        .catch(err => {
          warning.init("Could not add event. Please try again later.", "Error");
          console.error(err);
        });       
    });

    $("#new-event-grade").change(function () {
      let selectedGrade = $(this).val();
      $(".subject-option").remove();
      $(".batch-option").remove();

      iterateData(null, subject => {
        if (subject.grade === selectedGrade) {
          $("#new-event-subject").append(/*html*/ `
            <option class="subject-option" value="${subject.name}">
              ${subject.name}
            </option>
          `);
        }
      });

      let subjectSelector = $("#new-event-subject");
      subjectSelector.removeAttr("disabled");
      subjectSelector.prop("selectedIndex", 0);

      let batchSelector = $("#new-event-batch");
      batchSelector.prop("selectedIndex", 0);
    });

    $("#new-event-subject").change(function () {
      $(".batch-option").remove();
      let selectedSubject = $(this).val();
      let selectedGrade = $("#new-event-grade").val();

      iterateData(null, null, batch => {
        if (batch.grade === selectedGrade && batch.subject === selectedSubject) {
          $("#new-event-batch").append(/*html*/ `
            <option class="batch-option" value="${batch.name}">
              ${decodeString(batch.name)}
            </option>
          `);
        }
      });

      let batchSelector = $("#new-event-batch");
      batchSelector.removeAttr("disabled");
      batchSelector.prop("selectedIndex", 0);
    });

    $("#hide-new-event-form").click(function (event) {
      $("#new-event-form").fadeOut("fast", () => $("#events").fadeIn("fast"));
      event.preventDefault();
    });
  }

  /**
   * Takes a date object and inserts events from that date to the calendar sidepanel.
   * The list of events from that date is retrieved from the corresponding '.calendar-box' element.
   * @param {Date} dateObj - Instance of the Date constructor
   */
  renderEvents(dateObj) {
    let targetCell = $(`#${dateObj.getMonthName().toLowerCase()}-${dateObj.getDate()}-${dateObj.getFullYear()}`);

    let monthIndex = dateObj.getMonth() + 1;
    let month = monthIndex < 10 ? "0" + monthIndex : monthIndex;

    let date = dateObj.getDate();
    let d = date < 10 ? "0" + date : date;

    $("#new-event-date").attr("value", `${dateObj.getFullYear()}-${month}-${d}`); //example 2019-01-18

    let events = $(targetCell).find(".event-in-cell");
    $(".event-entries").empty();

    events.each(function () {
      let event = getDataAttributes(this);
      $(".event-entries").append(createEventElementForEventPane(event));
    });

    $(".delete-event").off();
    $(".delete-event").click(function(){
        let eventDOMElement = $(this).parents(".event");

        let { key } = getDataAttributes(eventDOMElement);
        calendar.removeEvent({ key });
    });

    $("#new-event-form").fadeOut("fast", () => $("#events").fadeIn("fast"));
  }

  /**
   * Resets the new event form
   */
  clearNewEventForm() {
    $("#new-event-name").val("");
    // $("#new-event-date").val("");
    $("#EventStartTime_ID").val("");
    $("#EventEndTime_ID").val("");
    $("#new-event-grade").prop("selectedIndex", 0);
    $("#new-event-subject").prop("selectedIndex", 0);
    $("#new-event-batch").prop("selectedIndex", 0);
  }
}


export default new CalendarSidepanel();

