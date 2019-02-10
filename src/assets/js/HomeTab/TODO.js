

jQuery(document).ready(function ($) {
    var $todo_tasks = $("#todo_tasks");

    $todo_tasks.find('input[type="text"]').on('keydown', function (ev) {
        if (ev.keyCode == 13) {
            ev.preventDefault();

            if ($.trim($(this).val()).length) {
                var $todo_entry = $('<li><div class="checkbox checkbox-replace color-white"><input type="checkbox" /><label>' + $(this).val() + '</label></div></li>');
                $(this).val('');

                $todo_entry.appendTo($todo_tasks.find('.todo-list'));
                $todo_entry.hide().slideDown('fast');
                replaceCheckboxes();
            }
        }
    });
});