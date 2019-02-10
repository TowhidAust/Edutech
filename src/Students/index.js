

import './Exam.css';
import './paymentHistory.css';
import './RollCall.css';
import './studentCard.css';

import Database from "../Database";

import StudentPane from "./StudentPane";
import VerticalNavBar from "./VerticalNavBar";


class Student {

  init(){

    let fullJSON = Database.getState().UserClass;
    //now we need to loop through it and create verticalNavBar for each and the corresponding tab pane

    let i = 0;
    for (let grade in fullJSON){
      for (let subject in fullJSON[grade]){
        for (let batchName in fullJSON[grade][subject]['Streams']){

          let newVerticalNavBar = new VerticalNavBar();
          let newStudentPane = new StudentPane();

          if (i == 0){
            newVerticalNavBar.init(grade, subject, batchName, 'active');
            newStudentPane.init(grade, subject, batchName, 'active');
          }
          else {
            newVerticalNavBar.init(grade, subject, batchName, 'inactive');
            newStudentPane.init(grade, subject, batchName, 'inactive');
          }

          i++;
        }
      }
    }
  }

  bindModals(){

  }
}


export default new Student();
