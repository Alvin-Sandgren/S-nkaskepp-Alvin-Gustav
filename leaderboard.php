<?php
    require_once 'db.php';
    require_once 'check_inlogg.php';
    $sql = "SELECT users.username, points.points FROM users JOIN points ON users.ID = points.ID ORDER BY points.points DESC LIMIT 10";
    $result = mysqli_query($conn, $sql);
    while ($row = mysqli_fetch_assoc($result)) {
        echo "<li>{$row['username']}: {$row['points']} poäng</li>";
    }
    ?>