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
            const output = document.getElementById("output");
            output.innerHTML = decryptedText;
            console.log(decryptedText);
        })
        .catch((error) => {
            console.error('Error fetching code:', error); // Handle errors
        });
}

// The function that sends an AJAX request to the PHP script
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
        return response.json(); // Expecting a JSON response from the server
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          return data[0].Code; // Return the first `Code` from the data
        } else {
          throw new Error('No data found'); // If no data is found
        }
      });
}

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
            // Reloader vinduet
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