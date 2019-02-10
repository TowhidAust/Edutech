



class Tooltip {
    
    bind(documentObject) {
        var $this = $(documentObject),
            placement = Tooltip.prototype.attrDefault($this, 'placement', 'top'),
            trigger = Tooltip.prototype.attrDefault($this, 'trigger', 'hover'),
            popover_class = $this.hasClass('tooltip-secondary') ? 'tooltip-secondary' : ($this.hasClass('tooltip-primary') ? 'tooltip-primary' : ($this.hasClass('tooltip-default') ? 'tooltip-default' : ''));

        $this.tooltip({
            placement: placement,
            trigger: trigger
        });

        $this.on('shown.bs.tooltip', function () {
            var $tooltip = $this.next();

            $tooltip.addClass(popover_class);
        });
    }

    // Element Attribute Helper
    attrDefault($el, data_var, default_val) {
        if (typeof $el.data(data_var) != 'undefined') {
            return $el.data(data_var);
        }

        return default_val;
    }
}
export default new Tooltip(); 