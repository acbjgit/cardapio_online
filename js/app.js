$(document).ready(function () {
    cardapio.eventos.init();
})

var cachorro = "Tobias";

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
        cardapio.metodos.carregarCampoTroco();
        cardapio.metodos.carregarCampoObservacao();
        // cardapio.metodos.carregarObservacao();
        // cardapio.metodos.criarCheckBox();
        // cardapio.metodos.acessarItensLanche();
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
            .replace(/\${dsc}/g, e.dsc)
            // .replace(/\${itens}/g, e.itens)

            //Acessar os itens do produto 
            let itens_produto = e.itens
            
            
            

            // Aqui o botão vermais foi clicado (12 itens)
            if(vermais && i >= 8 && i <= 12) {

                $("#itensCardapio").append(temp)
            }

            // Paginação inicial (8 itens)
            if(!vermais && i < 8) {
                $("#itensCardapio").append(temp)
            }
            
            

        })

        // remove a classe active
        $(".container-menu a").removeClass("active");

        // ativa a classe atual - selecionada
        $("#menu-" + categoria).addClass("active");
    },

    // criar checkbox
    // criarCheckBox: (texto='Remover itens:') => {
    //     var checkbox = $('<input>').attr('type', 'checkbox');
    //     var label = $('<label>').text(texto);
    //     $('.lista-itens').append(checkbox).append(label);
    // },

    // acessar itens do lanche
    // acessarItensLanche: () => {
    //     var filtro_itens = MENU;
    //     $.each(filtro_itens, (i, e) => {

    //         let temp = cardapio.templates.item
    //         .replace(/\${itens}/g, e.itens)
    //         $.each(temp, (i, e) => {
    //             var nome = e.nome;
    //             var preco = e.preco;
    //             $('.lista-itens').append(nome).append(preco);
    //         })
            
    //     })
    // },
    

    // Quando clica no botão de ver mais
    verMais: () => {
        // o ativo é para saber qual a categoria que foi selecionada e está ativa [manipulando cardapio, parte2]
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

    adicionarAoCarrinho: (id, obsAtual) => {
        const qntdAtual = parseInt($("#qntd-" + id).text());
        obsAtual = $(".campoObs-" + id).val();
    
        if (qntdAtual > 0) {
            const categoria = $(".container-menu a.active").attr('id').split('menu-')[1];
            const filtro = MENU[categoria];
            const item = filtro.find(e => e.id == id);
    
            if (item) {
                // Verifica se já existe o item no carrinho
                const existe = MEU_CARRINHO.find(elem => elem.id === id);
    
                if (existe) {
                    // Se o item já existe, verifica a observação
                    if (existe.observacao === obsAtual) {
                        // Se a observação for a mesma, soma a quantidade
                        existe.qntd += qntdAtual;
                    } else {
                        // Se a observação for diferente, adiciona como novo item
                        const novoItem = { ...item, qntd: qntdAtual, observacao: obsAtual };
                        MEU_CARRINHO.push(novoItem);
                    }
                } else {
                    // Se não existe, adiciona o item ao carrinho
                    const novoItem = { ...item, qntd: qntdAtual, observacao: obsAtual };
                    MEU_CARRINHO.push(novoItem);
                }
    
                // Mensagem exibida na tela depois de adicionado item ao carrinho
                cardapio.metodos.mensagem('Item adicionado ao carrinho!', 'green');
                // Depois de adicionar ao carrinho, zerar a quantidade no cardápio
                $("#qntd-" + id).text(0);
                cardapio.metodos.atualizarBadgeTotal();
                // Limpar o campo de texto da observação
                $(".campoObs-" + id).val("");
    
                // Desmarcar o checkbox e esconder o campo de observação
                const checkboxObs = $(".checkbox-obs-" + id);
                if (checkboxObs.is(":checked")) {
                    checkboxObs.prop("checked", false);
                    $(".campoObs-" + id).addClass("hidden");
                }
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
        if(etapa == 1) {
            $("#lblTituloEtapa").text("Seu carrinho:");
            $("#itensCarrinho").removeClass("hidden");
            $("#localEntrega").addClass("hidden");
            $("#resumoCarrinho").addClass("hidden");
            $("#formaPagamento").addClass("hidden");
            $("#entregaRetirada").addClass("hidden");

            $(".etapa").removeClass("active");
            $(".etapa1").addClass("active");

            $("#btnEtapaPedido").removeClass("hidden");
            $("#btnEtapaEndereco").addClass("hidden");
            $("#btnEtapaPagamento").addClass("hidden");
            $("#btnEtapaResumo").addClass("hidden");
            $("#btnVoltar").addClass("hidden");
        }else if(etapa == 2) {
            $("#lblTituloEtapa").text("Endereço de entrega:");
            $("#itensCarrinho").addClass("hidden");
            $("#localEntrega").removeClass("hidden");
            $("#resumoCarrinho").addClass("hidden");
            $("#formaPagamento").addClass("hidden");
            $("#entregaRetirada").addClass("hidden");

            $(".etapa").removeClass("active");
            $(".etapa1").addClass("active");
            $(".etapa2").addClass("active");

            $("#btnEtapaPedido").addClass("hidden");
            $("#btnEtapaEndereco").removeClass("hidden");
            $("#btnEtapaPagamento").addClass("hidden");
            $("#btnEtapaResumo").addClass("hidden");
            $("#btnVoltar").removeClass('hidden');
        }else if(etapa == 3) {
            $("#lblTituloEtapa").text("Forma de pagamento:");
            $("#itensCarrinho").addClass("hidden");
            $("#localEntrega").addClass("hidden");
            $("#formaPagamento").removeClass("hidden");
            $("#entregaRetirada").removeClass("hidden");
            $("#resumoCarrinho").addClass("hidden");

            $(".etapa").removeClass("active");
            $(".etapa1").addClass("active");
            $(".etapa2").addClass("active");
            $(".etapa3").addClass("active");

            $("#btnEtapaPedido").addClass("hidden");
            $("#btnEtapaEndereco").addClass("hidden");
            $("#btnEtapaPagamento").removeClass("hidden");
            $("#btnEtapaResumo").addClass("hidden");
            $("#btnVoltar").removeClass("hidden");
        }else if(etapa == 4) {
            $("#lblTituloEtapa").text("Resumo do pedido:");
            $("#itensCarrinho").addClass("hidden");
            $("#localEntrega").addClass("hidden");
            $("#formaPagamento").addClass("hidden");
            $("#entregaRetirada").addClass("hidden");
            $("#resumoCarrinho").removeClass("hidden");

            $(".etapa").removeClass("active");
            $(".etapa1").addClass("active");
            $(".etapa2").addClass("active");
            $(".etapa3").addClass("active");
            $(".etapa4").addClass("active");

            $("#btnEtapaPedido").addClass("hidden");
            $("#btnEtapaEndereco").addClass("hidden");
            $("#btnEtapaPagamento").addClass("hidden");
            $("#btnEtapaResumo").removeClass("hidden");
            $("#btnVoltar").removeClass("hidden");
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
                .replace(/\${obs}/g, e.observacao)
                
                
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

    // Botão Remover item carrinho
    removerItenCarrinho: (id, obs) => {
        MEU_CARRINHO = MEU_CARRINHO.filter(item => !(item.id === id && item.observacao === obs));
        
        cardapio.metodos.carregarCarrinho();

        // Atualiza o botão carrinho da página de vendas com a quantidade
        cardapio.metodos.atualizarBadgeTotal();
    },

    // Atualizar carrinho quando acrescenta ou diminui algum item
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

    // Carregar pagamento
    carregarPagamento: () => {
        cardapio.metodos.carregarEtapa(3);
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

    // Validação dos campos antes de prosseguir para a etapa 4
    resumoPedido: () => {
        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUF").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();
        let valorTroco = $("#txtValorTroco").val().trim();
        let entregarRetirar = $("#opcaoEntregaRetirada option:selected").text().trim();
        let formaDePagamento = $("#formaPagamento option:selected").text().trim();

        if($("#formaPagamento option:selected").val() == "dinheiro" && valorTroco.length <= 0) {
            cardapio.metodos.mensagem("Informe o valor para troco!");
            $("txtValorTroco").focus();
            return;
        }

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

        MEU_PAGAMENTO = {
            entregarRetirar: entregarRetirar,
            formaDePagamento: formaDePagamento,
            valorTroco: valorTroco
        }

        cardapio.metodos.carregarEtapa(4);
        cardapio.metodos.carregarResumo();
        
    },

    // Carregar campo de troco para a opção dinheiro
    carregarCampoTroco: () => {
        var valorEscolhido = $("#formaPagamento option:selected").val();
        if(valorEscolhido == 'dinheiro') {

            $("#dinheiro").removeClass('hidden');
        }else {
            //ocultar o campo de troco
            $("#dinheiro").addClass('hidden');
            //limpar o campo de troco
            $("#txtValorTroco").val("");
        };
        
       
    },

    // Carregar resumo
    carregarResumo: () => {
        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) => {
            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${qntd}/g, e.qntd)
                .replace(/\${obs}/g, e.observacao)

            $("#listaItensResumo").append(temp);
        });

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero} ${MEU_ENDERECO.complemento}, ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep}`);

        $("#entregarRetirar").html(`${MEU_PAGAMENTO.entregarRetirar}`);
        $("#formaDePagamento").html(`${MEU_PAGAMENTO.formaDePagamento}`);
        $("#trocoPara").html(`${MEU_PAGAMENTO.valorTroco}`);

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
            texto += `\n\n*Forma de pagamento:*`;
            texto += `\n${MEU_PAGAMENTO.entregarRetirar}`;
            texto += `\n${MEU_PAGAMENTO.formaDePagamento}`;
            texto += `\nTroco para: ${MEU_PAGAMENTO.valorTroco}`;

            var itens = '';

            $.each(MEU_CARRINHO, (i, e) => {

                itens += `*${e.qntd}x* ${e.name} ...... R$ ${e.price.toFixed(2).replace('.', ',')}\n`;
                itens += `*Observação:* _${e.observacao}_\n`;
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
    },

    // carregarObservacao: () => {
    //     $('.checkbox-obs').on('change', function() {
    //         if($(this).is(':checked')) {
    //             $('.campoObs').removeClass('hidden')
    //         }else {
    //             $('.campoObs').addClass('hidden')
    //         }
    //     })
    // }
    carregarCampoObservacao: (id) => {

        var textoObservacao = $(".campoObs").text()

        // Obter a categoria ativa
        var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

        // Obtem a lista de itens
        let filtro = MENU[categoria];

        // Obtem o item
        let item = $.grep(filtro, (e, i) => { return e.id == id});

        //pegar o texto do campo observacao

        

        var checkbox = $('.checkbox-obs-' + id)
        var input_checkbox = $('.campoObs-' + id)


        if(checkbox.is(":checked") && item) {
            input_checkbox.removeClass("hidden")
        }else {
            input_checkbox.addClass("hidden")
        }
    }
    
    
}

cardapio.templates = {
    item: `
        <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5">
            <div class="card card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}" alt="">
                </div>
                <p class="desc-produto text-center">
                    \${dsc}
                </p>
                <div class="observacao-texto">
                    <input type="checkbox" class="checkbox-obs-\${id} "  onchange="cardapio.metodos.carregarCampoObservacao('\${id}')"><label >Observação:</label>
                    <textarea class="form-control campoObs-\${id} hidden" rows="3" id="campoObs" placeholder="Ex: retirar cebola..."></textarea>
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
    observacaoCampo: `
        
    `,
    itemCarrinho: `
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}" alt="\${name}">
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${name}</b></p>
                <p class="price-produto"><b>\${price}</b></p>
                <p class="itens-checkbox"> \${obs}</p>
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
                <p class="itens-checkbox"> \${obs}</p>
            </div>
            <p class="quantidade-produto-resumo">
                X <b>\${qntd}</b>
            </p>
        </div>
    `
}
