/* main js */
(function ($) {
    "use strict";

    $(".bb-toggle-menu").on("click", function () {
        $(".bb-mobile-menu-overlay").fadeIn();
        $(".bb-mobile-menu").addClass("bb-menu-open");
    });

    $(".bb-mobile-menu-overlay, .bb-close-menu").on("click", function () {
        $(".bb-mobile-menu-overlay").fadeOut();
        $(".bb-mobile-menu").removeClass("bb-menu-open");
    });

    function ResponsiveMobilemsMenu() {
        var $msNav = $(".bb-menu-content, .overlay-menu"),
            $msNavSubMenu = $msNav.find(".sub-menu");
        $msNavSubMenu.parent().prepend('<span class="menu-toggle"></span>');

        $msNav.on("click", "li a, .menu-toggle", function (e) {
            var $this = $(this);
            if ($this.attr("href") === "#" || $this.hasClass("menu-toggle")) {
                e.preventDefault();
                if ($this.siblings("ul:visible").length) {
                    $this.parent("li").removeClass("active");
                    $this.siblings("ul").slideUp();
                    $this.parent("li").find("li").removeClass("active");
                    $this.parent("li").find("ul:visible").slideUp();
                } else {
                    $this.parent("li").addClass("active");
                    $this
                        .closest("li")
                        .siblings("li")
                        .removeClass("active")
                        .find("li")
                        .removeClass("active");
                    $this.closest("li").siblings("li").find("ul:visible").slideUp();
                    $this.siblings("ul").slideDown();
                }
            }
        });
    }

    ResponsiveMobilemsMenu();

    /* Custom select */
    $("select").each(function () {
        var $this = $(this),
            selectOptions = $(this).children("option").length;

        $this.addClass("hide-select");
        $this.wrap('<div class="select"></div>');
        $this.after('<div class="custom-select active"></div>');

        var $customSelect = $this.next("div.custom-select.active");
        $customSelect.text($this.children("option").eq(0).text());

        var $optionlist = $("<ul />", {
            class: "select-options",
        }).insertAfter($customSelect);

        for (var i = 0; i < selectOptions; i++) {
            $("<li />", {
                text: $this.children("option").eq(i).text(),
                rel: $this.children("option").eq(i).val(),
            }).appendTo($optionlist);
        }

        var $optionlistItems = $optionlist.children("li");

        $customSelect.click(function (e) {
            e.stopPropagation();
            $("div.custom-select.active")
                .not(this)
                .each(function () {
                    $(this).removeClass("active").next("ul.select-options").hide();
                });
            $(this).toggleClass("active").next("ul.select-options").slideToggle();
        });

        $optionlistItems.click(function (e) {
            e.stopPropagation();
            $customSelect.text($(this).text()).removeClass("active");
            $this.val($(this).attr("rel"));
            $optionlist.hide();
        });

        $(document).click(function () {
            $customSelect.removeClass("active");
            $optionlist.hide();
        });
    });

    $(".bb-close-modal, .bb-modal-overlay").on("click", function () {
        $(".bb-modal-overlay").fadeOut();
        $(".bb-modal").fadeOut();
        $("body").removeClass("bb-overflow-hidden")
        $(".bb-modal-dialog").removeClass("bb-fadeOutUp");
        $(".bb-modal-dialog").addClass("bb-fadeInDown");
    });

})(jQuery);
