

(function ($) {

    $.fn.displayTime = function () {
        var checkTime = function (i) {
            if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
            return i;
        };

        var t = $(this);
        var updateTime = function () {
            var date = new Date();
            var stunden = date.getHours();
            var minuten = date.getMinutes();
            minuten = checkTime(minuten);

            var zeit = stunden + ":" + minuten;

            t.html(zeit);
            setTimeout(updateTime, 30000);
        };
        updateTime();
    };


    $.fn.displayDate = function () {
        var checkTime = function (i) {
            if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
            return i;
        };

        var t = $(this);
        var updateTime = function () {
            var date = new Date();
            
            var tag = date.getDate();
            var monatDesJahres = date.getMonth();
            var jahr = date.getFullYear();
            var tagInWoche = date.getDay();
            var monat = new Array("Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");

            var datum = tag + ". " + monat[monatDesJahres] + " " + jahr;

            t.html(datum);
            setTimeout(updateTime, 60000);
        };
        updateTime();
    };


    $.fn.autoScroll = function (options) {
        var settings = $.extend({
            // These are the defaults.
            speed: 50, /* px / sec */
            rewindTime: 1, /* sec */
            pauseOnStart: 3, /* sec */
            pauseOnEnd: 3, /* sec */
        }, options);


        return $(this).each(function () {
            var t = $(this);

            var max = this.scrollHeight - t.innerHeight();

            var animateOnce = function () {
                window.setTimeout(
                    function () {
                        t.animate({ scrollTop: max }, 1000 * max / settings.speed,
                            function () {
                                window.setTimeout(function () {
                                    t.animate({ scrollTop: 0 }, settings.rewindTime * 1000, animateOnce);
                                }, 1000* settings.pauseOnEnd);
                            });
                    }, 1000* settings.pauseOnStart);
            }
            animateOnce();
        });        
    };
    
    $.fn.customScroll = function (options) {
        var settings = $.extend({
            // These are the defaults.
            up: null, /* up button */
            down: null, /* down button */
            disabledCssClass: "disabled",
            scrollStep: 100, /* px */
            animateTime: 1000 /* ms */
        }, options);

        var scroll = $(this);
        var scrollPos = scroll.scrollTop();
        if (!scrollPos)
            scrollPos = 0;
        
        var obj = {
            update: function() {
                var max = scroll.prop("scrollHeight") - scroll.innerHeight();
                $(settings.up).toggleClass(settings.disabledCssClass, scrollPos <= 0);
                $(settings.down).toggleClass(settings.disabledCssClass, scrollPos >= max);
            },
            doScroll: function(dir) {
                scrollPos = scrollPos + dir * settings.scrollStep;
                var max = scroll.prop("scrollHeight") - scroll.innerHeight();
                if (scrollPos <= 0) {
                    scrollPos = 0;
                } else if (scrollPos >= max) {
                    scrollPos = max;
                }
                this.update();
                scroll.animate({ scrollTop: scrollPos }, settings.animateTime);  
            }
        };
        
        $(settings.up).click(function() {
            obj.doScroll(-1);
        });
        $(settings.down).click(function() {
            obj.doScroll(1);
        });
            
        obj.update();
        return obj;
    };

    
    $.fn.partialView = function (options) {
        var settings = $.extend({
            // These are the defaults.
            updateInterval: 0,
            pauseWhenEmpty: false,
            onUpdated: null
        }, options);
        
        return $(this).each(function () {
            var t = $(this);
            var href = t.data("href");
            if (href) {
                var refresh = function () {
                    $.ajax({ url: href, cache: false })
                        .done(function (data) {
                            if (settings.pauseWhenEmpty && !$.trim(data)) {
                                ContentController.isPaused(true);
                            }
                            else {
                                t.html(data);
                                ContentController.isPaused(false);
                                if (settings.onUpdated)
                                    settings.onUpdated();
                            }
                        });
                    if (settings.updateInterval)
                        window.setTimeout(refresh, settings.updateInterval);
                };

                refresh();
            }
        });
    }
}(jQuery));