
import './loading_.css';
import { getRandomInt } from "../misc";


class Loading {

    show(){
        $("#loading_background_id").fadeIn();
    }

    hide(){
        $("#loading_background_id").fadeOut();
    }

    update(startingPercentage, endingPercentage){

        let randomEndingPercentage = getRandomInt((parseInt(endingPercentage) - 6), (parseInt(endingPercentage) + 6));

        if (randomEndingPercentage>100){
            randomEndingPercentage = 100;
        }

        for (let index = startingPercentage; index < randomEndingPercentage + 1; index++) {
          $(".loadingText").text(`${index}%`);
          $(".loadingLineInner").css("width", `${index}%`);
        }
    }
}

export default new Loading();