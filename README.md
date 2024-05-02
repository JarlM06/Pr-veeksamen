# Prøveeksamen
Prøveeksamen i driftstøtte, brukerstøtte og utvikling.

### Om prosjektet
<b>IP: http://172.20.128.85/Frontend/</b>

Programmet jeg skal lage er et krypterings-program. Brukeren kan velge mellom en liste av såkalte "koder". Disse kodene er det som brukes for å kryptere/dekryptere tekst. Brukeren kan skrive både ord, tall, symboler og hele setninger som skal brukes. De fleste symboler (inkludert mellomrom) vil bli ignorert i krypteringen. Brukerene får aldri se selve koden, men heller navnet som er tilgitt den tilhørende koden. I tillegg kan brukeren legge til en ny kode. Det gjør de ved å skrive inn et navn, og så vil den tilhørende koden bli tilfeldig generert av programmet.

Programmet bruker HTML og CSS for frontend koding, og JavaScript og PHP for backend koding. Programmet kjører på en Apache2 server, mens databasen kjører på en MariaDB server. I tillegg brukes det SQL i PHP scriptene, for å snakke med databasen.

### Filene
``index.html`` → Programmet bruker bare en HTML side, så det er denne siden brukeren alltid vil kunne se.

``styles.css`` → Generell CSS for HTML siden.

``main.js`` → All JavaScript ligger her. Det er her krypteringen og dekrypteringen blir gjort. I tillegg kalles flere av PHP scriptene gjennom JavaScript, i tillegg til at den gjør flere andre viktige funksjoner.

``newCode.php`` → PHP for å legge til en ny "kode" i databasen.

``getNames.php`` → PHP som henter alle navnene (som tilhører kodene) i databasen og lager en dropdown list med det.

``getCode.php`` → PHP som henter koden tilhørende det navnet brukeren har valgt.

### Spesifikasjoner
