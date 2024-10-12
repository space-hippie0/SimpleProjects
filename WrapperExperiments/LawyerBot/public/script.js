document.getElementById('lawForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const response = await fetch('/submit', {
        method: 'POST',
        body: new URLSearchParams(formData),
    });

    const result = await response.text();
    document.getElementById('response').innerText = result;
});

