import { auth } from "../firebase";
import db from "../Database";
import WarningPopup from "../WarningPopup";

class Settings {

  init(){
    this.initializeElements();
    this.initializeEventListeners();
  }


  initializeEventListeners() {
    let settingsObj = this;
    $('.btn-acct').click(function () {
      let $inputElem = $(this).parents('.input-group-btn').siblings('input').first();
      let inputData = $inputElem.val();
      let fieldType = $inputElem.attr('id');
      let warning = new WarningPopup();
  
      if (!inputData) return false;
  
      switch(fieldType) {
        case 'UserEmail':
          settingsObj.changeEmail(inputData).then(() => {
            $inputElem.val('');
            $inputElem.attr('placeholder', inputData);
          }).catch(err => {
            warning.init(`${err}`, 'Error');
            console.error(err);
          });
          break;
        case 'password':
          auth.currentUser.updatePassword(inputData)
            .then(() => $inputElem.val(''))
            .catch(err => {
              warning.init(`${err}`, 'Error');
              console.error(err);
            });
          break;
        default:
          db.update([], { [fieldType]: inputData }).then(() => {
            $inputElem.val('');
            $inputElem.attr('placeholder', inputData);
          }).catch(err => {
            warning.init(`${err}`, 'Error');
            console.error(err);
          });
      }
  
      return false;
    });
  }

  initializeElements() {
    let { UserName, UserInstitution, UserAddress, UserPhone } = db.getState();

    // populate the 'name' input field in account settings with the user's current name
    $("#UserName").attr("placeholder", UserName || "Name");

    // Similarly, populate the other fields
    $("#UserInstitution").attr("placeholder", UserInstitution || "Institution");
    $("#UserAddress").attr("placeholder", UserAddress || "Location");
    $("#UserPhone").attr("placeholder", UserPhone || "Phone");
    $("#UserEmail").attr(
      "placeholder",
      (auth.currentUser && auth.currentUser.email) || "Email"
    );
  }

  changeEmail(newEmail) {
    return auth.currentUser.updateEmail(newEmail).then(() => {
      return db.update([], { UserEmail: newEmail });
    });
  }
}

export default new Settings();
