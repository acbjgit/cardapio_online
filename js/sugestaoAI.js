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