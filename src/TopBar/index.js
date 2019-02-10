import messaging from "./Messaging";
import Notifications from "./Notifications";
import LogOut from "./LogOut";

class TopBar {
  init() {
      messaging.init();
      Notifications.prototype.bindNotificationEvents();
      LogOut.init();
      this.initListeners();
  }

  initListeners() {
    messaging.initListeners();
  }
}

export default new TopBar(); 