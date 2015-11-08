// Availibilty calender object
function d21_aCalendar(options) {
    var self = this;

    self.options = $.extend({
        lang: "de",
        ibeUrl: "",
        notAvail: [],
    }, options);

    self.var = {
        Texts: {
            en: {
                days: {
                    short: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                    long: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                },
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            },
            de: {
                days: {
                    short: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
                    long: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']
                },
                months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Julie', 'August', 'September', 'Oktober', 'November', 'Dezember']
            }
        },
        DateArray: [],
        DateNow: new Date(),
        FirstDay: 1
    }

    self.fn = {
        init: function () {
            moment.locale('de');

            self.fn.createDateArray(false);
            self.fn.render.calendar();
        },
        render: {
            calendar: function () {
                // Set output container
                $('#d21-calendar').append('<div id="d21-controlls-top">');
                $('#d21-calendar').append('<div id="d21-headContainer">');
                $('#d21-calendar').append('<div id="d21-dayContainer">');
                $('#d21-calendar').append('<div id="d21-controlls-bottom">');

                // Add controlls
                $('#d21-controlls-top').append('<div class="prevWeek">Eine Woche zurück</div>');
                $('#d21-controlls-bottom').append('<div class="nextWeek">Eine Woche weiter</div>');

                // Render header
                self.fn.render.header();
                // Render days
                self.fn.render.days();
            },
            header: function () {
                for (var i = 0; i < 7; i++) {
                    var newItem = '<div class="d21-calendar-head">';
                    newItem += self.var.Texts[self.options.lang].days.short[i];
                    newItem += '</div>';

                    $('#d21-headContainer').append(newItem);
                }
            },
            days: function () {
                var result = "";

                for (var i = 0; i < 21; i++) {
                    var stateClass = "";
                    var btBook = "";

                    if (self.options.notAvail.length > 0) {
                        $.each(self.options.notAvail, function () {
                            var currentDate = moment(this);
                            currentDate.millisecond(0);
                            currentDate.second(0);
                            currentDate.minute(0);
                            currentDate.hour(0);

                            if ((currentDate - self.var.DateArray[i]) == 0) {
                                stateClass = " notAvail";
                            } else if ((currentDate - self.var.DateArray[i]) < 0) {
                                stateClass = " avail";
                                btBook = "Buchen!";
                            }
                            else {
                                stateClass = "";
                                btBook = "";
                            }
                        });
                    }

                    var newItem = '<div class="d21-calendar-day' + stateClass + '" d21-datestring="' + moment(self.var.DateArray[i], 'DD.MM.YYYY') + '">';
                    newItem += '<div class="d21-dayNumer">' + self.var.DateArray[i].get('date') + '</div>';
                    newItem += '<div class="d21-monthYear">' + self.var.Texts[self.options.lang].months[self.var.DateArray[i].get('month')].substring(0, 3) + ' ' + self.var.DateArray[i].get('year') + '</div>';
                    newItem += '<div class="d21-bookButton">' + btBook + '</div>';
                    newItem += '</div>';

                    result += newItem;
                }

                $('#d21-calendar #d21-dayContainer')
                        .html('')
                        .append(result);
            }
        },
        handler: {
            nextWeek: function () {
                self.fn.createDateArray(true, 1);
                self.fn.render.days();
            },
            prevWeek: function () {
                self.fn.createDateArray(true, -1);
                self.fn.render.days();
            }
        },
        createDateArray: function (changeWeek, direct) {
            var currentDate,
            startDate;

            if (changeWeek) {
                if (direct > 0) {
                    currentDate = self.var.DateArray[0].add(7, 'days');
                }
                else {
                    currentDate = self.var.DateArray[0].subtract(7, 'days');
                }

            }
            else {
                currentDate = moment(self.var.DateNow);
            }

            self.var.DateArray = [];
            startDate = currentDate.startOf('week');

            for (var i = 0; i < 21; i++) {
                self.var.DateArray.push(moment(startDate));
                startDate = startDate.add(1, 'day');
            }
        }
    }
}

// On document ready
$(document).ready(function () {
    var d21_ac = new d21_aCalendar({
        notAvail: [moment(new Date()), moment(new Date()).add(1, 'days')]
    });
    d21_ac.fn.init();

    $('.nextWeek').click(function () {
        d21_ac.fn.handler.nextWeek();
    });

    $('.prevWeek').click(function () {
        d21_ac.fn.handler.prevWeek();
    });
});