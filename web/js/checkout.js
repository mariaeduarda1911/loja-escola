
const form = document.querySelector("#checkoutForm");

const cepInput = document.querySelector("#cep");
const buscarCepButton = document.querySelector("#buscarCep");
const cepFeedback = document.querySelector("#cepFeedback");

const resumoCompra = document.querySelector("#resumoCompra");
const checkoutFeedback = document.querySelector("#checkoutFeedback");

// Recupera os produtos da sacola
const sacola = JSON.parse(sessionStorage.getItem("sacola")) || [];

// Valor fixo do frete
const frete = 15.90;

// Formata valores para reais
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Atualiza o contador da sacola
function atualizarContadorSacola() {
    const cartCount = document.querySelector("#cartCount");

    if (!cartCount) return;

    const quantidadeTotal = sacola.reduce((total, item) => {
        return total + item.quantidade;
    }, 0);

    cartCount.textContent = quantidadeTotal;
}

// Exibe todos os produtos no resumo da compra
function exibirResumo() {
    if (sacola.length === 0) {
        resumoCompra.innerHTML = `
            <p class="text-secondary">
                Sua sacola está vazia.
            </p>

            <a href="index.html" class="btn btn-dark">
                Escolher uma invenção
            </a>
        `;

        return;
    }

    let subtotal = 0;

    const produtosHTML = sacola.map((item) => {
        const produto = item.produto;
        const quantidade = item.quantidade;

        const totalProduto = produto.preco * quantidade;

        subtotal += totalProduto;

        return `
            <div class="mb-3">

                <h3 class="h5">${produto.nome}</h3>

                <p class="text-secondary mb-2">
                    ${produto.categoria}
                </p>

                <p class="mb-2">
                    Quantidade: ${quantidade}
                </p>

                <p class="mb-2">
                    Preço unitário:
                    ${formatarPreco(produto.preco)}
                </p>

                <p class="price">
                    Subtotal:
                    ${formatarPreco(totalProduto)}
                </p>

            </div>

            <hr>
        `;
    }).join("");

    const total = subtotal + frete;

    resumoCompra.innerHTML = `
        ${produtosHTML}

        <div class="d-flex justify-content-between mb-2">
            <span>Produtos</span>
            <span>${formatarPreco(subtotal)}</span>
        </div>

        <div class="d-flex justify-content-between mb-2">
            <span>Frete</span>
            <span>${formatarPreco(frete)}</span>
        </div>

        <hr>

        <div class="d-flex justify-content-between">
            <strong>Total</strong>
            <strong>${formatarPreco(total)}</strong>
        </div>
    `;
}

// Remove caracteres que não são números
function somenteNumeros(valor) {
    return valor.replace(/\D/g, "");
}

// Formata o CEP
function formatarCep(valor) {
    const numeros = somenteNumeros(valor).slice(0, 8);

    if (numeros.length <= 5) {
        return numeros;
    }

    return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
}

// Verifica se o CEP possui oito números
function cepValido(cep) {
    return somenteNumeros(cep).length === 8;
}

// Formata o CEP enquanto o usuário digita
cepInput?.addEventListener("input", () => {
    cepInput.value = formatarCep(cepInput.value);
    cepInput.setCustomValidity("");

    if (cepFeedback) {
        cepFeedback.textContent = "";
    }
});

// Consulta o CEP na API ViaCEP
async function buscarCep() {
    const cep = somenteNumeros(cepInput.value);

    cepFeedback.textContent = "";

    if (!cepValido(cep)) {
        cepFeedback.textContent =
            "Digite um CEP válido com oito números.";

        cepInput.focus();
        return;
    }

    buscarCepButton.disabled = true;
    buscarCepButton.textContent = "Buscando...";

    cepFeedback.textContent = "Consultando endereço...";

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`
        );

        if (!resposta.ok) {
            throw new Error("Erro ao consultar o CEP.");
        }

        const dados = await resposta.json();

        if (dados.erro) {
            throw new Error("CEP não encontrado.");
        }

        document.querySelector("#logradouro").value =
            dados.logradouro || "";

        document.querySelector("#bairro").value =
            dados.bairro || "";

        document.querySelector("#cidade").value =
            dados.localidade || "";

        document.querySelector("#estado").value =
            dados.uf || "";

        cepFeedback.textContent =
            "Endereço encontrado com sucesso!";

    } catch (erro) {
        cepFeedback.textContent =
            erro.message ||
            "Não foi possível consultar o CEP. Tente novamente.";

    } finally {
        buscarCepButton.disabled = false;
        buscarCepButton.textContent = "Buscar";
    }
}

// Evento do botão de busca do CEP
buscarCepButton?.addEventListener("click", buscarCep);

// Finalização da compra
form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (sacola.length === 0) {
        checkoutFeedback.textContent =
            "Sua sacola está vazia. Escolha um produto antes de continuar.";

        return;
    }

    cepInput.setCustomValidity(
        cepValido(cepInput.value) ? "" : "CEP inválido"
    );

    if (!form.checkValidity()) {
        form.classList.add("was-validated");

        form.querySelector(":invalid")?.focus();

        return;
    }

    const nome = document.querySelector("#nome").value.trim();

    // Calcula o subtotal de todos os produtos
    const subtotal = sacola.reduce((total, item) => {
        return total + (item.produto.preco * item.quantidade);
    }, 0);

    // Calcula o valor total da compra
    const total = subtotal + frete;

    // Salva o nome do cliente
    sessionStorage.setItem("clienteNome", nome);

    // Gera o número do pedido
    sessionStorage.setItem(
        "pedidoNumero",
        `PED-${Math.floor(100000 + Math.random() * 900000)}`
    );

    // Salva todos os dados do pedido
    sessionStorage.setItem(
        "resumoPedido",
        JSON.stringify({
            sacola: sacola,
            subtotal: subtotal,
            frete: frete,
            total: total
        })
    );

    // Marca que a compra foi finalizada
    sessionStorage.setItem("compraFinalizada", "true");

    // Redireciona para a página de sucesso
    window.location.href = "sucesso.html";
});

// Carrega o resumo quando a página abre
exibirResumo();
atualizarContadorSacola();
