<?php
$conn = mysqli_connect('localhost', 'ntigskov_websrv2-age', 'ntigskov_webserv2_age', 'v-JV$H^Aa+1b');
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
} else {
    echo"Connected successfully";
}
?>