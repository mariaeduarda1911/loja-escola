function atualizarContadorSacola() {
    const cartCount = document.querySelector("#cartCount");

    if (!cartCount) return;

    const sacola = JSON.parse(sessionStorage.getItem("sacola")) || [];

    const quantidadeTotal = sacola.reduce((total, item) => {
        return total + item.quantidade;
    }, 0);

    cartCount.textContent = quantidadeTotal;
}

const inputFiltro = document.querySelector("#filtroProduto");
const produtos = document.querySelectorAll(".product-item");
const mensagemFiltro = document.querySelector("#mensagemFiltro");

function filtrarProdutos() {
    const termo = inputFiltro.value.trim().toLowerCase();
    let quantidadeVisivel = 0;

    produtos.forEach((produto) => {
        const nome = produto.dataset.name.toLowerCase();
        const deveAparecer = nome.includes(termo);

        produto.hidden = !deveAparecer;

        if (deveAparecer) {
            quantidadeVisivel += 1;
        }
    });

    if (!termo) {
        mensagemFiltro.textContent = "";
        return;
    }

    mensagemFiltro.textContent = quantidadeVisivel === 0
        ? "Nenhum produto encontrado."
        : `${quantidadeVisivel} produto(s) encontrado(s).`;
}

inputFiltro?.addEventListener("input", filtrarProdutos);

// Atualiza a quantidade de itens na sacola ao carregar a página.
atualizarContadorSacola();