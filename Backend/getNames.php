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

// Query for å hente 'Name' verdiene fra 'codes' table
$sql = "SELECT Name FROM codes";
$result = $conn->query($sql);

// Lag dropdown list
$dropdown_html = '<select name="input-code">';
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $name = htmlspecialchars($row['Name']);
        $dropdown_html .= "<option value=\"$name\">$name</option>";
    }
} else {
    $dropdown_html .= '<option value="">No codes found</option>';
}
$dropdown_html .= '</select>';

// Lukk tilkobling
$conn->close();

// Echo HTML dropdownen
echo $dropdown_html;

?>