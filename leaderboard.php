<?php
session_start();
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "Not logged in"]);
    exit;
}

// Points via POST JSON
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['points'])) {
        echo json_encode(["success" => false, "error" => "No points received"]);
        exit;
    }

    $points = intval($data['points']);
    $user_id = $_SESSION['user_id'];

    $sql = "UPDATE Highacore SET points = points + ? WHERE ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $points, $user_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "newPoints" => $points]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    exit;
}

// Otherwise GET request → return leaderboard HTML
$sql = "SELECT users.username, Highacore.points FROM users JOIN Highacore ON users.ID = Highacore.ID ORDER BY Highacore.points DESC LIMIT 10";
$result = mysqli_query($conn, $sql);

while ($row = mysqli_fetch_assoc($result)) {
    echo "<li>{$row['username']}: {$row['points']} poäng</li>";
}
?>
