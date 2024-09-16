document.getElementById('check-btn').addEventListener('click', checkPalindrome);

document.getElementById('text-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        checkPalindrome();
    }
});

function checkPalindrome() {
    const inputText = document.getElementById('text-input').value;
    const resultElement = document.getElementById('result');

    if (!inputText.trim()) {
        alert('Please input a value');
        return;
    }

    const sanitizedText = inputText
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

    const isPalindrome = sanitizedText === sanitizedText.split('').reverse().join('');

    if (isPalindrome) {
        resultElement.textContent = `${inputText} is a palindrome`;
    } else {
        resultElement.textContent = `${inputText} is not a palindrome`;
    }

    document.getElementById('text-input').value = '';
}
