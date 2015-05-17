<?php

$htmlFileInstance = fopen("speedDial.html", "w") or die("Unable to open file!");
$codeInjection = "HTML Updated content will go here…";
fwrite($htmlFileInstance, $codeInjection);
fclose($htmlFileInstance);

?>