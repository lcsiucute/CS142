"use strict";
function DatePicker(id, callback) {
    this.render = function (datetime) {
        var ele = document.getElementById(id);
        ele.innerHTML = "";
        var tab = document.createElement("table");
        ele.appendChild(tab);

        var monthRow = tab.insertRow(0);
        var goBackward = monthRow.insertCell(0);
        var currentShow = monthRow.insertCell(1);
        var goForward = monthRow.insertCell(2);

        goBackward.innerHTML = "<div id=" + id + "_goBackward" + "> &lt; </div>";
        goForward.innerHTML = "<div id=" + id + "_goForward" + "> &gt; </div>";
        currentShow.colSpan = "5"; // pay attention here

        // month text
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "December"];
        var monthAndYear = "<center> " + months[datetime.getMonth()] + " " + datetime.getFullYear() + "</center>";
        currentShow.innerHTML = monthAndYear;

        // event listener
        var backward = document.getElementById(id + "_goBackward");
        backward.addEventListener("click", function () {
            var mo = datetime.getMonth();
            if (mo === 0) {
                datetime.setMonth(11);
                datetime.setFullYear(datetime.getFullYear() - 1);
            } else {
                datetime.setMonth(mo - 1);
            }
            this.render(new Date(datetime));
        }.bind(this));

        var forward = document.getElementById(id + "_goForward");
        forward.addEventListener("click", function () {
            var mo = datetime.getMonth();
            if (mo === 11) {
                datetime.setMonth(0);
                datetime.setFullYear(datetime.getFullYear() + 1);
            } else {
                datetime.setMonth(mo + 1);
            }
            this.render(new Date(datetime));
        }.bind(this));

        // days of a week
        var header = tab.insertRow(1);
        var cells = [];
        for (var x = 0; x < 7; x++) {
            cells[x] = header.insertCell(x);
        }

        cells[0].innerHTML = "Su";
        cells[1].innerHTML = "Mo";
        cells[2].innerHTML = "Tu";
        cells[3].innerHTML = "We";
        cells[4].innerHTML = "Th";
        cells[5].innerHTML = "Fr";
        cells[6].innerHTML = "Sa";

        var date = new Date(datetime.valueOf());
        var firstDateOfThisMonth = new Date(date.setDate(1));
        var firstDateOfNextMonth = new Date(date.setMonth(date.getMonth() + 1));
        var tempDate = new Date(firstDateOfNextMonth);
        var lastDateOfThisMonth = new Date(tempDate.setDate(0));
        var daysThisMonth = (lastDateOfThisMonth.getDate() - firstDateOfThisMonth.getDate() + 1);

        var firstDayOfThisMonth = firstDateOfThisMonth.getDay();
        var firstDayOfNextMonth = firstDateOfNextMonth.getDay();
        var lastDayOfThisMonth = lastDateOfThisMonth.getDay();
        var daysLeft = daysThisMonth; 
        var firstDimRow = false;
        var lastDimRow = false;
        if (firstDayOfThisMonth !== 0) {
            daysLeft = daysLeft - (7 - firstDayOfThisMonth);
            firstDimRow = true;
        }
        if (lastDayOfThisMonth !== 6) {
            daysLeft = daysLeft - (lastDayOfThisMonth + 1);
            lastDimRow = true;
        }
        var wholeWeeksThisMonth = daysLeft / 7;
        var row = 1;

        // first dim row
        var rows = [];
        if(firstDimRow) {
            row++;
            rows[row] = tab.insertRow(row);
            rows[row].setAttribute("class", "alright");
            // dim
            for (var i = firstDayOfThisMonth - 1; i >= 0; i--) {
                var tempDate = new Date(firstDateOfThisMonth);
                var currDate = new Date(tempDate.setDate(-i));
                var currCell = rows[row].insertCell(firstDayOfThisMonth - 1 - i);
                currCell.innerHTML = currDate.getDate();
                currCell.setAttribute("class", "dim");
            }

            // not dim
            for (var i = firstDayOfThisMonth; i <= 6; i++) {
                var tempDate = new Date(firstDateOfThisMonth);
                var currDate = new Date(tempDate.setDate(i - firstDayOfThisMonth + 1));
                var currCell = rows[row].insertCell(i);
                currCell.innerHTML = currDate.getDate();
                this.clickDate(currCell, currDate, id, callback);
            }
        }


        // not dim
        var offset = firstDimRow ? 1 : 0;
        for (var j = 0; j < wholeWeeksThisMonth; j++) {
            row++;
            rows[row] = tab.insertRow(row);
            rows[row].setAttribute("class", "alright");
            for (var i = 0; i <= 6; i++) {
                var tempDate = new Date(firstDateOfThisMonth);
                var currDate = new Date(tempDate.setDate(i + 1 - firstDayOfThisMonth + (j + offset) * 7));
                var currCell = rows[row].insertCell(i);
                currCell.innerHTML = currDate.getDate();
                this.clickDate(currCell, currDate, id, callback);
            }
        }

        // last dim row
        if (lastDimRow) {
            row++;
            rows[row] = tab.insertRow(row);
            rows[row].setAttribute("class", "alright");
            // not dim
            for (var i = 0; i <= lastDayOfThisMonth; i++) {
                var tempDate = new Date(firstDateOfNextMonth);
                var currDate = new Date(tempDate.setDate(-lastDayOfThisMonth + i));
                var currCell = rows[row].insertCell(i);
                currCell.innerHTML = currDate.getDate();
                this.clickDate(currCell, currDate, id, callback);
            }
            // dim
            for (var i = 1; i <= 6 - lastDayOfThisMonth; i++) {
                var tempDate = new Date(firstDateOfNextMonth);
                var currDate = new Date(tempDate.setDate(i));
                var currCell = rows[row].insertCell(lastDayOfThisMonth + i);
                currCell.innerHTML = currDate.getDate();
                currCell.setAttribute("class", "dim");
            }
        }
    };
}

DatePicker.prototype.clickDate = function(currCell, currDate, id, fn) {
    currCell.addEventListener("click", function() {
        fn(id, {month: currDate.getMonth(), day:currDate.getDay(), year: currDate.getFullYear()});
    });
};