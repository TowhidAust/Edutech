import { getPropertyFromAllBatches } from "../../misc";
import calendar from ".";
import { createCellEventElement } from "./elementMaker";
import calendarSidepanel from "./CalendarSidepanel";

class CalendarGrid {
  /**
   * Populate the calendar grid with dates
   * NOTE: This method does not automatically load in the events from that month.
   * @param {String} month
   * @param {String|Number} year
   *
   * @example
   * // This will result in the calendar getting populated with the dates of February, 2019
   * let calendarGrid = new calendarGrid();
   * calendarGrid.populateDates('February', '2019')
   */
  populateDates(month, year) {
    let date = new Date(`${month} 1 ${year}`);

    // Check whether the provided arguments are valid
    if (isNaN(date.getTime())) {
      console.error(
        `Invalid month:${month} or year:${year} argument(s) passed to calendarGrid.populateDates()`
      );
      return;
    }

    let week = 0;

    $(".calendar-box").empty();
    $("#active-month h3").text(`${month} ${year}`);

    do {
      let targetCell = $(`#week-${week} .day-${date.getDay()}`);

      targetCell.attr(
        "id",
        `${month.toLowerCase()}-${date.getDate()}-${date.getFullYear()}`
      );
      targetCell.append(/*html*/ `<div class="calendar-date">${date.getDate()}</div>`);
      targetCell.append(
        /*html*/ `<div class="events-in-calendar-cell" data-numberofevents="0"></div>`
      );
      targetCell.append(/*html*/ `<div class="more" style="display: none;"></div>`);

      // increment the date object
      date.setDate(date.getDate() + 1);

      let nextDateIsSunday = date.getDay() === 0;
      if (nextDateIsSunday) week++;
    } while (date.getDate() != 1);
  }

  /**
   * Load events from a specific month into the Calendar grid UI
   * @param {String} month
   * @param {Number|String} year
   */
  renderEvents(month, year) {
    let dateObj = new Date(`${month} 1 ${year}`);

    if (isNaN(dateObj.getTime())) {
      console.error(
        `Invalid month: ${month} or year: ${year} argument(s) passed to CalendarGrid.renderEvents()`
      );
      return;
    }

    let allEvents = getPropertyFromAllBatches("Events");

    allEvents.forEach(event => {
      this.insertEventIntoCell(event);
    });
  }

  /**
   * Loads an event into its corresponding calendar cell
   * NOTE: This method will only load an event into the calendar if that event
   *       is scheduled at a date in the currently displayed month in the calendar
   * @param {Event} event 
   */
  insertEventIntoCell(event) {
    let eventTime = new Date(event.startTime);

    if (isNaN(eventTime.getTime())) {
      console.error(`Invalid event object passed to CalendarGrid.insertEventIntoCell()`);
      return;
    }

    if (eventTime.getMonthName() === calendar.displayedMonth) {
      let cellId = `${eventTime
        .getMonthName()
        .toLowerCase()}-${eventTime.getDate()}-${eventTime.getFullYear()}`;

      let eventsContainer = $(`#${cellId} .events-in-calendar-cell`);

      let hidden = false;

      let numberOfEventsInCell = Number(eventsContainer.attr("data-numberofevents"));

      numberOfEventsInCell++;
      eventsContainer.attr("data-numberofevents", numberOfEventsInCell);

      if (numberOfEventsInCell > 1) {
        let moreEventsElem = $(`#${cellId} .more`);
        moreEventsElem.text(`${numberOfEventsInCell - 1} more events...`);
        hidden = true;
        moreEventsElem.show();
      }

      eventsContainer.append(createCellEventElement(event, hidden));
    }
  }

  initEventListeners() {
    $(".calendar-box").click(function() {
      let date = $(this).attr("id").split('-').join(' ');
      calendar.selectedDate = date;
      let dateObj = new Date(date);
      calendarSidepanel.renderEvents(dateObj);

      $(".selected-date").removeClass("selected-date");
      $(this).addClass("selected-date");
    });
  }

  /**
   * Marks current date if the displayed Month is the present month
   */
  markTodaysDate() {
    $(".today").removeClass("today");
    let today = new Date();
    let { displayedMonth, displayedYear } = calendar;

    if (
      today.getMonthName() === displayedMonth &&
      today.getFullYear() === Number(displayedYear)
    ) {
      let cell = $(
        `#${displayedMonth.toLowerCase()}-${today.getDate()}-${today.getFullYear()}`
      );
      cell.addClass("today");
    }
  }
}

export default new CalendarGrid();