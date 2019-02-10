function EncodeString(inputString) {

    outputstring = encodeURIComponent(inputString).replace(/\./g, '%2E');

    return outputstring
}


function DecodeString(inputString) {
    outputstring = decodeURIComponent(inputString);
    withoutDots = outputstring.replace('%2E', '.');

    return withoutDots
}

function FadeOutANDRemove(speed, element_) {

    $(element_).fadeOut(speed, function () {
        $(element_).remove();
    })
}

function BlurAnimate(blurElement) {

    tweenBlur(blurElement, 0, 5);
}



function UnBlurAnimate(unblurElement) {

    tweenUnBlur(unblurElement, 5, -2);
}



// Generic function to tween blur radius
function tweenBlur(ele, startRadius, endRadius) {

    $({
        blurRadius: startRadius
    }).animate({
        blurRadius: endRadius
    }, {
            duration: 500,
            easing: 'swing', // or "linear"
            // use jQuery UI or Easing plugin for more options
            step: function () {
                setBlur(ele, this.blurRadius);
            },
            complete: function () {
                // Final callback to set the target blur radius
                // jQuery might not reach the end value
                setBlur(ele, endRadius);
            }
        });
}

// Generic function to tween blur radius
function tweenUnBlur(ele, startRadius, endRadius) {

    $({
        blurRadius: startRadius
    }).animate({
        blurRadius: endRadius
    }, {
            duration: 500,
            easing: 'swing', // or "linear"
            // use jQuery UI or Easing plugin for more options
            step: function () {
                setBlur(ele, this.blurRadius);
            },
            complete: function () {
                // Final callback to set the target blur radius
                // jQuery might not reach the end value
                //setBlur(ele, endRadius);

                $(ele).css({
                    "-webkit-filter": "none",
                    "filter": "none"
                });
            }
        });
}


function setBlur(ele, radius) {
    $(ele).css({
        "-webkit-filter": "blur(" + radius + "px)",
        "filter": "blur(" + radius + "px)"
    });
}

function MatchAndFindIndex(inputArr, inputToMatch) {

    index_ = null;

    for (var i = 0; i < inputArr.length; i++) {

        if (inputArr[i] == inputToMatch) {

            index_ = i;
            break;
        }

    }

    return index_
}

function DeleteTableEntryByIndex(InputIndex, TableAddress) {
    //this function will delete a table entry by the index value e.g 0,1,2
    //var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  dataMain);

    var ref = database.ref(TableAddress);

    var nonDeletedStreams = [];

    const promise = ref.once('value', ReceivedData, errData).then(DeleteStreamFromDatabase);

    //Functions for fetching data
    function ReceivedData(data) {

        tableData = data.val();
        var arr = $.map(tableData, function (el) {
            return el;
        });


        for (var i = 0; i < arr.length; i++) {

            if (i != parseInt(InputIndex)) {
                console.log('copying non deleted streams..');
                nonDeletedStreams.push(arr[i]);
            }

        }
        console.log(nonDeletedStreams);
    }

    function errData(err) {
        console.log('Error!');
        console.log(err);
    }

    function DeleteStreamFromDatabase() {

        var database = firebase.database();
        var ref = database.ref(TableAddress);
        ref.remove();
        console.log('timing has been removed');

        JSONarray = {
            ...nonDeletedStreams
        };

        var database = firebase.database();
        var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + dataMain);

        ref.update(JSONarray);

    }

    return promise
}


function InsertDataIntoTable(InputJSONdata, tableAddress) {
    //this will insert the JSON data into the tableAddress
    var ref = database.ref(tableAddress);

    const promise = ref.update(InputJSONdata);

    return promise
}

function AlertIfEmptyInput(element_ID, alertText) {
    lol = document.getElementById('StreamName_ID').value;

    if (!lol) {
        alert(alertText);
    }
}


function ReturnAsArrayChildOfTable(InputTableJSON) {
    //this function will return as a child all the members of queried table as an array

    OutputArr = new Array();

    for (var k in InputTableJSON) OutputArr.push(k);

    return OutputArr
}

function CheckIfElementExistsInArray(element, InputArr) {

    var CheckBoolean = false;

    for (var i = 0; i < InputArr.length; i++) {

        if (element == InputArr[i]) {
            CheckBoolean = true;
            break
        }
    }

    return CheckBoolean
}


