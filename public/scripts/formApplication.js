document.getElementById('applicationForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    console.log(name);
    console.log(description);
    console.log(JSON.stringify({ name: name, description: description }));

    try {
        const response = await fetch('http://localhost:3000/applications/create-application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, description: description }),
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('result').textContent = 'Заявка успешно создана!';
        } else {
            document.getElementById('result').textContent = 'Ошибка! Заявка не создана.';
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
});