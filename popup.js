// ==========================================
// 1. SINCRONIZAÇÃO COM O WHATSAPP
// ==========================================
let intervaloInterface;

async function sincronizarInterface() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.url.includes("web.whatsapp.com")) return;

        const resultados = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                return {
                    ativo: !!window.capturador,
                    grupos: window.meusGrupos ? window.meusGrupos.size : 0,
                    tempo: window.aspiradorTempoSegundos || 0,
                    progresso: window.aspiradorProgresso || 0
                };
            }
        });

        if (resultados && resultados[0] && resultados[0].result) {
            const dados = resultados[0].result;

            // Atualiza Tempo
            const min = Math.floor(dados.tempo / 60).toString().padStart(2, '0');
            const seg = (dados.tempo % 60).toString().padStart(2, '0');
            document.getElementById('timer-display').innerText = `${min}:${seg}`;

            // Atualiza Contador de Grupos
            document.getElementById('count-display').innerText = dados.grupos;

            // Atualiza Textos de Status e Barra Dinâmica
            if (dados.ativo) {
                document.getElementById('status-text').innerText = "Varredura em progresso...";
                document.getElementById('bar-fill').style.width = dados.progresso + "%";
                document.getElementById('progress-percent').innerText = dados.progresso + "%";
            } else if (dados.grupos > 0 || dados.progresso > 0) {
                document.getElementById('status-text').innerText = "Pausado";
                document.getElementById('bar-fill').style.width = dados.progresso + "%";
                document.getElementById('progress-percent').innerText = dados.progresso + "%";
            } else {
                document.getElementById('status-text').innerText = "Aguardando...";
                document.getElementById('bar-fill').style.width = "0%";
                document.getElementById('progress-percent').innerText = "0%";
            }
        }
    } catch (erro) {
        console.log("Aguardando WhatsApp...", erro);
    }
}

// Inicia a sincronização e mantém atualizando a cada 1 segundo
sincronizarInterface();
intervaloInterface = setInterval(sincronizarInterface, 1000);


// ==========================================
// 2. EVENTOS DOS BOTÕES
// ==========================================

document.getElementById('btnIniciar').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.url.includes("web.whatsapp.com")) {
        alert("Abra o WhatsApp Web para usar o aspirador!");
        return;
    }
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: ligarAspiradorNoWhatsapp });
    sincronizarInterface();
});

document.getElementById('btnPausar').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url.includes("web.whatsapp.com")) {
        await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: pausarAspiradorNoWhatsapp });
        sincronizarInterface();
    }
});

document.getElementById('btnDesativar').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url.includes("web.whatsapp.com")) {
        await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: limparAspiradorNoWhatsapp });
        sincronizarInterface();
    }
});

document.getElementById('btnBaixar').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.url.includes("web.whatsapp.com")) return;

    // Pega os grupos capturados
    const resultados = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            if (!window.meusGrupos || window.meusGrupos.size === 0) return null;
            return Array.from(window.meusGrupos).sort();
        }
    });

    const grupos = resultados && resultados[0] ? resultados[0].result : null;

    if (!grupos) {
        alert("Nenhum grupo capturado ainda. Clique em Iniciar e role a tela do WhatsApp!");
        return;
    }

    // Baixa o CSV
    let conteudoCSV = "\uFEFFNome do Grupo\n" + grupos.join('\n');
    let blob = new Blob([conteudoCSV], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob);
    
    let link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Meus_Grupos_WhatsApp.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});


// ==========================================
// 3. FUNÇÕES INJETADAS (RODAM NO WHATSAPP)
// ==========================================

function ligarAspiradorNoWhatsapp() {
    window.meusGrupos = window.meusGrupos || new Set();
    window.aspiradorTempoSegundos = window.aspiradorTempoSegundos || 0;
    window.aspiradorProgresso = window.aspiradorProgresso || 0;
    
    if (window.capturador) clearInterval(window.capturador);

    window.capturador = setInterval(() => {
        window.aspiradorTempoSegundos++;
        
        // 1. Lógica de captura de grupos
        const itens = document.querySelectorAll('div[role="listitem"]');
        itens.forEach(item => {
            const texto = item.innerText.split('\n')[0];
            if (texto && texto.trim().length > 1) {
                window.meusGrupos.add(texto.trim());
            }
        });

        // 2. Lógica para calcular a porcentagem baseada no Scroll do WhatsApp
        const painelScroll = document.getElementById('pane-side'); // ID padrão da lista de contatos do WA
        if (painelScroll) {
            const alturaTotal = painelScroll.scrollHeight;
            const alturaVisivel = painelScroll.clientHeight;
            const rolagemAtual = painelScroll.scrollTop;
            
            if (alturaTotal > alturaVisivel) {
                let porcentagem = Math.floor((rolagemAtual / (alturaTotal - alturaVisivel)) * 100);
                
                // Trava de limites
                if (porcentagem < 0) porcentagem = 0;
                if (porcentagem > 100) porcentagem = 100;
                
                // Garante que o progresso só aumente (se o usuário rolar pra cima, não perde o % visual)
                if (porcentagem > window.aspiradorProgresso) {
                    window.aspiradorProgresso = porcentagem;
                }
            } else {
                window.aspiradorProgresso = 100;
            }
        }
    }, 1000);
}

function pausarAspiradorNoWhatsapp() {
    if (window.capturador) {
        clearInterval(window.capturador);
        window.capturador = null;
    }
}

function limparAspiradorNoWhatsapp() {
    if (window.capturador) {
        clearInterval(window.capturador);
        window.capturador = null;
    }
    if (window.meusGrupos) window.meusGrupos.clear();
    window.aspiradorTempoSegundos = 0;
    window.aspiradorProgresso = 0;
}