import { preloadImage, resizeImage } from "../misc";
import store from "../store";
import { auth, storage, database } from "../firebase";
import WarningPopup from "../WarningPopup";
import SuccessPopup from "../SuccessPopup";

class Avatar {
    init() {
        let url = store.getState().avatarURL;
        let avatarPromise = preloadImage(url);

        avatarPromise.then($avatarElement => {
            let $sidebarAvatar = $avatarElement.clone();
            $sidebarAvatar.addClass("avatar img-circle");
            $sidebarAvatar.attr("width", "55");
            $sidebarAvatar.attr("alt", "Profile Picture");

            $(".user-link").prepend($sidebarAvatar);

            let $settingsAvatar = $avatarElement.clone();
            $settingsAvatar.addClass("avatar img-rounded img-thumbnail");
            $settingsAvatar.attr("width", "200");
            $sidebarAvatar.attr("alt", "Profile Picture");

            $("#avatar-in-settings").append($settingsAvatar);
        });

        this.initEventListeners();

        return avatarPromise;
    }

    initEventListeners() {
      let avatarObj = this;
      $(".change-avatar").click(function (event) {
        let fileInputElem = $(this).siblings(".upload-avatar").first();
        fileInputElem.trigger("click");
        
        fileInputElem.change(function () {
          // alert("New image selected!");
          resizeImage(400, 400, fileInputElem[0]).then(resizedImage => {
            avatarObj._uploadAvatarToFirebase(resizedImage.data, resizedImage.fileName, "avatar").then(
              () => {
                $(".avatar").attr("src", resizedImage.data);
                new SuccessPopup().init(`Your avatar has been updated!`, 'Upload Success');
              });
          }).catch(err => {
            let warning = new WarningPopup();
            warning.init(err, 'Error');
            console.error(err);
          });
        });
        
        event.preventDefault();
      });
    }

    _uploadAvatarToFirebase(imageData, fileName) {
      let fileExtension = fileName.split(".").pop();
      let uid = auth.currentUser.uid;
  
      let storageRef = `images/${uid}/avatar.${fileExtension}`;
      let uploadPromise = storage.ref(storageRef).putString(imageData, "data_url");
  
      uploadPromise
          .then(snapshot => {
              snapshot.ref.getDownloadURL().then(url => {
                  database.ref(`USERS/${uid}/avatarURL`).set(url);
              });
          })
          .catch(err => {
            new WarningPopup().init(`${err}`, 'Upload Error')
            console.error(err);
          });
  
      $(".close-sui-popup").trigger("click");
      return uploadPromise;
  }
}

export default new Avatar();