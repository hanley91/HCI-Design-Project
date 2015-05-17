$(function(){
        $("#timetable").load("timetable.html", function(){
            //Hard coded courses
            addCourse("Introduction to Computer Science", "CompSci", "1026a", "UCC-28", 1, "200p", "Mon", 2);
            addCourse("Human-Computer Interaction", "CompSci", "4474b", "MC-35", 2, "100p", "Tues", 3);
            addCourse("The World of Biology", "Biology", "1000a", "NCB-100", 1, "1000a", "Wed", 1);
            addCourse("Political Science: Introduction", "PoliSci", "1000b", "UCC-415", 2, "330p", "Mon", 2);
      });
});

function generatePDF(){
    alert("Not implemented. A PDF would download from here.");
}

function print(){
    alert("Not implemented. If a user presses Ctrl+P, new CSS " +
           "code would be generated that properly formats the schedule " + 
           "for printing.");
}

function addCourse(name, subCode, code, classroom, semester, startTime, day, len){    
    //First, we get the first time element.
    elementCode = '#';
    if (semester === 2) elementCode += 2;
    elementCode += day + startTime;
    
    //Selects the first element.
    startCell = $(elementCode);
    
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
    startCell.html('<div class="name">' + subCode +
                   '</div><div class="code">' + code +
                   '<div class="classroom">' + classroom +
                   '</div>');
           
    //Adds the tooltip attribute.
    startCell.attr('title', name);
    
    $(function() {
            $('#' + startCell.attr('id')).tooltip();
    });
}