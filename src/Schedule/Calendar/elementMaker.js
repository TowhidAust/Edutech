import { formatAMPM } from "../../misc";

export function createCellEventElement(event, hidden, cssClass) {
    let {
        name,
        startTime,
        starttime,
        endTime,
        endtime,
        key,
        subject,
        grade,
        batchName,
        batchname,
        batch
    } = event;
    let style = hidden ? "display: none;" : "";

    return /*html*/ `
    <div 
      id="${key}"
      class="event-in-cell regular-event flex-column justify-center
            ${key} ${cssClass || ""}"
      data-name="${name}"
      data-key="${key}"
      data-startTime="${starttime || startTime}"
      data-endTime="${endTime || endtime}"
      data-subject="${subject}"
      data-grade="${grade}"
      data-batchName="${batchname || batchName || batch || ""}"
      style="${style}"
    >
      ${name.substring(0, 12)}${name.length > 12 ? "..." : ""}
    </div>
  `;
}

export function createEventElementForEventPane(event) {
    let {
        name,
        starttime,
        startTime,
        endtime,
        endTime,
        key,
        subject,
        grade,
        batchname,
        batchName,
        batch
    } = event;

    return /*html*/ `
    <div
      class="event regular-event ${key}"
      data-key="${key}"
      data-subject="${subject}"
      data-grade="${grade}"
      data-batchName="${batchname || batchName || batch}"
    >
      <div class="event-name-in-pane">${name}</div>
      
      <div>
        <i class="entypo-clock"></i>
        ${formatAMPM(new Date(Number(starttime || startTime)))} - 
        ${formatAMPM(new Date(Number(endtime || endTime)))}
      </div>
      
      <div>
        <i class="entypo-users"></i>
        ${grade} ${subject} ${batchname || batchName || batch}
      </div>
      <div class="bottom-section flex-row">
        <div class="delete-event red ml-auto pointer">
          <i class="entypo-cancel"></i>Delete
        </div>
      </div>
    </div>
  `;
}