import { getPropertyFromAllBatches, getDataAttributes, iterateData } from "../../misc";
import { createMessageElement } from "./elementMaker";
import store from "../../store";
import { auth, database } from "../../firebase";
import db from "../../Database";

import "./messaging.css";

class Messaging {
  init() {
    this.getAllMessagesFromStore().forEach(messageObj => {
      $("#messages-list").append(createMessageElement(messageObj));
    });

    this.setBadge();
  }

  setBadge() {
    let numberOfUnseenMessages = this.getAllMessagesFromStore().reduce((unseenMsgs, currentMessage) => {
      if (!currentMessage.seen) return unseenMsgs + 1;
      else return unseenMsgs 
    }, 0);
    
    let $badgeElement = $('#messages-badge');
    
    if (numberOfUnseenMessages == 0) {
      $badgeElement.text(numberOfUnseenMessages);
      $badgeElement.hide();
    } else {
      $badgeElement.text(numberOfUnseenMessages);
      $badgeElement.show();
    }
  }

  initListeners() {
    this._domListeners();
    this._firebaseEventListeners();
  }

  /**
   * @typedef {Object} Message
   * @property {String} uid
   * @property {Number} time
   * @property {String} grade
   * @property {Boolean} seen
   * @property {String} subject
   * @property {String} content
   * @property {String} username
   * @property {String} batchName
   */
  /**
   * Retrieves and sorts messages from ALL BATCHES across all subjects and grades
   * @returns {Array<Message>}
   */
  getAllMessagesFromStore() {
    let allMessages = getPropertyFromAllBatches("GlobalMessages"); // get all the messages from the store as an array
    allMessages.sort((a, b) => b.time - a.time); // sort messages according to time

    return allMessages;
  }
  
  /**
   * Initializes all DOM event listeners related to messaging
   */
  _domListeners() {
    $('#messages-list li').click(this._messageClickHandler);

    $('#reply-msg-button').click(function () {
      let replyModal = $('#reply-modal');

      let { studentname, grade, subject, batchname } = getDataAttributes(replyModal); 

      replyModal.find('.modal-header').text(`Reply to: ${studentname} - ${grade} ${subject} ${batchname}`);
      replyModal.modal('show', { backdrop: 'static' });
    });
  }

  /**
   * This listener is run when a user clicks on a message in the dropdown menu
   */
  _messageClickHandler() {
    let { studentname, seen, grade, subject, batchname, fullmessage, studentuid } = getDataAttributes(this);
    
    if (seen == 'false') {
      let msgKey = $(this).attr('id');
      db.update(['UserClass', grade, subject, 'Streams', batchname, 'GlobalMessages', msgKey], { seen: true });
      
      let unreadMessages = Number($('#messages-badge').text());
      unreadMessages = unreadMessages - 1;
      $('#messages-badge').text(`${unreadMessages}`);

      if (unreadMessages == 0) $('#messages-badge').hide();
      
      $(this).find('strong').first().remove();
      $(this).find('.line').first().prepend(studentname);
    }

    // Inject message data into the '#message-modal' modal
    let messageModal = $('#message-modal');
    messageModal.find('.modal-header').text(`${studentname} - ${grade} ${subject} ${batchname}`);
    messageModal.find('.modal-body').text(`${fullmessage}`);
    messageModal.modal('show');

    // Set message details on the REPLY MODAL as data attributes
    let replyModal = $('#reply-modal');
    replyModal.attr('data-studentname', studentname);
    replyModal.attr('data-grade', grade);
    replyModal.attr('data-subject', subject);
    replyModal.attr('data-batchname', batchname);
    replyModal.attr('data-fullmessage', fullmessage);
    replyModal.attr('data-studentuid', studentuid);
  }

  /**
   * Listen for new messages 
   */
  _firebaseEventListeners() {
    iterateData(
      null,
      null,
      batch => {
        let uid = auth.currentUser.uid;
        let { grade, subject, name } = batch;
  
        let messagesRef = `USERS/${uid}/UserClass/${grade}/${subject}/Streams/${name}/GlobalMessages`;
  
        database.ref(messagesRef).on("child_added", snapshot => {
          // check if the arriving message already exists in the store
          let messageExists = this.getAllMessagesFromStore().find(message => {
            return message.key === snapshot.key;
          });
          
          // only add the message if it is NOT already in the store
          if (!messageExists) {
  
            let message = {
              ...snapshot.val(),
              grade,
              subject,
              batchName: name,
              key: snapshot.key
            };
            $("#messages-list").prepend(createMessageElement(message));
            
            // Re assign message click handlers
            $('#messages-list li').off('click', this._messageClickHandler);
            $('#messages-list li').click(this._messageClickHandler);

            let unreadMessages = $('#messages-badge').text();
            $('#messages-badge').text(`${Number(unreadMessages) + 1}`);
            $('#messages-badge').show();

            store.update(
              [
                "UserClass",
                grade,
                subject,
                "Streams",
                name,
                "GlobalMessages",
                snapshot.key
              ],
              snapshot.val()
            );
          }
        });
      }
    );
  }
}

export default new Messaging();