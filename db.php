<?php
$host = "websrv2-age.ntigskovde.se";
$dbname = "ntigskov_websrv2-age";
$username = "ntigskov_websrv2-age";
$password = 'v-JV$H^Aa+1b';

$conn = mysqli_connect($host, $username, $password, $dbname);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>