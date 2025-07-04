$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 5; // SEPARAR OS CENTAVOS POR PONTO E NÃO VIRGULA

var CELULAR_EMPRESA = '5511945903307';

var FACEBOOK = 'bessawebdesign';
var INSTAGRAM = 'bessawebdesign';

cardapio.eventos = {
    init: () => {
        
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoReserva();
        cardapio.metodos.carregarBotaoLigar();
        cardapio.metodos.conversarViaWhatsapp();
        cardapio.metodos.acessarFacebook();
        cardapio.metodos.acessarInstagram();
    }
}

cardapio.metodos = {
    // obtém a lisa de itens do cardápio
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        var filtro = MENU[categoria];

        if(!vermais) {
            
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden');
        }
      

    $.each(filtro, (i, e) => {

        let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
        .replace(/\${name}/g, e.name)
        .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
        .replace(/\${id}/g, e.id)


        // Aqui o botão vermais foi clicado (12 itens)
        if(vermais && i >= 8 && i <= 12) {

            $("#itensCardapio").append(temp);
        }

        // Paginação inicial (8 itens)
        if(!vermais && i < 8) {
            $("#itensCardapio").append(temp);
        }

    })

    // remove a classe active
    $(".container-menu a").removeClass("active");

    // ativa a classe atual - selecionada
    $("#menu-" + categoria).addClass("active");
    },

    // Quando clica no botão de ver mais
    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true)

        $("#btnVerMais").addClass('hidden');
    },

    // Diminuir quantidade

    diminuirQuantidade: (id) => {
        qntdAtual = parseInt($("#qntd-" + id).text());

        if(qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }
    },

    // Aumentar quantidade

    aumentarQuantidade: (id) => {
        qntdAtual = parseInt($("#qntd-" + id).text());

        if(qntdAtual >= 0) {
            $("#qntd-" + id).text(qntdAtual + 1)
        }

    },

    // Adicionar ao carrinho o item do cardapio

    adicionarAoCarrinho: (id) => {
        qntdAtual = parseInt($("#qntd-" + id).text());

        if(qntdAtual > 0) {

            // Obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            // Obtem a lista de itens
            let filtro = MENU[categoria];

            // Obtem o item
            let item = $.grep(filtro, (e, i) => { return e.id == id});

            if(item.length > 0) {

                // Validar se já existe esse item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id});

                // Caso já exista o item no carrinho, só altera a quantidade
                if(existe.length > 0) {
                    // Pegar a posição do item no carrinho
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }
                // Caso não exista o item no carrinho, adiciona ele ao carrinho
                else {
                    item[0].qntd = qntdAtual;

                    MEU_CARRINHO.push(item[0]);
                }
                // Mensagem exibida na tela depois de adicionado item ao carrinho
                cardapio.metodos.mensagem('Item adicionado ao carrinho!', 'green');
                // Depois de adicionar ao carrinho, dever zerar a quantide no cardapio
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();

                
            }
        }
    },

    // Atualizar Badge do carrinho
    atualizarBadgeTotal: (id) => {
        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if(total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }else {
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);
    },

    // Abrir a modal de carrinho
    verCarrinho: (ver) => {
        if(ver) {
            $("#modalCarrinho").removeClass("hidden");
            cardapio.metodos.carregarCarrinho();
        }else {
            $("#modalCarrinho").addClass("hidden");

        }
    },

    // Altera os textos e exibe os botões das etapas
    carregarEtapa: (etapa) => {

        if (etapa == 1) {
            $("#lblTituloEtapa").text('Seu carrinho:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');
        }
        
        if (etapa == 2) {
            $("#lblTituloEtapa").text('Endereço de entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

        if (etapa == 3) {
            $("#lblTituloEtapa").text('Resumo do pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

    },

    // Botão de voltar etapa
    voltarEtapa: () => {
        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);
    },

    // Carregar a lista de itens do carrinho
    carregarCarrinho: () => {
        cardapio.metodos.carregarEtapa(1);

        if(MEU_CARRINHO.length > 0) {
            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {
                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp);

                // último item do carrinho
                if((i + 1) == MEU_CARRINHO.length) {
                    // Atualiza valores subtotal, entrega e total
                    cardapio.metodos.carregarValores();
                }
            })
        }else {
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i>Você ainda não adicionou itens ao carrinho.</p>');
            // Atualiza valores subtotal, entrega e total
            cardapio.metodos.carregarValores();
        }
    },

    // Diminuir quantidade do intem no carrinho
    diminuirQuantidadeCarrinho: (id) => {
        qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if(qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1)
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        }else {
            cardapio.metodos.removerItenCarrinho(id);
        }
    },

    // Aumentar quantidade do item no carrinho
    aumentarQuantidadeCarrinho: (id) => {
        qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1)
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);
    },

    // Botão Remover item carrinho
    removerItenCarrinho: (id) => {
        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id});
        cardapio.metodos.carregarCarrinho();

        // Atualiza o botão carrinho da página de vendas com a quantidade
        cardapio.metodos.atualizarBadgeTotal();
    },

    // Atualizar carrinho quando acrescenta ou diminui algum item
    atualizarCarrinho: (id, qntd) => {
        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        // Atualiza o botão carrinho da página de vendas com a quantidade
        cardapio.metodos.atualizarBadgeTotal();
        // Atualiza valores subtotal, entrega e total
        cardapio.metodos.carregarValores();
    },

    // Carregar valores Subtotal, Entrega e Total
    carregarValores: () => {
        VALOR_CARRINHO = 0;

        $("#lblSubTotal").text("R$ 0,00");
        $("#lblValorEntrega").text("+ R$ 0,00");
        $("#lblValorTotal").text("R$ 0,00");
        
        $.each(MEU_CARRINHO, (i, e) => {

            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if((i + 1) == MEU_CARRINHO.length) {
                $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.',',')}`);
            }
        })


    },

    // Carregar endereço
    carregarEndereco: () => {
        if(MEU_CARRINHO.length <= 0) {
            cardapio.metodos.mensagem("Seu carrinho está vazio!");
            return;
        }else {
            cardapio.metodos.carregarEtapa(2);
        }
    },

    // Buscar CEP (chamando API VIACEP)
    buscarCep: () => {
        // cria a variável com o valor do cep
        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

        // verifica se o cep possui valor informado
        if(cep != '') {
            // expressão regular para validar o cep
            var validacep = /^[0-9]{8}$/;

            if(validacep.test(cep)) {

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function(dados) {

                    if(!("erro" in dados)) {

                        // atualizar os campos com os valores retornados
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUF").val(dados.uf);
                        $("#txtComplemento").val('');

                        $("#txtNumero").focus();

                    }else {
                        cardapio.metodos.mensagem("CEP não encontrado, verifique se o CEP está correto e digite novamente ou prossiga com as informações manualmente, sem pesquisar o CEP!");
                        $("#txtEndereco").focus();
                    }
                });
            }else {
                cardapio.metodos.mensagem("Formato do CEP inválido!")
                $("#txtCEP").focus();
            }
        }else {
            cardapio.metodos.mensagem("Informe o CEP, por favor!");
            $("#txtCEP").focus();
        }
    },

    // Validação dos campos antes de prosseguir para a etapa 3
    resumoPedido: () => {
        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUF").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        if(cep.length <= 0) {
            cardapio.metodos.mensagem("Informe o cep, por favor!");
            $("#txtCEP").focus();
            return;
        }
        if(endereco.length <= 0) {
            cardapio.metodos.mensagem("Informe o endereco, por favor!");
            $("#txtEndereco").focus();
            return;
        }
        if(bairro.length <= 0) {
            cardapio.metodos.mensagem("Informe o bairro, por favor!");
            $("#txtBairro").focus();
            return;
        }
        if(cidade.length <= 0) {
            cardapio.metodos.mensagem("Informe o cidade, por favor!");
            $("#txtCidade").focus();
            return;
        }
        if(uf.length == -1) {
            cardapio.metodos.mensagem("Informe o UF, por favor!");
            $("#ddlUF").focus();
            return;
        }
        if(numero.length <= 0) {
            cardapio.metodos.mensagem("Informe o numero, por favor!");
            $("#txtNumero").focus();
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        }

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();
        
    },

    // Carregar resumo
    carregarResumo: () => {
        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) => {
            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${qntd}/g, e.qntd)

            $("#listaItensResumo").append(temp);
        });

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero} ${MEU_ENDERECO.complemento}, ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep}`);

        cardapio.metodos.finalizarPedido();
    },

    // Finalizar pedido e carrega o botão do whatsapp
    finalizarPedido: () => {
        if(MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {
            var texto = 'Olá, gostaria de fazer um pedido:';
            texto += `\n*Itens do pedido:*\n\n\${itens}`;
            texto += `\n\n*Endereço de entrega:*`;
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
            texto += `\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}*`;

            var itens = '';

            $.each(MEU_CARRINHO, (i, e) => {

                itens += `*${e.qntd}x* ${e.name} ...... R$ ${e.price.toFixed(2).replace('.', ',')}\n`;
                // último item do carrinho
                if((i + 1) == MEU_CARRINHO.length) {
                    texto = texto.replace(/\${itens}/g, itens);
                    
                    // converte URL
                    let encode = encodeURI(texto);
                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

                    $('#btnEtapaResumo').attr('href', URL);
                }
            })
        }
    },

    //Fazer reserva
    carregarBotaoReserva: () => {
        var texto = "Olá, gostaria de fazer um *reserva*!";
        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $('#btnReserva').attr('href', URL);
    },

    //Fazer ligação
    carregarBotaoLigar: () => {
        $('#btnLigar').attr('href', `tel:${CELULAR_EMPRESA}`);
    },

    //Abrir depoimento
    abrirDepoimento: (depoimento) => {
        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#btnDepoimento-" + depoimento).addClass('active');

    },

    //Convesar via whatsapp
    conversarViaWhatsapp: () => {
        let URL = `https://wa.me/${CELULAR_EMPRESA}`;
        $('#falar').attr('href', URL);
    },

    //Acessar Facebook
    acessarFacebook: () => {
        let URL = `https://facebook.com/${FACEBOOK}`;
        $('#facebook').attr('href', URL);
    },
    //Acessar Instagram
    acessarInstagram: () => {
        let URL = `https://instagram.com/${INSTAGRAM}`;
        $('#instagram').attr('href', URL);
    },

    // Mensagem exibida na tela depois de adicionado item ao carrinho
    
    mensagem: (texto, cor = 'red', tempo = 3500) => {
        
        let id = Math.floor(Date.now() * Math.random()).toString(); // gera um id aleatório que não se repete
        let msg = `<div id= "msg-${id}" class="animated fadeInDown toast ${cor}" >${texto}</div>`; //adiciona esse html pra gerar mensagem
        $('#container-mensagens').append(msg); //adiciona a mensagem
        setTimeout(() => {//remove a mensagem depois do tempo estipulado
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800)
        }, tempo)
    }
}

cardapio.templates = {
    item: `
        <div class="col-12 col-lg-3 col-md-3 col-sm-6 col-one mb-5">
            <div class="card card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}" alt="">
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${name}</b>
                </p>
                <p class="price-produto text-center">
                    <b>\${price}</b>
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="btn-add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `,
    itemCarrinho: `
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}" alt="\${name}">
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${name}</b></p>
                <p class="price-produto"><b>\${price}</b></p>
            </div>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="btn-add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItenCarrinho('\${id}')"><i class="fa fa-times"></i></span>
            </div>
        </div>
    `,
    itemResumo: `
            
        <div class="col-12 item-carrinho resumo">
            <div class="img-produto-resumo">
                <img src="\${img}" alt="\${name}">
            </div>
            <div class="dados-produto">
                <p class="title-produto-resumo">
                    <b>\${name}</b>

                </p>
                <p class="price-produto-resumo">
                    <b>\${price}</b>

                </p>
            </div>
            <p class="quantidade-produto-resumo">
                X <b>\${qntd}</b>
            </p>
        </div>
    `
}
