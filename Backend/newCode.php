<?php

// Informasjon om MySQL server og login
$servername = "172.20.128.85";
$username = "root";
$password = "Akademiet99";
$dbname = "proveeksamen";

// Lager kobling til MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Sjekker koblingen
if ($conn->connect_error) {
    // Send JSON svar som indikerer tilkoblings feil
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Sjekker om dataene eksisterer
if (isset($data['input-newCode']) && isset($data['input-name'])) {
    // Les input data fra AJAX request
    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);

    // Henter dataen som skal brukes
    $code = $data['input-newCode'];
    $name = $data['input-name'];

    // Bruker 'prepare' for å legge til data i databasen
    $stmt = $conn->prepare("INSERT INTO codes (Name, Code) VALUES (?, ?)");
    $stmt->bind_param("ss", $name, $code);

    if($stmt->execute()) {
        // Hvis den får lagt til, sender den en suksess respons
        header("Content-Type: application/json");
        echo json_encode(["status" => "success", "message" => "Data inserted successfully"]);
    } else {
        // Hvis den ikke fikk lag til, sender den error tilbake
        header("Content-Type: application/json");
        echo json_encode(["status" => "error", "message" => "Failed to insert data"]);
    }

    // Stenger 'prepared'
    $stmt->close();
} else {
    // Sender en error hvis dataene ikke eksisterer
    header("Content-Type: appliaction/json");
    echo json_encode(["status" => "error", "message" => "Missing input data"]);
}

// Stenger koblingen til databasen
$conn->close();

?>