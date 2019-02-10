import get from "lodash/get";
import store from "./store";

export function iterateData(gradeCb, subjectCb, batchCb) {
  let UserClass = store.getState().UserClass;

  for (let grade in UserClass) {
    if (gradeCb) gradeCb({ name: grade });
    let subjects = UserClass[grade];

    for (let subject in subjects) {
      if (!subjectCb && !batchCb) break;
      else if (subjectCb) subjectCb({ name: subject, grade });

      let batches = subjects[subject].Streams;

      for (let batchName in batches) {
        let batch = batches[batchName];
        batch = {
          ...batch,
          grade: batch.Grade,
          subject: batch.Subject,
          name: batch.BatchName
        };

        if (batchCb) batchCb(batch);
        else break;
      }
    }
  }
}

export function getMonthName(date) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  return months[date.getMonth()];
}

export function formatAMPM(date) {
  if (typeof date === "string") {
    let [hours, minutes] = date.split(":");
    let ampm = "AM";

    if (Number(hours) > 12) {
      hours = Number(hours) - 12;
      ampm = "PM";
    }

    return `${hours}:${minutes} ${ampm}`;
  } else if (date instanceof Date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  return date;
}

export function hexToRgbA(hex, alpha) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
    }
    throw new Error('Bad Hex');
}

export function getPropertyFromAllBatches(property) {
  let output = [];

  iterateData(null, null, batch => {
    let { grade, subject, name } = batch;
    let path = ["UserClass", grade, subject, "Streams", name, property];

    let propertyObj = get(store.getState(), path, {});
    let propertyArray = [];

    for (let key in propertyObj) {
      let o = {
        ...propertyObj[key],
        grade: grade,
        subject: subject,
        batchName: name,
        key
      };
      propertyArray.push(o);
    }

    output = [...output, ...propertyArray];
  });

  return output;
}

export function getDataAttributes(selector) {
  let attributes = {};

  $(selector).each(function() {
    $.each(this.attributes, function() {
      if (this.specified) {
        let name = this.name;
        let regex = /^data-(\S+)/i;

        let result = regex.exec(name);
        if (result) attributes[result[1]] = this.value;
      }
    });
  });

  return attributes;
}

export function encodeString(inputString) {
  let outputstring = encodeURIComponent(inputString).replace(/\./g, "%2E");
  return outputstring;
}

export function decodeString(inputString) {
  let outputstring = decodeURIComponent(inputString);
  let withoutDots = outputstring.replace("%2E", ".");

  return withoutDots;
}

export function resizeImage(MAX_WIDTH, MAX_HEIGHT, fileInputElement) {
  let p = new Promise((resolve, reject) => {
    try {
      let filesToUpload = fileInputElement.files;
      let file = filesToUpload[0];

      // Create an image
      // let img = document.createElement("img");

      // Create a file reader
      let reader = new FileReader();
      // Set the image once loaded into file reader
      reader.onload = function (e) {
        let img = new Image();

        img.onload = function () {
          let canvas = document.createElement("canvas");
          //let canvas = $("<canvas>", {"id":"testing"})[0];
          let ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          let width = MAX_WIDTH;
          let height = MAX_HEIGHT;
          // let width = img.width;
          // let height = img.height;

          // if (width > height) {
          //     if (width > MAX_WIDTH) {
          //         height *= MAX_WIDTH / width;
          //         width = MAX_WIDTH;
          //     }
          // } else {
          //     if (height > MAX_HEIGHT) {
          //         width *= MAX_HEIGHT / height;
          //         height = MAX_HEIGHT;
          //     }
          // }
          canvas.width = width;
          canvas.height = height;
          ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          let dataurl = canvas.toDataURL("image/png");

          // document.getElementsByClassName('profileImage')[0].src = img.src;
          resolve({ fileName: file.name, data: dataurl });
        };

        img.src = e.target.result;
      };

      // Load files into file reader
      reader.readAsDataURL(file);

    } catch(e) {
      reject(e);
    }
  });

  return p;
}


export function ConvertHourTimeToMinutes(time_){
  //input time as 6:00 or 13:30

  let hourMinute = parseInt(time_.split(':')[0])*60;
  let minuteMinute = parseInt(time_.split(':')[1]);

  let totalMinutes = hourMinute + minuteMinute;

  return totalMinutes
}

