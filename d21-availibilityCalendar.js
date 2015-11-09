// Availibilty calender object
function d21_aCalendar(options) {
    var self = this;

    self.options = $.extend({
        lang: "de",
        ibeUrl: "",
        notAvail: [],
        avail: [],
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
                months: ['Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni', 'Julie', 'August', 'September', 'Oktober', 'November', 'Dezember']
            }
        },
        los: 1,
        DateArray: [],
        DateNow: new Date(),
        FirstDay: 1,
        adultCount: 2,
        childs: []
    }

    self.api = new d21_API(self);

    self.fn = {
        init: function () {
            moment.locale('de');
            self.fn.createDateArray(false);
            self.fn.refreshAvailability().done(function (response) {
                var avail = [];
                var notAvail = [];

                $.each(response.Value.Properties[0].Days, function () {
                    if (this.IsAvailable) {
                        avail.push(this);
                    }
                    else {
                        notAvail.push(this);
                    }
                });

                self.options.avail = avail;
                self.options.notAvail = notAvail;

                self.fn.render.calendar();

                $('.nextWeek').click(function () {
                    self.fn.handler.nextWeek();
                });

                $('.prevWeek').click(function () {
                    self.fn.handler.prevWeek();
                });
            });
        },
        refreshAvailability: function () {
            return self.api.fn.get(self.var.DateArray[0]);
        },
        refreshCalendar: function (los, startDate, adults, childs) {
            self.var.DateNow = moment(startDate);
            self.var.los = los;
            self.var.adultCount = adults;
            self.var.childs = childs;

            self.fn.createDateArray(false);
            self.fn.refreshAvailability().done(function (response) {
                var avail = [];
                var notAvail = [];

                $.each(response.Value.Properties[0].Days, function () {
                    if (this.IsAvailable) {
                        avail.push(this);
                    }
                    else {
                        notAvail.push(this);
                    }
                });

                self.options.avail = avail;
                self.options.notAvail = notAvail;

                self.fn.render.days();
            });
        },
        render: {
            calendar: function () {
                // Set output container
                $('#d21-calendar').append('<div id="d21-controlls-top">');
                $('#d21-calendar').append('<div id="d21-headContainer">');
                $('#d21-calendar').append('<div id="d21-dayContainer">');
                $('#d21-calendar').append('<div id="d21-controlls-bottom">');

                // Add controlls
                $('#d21-controlls-top').append('<div class="prevWeek">Eine Woche zur&uuml;ck</div>');
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
                    var priceText = "";

                    if (self.options.notAvail.length > 0) {
                        $.each(self.options.notAvail, function () {
                            var currentDate = moment(this.Date);
                            currentDate.millisecond(0);
                            currentDate.second(0);
                            currentDate.minute(0);
                            currentDate.hour(0);

                            if ((currentDate - self.var.DateArray[i]) == 0) {
                                stateClass = " notAvail";
                                priceText = "nicht verf&uuml;gbar";
                            }
                        });
                    }

                    if (self.options.avail.length > 0) {
                        $.each(self.options.avail, function () {
                            var currentDate = moment(this.Date);
                            currentDate.millisecond(0);
                            currentDate.second(0);
                            currentDate.minute(0);
                            currentDate.hour(0);

                            if ((currentDate - self.var.DateArray[i]) == 0) {
                                stateClass = " avail";
                                btBook = "Buchen!";
                                priceText = 'ab ' + this.PriceMin + ' €';
                            }
                        });
                    }

                    var newItem = '<div class="d21-calendar-day' + stateClass + '" d21-datestring="' + moment(self.var.DateArray[i], 'DD.MM.YYYY') + '">';
                    newItem += '<div class="d21-dayNumer">' + self.var.DateArray[i].get('date') + '</div>';
                    newItem += '<div class="d21-monthYear">' + self.var.Texts[self.options.lang].months[self.var.DateArray[i].get('month')].substring(0, 3) + ' ' + self.var.DateArray[i].get('year') + '</div>';
                    newItem += '<div class="d21-bookButton">' + btBook + '</div>';
                    newItem += '<div class="d21-minPrice">' + priceText + '</div>';
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
                self.fn.refreshAvailability().done(function (response) {
                    var avail = [];
                    var notAvail = [];

                    $.each(response.Value.Properties[0].Days, function () {
                        if (this.IsAvailable) {
                            avail.push(this);
                        }
                        else {
                            notAvail.push(this);
                        }
                    });

                    self.options.avail = avail;
                    self.options.notAvail = notAvail;

                    self.fn.render.days();
                });
            },
            prevWeek: function () {
                self.fn.createDateArray(true, -1);
                self.fn.refreshAvailability().done(function (response) {
                    var avail = [];
                    var notAvail = [];

                    $.each(response.Value.Properties[0].Days, function () {
                        if (this.IsAvailable) {
                            avail.push(this);
                        }
                        else {
                            notAvail.push(this);
                        }
                    });

                    self.options.avail = avail;
                    self.options.notAvail = notAvail;

                    self.fn.render.days();
                });
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

// API object
function d21_API(app) {
    var self = this;

    self.fn = {
        get: function (begin) {
            var response = $.ajax({
                url: self.fn.getRequestUrl(begin),
                method: 'GET',
                beforeSend: function (request) {
                    request.setRequestHeader('access_token', 'LItR5Tpx+UCZOJsQEQ66mQ==');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(jqXHR);
                }
            });

            return response;
        },
        getRequestUrl: function (begin) {
            var begin = moment(begin);
            var end = moment(begin).add(20, 'days');
            var personString = "";

            var isoBegin = begin.get('year') + "-" + (begin.get('month') + 1) + "-" + begin.get('date');
            var isoEnd = end.get('year') + "-" + (end.get('month') + 1) + "-" + end.get('date');

            for (var i = 0; i < app.var.adultCount; i++) {
                if (i == 0) {
                    personString += "18";
                } else {
                    personString += ",18";
                }
            }

            if (app.var.childs.length > 0) {
                $.each(app.var.childs, function () {
                    if (i == 0) {
                        personString += this;
                    } else {
                        personString += "," + this;
                    }
                });
            }

            var url = "http://v4.api.ibe.dirs21.de/calendar?"
                + "begin=" + isoBegin
                + "&end=" + isoEnd
                + "&channel_id=" + "795"
                + "&property_id=" + "2170"
                + "&los=" + app.var.los
                + "&room=" + personString;

            return url;
        }
    }
}

// On document ready
$(document).ready(function () {
    var d21_api = new d21_aCalendar();
    var d21_ac;
    var avail = [];
    var notAvail = [];

    d21_ac = new d21_aCalendar();
    d21_ac.fn.init();
});