function BoxAlert(AlertText) {
    //showcases an alert notifications and then removes it automatically after a set time period
    document.getElementById('AlertText_ID').innerHTML = AlertText;
    $('.BoxAlert').fadeIn('fast', function () {
        setTimeout(function () {
            $(this).fadeOut('fast');
            $(this).remove();
        }, 60000);
    });

    //also add this to the persistent notification area
    var date = new Date();
    innerTime = date.toLocaleString('en-US');
    createPersNotifBox(AlertText, innerTime);
}


function getScheduleTimestamp(time) {
    //accepts hh:mm format - convert hh:mm to timestamp
    time = time.replace(/ /g, '');
    var timeArray = time.split(':');
    var timeStamp = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
    return timeStamp;
}


function RewriteKeyName(oldName, newName, address) {

    var snapshotJSON;
    //now lets first access the firebase database and keep a copy of the stream to be changed
    var ref = database.ref(address + oldName);

    const promise = ref.once('value', ReceivedData, errData).then(function () {

        //now we will delete this stream
        var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + address + oldName);
        ref.remove().then(function () {
            //now we need to reload the address with the new stream
            var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + address + newName);

            ref.update(snapshotJSON);

        });
    });

    function ReceivedData(data) {

        tableData = data.val();

        snapshotJSON = tableData;

    }

    function errData(err) {
        console.log('Error!');
        console.log(err);
    }
}

function getCurrentDay() {
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var n = d.getDay();

    return n;
}

function print(inputS) {
    console.log(inputS);
}

function getDayIndex(day) {
    let week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return week.indexOf(day);
}



function datesOfTheMonth(month, year, callback) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let monthParameterIsValid = (typeof month === 'string' && months.includes(month))
        || (typeof month === 'number' && !Object.is(month, NaN) && (month >= 0 && month <= 11));

    if (monthParameterIsValid) {
        let date = new Date(`${month} 1, ${year} 03:24:00`);
        let week = 0;

        do {
            callback(date.getDate(), week, date.getDay());

            // increment the date object
            date.setDate(date.getDate() + 1);

            let nextDateIsSunday = date.getDay() === 0;
            if (nextDateIsSunday) week++;
        } while (date.getDate() != 1);
    }
}

function getMonthName(date) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return months[date.getMonth()];
}

