document.getElementById('btnIniciar').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({ target: { tabId: tab.id }, function: ligarAspirador });
});

document.getElementById('btnPausar').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({ target: { tabId: tab.id }, function: pausarAspirador });
});

document.getElementById('btnDesativar').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({ target: { tabId: tab.id }, function: desativarAspirador });
});

document.getElementById('btnBaixar').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({ target: { tabId: tab.id }, function: baixarPlanilha });
});

// --- FUNÇÕES INJETADAS NO WHATSAPP ---

function ligarAspirador() {
  window.meusGrupos = window.meusGrupos || new Set();
  
  if (window.capturador) clearInterval(window.capturador);
  
  let painel = document.getElementById('painel-aspirador');
  if (!painel) {
    painel = document.createElement('div');
    painel.id = 'painel-aspirador';
    painel.style.position = 'fixed';
    painel.style.top = '20px';
    painel.style.left = '50%';
    painel.style.transform = 'translateX(-50%)';
    painel.style.padding = '10px 20px';
    painel.style.borderRadius = '20px';
    painel.style.fontFamily = 'sans-serif';
    painel.style.fontWeight = 'bold';
    painel.style.zIndex = '99999';
    painel.style.boxShadow = '0px 4px 6px rgba(0,0,0,0.3)';
    painel.style.color = 'white';
    document.body.appendChild(painel);
  }
  painel.style.backgroundColor = '#25D366'; // Verde
  painel.innerText = `Aspirando... ${window.meusGrupos.size} grupos`;

  window.capturador = setInterval(() => {
    try {
      document.querySelectorAll('div[role="listitem"]').forEach(item => {
        let nome = item.innerText.split('\n')[0];
        if (nome && nome.trim() !== "") {
          window.meusGrupos.add(nome.trim());
        }
      });
      
      let painelAtualizado = document.getElementById('painel-aspirador');
      if (painelAtualizado) {
        painelAtualizado.innerText = `Aspirando... ${window.meusGrupos.size} grupos`;
      }
    } catch (erro) {
      console.log("Ignorando erro de leitura:", erro);
    }
  }, 1000);
}

function pausarAspirador() {
  // 1. Para o motor, mas NÃO apaga a memória
  if (window.capturador) {
    clearInterval(window.capturador);
    window.capturador = null;
  }
  
  // 2. Muda a cor do aviso para Laranja
  let painel = document.getElementById('painel-aspirador');
  if (painel) {
    painel.style.backgroundColor = '#FF9800'; 
    painel.innerText = `Pausado. ${window.meusGrupos ? window.meusGrupos.size : 0} grupos salvos.`;
  }
}

function desativarAspirador() {
  // 1. Para o motor
  if (window.capturador) {
    clearInterval(window.capturador);
    window.capturador = null;
  }
  
  // 2. Remove o painel da tela completamente
  let painel = document.getElementById('painel-aspirador');
  if (painel) {
    painel.remove();
  }
  
  // 3. Limpa a memória (zera a lista de grupos)
  if (window.meusGrupos) {
    window.meusGrupos.clear();
  }
}

function baixarPlanilha() {
  if (!window.meusGrupos || window.meusGrupos.size === 0) {
    alert("Nenhum grupo capturado ainda. Ligue o aspirador e role a tela.");
    return;
  }
  
  if (window.capturador) {
    clearInterval(window.capturador);
    window.capturador = null;
  }
  
  let painel = document.getElementById('painel-aspirador');
  if (painel) painel.remove();
  
  let listaGrupos = Array.from(window.meusGrupos).sort();
  let conteudoCSV = "\uFEFFNome do Grupo\n" + listaGrupos.join('\n');
  
  let blob = new Blob([conteudoCSV], { type: 'text/csv;charset=utf-8;' });
  let link = document.createElement("a");
  let url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", "Meus_Grupos_WhatsApp.csv");
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Limpa a memória após baixar
  window.meusGrupos.clear(); 
}