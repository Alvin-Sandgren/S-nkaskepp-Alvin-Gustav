<?php
    require_once 'db.php';
    $sql = "SELECT users.username, Highacore.points 
            FROM users 
            JOIN Highacore ON users.ID = Highacore.ID 
            ORDER BY Highacore.points DESC 
            LIMIT 10";
    $result = mysqli_query($conn, $sql);
    while ($row = mysqli_fetch_assoc($result)) {
        echo "<li>{$row['username']}: {$row['points']} poäng</li>";
    }
?>