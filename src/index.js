
import { auth } from "./firebase";
import Database from "./Database";

import "./mergedAssets/assets";
import "./custom.css";
import "./assets/css/skins/black.css";

import Loading from './Loading';
import windowEvents from "./Window";
import {toastr_} from "./misc";

import topBar from "./TopBar";
import sideBar from "./Sidebar";
import avatar from "./Avatar";

import dashboard from './Dashboard/';
import batchesTab from "./BatchesTab";
import studentsTab from "./Students";
import timetable from "./Schedule/Timetable";
import calendar from "./Schedule/Calendar";
import lecturesTab from "./LecturesTab";
import notesTab from "./Notes";
import settingsTab from "./Settings";
import Graphs from "./Graphs";


//this is entry point of software. it will check to see if user is logged in
//if not logged in redirect to sign in page, otherwise fetch everything from database and trigger initial load function which will load everything

Loading.show(); //show the loading page
Loading.update(0,7);

auth.onAuthStateChanged(user => {
  if (user) {
    Loading.update(7,56);
    
    Database.initialRead().then(() => {
      let promisesArray = [avatar.init(), initialLoad()];       //promises will be stored here to be resolved collectively

      //resolve all promises and then initiate post load functions
      Promise.all(promisesArray).then(function(){

        Loading.update(84,100);

        Loading.hide();
        postLoad();
      });
    });
  } else {
    //user not logged in, so redirect them back to login page
    window.location.href = '/Login.html';
  }
});

function initialLoad() {

  return new Promise(function(resolve){

    toastr_();

    dashboard.init();
    Graphs.init();

    timetable.init();
  
    sideBar.init();
  
    topBar.init();
  
    Loading.update(56,68); 
  
    settingsTab.init();
  
    windowEvents.init();
    Loading.update(68,77);
  
    studentsTab.init();
    
    lecturesTab.init();
    
    batchesTab.init();

    calendar.init();

    Loading.update(77,84);

    notesTab.init();
    
    resolve();
  });

}


function postLoad(){
  //trigger animations and Post load functions
  dashboard.postLoad();
  calendar.postLoad();
}