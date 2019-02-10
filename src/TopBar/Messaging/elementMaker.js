import { getMonthName, formatAMPM } from '../../misc';

/**
   * @typedef {Object} Message
   * @property {String} uid
   * @property {String} key
   * @property {Number} time
   * @property {String} grade
   * @property {Boolean} seen
   * @property {String} subject
   * @property {String} content
   * @property {String} username
   * @property {String} batchName
   */
  /**
   * @param {Message} messageObj
   * @returns {String}
   */
export function createMessageElement(messageObj) {
  let { content, time, uid, key, username, grade, subject, batchName, seen } = messageObj;

  let d = new Date(time);
  let timeString = `${getMonthName(d)} ${d.getDate()}, ${formatAMPM(d)}`;

  return /*html*/ `
    <li 
      class="active" 
      id="${key}" 
      data-studentuid="${uid}"
      data-studentname="${username}"
      data-grade="${grade}"
      data-seen="${seen}"
      data-subject="${subject}"
      data-batchname="${batchName}"
      data-fullmessage="${content}"
    >
      <a href="#">
        <span class="line">
          ${ seen ? username : /*html*/`<strong>${username}</strong>` }
          - ${timeString}
        </span>

        <span class="line desc small">
          ${content.substring(0, 50)}${content.length > 50 ? "..." : ""}
        </span>
      </a>
    </li>
  `;
}
