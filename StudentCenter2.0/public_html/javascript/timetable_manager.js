//The courses array.
var courses = {};

$(function(){
      $("#timetable").load("timetable.html"); 
});

function getCourses(){
    //We load in all the courses.
    runSQL("SELECT * FROM Courses INNER JOIN Date ON Courses.CourseNum = Date.CourseNum;", receiveCourses);
}

function loadCourseData(){
    //We get the subjects.
    runSQL("SELECT Subject FROM Courses GROUP BY Subject;", receiveSubjects);
}

function searchForCourses(){
    if ($('#CourseName').val() === "") {
        subjectTable = $( '#courses' );
        subjectTable.html('<tr>' +
                    '<th>Course Code</th>' +
                    '<th class=\"name\">Course Name</th>' +
                    '<th>Subject</th>' +
                    '<th class=\"date\">Date</th>' +
                    '<th>Options</th>' +
                '</tr>');
        $('#results').html("Please search above to see courses.");
        return;
    }
    
    //Gets the days of the week. 
    sql = "SELECT CourseNum From Date WHERE DayOfWeek = ";
    checked = false;
    if (!$('#MonCheck').is(":checked")) {
        sql += "\"Mon\" OR DayOfWeek = ";
        checked = true;
    }
    if (!$('#TuesCheck').is(":checked")) {
        sql += "\"Tues\" OR DayOfWeek = ";
        checked = true;
    }
    if (!$('#WedCheck').is(":checked")) {
        sql += "\"Wed\" OR DayOfWeek = ";
        checked = true;
    }
    if (!$('#ThursCheck').is(":checked")) {
        sql += "\"Thurs\" OR DayOfWeek = ";
        checked = true;
    }
    if (!$('#FriCheck').is(":checked")) {
        sql += "\"Fri\" OR DayOfWeek = ";
        checked = true;
    }
    if (checked)
        sql = sql.substring(0, sql.length - 16);
    else 
        sql = "SELECT * FROM Date WHERE DayOfWeek = \"Sat\"";
    sql += ";";
    
    runSQL(sql, nextSQL);
}

