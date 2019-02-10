/* global toastr */

class SuccessPopup {

    init(inner, heading){
        let opts = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "toastClass": "black",
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "3000",
            "extendedTimeOut": "3000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        toastr.success(inner, heading, opts);
    }

}

export default SuccessPopup;