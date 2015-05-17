function elementShow(elementID, elementMessage){
    //Sets the tip text.
    $( '.' + elementID ).html(elementMessage);
}

function elementHide(elementID){
    //Sets the tip back to default.
    $( '.' + elementID ).html("Select a task above.");
}