function nextSQL(data){
    subject = $('#SubjectName').find(":selected").text();
    
    //We search for the courses.
    sql = "SELECT * FROM Courses INNER JOIN Date ON Courses.CourseNum = Date.CourseNum";
    if (!(subject === "All Subjects")){
        sql += " WHERE Subject = \"" + subject + "\" AND (";
    } else {
        sql += " WHERE (";
    }
    sql += " CourseName LIKE \"%" + $('#CourseName').val() + "%\" OR" +
           " CourseCode LIKE \"%" + $('#CourseName').val() + "%\")";
   
    if (data.length === 0){
        sql += ";";
    } else {
        sql += " AND (";
    }
    for (i = 0; i < data.length; i++){
        element = data[i];
        sql += "Courses.CourseNum != " + element["CourseNum"] + " AND ";
    }
    if (data.length > 0) { 
        sql = sql.substr(0, sql.length - 5);
        sql += ");";
    }
  
    //Runs the SQL.
    runSQL(sql, populateCourses);
}
function populateCourses(data){
    //Clears the courses array.
    courses = {};
    
    //Creates the table.
    subjectTable = $( '#courses' );
    subjectTable.html('<tr>' +
                    '<th>Course Code</th>' +
                    '<th class=\"name\">Course Name</th>' +
                    '<th>Subject</th>' +
                    '<th class=\"date\">Date</th>' +
                    '<th>Options</th>' +
                '</tr>');
        
    //If error, we handle it.
    if (data === "error" || data.length === 0){
        $('#results').html("No courses were found.");
        return;
    } else {
        $('#results').html("");
    }
    
    //Loop through each of the courses.
    for (i = 0; i < data.length; i++){
        element = data[i];
        
        //Checks if last course was the same.
        if (i > 0 && element['CourseNum'] === data[i-1]['CourseNum']){
            $( '#' + element['CourseNum'] + 'Date' ).append('<br>' + element['DayOfWeek'] + ', ' + 
                    element['StartTime'] + ' - ' + element['EndTime']);
            
            //Adds in the two time elements.
            courses[element['CourseNum']]['StartTime'].push(element['StartTime']);
            courses[element['CourseNum']]['EndTime'].push(element['EndTime']);
            courses[element['CourseNum']]['DayOfWeek'].push(element['DayOfWeek']);
            courses[element['CourseNum']]['Length'].push(getLength(element['StartTime'], element['EndTime']));
            continue;
        } else {
            //Creates a new array for the course.
            courses[element['CourseNum']] = {};
            courses[element['CourseNum']]['StartTime'] = new Array;
            courses[element['CourseNum']]['EndTime'] = new Array;
            courses[element['CourseNum']]['DayOfWeek'] = new Array;
            courses[element['CourseNum']]['Length'] = new Array;
        }
        
        subjectTable.append('<tr>' + 
                '<td>' + element['CourseCode'] + '</td>' +
                '<td class=\"name\">' + element['CourseName'] + '</td>' +
                '<td>' + element['Subject'] + '</td>' +
                '<td class=\"date\" id="' + element['CourseNum'] + 'Date">' + element['DayOfWeek'] + ', ' + 
                    element['StartTime'] + ' - ' + element['EndTime'] + '</td>' +
                '<td id="' + element['CourseNum'] + 'Button"></td>' +
                '</tr>');
        
        //Pushes all the data.
        courses[element['CourseNum']]['CourseCode'] = element['CourseCode'];
        courses[element['CourseNum']]['CourseName'] = element['CourseName'];
        courses[element['CourseNum']]['Semester'] = element['Semester'];
        courses[element['CourseNum']]['Subject'] = element['Subject'];
        courses[element['CourseNum']]['Room'] = element['Room'];
        courses[element['CourseNum']]['StartTime'].push(element['StartTime']);
        courses[element['CourseNum']]['EndTime'].push(element['EndTime']);
        courses[element['CourseNum']]['DayOfWeek'].push(element['DayOfWeek']);
        courses[element['CourseNum']]['Length'].push(getLength(element['StartTime'], element['EndTime']));
        
        //Generates its enroll button.
        $( '#' + element['CourseNum'] + "Button" ).html(
                    '<button type="button" id="' + element['CourseNum'] +
                    'inButton" onclick=\'setupDialog("' + element['CourseNum'] + '");\'>' +  
                    'Enroll</button>');
    }
}

function receiveSubjects(data){
    //Loops through each of the subjects.
    for (i = 0; i < data.length; i++){
        element = data[i];
        
        //Adds in the option.
        $( '#SubjectName' ).append(
                '<option id="' + element['Subject'] + '">' +
                element['Subject'] + '</option>');
    }
}

function getLength(startTime, endTime){
    //Manages time elements.
    end = 0;
    start = 0;
    if (endTime.split(':')[1].substring(2, 4) === "pm" &&
            endTime.split(':')[0] !== '12')
        end = parseInt(endTime.split(':')[0]) + 12;
    else
        end = endTime.split(':')[0];
    if (startTime.split(':')[1].substring(2, 4) === "pm" &&
            startTime.split(':')[0] !== '12')
        start = parseInt(startTime.split(':')[0]) + 12;
    else
        start = startTime.split(':')[0];

    startT = new Date(2000, 0, 1, start, 
        startTime.split(':')[1].substring(0,2));
    endT = new Date(2000, 0, 1, end, 
        endTime.split(':')[1].substring(0,2));

    //Gets the difference between the time.
    diff = endT - startT;
    duration = Math.floor(diff / 1000 / 60 / 60);
    diff -= duration * 1000 * 60 * 60;
    duration += Math.floor(diff / 1000 / 60);
    
    return duration;
}

function generateButtons(courseNum){
    //Generate the button.
    element = courses[courseNum];
    for (i = 0; i < courses[courseNum]['StartTime'].length; i++){
        //Creates the element name.
        divID = element['StartTime'][i].split(':')[0] + 
                element['StartTime'][i].split(':')[1].substring(0, 2);
        if (element['StartTime'][i].split(':')[1].substring(2, 4) === "pm")
            divID += "p";
        
        //Checks if the last course was also a time.
        $( '#rightFloat' ).attr('onClick', $( '#rightFloat' ).attr('onClick') +
            'addCourse("' + element['CourseName'] + '","' + 
            element['Subject'] + '", "' + 
            element['CourseCode'] + '","' + element['Room'] + '", ' + 
            element['Semester'] + ', "' + divID + '", "' + 
            element['DayOfWeek'][i] + '", ' + element['Length'][i] + ');');
   }
   
   $( '#rightFloat' ).attr('onClick', $( '#rightFloat' ).attr('onClick') +
            "$( '#dialog' ).dialog( 'close' );");
}

