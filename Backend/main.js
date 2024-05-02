// Funksjon for å kryptere tekst
function encrypt(event) {
    // Hindrer default form submit
    event.preventDefault();

    // Hent data fra form
    var form = event.target;
    var formData = new FormData(form);

    // Ekstrakt individuell data fra formData
    var name = formData.get('input-code');
    var text = formData.get('input-text');

    fetchCode(name)
        .then((code) => {
            const encryptedText = substituteEncrypt(text, code);
            // Skriver ut den krypterte teksten
            const output = document.getElementById("output");
            output.innerHTML = encryptedText;
            console.log(encryptedText);
        })
        .catch((error) => {
            console.error('Error fetching code:', error); // Handle errors
        });
}

// Funksjon for å dekryptere tekst
function decrypt(event) {
    // Hindrer default form submit
    event.preventDefault();

    // Hent data fra form
    var form = event.target;
    var formData = new FormData(form);

    // Ekstrakt individuell data fra formData
    var name = formData.get('input-code');
    var text = formData.get('input-text');

    fetchCode(name)
        .then((code) => {
            const decryptedText = substituteDecrypt(text, code);
            // Skriver ut den dekrypterte teksten
            const output = document.getElementById("output");
            output.innerHTML = decryptedText;
            console.log(decryptedText);
        })
        .catch((error) => {
            console.error('Error fetching code:', error);
        });
}

// Funksjon som sender en AJAX request til PHP scriptet
function fetchCode(name) {
    return fetch('http://172.20.128.85/Backend/getCode.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: name,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          return data[0].Code; // Returnere then første koden fra dataene
        } else {
          throw new Error('No data found');
        }
      });
}

// Funksjon som lager et krypterings "map" basert på en kode
function generateSubstitutionMap(key) {
    const baseAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shuffledAlphabet = baseAlphabet.split('');
    
    let keyHash = Array.from(key).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let i = shuffledAlphabet.length - 1; i > 0; i--) {
        const j = (keyHash + i) % shuffledAlphabet.length;
        [shuffledAlphabet[i], shuffledAlphabet[j]] = [shuffledAlphabet[j], shuffledAlphabet[i]];
    }
    
    const substitutionMap = {};
    baseAlphabet.split('').forEach((char, index) => {
        substitutionMap[char] = shuffledAlphabet[index];
    });
    
    return substitutionMap;
}

// Funksjon som krypterer tekst ved bruk av "substitution map" laget med koden
function substituteEncrypt(text, key) {
    const substitutionMap = generateSubstitutionMap(key);
    let encrypted = '';
    for (const char of text) {
        if (substitutionMap[char]) {
            encrypted += substitutionMap[char];
        } else {
            encrypted += char;
        }
    }
    return encrypted;
}

// Funksjon som dekrypterer tekst ved bruk av "substitution map" laget med koden
function substituteDecrypt(text, key) {
    const substitutionMap = generateSubstitutionMap(key);
    const reverseSubstitutionMap = {};
    
    for (const [key, value] of Object.entries(substitutionMap)) {
        reverseSubstitutionMap[value] = key;
    }
    
    let decrypted = '';
    for (const char of text) {
        if (reverseSubstitutionMap[char]) {
            decrypted += reverseSubstitutionMap[char];
        } else {
            decrypted += char;
        }
    }
    return decrypted;
}

// Funksjon for å legge til en ny kode i databasen
function newCode(event) {
    // Hindrer default form submit
    event.preventDefault();

    // Hent data fra form
    var form = event.target;
    var formData = new FormData(form);

    // Ekstrakt individuell data fra formData
    var name = formData.get('input-name');
    var code = createRandomCode(20);

    // Lager et objekt som inneholder all dataen
    const data = {
        "input-newCode": code,
        "input-name": name
    };

    insertCode(data);
}

// Funksjon som snakker med PHP
function insertCode(data) {
    // Sender en POST-request til php scriptet
    fetch("http://172.20.128.85/Backend/newCode.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(json => {
        if (json.status === "success") {
            alert("Data inserted succesfully");
            // "Reloader" vinduet
            location.reload();
        } else {
            console.error("Error", json.message);
            alert("Failed to insert data: " + json.message);
        }
    })
    .catch(error => {
        console.error("Fetch error:", error);
        alert("An error occurred: " + error.message);
    })
}

// Funksjon som lager en tilfeldig kode
function createRandomCode(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Funksjon som kopierer 'ouput' teksten til utklippstavlen
function copy() {
    // Hent tekst området
    var element = document.getElementById("output");
  
    const selection = window.getSelection();
    const range = document.createRange();
    
    // Velger tekst-innholdet
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);

    // Prøver å kopiere
    const success = document.execCommand('copy');
    
    if (success) {
        console.log("Text copied to clipboard.");
    } else {
        console.error("Failed to copy. Please use Ctrl+C.");
    }

    // "Deselect" teksten
    selection.removeAllRanges();
}