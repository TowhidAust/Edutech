// creating the subject and grade Box
class VerticalNavBar {
  init(grade, subject, arrowVisibility) {
    let gradeSplit = grade.split(" ").join("");
    if (arrowVisibility == "active") {
      $("#Batches_Tab_F").append(/*html*/ `
            <li class="active navBatchTabLI" id="${subject}${gradeSplit}batchNavLI">
              <a class="batchTabOption" href="#${subject}${gradeSplit}batchtab" data-toggle="tab" style="display: flex;  align-items: center; justify-content: flex-start;">
                 <span style="font-size:0.8em; margin-right: 3%; color: gray;">${grade} </span>
                 <span>${subject}</span> 
              </a>
            </li>    
        `);
    } else if (arrowVisibility == "inactive") {
      $("#Batches_Tab_F").append(/*html*/ `
            <li class="navBatchTabLI" id="${subject}${gradeSplit}batchNavLI">
              <a class="batchTabOption" href="#${subject}${gradeSplit}batchtab" data-toggle="tab" style="display: flex;  align-items: center; justify-content: flex-start;">
                <span style="font-size:0.8em; margin-right: 3%; color: gray;">${grade} </span>
                <span>${subject}</span> 
              </a>
            </li>    
        `);
    }
  }
}

export default VerticalNavBar;
