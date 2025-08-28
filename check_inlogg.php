<?php
session_start();
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Hämta användaren
    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $user = mysqli_fetch_assoc($result);

    if ($user && $user['password'] === $password) {
        // Hämta poäng från points-tabellen
        $sql_points = "SELECT points FROM points WHERE ID = ?";
        $stmt_points = mysqli_prepare($conn, $sql_points);
        mysqli_stmt_bind_param($stmt_points, "i", $user['ID']);
        mysqli_stmt_execute($stmt_points);
        $result_points = mysqli_stmt_get_result($stmt_points);
        $points_row = mysqli_fetch_assoc($result_points);

        $_SESSION['username'] = $username;
        $_SESSION['user_id'] = $user['ID'];
        $_SESSION['points'] = $points_row ? $points_row['points'] : 0;

        header("Location: game.php");
        exit();
    } else if (!$user) {
        // Skapa nytt konto
        $sql_insert = "INSERT INTO users (username, password) VALUES (?, ?)";
        $stmt_insert = mysqli_prepare($conn, $sql_insert);
        mysqli_stmt_bind_param($stmt_insert, "ss", $username, $password);
        mysqli_stmt_execute($stmt_insert);

        // Hämta det nya användar-ID:t
        $new_user_id = mysqli_insert_id($conn);

        // Skapa rad i points-tabellen
        $sql_points_insert = "INSERT INTO points (ID, points) VALUES (?, 0)";
        $stmt_points_insert = mysqli_prepare($conn, $sql_points_insert);
        mysqli_stmt_bind_param($stmt_points_insert, "i", $new_user_id);
        mysqli_stmt_execute($stmt_points_insert);

        $_SESSION['username'] = $username;
        $_SESSION['user_id'] = $new_user_id;
        $_SESSION['points'] = 0;

        header("Location: game.php");
        exit();
    } else {
        $error = "Fel användarnamn eller lösenord!";
    }
}
?>