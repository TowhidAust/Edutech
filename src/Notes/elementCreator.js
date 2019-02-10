/**
 * Takes an Object as an argument and returns a string representing a sidebar
 * element on the Notes Tab.
 * @param {{ key: String, title: String, body: String }} note
 * @returns {String}
 */
export function createNoteSidebarElement(note) {
  const { key, title, body } = note;

  if (!key) {
    console.error(`Invalid note object: ${note} passed to createNoteSidebarElement()`);
    return '';
  }
  
  return /*html*/ `
    <li id="${key}">
      <a href="#">
        <strong>${title}</strong>
        <span>${body}</span>
      </a>
      <button class="note-close">×</button>
      <div class="content">
        ${title}
        ${body}
      </div>
    </li>
  `;
}