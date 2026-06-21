let last = "";
let vozPortugues = null;

// As vozes do navegador carregam de forma assíncrona — guardamos a melhor
// voz em português assim que ela estiver disponível.
function escolherVozPortugues() {
  if (!('speechSynthesis' in window)) return null;
  var vozes = speechSynthesis.getVoices();
  if (!vozes.length) return null;
  return (
    vozes.find(function (v) { return v.lang === 'pt-BR'; }) ||
    vozes.find(function (v) { return v.lang && v.lang.toLowerCase().indexOf('pt') === 0; }) ||
    null
  );
}

if ('speechSynthesis' in window) {
  vozPortugues = escolherVozPortugues();
  speechSynthesis.onvoiceschanged = function () {
    vozPortugues = escolherVozPortugues();
  };
}

function falar(texto) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  var utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'pt-BR'; // sem isso, o navegador pode usar uma voz em inglês
  if (vozPortugues) utterance.voice = vozPortugues;
  utterance.rate = 1;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

document.addEventListener("mouseover", (e) => {
  const el = e.target.closest("[data-read]");
  if (!el) return;

  const text = el.innerText?.trim();
  if (!text) return;

  if (text.length < 2 || text.length > 200) return;
  if (text === last) return;

  last = text;

  falar(text);
});