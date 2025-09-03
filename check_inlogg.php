//? Gör så att du inte kan komma åt spel.php utan att vara inloggad
<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}
?>