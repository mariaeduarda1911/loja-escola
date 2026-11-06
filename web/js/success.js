const mensagemCliente = document.querySelector("#mensagemCliente");
const numeroPedido = document.querySelector("#numeroPedido");

const nome = sessionStorage.getItem("clienteNome");
const pedido = sessionStorage.getItem("pedidoNumero");

// Impede o acesso direto à página de confirmação
if (!nome || !pedido) {
  window.location.href = "index.html";
}

// Mostra o nome do cliente
if (nome) {
  mensagemCliente.textContent =
    `${nome}, seus dados foram validados e o fluxo educacional chegou ao final.`;
}

// Mostra o número do pedido
if (pedido) {
  numeroPedido.textContent = pedido;
}