export function ConvertMinutesToHour(totalMinutes){
  //input as 400 or 900 etc of minutes
  let Hour_ = String(Math.floor( totalMinutes / 60));
  let minutes = String(totalMinutes % 60);

  if (minutes == 0) {
      return (Hour_ + ':' + minutes + '0');
  } else {
      return (Hour_ + ':' + minutes);
  }

}

export function toastr_(){

	; (function (define) {
		define(['jquery'], function ($) {
			return (function () {
				var version = '2.0.1';
				var $container;
				var listener;
				var toastId = 0;
				var toastType = {
					error: 'error',
					info: 'info',
					success: 'success',
					warning: 'warning'
				};

				var toastr = {
					clear: clear,
					error: error,
					getContainer: getContainer,
					info: info,
					options: {},
					subscribe: subscribe,
					success: success,
					version: version,
					warning: warning
				};

				return toastr;

				//#region Accessible Methods
				function error(message, title, optionsOverride) {
					return notify({
						type: toastType.error,
						iconClass: getOptions().iconClasses.error,
						message: message,
						optionsOverride: optionsOverride,
						title: title
					});
				}

				function info(message, title, optionsOverride) {
					return notify({
						type: toastType.info,
						iconClass: getOptions().iconClasses.info,
						message: message,
						optionsOverride: optionsOverride,
						title: title
					});
				}

				function subscribe(callback) {
					listener = callback;
				}

				function success(message, title, optionsOverride) {
					return notify({
						type: toastType.success,
						iconClass: getOptions().iconClasses.success,
						message: message,
						optionsOverride: optionsOverride,
						title: title
					});
				}

				function warning(message, title, optionsOverride) {
					return notify({
						type: toastType.warning,
						iconClass: getOptions().iconClasses.warning,
						message: message,
						optionsOverride: optionsOverride,
						title: title
					});
				}

				function clear($toastElement) {
					var options = getOptions();
					if (!$container) { getContainer(options); }
					if ($toastElement && $(':focus', $toastElement).length === 0) {
						$toastElement[options.hideMethod]({
							duration: options.hideDuration,
							easing: options.hideEasing,
							complete: function () { removeToast($toastElement); }
						});
						return;
					}
					if ($container.children().length) {
						$container[options.hideMethod]({
							duration: options.hideDuration,
							easing: options.hideEasing,
							complete: function () { $container.remove(); }
						});
					}
				}
				//#endregion

				//#region Internal Methods

				function getDefaults() {
					return {
						tapToDismiss: true,
						toastClass: 'toast',
						containerId: 'toast-container',
						debug: false,

						showMethod: 'fadeIn', //fadeIn, slideDown, and show are built into jQuery
						showDuration: 300,
						showEasing: 'swing', //swing and linear are built into jQuery
						onShown: undefined,
						hideMethod: 'fadeOut',
						hideDuration: 1000,
						hideEasing: 'swing',
						onHidden: undefined,

						extendedTimeOut: 1000,
						iconClasses: {
							error: 'toast-error',
							info: 'toast-info',
							success: 'toast-success',
							warning: 'toast-warning'
						},
						iconClass: 'toast-info',
						positionClass: 'toast-top-right',
						timeOut: 5000, // Set timeOut and extendedTimeout to 0 to make it sticky
						titleClass: 'toast-title',
						messageClass: 'toast-message',
						target: '.page-container',
						closeHtml: '<button>&times;</button>',
						newestOnTop: true
					};
				}

				function publish(args) {
					if (!listener) {
						return;
					}
					listener(args);
				}

				function notify(map) {
					var
						options = getOptions(),
						iconClass = map.iconClass || options.iconClass;

					if (typeof (map.optionsOverride) !== 'undefined') {
						options = $.extend(options, map.optionsOverride);
						iconClass = map.optionsOverride.iconClass || iconClass;
					}

					toastId++;

					$container = getContainer(options);
					var
						intervalId = null,
						$toastElement = $('<div/>'),
						$titleElement = $('<div/>'),
						$messageElement = $('<div/>'),
						$closeElement = $(options.closeHtml),
						response = {
							toastId: toastId,
							state: 'visible',
							startTime: new Date(),
							options: options,
							map: map
						};

					if (map.iconClass) {
						$toastElement.addClass(options.toastClass).addClass(iconClass);
					}

					if (map.title) {
						$titleElement.append(map.title).addClass(options.titleClass);
						$toastElement.append($titleElement);
					}

					if (map.message) {
						$messageElement.append(map.message).addClass(options.messageClass);
						$toastElement.append($messageElement);
					}

					if (options.closeButton) {
						$closeElement.addClass('toast-close-button');
						$toastElement.prepend($closeElement);
					}

					$toastElement.hide();
					if (options.newestOnTop) {
						$container.prepend($toastElement);
					} else {
						$container.append($toastElement);
					}


					$toastElement[options.showMethod](
						{ duration: options.showDuration, easing: options.showEasing, complete: options.onShown }
					);
					if (options.timeOut > 0) {
						intervalId = setTimeout(hideToast, options.timeOut);
					}

					$toastElement.hover(stickAround, delayedhideToast);
					if (!options.onclick && options.tapToDismiss) {
						$toastElement.click(hideToast);
					}
					if (options.closeButton && $closeElement) {
						$closeElement.click(function (event) {
						if( event.stopPropagation ) {
							event.stopPropagation();
						} else if( event.cancelBubble !== undefined && event.cancelBubble !== true ) {
							event.cancelBubble = true;
						}
							hideToast(true);
						});
					}

					if (options.onclick) {
						$toastElement.click(function () {
							options.onclick();
							hideToast();
						});
					}

					publish(response);

					if (options.debug && console) {
						console.log(response);
					}

					return $toastElement;

					function hideToast(override) {
						if ($(':focus', $toastElement).length && !override) {
							return;
						}
						return $toastElement[options.hideMethod]({
							duration: options.hideDuration,
							easing: options.hideEasing,
							complete: function () {
								removeToast($toastElement);
								if (options.onHidden) {
									options.onHidden();
								}
								response.state = 'hidden';
								response.endTime = new Date(),
								publish(response);
							}
						});
					}

					function delayedhideToast() {
						if (options.timeOut > 0 || options.extendedTimeOut > 0) {
							intervalId = setTimeout(hideToast, options.extendedTimeOut);
						}
					}

					function stickAround() {
						clearTimeout(intervalId);
						$toastElement.stop(true, true)[options.showMethod](
							{ duration: options.showDuration, easing: options.showEasing }
						);
					}
				}
				function getContainer(options) {
					if (!options) { options = getOptions(); }
					$container = $('#' + options.containerId);
					if ($container.length) {
						return $container;
					}
					$container = $('<div/>')
						.attr('id', options.containerId)
						.addClass(options.positionClass);
					$container.appendTo($(options.target));
					return $container;
				}

				function getOptions() {
					return $.extend({}, getDefaults(), toastr.options);
				}

				function removeToast($toastElement) {
					if (!$container) { $container = getContainer(); }
					if ($toastElement.is(':visible')) {
						return;
					}
					$toastElement.remove();
					$toastElement = null;
					if ($container.children().length === 0) {
						$container.remove();
					}
				}
				//#endregion

			})();
		});
  }(typeof define === 'function' && define.amd ? define : function (deps, factory) { /* eslint-disable-line */
		if (typeof module !== 'undefined' && module.exports) { //Node
			module.exports = factory(require('jquery'));
		} else {
			window['toastr'] = factory(window['jQuery']);
		}
	}));

}

