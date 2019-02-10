
import { decodeString } from "../../misc";


class VerticalNavBar {

    init(grade, subject, batchName, status){
        //append this to the vertical nav bar

        let gradeSplit = grade.split(" ").join('');
        let batchSplit = decodeString(batchName).split(" ").join('');

        if (status == "active"){

            $('.studentTabVerticalNavBar').append(/*html*/`

                <li class="active navStudentTabLI tooltip-primary" id="${subject}${gradeSplit}${batchSplit}StudentTabNavLI" data-toggle="tooltip" data-placement="right" title="" data-original-title="${subject} ${grade}">
                    <a href="#${subject}${gradeSplit}${batchSplit}Studenttab" data-toggle="tab">${decodeString(batchName)}</a>
                </li>

            `);

        }

        else if (status == "inactive"){

            $('.studentTabVerticalNavBar').append(/*html*/`

                <li class="navStudentTabLI tooltip-primary" id="${subject}${gradeSplit}${batchSplit}StudentTabNavLI" data-toggle="tooltip" data-placement="right" title="" data-original-title="${subject} ${grade}">
                    <a href="#${subject}${gradeSplit}${batchSplit}Studenttab" data-toggle="tab">${decodeString(batchName)}</a>
                </li>

            `);

        }
    }
}


export default VerticalNavBar;