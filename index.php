<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inlogg</title>
    <link rel="stylesheet" href="skepp.css">
    <script src="login.js" defer></script>
    <?php
    require_once 'db.php';
    require_once 'check_inlogg.php';
    ?>
</head>
<body>
    <br>
    <h1>Logga in för sänka skäpp</h1>
    <p>Om du inte har ett konto så gör du ett nytt igenom att fylla i fälten nedan.</p> <br><br>
    <?php if (isset($error)) echo "<p style='color:red;'>$error</p>"; ?>
    <form method="POST" header="spel.php">
        <input type="text" name="username" placeholder="Användarnamn" required>
        <input type="password" name="password" placeholder="Lösenord" required> <br>
        <button type="submit">Logga in</button>
    </form>
</body>
</html>