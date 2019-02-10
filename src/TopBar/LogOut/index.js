
import { auth } from "../../firebase";
import WarningPopup from "../../WarningPopup/"
import SuccessPopup from "../../SuccessPopup/";

class LogOut {
    init(){

        $(".logoutMain").click(function(){

            auth.signOut().then(function () {
                let newSuccessPopup = new SuccessPopup();
                newSuccessPopup.init(`Relocating to Sign In Page`, `Signout Successful`);

                window.location.href = "/Login.html";
            }, function (error) {
                console.log(error);

                let newWarningPopup = new WarningPopup();
                newWarningPopup.init(`Could not signout`, `Signout Error`);
            });


        });
    }
}

export default new LogOut();