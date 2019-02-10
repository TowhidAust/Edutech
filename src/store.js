import unset from "lodash-es/unset";
import set from "lodash-es/set";
import get from "lodash-es/get";

class Store {
  //corrected time can always be accessed by store.time variable
  constructor() {
    this.store = {};
  }

  init(initialState) {
    this.store = initialState;
  }

  getState() {
    return this.store;
  }

  getNestedData(path) {
    return get(this.store, path);
  }

  update(path, data) {
    if (!(path instanceof Array)) {
      console.error('Non array passed to store.update()');
      return;
    }

    set(this.store, path, data)
  }

  remove(path) {
    if (!(path instanceof Array)) {
      console.error("Non array passed as path to store.remove()");
      return;
    }
    
    unset(this.getState(), path);
  }

  get time() {
    if (!this.getState().timedelta) {
      console.error("You have to run db.init() before accessing db.time.");
      return -1;
    }
    
    return Date.now() + this.getState().timedelta;
  }
}

export default new Store();