function setupDialog(courseNum){
    //Sets the dialog up.
    $( '#rightFloat' ).show();
    $( '#rightFloat' ).attr('onClick', "");
    $( '#dlg-title').html("Confirm Enrollment Details:");
    $( '#dlg-text' ).html("Please confirm the details of this course before choosing to enroll. If you are not satisfied, press 'Cancel'.");
    $( '#modal-table' ).html("<tr>" +
                    "<th>Course Code</th>" +
                    "<th>Course Name</th>" +
                    "<th>Subject</th>" +
                    "<th>Date</th>" +
                "</tr>");
    $( '#dialog' ).attr("title", "Adding Course: " + courses[courseNum]["Subject"] + " " + courses[courseNum]["CourseCode"]);
    $( '#modal-table tr:last' ).after("<tr><td>" +
            courses[courseNum]["CourseCode"] + "</td><td class=\"name\">" + courses[courseNum]["CourseName"] + "</td><td>" + courses[courseNum]["Subject"] + "</td><td id=\"dat_column\" class=\"date\"></td></tr>");
    
    //Generates the date items.
    for (i = 0; i < courses[courseNum]['StartTime'].length; i++){
        if (i > 0) $('#dat_column').append("<br>");
        $('#dat_column').append(courses[courseNum]['DayOfWeek'][i] + ", " + 
                courses[courseNum]['StartTime'][i] + " - " + courses[courseNum]['EndTime'][i]);
    }
    
    $( '#dialog' ).dialog({ modal: true, width: 700 });
    $( '#dialog' ).prev(".ui-dialog-titlebar").css("background","#633e9c");
    
    //Generates the buttons.
    generateButtons(courseNum);
}

function addCourse(name, subCode, code, classroom, semester, startTime, day, len){    
    //First, we get the first time element.
    elementCode = '#';
    if (semester === 2) elementCode += 2;
    elementCode += day + startTime;
    
    //Selects the first element.
    startCell = $(elementCode);
    
    //Checks if the course has been added.
    var attr = $(elementCode).attr('rowspan');
    if (typeof attr !== typeof undefined && attr !== false) {
        //Already added.
        alert("Course has been already added.");
        return;
    }
    //We delete the rows below.
    index = startCell.index();  
    for (i = 1; i < (len / 0.5); i++) { 
        //Gets the next cell.
        nextCell = $(elementCode).closest('tr').next().children().eq(index);
        
        //Removes it.
        if (i !== 1)
            $(elementCode).remove();
        
        //Gets important next variables.
        index = nextCell.index();
        elementCode = '#' + nextCell.attr('id');
    }
    $(elementCode).remove();
        
    //Merges the new cells together.
    startCell.attr('rowspan', len / 0.5);
    
    //Add in information to table.
    startCell.html('<div class="remove"><input type="image" title="Remove Course" class="set" src="http://cs4474.muscedere.ca/images/remove2.png" alt="remove" onclick="removeCourse();"/></div>' +
                   '<div class="name">' + subCode +
                   '</div><div class="code">' + code +
                   '<div class="classroom">' + classroom +
                   '</div>');
           
    //Adds the tooltip attribute.
    startCell.attr('title', name);
    
    $(function() {
            $('#' + startCell.attr('id')).tooltip();
    });
}

function removeCourse(){
    //Sets the dialog up.
    $( '#rightFloat' ).hide();
    $( '#hider' ).hide();
    $( '#modal-table' ).html("");
    $( '#dlg-title').html("Course Removal:");
    $( '#dlg-text' ).html("Not implemeted yet.");
    $( '#dialog' ).attr("title", "Course Removal");

    
    $( '#dialog' ).dialog({ modal: true, width: 700 });
    $( '#dialog' ).prev(".ui-dialog-titlebar").css("background","#633e9c");
}