function formatAMPM(date) {
    if (typeof date === 'string') {
        let [hours, minutes] = date.split(':');
        let ampm = 'AM';

        if (Number(hours) > 12) {
            hours = Number(hours) - 12;
            ampm = 'PM'
        }

        return `${hours}:${minutes} ${ampm}`
    } else if (date instanceof Date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    return date;
}

function hideEventsPane() {
    $('#new-event-button').hide();
    $('#events h3').fadeOut('fast');
    $('#event-entries').fadeOut('fast', () => $('#new-event-form').fadeIn('fast'));
}

function showEventsPane() {
    $('#new-event-button').fadeIn('fast');
    $('#events h3').fadeIn('fast');
    $('#event-entries').fadeIn('fast');
}

if (!String.prototype.splice) {
    /**
     * {JSDoc}
     *
     * The splice() method changes the content of a string by removing a range of
     * characters and/or adding new characters.
     *
     * @this {String}
     * @param {number} start Index at which to start changing the string.
     * @param {number} delCount An integer indicating the number of old chars to remove.
     * @param {string} newSubStr The String that is spliced in.
     * @return {string} A new string with the spliced substring.
     */
    String.prototype.splice = function (start, delCount, newSubStr) {
        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
    };
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

function setNestedProperty(obj, value, childProperties) {
    /**
     * {JSDoc}
     *
     * Set a value nested multiple layers deep into an Object specified by the
     * childProperties array.
     * @param {Object} obj Target object 
     * @param {any} value Value that needs to be pushed.
     * @param {Array} childProperties An integer indicating the number of old chars to remove.
     * @return {Object} Reference to the Object.
     */
    // childProperties = childProperties.split('/');
    let currObj = obj;

    if (childProperties.length === 0) {
        obj = value;
        return;
    }

    let setter = (propName, index, arr) => {
        const isLastChild = index === arr.length - 1;

        if (!currObj[propName]) {
            currObj[propName] = {};
        }

        if (isLastChild) {
            currObj[propName] = value;
        }

        if (!isLastChild) currObj = currObj[propName];
    };

    childProperties.forEach(setter);
}

function removeNestedProperty(obj, childProperties) {
    let currObj = obj;

    if (childProperties.length === 0) {
        return;
    }

    let remover = (propName, index, arr) => {
        const isLastChild = index === arr.length - 1;

        if (!currObj[propName]) return;

        if (isLastChild) delete currObj[propName];
        else currObj = currObj[propName];
    }

    childProperties.forEach(remover);
}

function ref(obj, childProperties) {
    let childPropertiesArray = childProperties === '/' || childProperties === '' ? [] : childProperties.split('/');

    return {
        set(value) {
            setNestedProperty(obj, value, childPropertiesArray);
            return obj;
        },
        remove() {
            removeNestedProperty(obj, childPropertiesArray);
        }
    };
}

function returnLastKEYofJSON(inputJSON) {
    //returns the last key of JSON
    let key;
    endResult = {};
    for (key in inputJSON) {
        endResult = key;
    }

    if (endResult == null) {
        endResult = '';
    }
    return endResult
}

//correcting the firebase .on event
function childAddedEvent_Bind(addressToListen, lastexistingChild_KEY, callback) {

    //addressToListen ---> the address to which the firebase .on event will listen to
    //lastexistingChild_KEY ---> the key property of the last existing JSON of where this event will listen to / if empty pass in null var
    //callback function has as parameters the new child added key name and the new child added JSON values

    //this function will bind the event and carry out the actions outlined by the callback as an argument when it triggers

    if (!lastexistingChild_KEY) {
        lastexistingChild_KEY = '';
    }

    let ref = database.ref(addressToListen);

    //print(`setting listening event on address: ${addressToListen}`);
    ref.limitToLast(1).on("child_added", function (snapshot) {

        let keyName = snapshot.key;
        let JSONval = snapshot.val();

        //print(lastexistingChild_KEY);
        //print(keyName);

        if (String(keyName) != String(lastexistingChild_KEY)) {
            //print('Existing JSON is different from new triggered JSON');
            //print('Initiating callback function');
            callback(keyName, JSONval);
        }

        else if (String(keyName) == String(lastexistingChild_KEY)) {
            //print('Existing JSON is SAME as triggerred JSON');
            //print('First load so doing nothing');
        }
    });
}

function ConvertHourTimeToMinutes(time_) {
    //input time as 6:00 or 13:30

    hourMinute = parseInt(time_.split(':')[0]) * 60;
    minuteMinute = parseInt(time_.split(':')[1]);

    totalMinutes = hourMinute + minuteMinute;

    return totalMinutes
}

function ConvertMinutesToHour(totalMinutes) {
    //input as 400 or 900 etc of minutes
    Hour_ = String(Math.floor(totalMinutes / 60));
    minutes = String(totalMinutes % 60);

    if (minutes == 0) {
        return (Hour_ + ':' + minutes + '0');
    } else {
        return (Hour_ + ':' + minutes);
    }

}

function ReloadTimeTableGridBoxes(inputJSON) {
    $(".timetableONEBOX").fadeOut('fast');
    $(".timetableONEBOX").remove();

    let key;
    for (key in inputJSON['UserClass']) {
        let grade = key;

        let key2;
        for (key2 in inputJSON['UserClass'][grade]) {
            let subject = key2;

            let key3;
            for (key3 in inputJSON['UserClass'][grade][subject]) {

                let key4;
                for (key4 in inputJSON['UserClass'][grade][subject]['Streams']) {
                    let batchName = key4;
                    let streamColor = inputJSON['UserClass'][grade][subject]['Streams'][batchName]['StreamColor'];

                    let TimingJSON = inputJSON['UserClass'][grade][subject]['Streams'][batchName]['Timings'];
                    $(".MainTimeTableCont").css('display', 'block');
                    fillTimtableGridBox(TimingJSON, subject, grade, batchName, streamColor);
                }
            }
        }
    }
}

function generateValidTimeOptions(elementSelector, start) {
    start = start || '7:00';
    let end = '24:00';
    $(`${elementSelector} option`).remove();

    let startTimeAsNumber = Number(start.split(':').join(''));
    let endTimeAsNumber = Number(end.split(':').join(''));

    while (startTimeAsNumber <= endTimeAsNumber) {
        let startIndex = startTimeAsNumber < 1000 ? 1 : 2;
        let currentTimeStr = String(startTimeAsNumber).splice(startIndex, 0, ':');

        let optionElement = /*html*/ `<option value=${currentTimeStr}>${currentTimeStr}</option>`;
        $(elementSelector).append(optionElement);

        startTimeAsNumber += 30;
        if (startTimeAsNumber % 100 === 60) startTimeAsNumber += 40;
    }
}