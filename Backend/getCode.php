<?php
header('Content-Type: application/json');

// Informasjon om MySQL server og login
$servername = "172.20.128.85";
$username = "root";
$password = "Akademiet99";
$dbname = "proveeksamen";

// Lager kobling til MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Sjekker koblingen
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error])); // Return JSON error
}

// Hent data fra POST request
$name = trim(file_get_contents('php://input'));

// Bruker "escape input" for å hindre SQL injection
$name = $conn->real_escape_string($name);

// Henter dataen fra databasen
$query = "SELECT * FROM codes WHERE Name = '$name'";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    // Henter resultatene som en array
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
} else {
    echo json_encode([]);
}

// Stenger koblingen til databasen
$conn->close();
?>
