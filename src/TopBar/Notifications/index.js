
import { tConvert } from '../../misc';


class Notifications {

    //to use this just instantiate a Notifications object and use the add function

    add(parentTab, innerText){

        this.append_htmlContent(parentTab, innerText);

        this.Update_Badges();

    }

    append_htmlContent(parentTab, innerText){

        let iconNotif = "entypo-attention";

        let d = new Date();
        d.toUTCString();
    
        let onlyTime = String(d).split(' ')[4];
        onlyTime = tConvert(onlyTime);

        //first need to decide what icon to use based on where the notification was generated
        if (parentTab=="Timetable"){
            iconNotif = "entypo-clock";
        }
        else if (parentTab == "Batches"){
            iconNotif = "entypo-layout";
        }
        else if (parentTab == 'Lecture'){
            iconNotif = 'entypo-doc-text'
        }
        else if (parentTab == "Calender"){
            iconNotif = "entypo-clock";
        }
        else if (parentTab == "Settings"){
            iconNotif = "entypo-cog";
        }
        else if (parentTab == "Dashboard"){
            iconNotif = "entypo-gauge";
        }
        else if (parentTab == "Video"){
            iconNotif = "entypo-video";
        }
        else if (parentTab == "Students"){
            iconNotif = "entypo-users";
        }

        $('#notification_container_id').prepend(/*html*/`
            <li class="unread notification-success">
                <a href="#">
                    <i class="${iconNotif} pull-right"></i>

                    <span class="line notif_mainText">
                        <strong class="notif_mainTextStrong">${innerText}</strong>
                    </span>

                    <span class="line small">
                        ${onlyTime}
                    </span>
                </a>
            </li>
        `)
    }

    Update_Badges(){
        let currentNumber = $('#notification_badge_id').text();

        if (currentNumber){
            let newNumber = parseInt(currentNumber) + 1;
            $('#notification_badge_id').text(newNumber);
            $('#notifications_top_text').text(`You have ${newNumber} new notifications.`);
        }

        else{
            $('#notification_badge_id').text('1');
            $('#notifications_top_text').text(`You have ${1} new notifications.`);
        }
    }

    bindNotificationEvents(){
        $(".notificationMain").click(function() {
          if ($(this).hasClass("open")) {
            //notification window closed
            $("#notifications_top_text").text(`You have ${0} new notifications.`);
            $("#notification_badge_id").text("");

            //now loop through all existing notifications and remove strong from them
            $("#notification_container_id")
              .children("li")
              .each(function() {
                if ($(this).find(".notif_mainTextStrong").length == 1) {
                  let innerText = $(this)
                    .find(".notif_mainTextStrong")
                    .text();

                  $(this)
                    .find(".notif_mainText")
                    .empty()
                    .append(`${innerText}`);
                }
              });
          }
        });

        $('#dismisAllNotif').click(function(){
  
            $('#notification_container_id').empty();

        });
    }
}



export default Notifications;