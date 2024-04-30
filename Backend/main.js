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
            console.log('Code:', code); // Handle the resolved `Code`
            const encryptedText = substituteEncrypt(text, code);
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
            console.log('Code:', code); // Handle the resolved `Code`
            const decryptedText = substituteDecrypt(text, code);
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