export function tConvert (time) {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours

  }

  return time.join (''); // return adjusted time or original string
}

export function CraftTimingArray(startingIndex) {
	//this function will return an array containing the timings from startingIndex number to 12PM in 30min intervals
	//in 24hour format
	let Crafted_Timings = [];

	for (let i = startingIndex; i < 25; i++) {
		let currentTiming = String(i) + ':00';

		Crafted_Timings.push(currentTiming);

		let currentTiming2 = String(i) + ':30';

		Crafted_Timings.push(currentTiming2);
	}

	Crafted_Timings.pop();
	return Crafted_Timings
}

export function preloadImage(link) {
    return new Promise((resolve, reject) => {
        try {
            var img = new Image();

            img.onload = function () {
                let avatarElement = $(img);
                resolve(avatarElement);
            };

            img.src = link;
        } catch (err) {
            reject(err);
        }
    });
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export function validColor(color){
	var $div = $("<div>");
	$div.css("border", "1px solid "+color);
	return ($div.css("border-color")!="")
  }

export function isOnlyWhitespace(inputString){
	//returns true if supplied string is only whitespace

	let sArr = inputString.split(' ');

	let output = true;

	for (let el of sArr){
		if (el!=''){
			output=false;
		}
	}

	return output;
}

export function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

export function openInNewTab(url) {
	let win = window.open(url);
	win.focus();
}