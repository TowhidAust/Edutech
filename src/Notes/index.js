/* global TweenMax, TimelineMax */ // Tells eslint that TweenMax and TimelineMax are globals
import store from "../store";
import WarningPopup from "../WarningPopup";
import { createNoteSidebarElement } from "./elementCreator";
import db from "../Database";
import Database from "../Database";


class Notes {
  init() {
    let notesObject = this;
    try {
      /**
       *	Neon Notes Script
       *
       *	Developed by Arlind Nushi - www.laborator.co
       */

      var neonNotes = neonNotes || {};

      ; (function ($, window, undefined) { /* eslint-disable-line */ // Tells eslint to ignore this line when linting
        "use strict";

        $(document).ready(function () {
          neonNotes.$container = $(".notes-env");

          $.extend(neonNotes, { isPresent: neonNotes.$container.length > 0,
            noTitleText: "Untitled", noDescriptionText: "(No content)",
            $currentNote: $(null), $currentNoteTitle: $(null), $currentNoteDescription: $(null), $currentNoteContent: $(null),
            addNote() {
              var $note = $('<li><a href="#"><strong></strong><span></li></a></li>');

              $note
                .append('<div class="content"></div>')
                .append('<button class="note-close">&times;</button>');

              $note.find("strong").html(neonNotes.noTitleText);
              $note.find("span").html(neonNotes.noDescriptionText);

              let notePushPromise = Database.push(
                ['Notes'], 
                {
                  title: neonNotes.noTitleText,
                  body: neonNotes.noDescriptionText
                }
              );
                
              notePushPromise.then(() => {
                  neonNotes.$notesList.prepend($note); // Add note to the list

                  TweenMax.set($note, { autoAlpha: 0 });

                  var tl = new TimelineMax();

                  tl.append(TweenMax.to($note, 0.1, {
                      css: { autoAlpha: 1 }
                    }));
                  tl.append(TweenMax.to($note, 0.15, {
                      css: { autoAlpha: 0.8 }
                    }));
                  tl.append(TweenMax.to($note, 0.15, {
                      css: { autoAlpha: 1 }
                    }));

                  neonNotes.$notesList.find("li").removeClass("current");
                  $note.addClass("current");
                  $note.attr('id', notePushPromise.key);

                  neonNotes.$writePadTxt.focus();

                  neonNotes.checkCurrentNote();

                  neonNotes.$notesList.off();
                  neonNotes.$notesList.on("click", "li a", neonNotes.noteEntryClickListener);
                  neonNotes.$notesList.on("click", "li .note-close", neonNotes.deleteNoteListener);
                })
                .catch(err => {
                  let newWarningPopup = new WarningPopup();
                  newWarningPopup.init(err, `Note could not be added`);
                });
            },
            checkCurrentNote() {
              var $current_note = neonNotes.$notesList.find("li.current").first();

              if ($current_note.length) {
                neonNotes.$currentNote = $current_note;
                neonNotes.$currentNoteTitle = $current_note.find("strong");
                neonNotes.$currentNoteDescription = $current_note.find("span");
                neonNotes.$currentNoteContent = $current_note.find(".content");
                
                neonNotes.$writePadTxt
                .val($.trim(neonNotes.$currentNoteContent.html()))
                .trigger("autosize.resize");
                
                neonNotes.currentNoteFirebaseKey = $current_note.attr('id');
              } else {
                var first = neonNotes.$notesList.find("li:first:not(.no-notes)");

                if (first.length) {
                  first.addClass("current");
                  neonNotes.checkCurrentNote();
                } else {
                  neonNotes.$writePadTxt.val("Click on the 'New Note' button to add a note.");
                  neonNotes.$currentNote = $(null);
                  neonNotes.$currentNoteTitle = $(null);
                  neonNotes.$currentNoteDescription = $(null);
                  neonNotes.$currentNoteContent = $(null);
                }
              }
            },
            // on keyup
            updateCurrentNoteText() {
              var text = $.trim(neonNotes.$writePadTxt.val());

              if (neonNotes.$currentNote.length) {
                var title = "",
                  description = "";

                if (text.length) {
                  var _text = text.split("\n"),
                    currline = 1;

                  for (var i = 0; i < _text.length; i++) {
                    if (_text[i]) {
                      if (currline == 1) {
                        title = _text[i];
                      } else if (currline == 2) {
                        description = _text[i];
                      }

                      currline++;
                    }

                    if (currline > 2) break;
                  }
                }

                neonNotes.$currentNoteTitle.text(title.length ? title : neonNotes.noTitleText);
                neonNotes.$currentNoteDescription.text(description.length ? description : neonNotes.noDescriptionText);
                neonNotes.$currentNoteContent.text(text);
              } else if (text.length) {
                neonNotes.addNote();
              }
            },
            loadNotes() {
              let notes = db.getState().Notes;

              for (let key in notes) {
                let note = notes[key];
                note.key = key;
                neonNotes.$notesList.prepend(createNoteSidebarElement(note));
              }
            },
            updateNoteOnServer(key, title, body) {
              let noteUpdatePromise = db.update(['Notes', key], { title, body });
              return noteUpdatePromise;
            },
            noteEntryClickListener(ev) {
              ev.preventDefault();

              neonNotes.$notesList.find("li").removeClass("current");
              $(this).parent().addClass("current");

              neonNotes.checkCurrentNote();
            },
            deleteNoteListener(ev) {
              ev.preventDefault();

              let $note = $(this).parent();
              let firebaseKey = $note.attr('id');

              let removeNotePromise = db.remove(['Notes', firebaseKey]);

              removeNotePromise.then(() => {
                let tl = new TimelineMax();
                
                store.remove(['Notes', firebaseKey]);
                
                tl.append(TweenMax.to($note, 0.15, {
                    css: { autoAlpha: 0.2 },
                    onComplete: function() {
                      $note.slideUp("fast", function() {
                        $note.remove();
                        neonNotes.checkCurrentNote();
                      });
                    }
                  }));
              });

              return removeNotePromise;
            }
          });

          // Mail Container Height fit with the document
          if (neonNotes.isPresent) {
            neonNotes.$notesList = neonNotes.$container.find('.list-of-notes');
            neonNotes.$writePad = neonNotes.$container.find('.write-pad');
            neonNotes.$writePadTxt = neonNotes.$writePad.find('textarea');

            neonNotes.$addNote = neonNotes.$container.find('#add-note');

            neonNotes.loadNotes();

            neonNotes.$addNote.on('click', function (ev) { // eslint-disable-line
              neonNotes.addNote();
            });

            neonNotes.$writePadTxt.on('keyup', function (ev) { // eslint-disable-line            
              neonNotes.updateCurrentNoteText();

              let [, ...lines] = neonNotes.$currentNoteContent.text().split('\n');
              let contentBody = lines.join('\n').trim();
              
              if (notesObject.updateTimeout) clearTimeout(notesObject.updateTimeout);
              notesObject.updateTimeout = setTimeout(neonNotes.updateNoteOnServer, 5000, neonNotes.currentNoteFirebaseKey, neonNotes.$currentNoteTitle.text(), contentBody);
            });

            neonNotes.checkCurrentNote();

            // note entries
            neonNotes.$notesList.on("click", "li a", neonNotes.noteEntryClickListener);

            // delete button
            neonNotes.$notesList.on('click', 'li .note-close', neonNotes.deleteNoteListener);
          }
        });

      })(jQuery, window);
    } catch(err) {
      console.error(err);
    }
  }
}

export default new Notes();