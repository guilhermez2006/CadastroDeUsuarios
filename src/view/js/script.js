const API_URL = "http://localhost:3000";

const authContainer = document.getElementById("auth-container");
const dashboardContainer = document.getElementById("dashboard-container");

const loginForm = document.getElementById("login-form");
const cadastroForm = document.getElementById("cadastro-form");

const listaUsuarios = document.getElementById("lista-usuarios-body");
const totalUsers = document.getElementById("total-users");
const pesquisa = document.getElementById("pesquisa");

const editModal = document.getElementById("edit-modal");
const editName = document.getElementById("edit-name");
const editAge = document.getElementById("edit-age");
const editEmail = document.getElementById("edit-email");

const btSalvar = document.getElementById("btSalvar");
const btCancelar = document.getElementById("btCancelar");

const toast = document.getElementById("toast");

let usuarios = [];
let usuarioEditando = null;

document.getElementById("go-to-cadastro").addEventListener("click", () => {
  loginForm.classList.add("hidden");
  cadastroForm.classList.remove("hidden");
  document.getElementById("title").innerText = "Criar Conta";
});

document.getElementById("go-to-login").addEventListener("click", () => {
  cadastroForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  document.getElementById("title").innerText = "Bem-vindo";
});

document
  .getElementById("btCadastrar")
  .addEventListener("click", cadastrarUsuario);
document.getElementById("btLogin").addEventListener("click", login);
document.getElementById("btLogout").addEventListener("click", logout);

pesquisa.addEventListener("input", pesquisarUsuarios);

btCancelar.addEventListener("click", () => {
  editModal.classList.add("hidden");
});

btSalvar.addEventListener("click", salvarEdicao);

function mostrarMensagem(tipo, mensagem) {
  toast.className = "";
  toast.classList.add(tipo);
  toast.classList.add("show");
  toast.textContent = mensagem;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function verificarSessao() {
  const token = localStorage.getItem("token");

  if (!token) {
    authContainer.classList.remove("hidden");
    dashboardContainer.classList.add("hidden");
    return;
  }

  authContainer.classList.add("hidden");
  dashboardContainer.classList.remove("hidden");

  carregarUsuarios();
}

async function cadastrarUsuario() {
  const name = document.getElementById("cad-nome").value.trim();
  const age = document.getElementById("cad-idade").value.trim();
  const email = document.getElementById("cad-email").value.trim();
  const password = document.getElementById("cad-password").value.trim();

  if (!name || !age || !email || !password) {
    mostrarMensagem("warning", "Preencha todos os campos.");
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        age,
        email,
        password,
      }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem("error", dados.error);
      return;
    }

    mostrarMensagem("success", "Cadastro realizado com sucesso.");
    document.getElementById("go-to-login").click();
  } catch {
    mostrarMensagem("error", "Erro ao conectar ao servidor.");
  }
}

async function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    mostrarMensagem("warning", "Informe email e senha.");
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem("error", dados.error);
      return;
    }

    localStorage.setItem("token", dados.token);
    mostrarMensagem("success", `Bem-vindo, ${dados.user.name}!`);

    verificarSessao();
  } catch {
    mostrarMensagem("error", "Erro ao conectar ao servidor.");
  }
}

async function carregarUsuarios() {
  const token = localStorage.getItem("token");

  try {
    const resposta = await fetch(`${API_URL}/usuarios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (resposta.status === 401) {
      logout();
      return;
    }

    usuarios = await resposta.json();
    atualizarTabela(usuarios);
  } catch {
    mostrarMensagem("error", "Erro ao carregar usuários.");
  }
}

function atualizarTabela(lista) {
  listaUsuarios.innerHTML = "";
  totalUsers.textContent = `${lista.length} usuário(s) cadastrado(s)`;

  if (lista.length === 0) {
    listaUsuarios.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;">
          Nenhum usuário encontrado.
        </td>
      </tr>
    `;
    return;
  }

  lista.forEach((usuario) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${usuario.name}</td>
      <td>${usuario.age}</td>
      <td>${usuario.email}</td>
      <td>
        <button class="btn-action btn-edit" data-id="${usuario.id}">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn-action btn-delete" data-id="${usuario.id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    listaUsuarios.appendChild(tr);
  });

  document.querySelectorAll(".btn-delete").forEach((botao) => {
    botao.addEventListener("click", () => {
      deletarUsuario(botao.dataset.id);
    });
  });

  document.querySelectorAll(".btn-edit").forEach((botao) => {
    botao.addEventListener("click", () => {
      abrirModal(botao.dataset.id);
    });
  });
}

function pesquisarUsuarios() {
  const texto = pesquisa.value.toLowerCase();

  const filtrados = usuarios.filter((usuario) => {
    return (
      usuario.name.toLowerCase().includes(texto) ||
      usuario.email.toLowerCase().includes(texto)
    );
  });

  atualizarTabela(filtrados);
}

async function deletarUsuario(id) {
  const confirmar = confirm("Deseja realmente excluir este usuário?");

  if (!confirmar) return;

  const token = localStorage.getItem("token");

  try {
    const resposta = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resposta.ok) {
      mostrarMensagem("error", "Erro ao excluir usuário.");
      return;
    }

    mostrarMensagem("success", "Usuário excluído com sucesso.");
    carregarUsuarios();
  } catch {
    mostrarMensagem("error", "Erro ao conectar ao servidor.");
  }
}

function abrirModal(id) {
  usuarioEditando = usuarios.find((usuario) => usuario.id === id);

  if (!usuarioEditando) return;

  editName.value = usuarioEditando.name;
  editAge.value = usuarioEditando.age;
  editEmail.value = usuarioEditando.email;

  editModal.classList.remove("hidden");
}

async function salvarEdicao() {
  const name = editName.value.trim();
  const age = editAge.value.trim();
  const email = editEmail.value.trim();

  if (!name || !age || !email) {
    mostrarMensagem("warning", "Preencha todos os campos.");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const resposta = await fetch(`${API_URL}/usuarios/${usuarioEditando.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        age: Number(age),
        email,
      }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem("error", dados.error || "Erro ao editar usuário.");
      return;
    }

    editModal.classList.add("hidden");
    usuarioEditando = null;

    mostrarMensagem("success", "Usuário atualizado com sucesso.");
    carregarUsuarios();
  } catch {
    mostrarMensagem("error", "Erro ao conectar ao servidor.");
  }
}

function logout() {
  localStorage.removeItem("token");

  authContainer.classList.remove("hidden");
  dashboardContainer.classList.add("hidden");

  listaUsuarios.innerHTML = "";
  pesquisa.value = "";

  mostrarMensagem("success", "Sessão encerrada.");
}

verificarSessao();
