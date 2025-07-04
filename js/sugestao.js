// Remover item do carrinho
removerItenCarrinho: (id, observacao) => {
    MEU_CARRINHO = MEU_CARRINHO.filter(item => !(item.id === id && item.observacao === observacao));
    
    cardapio.metodos.carregarCarrinho();
    cardapio.metodos.atualizarBadgeTotal();
},

// Diminuir quantidade do item no carrinho
diminuirQuantidadeCarrinho: (id, observacao) => {
    let item = MEU_CARRINHO.find(item => item.id === id && item.observacao === observacao);
    
    if (item && item.quantidade > 1) {
        item.quantidade--;
        $(`#qntd-carrinho-${id}-${observacao}`).text(item.quantidade);
        cardapio.metodos.atualizarCarrinho(id, observacao, item.quantidade);
    } else {
        cardapio.metodos.removerItenCarrinho(id, observacao);
    }
},

// Aumentar quantidade do item no carrinho
aumentarQuantidadeCarrinho: (id, observacao) => {
    let item = MEU_CARRINHO.find(item => item.id === id && item.observacao === observacao);
    
    if (item) {
        item.quantidade++;
        $(`#qntd-carrinho-${id}-${observacao}`).text(item.quantidade);
        cardapio.metodos.atualizarCarrinho(id, observacao, item.quantidade);
    }
},

// Atualizar carrinho
atualizarCarrinho: (id, observacao, quantidade) => {
    let item = MEU_CARRINHO.find(item => item.id === id && item.observacao === observacao);
    
    if (item) {
        item.quantidade = quantidade;
    }

    cardapio.metodos.atualizarBadgeTotal();
    cardapio.metodos.carregarValores();
}

//######################################################

// Template do item no carrinho
let templateItemCarrinho = `
    <div class="col-12 item-carrinho">
        <div class="img-produto">
            <img src="\${img}" alt="\${name}">
        </div>
        <div class="dados-produto">
            <p class="title-produto"><b>\${name}</b></p>
            <p class="price-produto"><b>R$ \${price}</b></p>
            <p class="obs-produto">\${obs}</p>
        </div>
        <div class="add-carrinho">
            <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}', '\${obs}')">
                <i class="fas fa-minus"></i>
            </span>
            <span class="btn-add-numero-itens" id="qntd-carrinho-\${id}-\${obs.replace(/\s+/g, '')}">\${qntd}</span>
            <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}', '\${obs}')">
                <i class="fas fa-plus"></i>
            </span>
            <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItenCarrinho('\${id}', '\${obs}')">
                <i class="fa fa-times"></i>
            </span>
        </div>
    </div>
`;

//######################################################

// No seu arquivo app.js
const cardapio = {
    // ... outros métodos ...

    metodos: {
        // Diminuir quantidade do item no carrinho
        diminuirQuantidadeCarrinho: (id, obs) => {
            let qntdAtual = parseInt($(`#qntd-carrinho-${id}-${obs.replace(/\s+/g, '')}`).text());
            
            if (qntdAtual > 1) {
                qntdAtual--;
                $(`#qntd-carrinho-${id}-${obs.replace(/\s+/g, '')}`).text(qntdAtual);
                cardapio.metodos.atualizarCarrinho(id, obs, qntdAtual);
            } else {
                cardapio.metodos.removerItenCarrinho(id, obs);
            }
        },

        // Aumentar quantidade do item no carrinho
        aumentarQuantidadeCarrinho: (id, obs) => {
            let qntdAtual = parseInt($(`#qntd-carrinho-${id}-${obs.replace(/\s+/g, '')}`).text());
            qntdAtual++;
            $(`#qntd-carrinho-${id}-${obs.replace(/\s+/g, '')}`).text(qntdAtual);
            cardapio.metodos.atualizarCarrinho(id, obs, qntdAtual);
        },

        // Atualizar carrinho
        atualizarCarrinho: (id, obs, qntd) => {
            let itemIndex = MEU_CARRINHO.findIndex(item => item.id === id && item.observacao === obs);
            
            if (itemIndex > -1) {
                MEU_CARRINHO[itemIndex].quantidade = qntd;
                // Atualiza o botão carrinho da página de vendas com a quantidade
                cardapio.metodos.atualizarBadgeTotal();
                // Atualiza valores subtotal, entrega e total
                cardapio.metodos.carregarValores();
            }
        },

        // Remover item do carrinho
        removerItenCarrinho: (id, obs) => {
            MEU_CARRINHO = MEU_CARRINHO.filter(item => !(item.id === id && item.observacao === obs));
            cardapio.metodos.carregarCarrinho();
            cardapio.metodos.atualizarBadgeTotal();
        },

        // Carregar carrinho
        carregarCarrinho: () => {
            $('#itensCarrinho').html('');

            MEU_CARRINHO.forEach(item => {
                let temp = templateItemCarrinho
                    .replace(/\${img}/g, item.img)
                    .replace(/\${name}/g, item.name)
                    .replace(/\${price}/g, item.price.toFixed(2).replace('.', ','))
                    .replace(/\${id}/g, item.id)
                    .replace(/\${obs}/g, item.observacao)
                    .replace(/\${qntd}/g, item.quantidade);

                $('#itensCarrinho').append(temp);
            });

            // Atualiza os valores totais
            cardapio.metodos.carregarValores();
        }
    }
};



//############################### correção de aumentar e diminuir no carrinho

