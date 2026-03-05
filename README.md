# 🧹 Aspirador de Grupos para WhatsApp

Uma extensão leve e prática para Google Chrome que permite extrair e exportar facilmente o nome de todos os seus grupos do WhatsApp Web diretamente para uma planilha (CSV).

## ✨ Funcionalidades

* **Captura em Tempo Real:** Identifica e salva automaticamente os nomes dos grupos enquanto você rola a lista de conversas.
* **Controle Total:** Opções para iniciar, pausar e limpar a varredura a qualquer momento.
* **Processamento em Segundo Plano:** A extensão continua contabilizando os grupos e o tempo mesmo se você fechar o pop-up, graças à sincronização em background.
* **Interface Dinâmica:** Conta com cronômetro, contador de grupos identificados e uma barra de progresso fluida.
* **Exportação Rápida:** Gera um relatório completo em formato `.csv` (compatível com Excel e Google Sheets) com um único clique.

## 🛠️ Tecnologias Utilizadas

* HTML5 & CSS3 (Variáveis de cor e Grid Layout)
* JavaScript (ES6+, Promises, DOM Manipulation)
* Chrome Extension API (Manifest V3, Scripting, Tabs, Storage)

## 🚀 Como Instalar (Modo Desenvolvedor)

Como esta extensão ainda não está publicada na Chrome Web Store, você precisa instalá-la manualmente no seu navegador:

1. Baixe este repositório como `.zip` e extraia em uma pasta no seu computador, ou faça o clone via Git.
2. Abra o Google Chrome e digite na barra de endereços: `chrome://extensions/`
3. No canto superior direito, ative o **"Modo do desenvolvedor"**.
4. Clique no botão **"Carregar sem compactação"** (Load unpacked) no canto superior esquerdo.
5. Selecione a pasta onde você extraiu os arquivos da extensão.
6. Pronto! O ícone da vassourinha 🧹 aparecerá na sua barra de extensões.

## 📖 Como Usar

1. Abra o [WhatsApp Web](https://web.whatsapp.com/) no seu navegador e aguarde o carregamento de suas conversas.
2. Clique no ícone da extensão "Aspirador de Grupos".
3. Clique em **Iniciar Sweep** (o botão verde).
4. **Passo crucial:** Volte para a tela do WhatsApp e **role a sua lista de contatos/conversas para baixo**. A extensão só consegue capturar os grupos que aparecem na tela (devido à renderização virtual do WhatsApp).
5. Acompanhe o progresso abrindo a extensão novamente.
6. Quando terminar de rolar, clique em **Gerar Relatório Completo** para baixar sua planilha `.csv`.
7. Clique em **Limpar Dados** para zerar a memória da extensão antes de uma nova varredura.

## ⚠️ Observações e Limitações

* **Virtual Scrolling:** O WhatsApp Web não carrega todas as conversas de uma vez no código da página. Por isso, é obrigatório rolar a barra de contatos até o final para que a extensão consiga "ler" todos os nomes.
* A extensão não captura mensagens, números de telefone de membros ou dados sensíveis. Ela apenas extrai o *nome* do grupo visível na sua lista principal.

---
*Desenvolvido para facilitar a gestão e organização de contatos no WhatsApp.*
