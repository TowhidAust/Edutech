import { database, auth } from "./firebase";
import store from "./store";
import WarningPopup from "./WarningPopup";

class Database {
  /**
   * Initializes the local store with data and time from firebase server. Returns
   * a Promise that resolves to the store state
   * @returns {Promise<Object>}
   */
  initialRead() {
    let userDataPromise = database.ref(`USERS/${auth.currentUser.uid}`).once("value");

    let serverTimePromise = database.ref("/.info/serverTimeOffset").once("value");

    return Promise.all([userDataPromise, serverTimePromise]).then(
      ([userDataSnapshot, serverTimeSnapshot]) => {
        let userData = userDataSnapshot.val();
        let serverTimeOffset = serverTimeSnapshot.val();

        store.init(userData);
        store.update(["timedelta"], serverTimeOffset);

        return store.getState();
      }
    );
  }

  getState() {
    return store.getState();
  }

  /**
   *
   * @param {Array<String>} pathArray
   */
  getNestedData(pathArray) {
    return store.getNestedData(pathArray);
  }

  /**
   * Update the 'path' in the database with 'data'
   * @param {Array<String>} pathArray
   * @param {Object} dataObj
   * @returns {Promise<>} - Returns a promise that fulfills to undefined
   */
  update(pathArray, dataObj) {
    if (!(pathArray instanceof Array)) {
      console.error("Non array passed as path to db.update()");
      return Promise.reject(new Error("Database update failed"));
    }

    if (typeof dataObj != 'object') {
      console.error(`An 'object' must be passed to database.update() as data. Got a '${typeof dataObj}' instead.`);
      return Promise.reject(new Error("Database update failed"));
    }

    let dbpath = ["USERS", auth.currentUser.uid, ...pathArray];
    let address = dbpath.join("/");

    let updatePromise = database.ref(address).update(dataObj);

    return updatePromise
      .then(() => {
        let existingData = store.getNestedData(pathArray);
        store.update(pathArray, {...existingData, ...dataObj});
      })
      .catch(err => {
        let warning = new WarningPopup();
        warning.init(err, "Database update failed");
      });
  }

  /**
   * @param {Array<String>} pathArray 
   * @param {*} data 
   */
  set(pathArray, data) {
    if (!(pathArray instanceof Array)) {
      console.error("Non array passed as path to db.update()");
      return Promise.reject(new Error("Database update failed"));
    }

    let dbpath = ["USERS", auth.currentUser.uid, ...pathArray];
    let address = dbpath.join("/");

    let setPromise = database.ref(address).set(data);
    
    return setPromise
      .then(() => {
        store.update(pathArray, data);
      })
      .catch(err => {
        let warning = new WarningPopup();
        warning.init(err, "Database update failed");
      });
  }

  /**
   * Delete the data in the database location defined by 'path'
   * @param {Array<String>} pathArray
   * @returns {Promise<>}
   */
  remove(pathArray) {
    if (!(pathArray instanceof Array)) {
      console.error("Non array passed as path to db.remove()");
      return Promise.reject(new Error("Could not remove from database"));
    }

    let dbpath = ["USERS", auth.currentUser.uid, ...pathArray];
    let address = dbpath.join("/");

    let removePromise = database.ref(address).remove();

    return removePromise
      .then(() => {
        store.remove(pathArray);
      })
      .catch(err => {
        let warning = new WarningPopup();
        warning.init(err, "Could not remove from database");
      });
  }

  /**
   * Push 'data' to the database address specified by 'pathArray'
   * @param {Array<String>} pathArray
   * @param {Object} data
   * @returns {Promise<>} - Returns a promise that fulfills to undefined
   */
  push(pathArray, data) {
    if (!(pathArray instanceof Array)) {
      console.error("Non array passed as path to db.remove()");
      return Promise.reject(new Error("Could not remove from database"));
    }

    let dbpath = ["USERS", auth.currentUser.uid, ...pathArray];
    let address = dbpath.join("/");

    let pushPromise = database.ref(address).push(data);

    let storePushPromise = pushPromise
      .then(() => {
        store.update([...pathArray, pushPromise.key], data);
      })
      .catch(err => {
        let warning = new WarningPopup();
        warning.init(err, "Database push failed");
      });

    storePushPromise.key = pushPromise.key;
    return storePushPromise;
  }

  /**
   * @param {Array<String>} pathArray 
   * @param {String} oldKey 
   * @param {String} newKey 
   */
  changeKey(pathArray, oldKey, newKey) {
    if (!(pathArray instanceof Array)) {
      console.error("Non array passed as path to db.changeKey()");
      return Promise.reject(new Error("Database key update failed"));
    }
    
    let data = store.getNestedData([...pathArray, oldKey]);

    if (!data) {
      console.error("Invalid path/key to db.changeKey()");
      return Promise.reject(new Error("Database key update failed"));
    }

    let dbpath = ["USERS", auth.currentUser.uid, ...pathArray];
    let address = dbpath.join("/");

    let dbRef = database.ref(address);

    return dbRef.child(newKey).update(data)
      .then(() => {
        store.update([...pathArray, newKey], data)
        return dbRef.child(oldKey).remove();
      })
      .then(() => {
        store.remove([...pathArray, oldKey]);
      })
      .catch(err => console.error(err));
  }

  get time() {
    return store.time;
  }
}

export default new Database();