metodos: {
    // Diminuir quantidade do item no carrinho
    diminuirQuantidadeCarrinho: (id, obs) => {
        let itemIndex = MEU_CARRINHO.findIndex(item => item.id === id && item.observacao === obs);
        
        if (itemIndex > -1) {
            if (MEU_CARRINHO[itemIndex].quantidade > 1) {
                MEU_CARRINHO[itemIndex].quantidade--;
                cardapio.metodos.carregarCarrinho(); // Recarrega o carrinho
                cardapio.metodos.atualizarBadgeTotal();
            } else {
                cardapio.metodos.removerItenCarrinho(id, obs);
            }
        }
    },

    // Aumentar quantidade do item no carrinho
    aumentarQuantidadeCarrinho: (id, obs) => {
        let itemIndex = MEU_CARRINHO.findIndex(item => item.id === id && item.observacao === obs);
        
        if (itemIndex > -1) {
            MEU_CARRINHO[itemIndex].quantidade++;
            cardapio.metodos.carregarCarrinho(); // Recarrega o carrinho
            cardapio.metodos.atualizarBadgeTotal();
        }
    },

    // Remover item do carrinho
    removerItenCarrinho: (id, obs) => {
        MEU_CARRINHO = MEU_CARRINHO.filter(item => !(item.id === id && item.observacao === obs));
        cardapio.metodos.carregarCarrinho();
        cardapio.metodos.atualizarBadgeTotal();
    },

    // Carregar carrinho
    carregarCarrinho: () => {
        $('#itensCarrinho').html('');

        MEU_CARRINHO.forEach(item => {
            let temp = templateItemCarrinho
                .replace(/\${img}/g, item.img)
                .replace(/\${name}/g, item.name)
                .replace(/\${price}/g, item.price.toFixed(2))
                .replace(/\${id}/g, item.id)
                .replace(/\${obs}/g, item.observacao)
                .replace(/\${qntd}/g, item.quantidade);

            $('#itensCarrinho').append(temp);
        });

        cardapio.metodos.carregarValores();
    }
};



let templateItemCarrinho = `
    <div class="col-12 item-carrinho">
        <div class="img-produto">
            <img src="\${img}" alt="\${name}">
        </div>
        <div class="dados-produto">
            <p class="title-produto"><b>\${name}</b></p>
            <p class="price-produto"><b>R$ \${price}</b></p>
            <p class="obs-produto">\${obs}</p>
        </div>
        <div class="add-carrinho">
            <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}', '\${obs}')">
                <i class="fas fa-minus"></i>
            </span>
            <span class="btn-add-numero-itens">\${qntd}</span>
            <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}', '\${obs}')">
                <i class="fas fa-plus"></i>
            </span>
            <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItenCarrinho('\${id}', '\${obs}')">
                <i class="fa fa-times"></i>
            </span>
        </div>
    </div>
`;



//##################################### nova sugestão de correção

const cardapio = {
    metodos: {
        // Diminuir quantidade
        diminuirQuantidadeCarrinho: (id, obs) => {
            // Encontra o item no carrinho
            let item = MEU_CARRINHO.find(item => item.id === id && item.observacao === obs);
            
            if (item) {
                item.quantidade -= 1;
                
                // Se quantidade chegou a zero, remove o item
                if (item.quantidade === 0) {
                    MEU_CARRINHO = MEU_CARRINHO.filter(i => !(i.id === id && i.observacao === obs));
                }
                
                // Atualiza o carrinho
                cardapio.metodos.carregarCarrinho();
                cardapio.metodos.atualizarBadgeTotal();
            }
        },

        // Aumentar quantidade
        aumentarQuantidadeCarrinho: (id, obs) => {
            // Encontra o item no carrinho
            let item = MEU_CARRINHO.find(item => item.id === id && item.observacao === obs);
            
            if (item) {
                item.quantidade += 1;
                
                // Atualiza o carrinho
                cardapio.metodos.carregarCarrinho();
                cardapio.metodos.atualizarBadgeTotal();
            }
        },

        // Remover item
        removerItenCarrinho: (id, obs) => {
            MEU_CARRINHO = MEU_CARRINHO.filter(item => !(item.id === id && item.observacao === obs));
            cardapio.metodos.carregarCarrinho();
            cardapio.metodos.atualizarBadgeTotal();
        },

        // Carregar carrinho
        carregarCarrinho: () => {
            $('#itensCarrinho').html('');
            
            MEU_CARRINHO.forEach(item => {
                let template = `
                    <div class="col-12 item-carrinho">
                        <div class="img-produto">
                            <img src="${item.img}" alt="${item.name}">
                        </div>
                        <div class="dados-produto">
                            <p class="title-produto"><b>${item.name}</b></p>
                            <p class="price-produto"><b>R$ ${item.price.toFixed(2)}</b></p>
                            <p class="obs-produto">${item.observacao}</p>
                        </div>
                        <div class="add-carrinho">
                            <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('${item.id}', '${item.observacao}')">
                                <i class="fas fa-minus"></i>
                            </span>
                            <span class="btn-add-numero-itens">${item.quantidade}</span>
                            <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('${item.id}', '${item.observacao}')">
                                <i class="fas fa-plus"></i>
                            </span>
                            <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItenCarrinho('${item.id}', '${item.observacao}')">
                                <i class="fa fa-times"></i>
                            </span>
                        </div>
                    </div>
                `;
                
                $('#itensCarrinho').append(template);
            });

            cardapio.metodos.carregarValores();
        },

        // Atualizar badge do total
        atualizarBadgeTotal: () => {
            let total = MEU_CARRINHO.reduce((sum, item) => sum + item.quantidade, 0);
            $('.badge-total-carrinho').html(total);
        }
    }
};

