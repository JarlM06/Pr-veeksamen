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
    die("Connection failed: " . $conn->connect_error);
}

// Hent innsendte verdier fra skjemaet
$code = $_POST['input-newCode'];
$name = $_POST['input-name'];

// Utfør spørring for å legge til et nytt objekt i databasen
$result = $conn->query("INSERT INTO codes (Name, Code) VALUES ('$name', '$code')");

// Lukk tilkoblingen
$conn->close();

// Returnerer til html siden
header("Location: http://172.20.128.85/Frontend/index.html"); // ! OBS ! Endre denne når den blir lagt inn på serveren
exit();

?>