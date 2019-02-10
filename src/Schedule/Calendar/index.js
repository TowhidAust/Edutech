import calendarSidepanel from "./CalendarSidepanel";

import "./calendarStyle.css";
import { getDataAttributes } from "../../misc";

import store from "../../store";
import calendarGrid from "./CalendarGrid";
import db from "../../Database";

class Calendar {
  constructor() {
    this.displayedMonth = '';
    this.displayedYear = '';
    this.selectedDate  = '';
  }

  init() {
    //store.time is corrected absolute time
    let today = new Date(store.time);
    this.renderMonth(today.getMonthName(), today.getFullYear());
    this.selectDate(`${today.getMonthName()} ${today.getDate()} ${today.getFullYear()}`);

    calendarGrid.initEventListeners();
    
    calendarSidepanel.init();

    this.initializeEventListeners();
  }

  postLoad(){
    // Automatically show new date at 12AM
    let today = new Date(store.time);
    let tomorrow = new Date(store.time);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0);
    tomorrow.setMinutes(0);
    tomorrow.setSeconds(0);
    let numberOfSecondsUntilTomorrow = tomorrow.getTime() - today.getTime();

    setTimeout(() => {
      this.renderMonth(tomorrow.getMonthName(), tomorrow.getFullYear());
      this.selectDate(`${tomorrow.getMonthName()} ${tomorrow.getDate()} ${tomorrow.getFullYear()}`);
    }, numberOfSecondsUntilTomorrow * 1000);
  }

  reload() {
    let today = new Date(store.time);
    this.renderMonth(today.getMonthName(), today.getFullYear());
    this.selectDate(`${today.getMonthName()} ${today.getDate()} ${today.getFullYear()}`);

    calendarSidepanel.init();
  }

  initializeEventListeners() {
    $("#next-month-button").click(() => {
      this.changeMonth('next');
    });
    
    $("#prev-month-button").click(() => {
      this.changeMonth("previous");
    });

    calendarSidepanel.initializeEventListeners();
  }

  /**
   * Takes month and year, then renders dates from that month on the calendar
   * @param {String} month
   * @param {String|Number} year
   */
  renderMonth(month, year) {
    let date = new Date(`${month} 1 ${year}`);
    
    // Check whether the provided arguments are valid
    if (isNaN(date.getTime())) {
      console.error(`Invalid month:${month} or year:${year} argument(s) passed to calendar.renderMonth()`);
      return;
    }

    // Update the calendar object's state
    this.displayedMonth = month;
    this.displayedYear = year;
    
    calendarGrid.populateDates(month, year); 
    calendarGrid.renderEvents(month, year);
    calendarGrid.markTodaysDate();
  }

  /**
   * Increments or decrements the month shown on the calendar based on the
   * argument passed. E.g. if the displayed month is 'January 2019', calling
   * calendar.changeMonth("next") will change it to 'February 2019'.
   * @param {'previous'|'next'} direction
   */
  changeMonth(direction) {
    // Check if argument is valid
    if (
      typeof direction != "string" ||
      (direction.toLowerCase() != "next" && direction.toLowerCase() != "previous")
    ) {
      console.error(`Invalid argument: ${direction} passed to calendar.changeMonth(). You have to pass either 'next' or 'previous' as an argument.`);
      return;
    }
    
    let monthIncrement = 0;
    if (direction === 'next') monthIncrement = 1;
    else if (direction === 'previous') monthIncrement = -1;

    let d = new Date(`${this.displayedMonth} 1 ${this.displayedYear}`); // Construct a Date instance from current date
    d.setMonth(d.getMonth() + monthIncrement); // Increment/Decrement the month index in that date object
    this.renderMonth(d.getMonthName(), d.getFullYear()); // Render the incremented/decremented month/year to the UI

    $(".selected-date").removeClass("selected-date");
    $(".event-entries").empty();
  }

  /**
   * @typedef {Object} Event
   * @property {String} name
   * @property {String} subject
   * @property {String} grade
   * @property {String} batchName
   * @property {Number} startTime - unix timestamp
   * @property {Number} endTime - unix timestamp
   */
  /**
   * Takes an event object, adds it to firebase and UI
   * @param {Event} event
   * 
   * @returns {Promise}
   */
  createNewEvent(event) {
    let { name, grade, batchName, subject, startTime, endTime } = event;

    if (!event || !name || !subject || !grade || !batchName || !startTime || !endTime) {
      console.error("Invalid event object passed to calendar.insertEvent()");
      return;
    }

    let path = ['UserClass', grade, subject, 'Streams', batchName, 'Events'];
    let pushPromise = db.push(path, { name, startTime, endTime })
    
    pushPromise.then(() => {
      event = { ...event, key: pushPromise.key };
      calendarGrid.insertEventIntoCell(event);
      
      // Check whether the new event's date is currently selected in the calendar.
      // If it is, then the event is also rendered in the calendar side panel
      let dateObj = new Date(event.startTime);
      this.selectDate(`${dateObj.getMonthName()} ${dateObj.getDate()} ${dateObj.getFullYear()}`);
    });

    return pushPromise;
  }

  /**
   * Uses an event's unique key to remove it from calendar UI and firebase
   * @param {{key: String}} event
   */
  removeEvent(event) {
    if (!event || !event.key) {
      console.error("An invalid event was passed to calendar.removeEvent()");
      return;
    }

    let cellElement = $(`#${event.key}`);
    let { grade, key, batchname, subject } = getDataAttributes(cellElement);

    let path = ['UserClass', grade, subject, 'Streams', batchname, 'Events', key];
    let removePromise = db.remove(path);
      
    removePromise.then(() => {
      this.renderMonth(this.displayedMonth, this.displayedYear); // re-render the calendar
      $(`.${event.key}`).remove(); // Removes the event DOM element from the calendar sidepanel
    });

    return removePromise;
  }

  /**
   * Selects or highlights a specific date on the calendar
   * @param {String} date - FORMAT: 'Month Date Year'
   * 
   * @example
   * // Selects 21st Feb 2019 on the calendar
   * let cal = new Calendar();
   * cal.selectDate('February 21 2019');
   */
  selectDate(date) {
    let [ month, day, year ] = date.split(' ');

    let dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      console.error(`Invalid date string: ${date} passed to calendar.selectDate()`);
      return;
    }

    this.selectedDate = date;

    if (
      month.toLowerCase() != this.displayedMonth.toLowerCase() ||
      year != this.displayedYear
    ) {
      this.renderMonth(month, year);
    }

    let cellId = `#${month.toLowerCase()}-${day}-${year}`;
    $(".selected-date").removeClass("selected-date");
    $(cellId).addClass("selected-date");
    calendarSidepanel.renderEvents(dateObj);
  }
}

export default new Calendar();
