let usuarioId = null; // Variável global para guardar o id do usuário

document.getElementById('btCadastrar').addEventListener('click', () => {
    const nome = document.querySelector('input[placeholder="Nome"]').value;
    const idade = document.querySelector('input[placeholder="Idade"]').value;
    const email = document.querySelector('input[placeholder="Email"]').value;

    const usuario = {
        name: nome,
        age: idade,
        email: email
    };

    fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 409) {
            throw new Error('Usuário já cadastrado!');
        }
        throw new Error('Erro ao cadastrar usuário');
    })
    .then(data => {
        usuarioId = data.id;
        document.getElementById('nome').innerText = data.name;
        document.getElementById('idade').innerText = data.age;
        document.getElementById('email').innerText = data.email;
    })
    .catch(error => {
        if (error.message === 'Usuário já cadastrado!') {
            alert('Já existe um usuário com esse e-mail!');
        } else {
            console.error('Erro:', error);
        }
    });
});

document.getElementById('btn-lixeira').addEventListener('click', () => {
    if (!usuarioId) {
        alert('Nenhum usuário para deletar!');
        return;
    }

    fetch(`http://localhost:3000/usuarios/${usuarioId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Usuário deletado com sucesso!');
            document.getElementById('nome').innerText = '';
            document.getElementById('idade').innerText = '';
            document.getElementById('email').innerText = '';
            usuarioId = null;
        } else {
            throw new Error('Erro ao deletar usuário');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});