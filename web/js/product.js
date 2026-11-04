
const produtos = [
    {
        id: 1,
        nome: "Guarda-Chuva de Bolso",
        categoria: "Acessórios mágicos",
        preco: 29.90,
        descricao: "Prevê exatamente onde a próxima gota de chuva vai cair.",
        regra: "Cabe em um bolso",
        imagem: "img/guardachuva.png",
        detalhes: [
            "Cabe facilmente em qualquer bolso.",
            "Prevê o local exato onde a próxima gota vai cair.",
            "Possui tecido impermeável e estrutura retrátil.",
            "Ideal para dias de chuva imprevisíveis."
        ]
    },
    {
        id: 2,
        nome: "Estação Formiga Astronauta",
        categoria: "Universo miniatura",
        preco: 89.90,
        descricao: "Um módulo espacial minúsculo para descanso entre viagens intergalácticas.",
        regra: "Serve em uma formiga",
        imagem: "img/estacao.png",
        detalhes: [
            "Estrutura adaptada ao tamanho de uma formiga.",
            "Possui estação de descanso e abastecimento.",
            "Conta com oxigênio artificial.",
            "Preparada para pequenas viagens espaciais."
        ]
    },
    {
        id: 3,
        nome: "Jardim Flutuante Colossal",
        categoria: "Jardim cósmico",
        preco: 999999.90,
        descricao: "Um jardim suspenso tão vasto que transforma o céu em paisagem.",
        regra: "Maior que um avião",
        imagem: "img/jardim.png",
        detalhes: [
            "Dimensões maiores que um avião comercial.",
            "Possui árvores, flores e pequenos lagos.",
            "Flutua acima das nuvens.",
            "Sistema mágico de irrigação automática."
        ]
    },
    {
        id: 4,
        nome: "Zumbilume",
        categoria: "Luzes impossíveis",
        preco: 19.90,
        descricao: "Uma pequena luz que ilumina um sonho uma única vez.",
        regra: "Começa com Z · Uso único",
        imagem: "img/zumbilume.png",
        detalhes: [
            "Pequeno objeto luminoso.",
            "Ilumina um sonho durante uma noite.",
            "Possui brilho suave e colorido.",
            "Após o uso, sua luz desaparece para sempre."
        ]
    },
    {
        id: 5,
        nome: "Ampulheta de Minutos Extras",
        categoria: "Acessórios mágicos",
        preco: 49.90,
        descricao: "Guarda sete minutos extras para usar quando o dia parece curto.",
        regra: "Cabe em um bolso",
        imagem: "img/ampulheta.png",
        detalhes: [
            "Tamanho compacto e portátil.",
            "Armazena sete minutos extras.",
            "Pode ser utilizada uma vez por dia.",
            "Ideal para momentos de pressa."
        ]
    },
    {
        id: 6,
        nome: "Nebulosa de Bolso",
        categoria: "Universo miniatura",
        preco: 149.90,
        descricao: "Uma nebulosa portátil para decorar a cabine de qualquer nave.",
        regra: "Uso no espaço sideral",
        emoji: "🌌",
        detalhes: [
            "Contém uma pequena nebulosa em miniatura.",
            "Pode ser transportada dentro de uma nave.",
            "Possui iluminação em diferentes cores.",
            "Não interfere nos equipamentos espaciais."
        ]
    }
];

const produtoDetalhe = document.querySelector("#produtoDetalhe");
const feedback = document.querySelector("#produtoFeedback");

const parametros = new URLSearchParams(window.location.search);
const idProduto = Number(parametros.get("id"));

const produto = produtos.find((item) => item.id === idProduto);

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function atualizarContadorSacola() {
    const cartCount = document.querySelector("#cartCount");

    if (!cartCount) return;

    const sacola = JSON.parse(sessionStorage.getItem("sacola")) || [];

    const quantidadeTotal = sacola.reduce((total, item) => {
        return total + item.quantidade;
    }, 0);

    cartCount.textContent = quantidadeTotal;
}

function exibirProduto() {
    if (!produto) {
        produtoDetalhe.innerHTML = `
            <div class="alert alert-warning" role="alert">
                <h1 class="h3">Invenção não encontrada!</h1>

                <p>
                    Não conseguimos encontrar esse produto.
                    Talvez ele ainda seja impossível demais.
                </p>

                <a href="index.html" class="btn btn-dark">
                    Voltar à vitrine
                </a>
            </div>
        `;

        return;
    }

    document.title = `${produto.nome} | Impossibilândia`;

    const ilustracao = produto.imagem
        ? `
            <img
                src="${produto.imagem}"
                alt="${produto.nome}"
                class="img-fluid"
            >
        `
        : `
            <span aria-hidden="true">${produto.emoji || ""}</span>
        `;

    produtoDetalhe.innerHTML = `
        <article class="row g-5 align-items-start">

            <div class="col-lg-6">
                <div class="product-detail-illustration">
                    ${ilustracao}
                </div>
            </div>

            <div class="col-lg-6">

                <p class="eyebrow">${produto.categoria}</p>

                <h1>${produto.nome}</h1>

                <p class="lead">${produto.descricao}</p>

                <span class="rule-chip">${produto.regra}</span>

                <p class="price price-large mt-3">
                    ${formatarPreco(produto.preco)}
                </p>

                <section aria-labelledby="titulo-detalhes" class="mb-4">
                    <h2 id="titulo-detalhes" class="h4">
                        Detalhes da invenção
                    </h2>

                    <ul>
                        ${produto.detalhes.map((detalhe) => `
                            <li>${detalhe}</li>
                        `).join("")}
                    </ul>
                </section>

                <form id="formProduto">

                    <div class="mb-3">
                        <label for="quantidade" class="form-label">
                            Quantidade
                        </label>

                        <input
                            class="form-control quantity-field"
                            id="quantidade"
                            name="quantidade"
                            type="number"
                            min="1"
                            max="10"
                            value="1"
                            required
                        >
                    </div>

                    <button class="btn btn-dark btn-lg" type="submit">
                        Adicionar à sacola
                    </button>

                </form>

            </div>
        </article>
    `;

    const formProduto = document.querySelector("#formProduto");
    const quantidade = document.querySelector("#quantidade");

    formProduto.addEventListener("submit", (event) => {
        event.preventDefault();

        const quantidadeEscolhida = Number(quantidade.value);

        if (
            !Number.isInteger(quantidadeEscolhida) ||
            quantidadeEscolhida < 1 ||
            quantidadeEscolhida > 10
        ) {
            feedback.textContent = "Escolha uma quantidade entre 1 e 10.";
            quantidade.focus();
            return;
        }

        let sacola = JSON.parse(sessionStorage.getItem("sacola")) || [];

        const produtoExistente = sacola.find(
            (item) => item.produto.id === produto.id
        );

        if (produtoExistente) {
            produtoExistente.quantidade += quantidadeEscolhida;
        } else {
            sacola.push({
                produto: produto,
                quantidade: quantidadeEscolhida
            });
        }

        sessionStorage.setItem("sacola", JSON.stringify(sacola));

        atualizarContadorSacola();

        feedback.textContent = "Produto adicionado à sacola com sucesso!";
    });

    atualizarContadorSacola();
}

exibirProduto();
