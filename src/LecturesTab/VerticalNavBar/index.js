// creating the subject and grade Box
class VerticalNavBar {

    init(grade, subject, arrowVisibility_) {

        let gradeSplit = grade.split(" ").join('');

        if (arrowVisibility_ == "arrowActive_") {
            $("#Lecture_Tab_F").append( /*html*/ `
                <li class="active navLectureTabLI" id="${subject}${gradeSplit}lectureNavLI">
                    <a class="lectureTabOption" href="#${subject}${gradeSplit}lecturetab" data-toggle="tab" style="display: flex;  align-items: center; justify-content: flex-start;">
                        <span style="font-size:0.8em; margin-right: 3%; color: gray;">${grade}</span>
                        <span>${subject}</span> 
                    </a>
                </li>  
        `);
        } 
        
        else if (arrowVisibility_ == "arrowInactive_") {
            $("#Lecture_Tab_F").append( /*html*/ `
            <li class="navLectureTabLI" id="${subject}${gradeSplit}lectureNavLI">
                <a class="lectureTabOption" href="#${subject}${gradeSplit}lecturetab" data-toggle="tab" style="display: flex;  align-items: center; justify-content: flex-start;">
                    <span style="font-size:0.8em; margin-right: 3%; color: gray;">${grade}</span>
                    <span>${subject}</span> 
                </a>
            </li>  
        `);
        }

    }
}

export default VerticalNavBar;