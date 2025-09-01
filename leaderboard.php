<?php
    require_once 'db.php';
    require_once 'check_inlogg.php';
    echo '<script src="skepp.js"></script>';
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['points'])) {
            echo json_encode(["success" => false, "error" => "No points received"]);
            exit;
        }

        $points = intval($data['points']);
        $user_id = $_SESSION['user_id'];

        $sql = "UPDATE points SET points = points + ? WHERE ID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $points, $user_id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "newPoints" => $points]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        exit;
    }

    $sql = "SELECT users.username, points.points FROM users JOIN points ON users.ID = points.ID ORDER BY points.points DESC LIMIT 10";
    $result = mysqli_query($conn, $sql);
    while ($row = mysqli_fetch_assoc($result)) {
        echo "<li>{$row['username']}: {$row['points']} poäng</li>";
    }
?>