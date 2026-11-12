const $ = (selector) => document.querySelector(selector);
const dialog = $("#cameraDialog");
const form = $("#cameraForm");
const STORAGE_KEY = "cu360.camera-list.v1";
let cameras = [];
try { cameras = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); if (!Array.isArray(cameras)) cameras = []; } catch { cameras = []; }

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(cameras)); renderCameras(); }
function openDialog() { form.reset(); dialog.showModal(); }
["#addCameraTop","#addCameraHero","#addCameraInline","#addCameraEmpty"].forEach(id => $(id)?.addEventListener("click", openDialog));
$("#closeDialog").addEventListener("click", () => dialog.close());
$("#cancelDialog").addEventListener("click", () => dialog.close());
$("#menuBtn").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const camera = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: String(data.get("name")).trim(),
    brand: String(data.get("brand")).trim(),
    protocol: String(data.get("protocol")),
    host: String(data.get("host")).trim(),
    port: String(data.get("port")).trim(),
    createdAt: new Date().toISOString()
  };
  if (!camera.name || !camera.host) return;
  cameras.push(camera);
  save();
  dialog.close();
});

function renderCameras() {
  $("#cameraCount").textContent = String(cameras.length);
  const grid = $("#cameraGrid");
  if (!cameras.length) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">▣</div><b>Nenhuma câmera cadastrada</b><p>Adicione uma câmera IP para começar a montar seu painel.</p><button class="secondary" id="addCameraEmpty">Cadastrar câmera</button></div>';
    $("#addCameraEmpty").addEventListener("click", openDialog);
    return;
  }
  grid.replaceChildren(...cameras.map(camera => {
    const card = document.createElement("article"); card.className = "camera-card";
    const preview = document.createElement("div"); preview.className = "camera-preview"; preview.textContent = "◉";
    const info = document.createElement("div"); info.className = "camera-info";
    const title = document.createElement("b"); title.textContent = camera.name;
    const details = document.createElement("p"); details.textContent = [camera.brand, camera.host, camera.port].filter(Boolean).join(" · ");
    const tag = document.createElement("span"); tag.className = "camera-tag"; tag.textContent = camera.protocol;
    info.append(title, details, tag); card.append(preview, info); return card;
  }));
}
const views = {overview:"Visão geral",cameras:"Minhas câmeras",recordings:"Gravações",events:"Eventos e alertas",connections:"Conectividade"};
document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll("[data-view]").forEach(item => item.classList.toggle("active", item === button));
  $("#pageTitle").textContent = views[button.dataset.view];
  $("#sidebar").classList.remove("open");
  if (button.dataset.view !== "overview" && button.dataset.view !== "cameras") {
    const labels = {recordings:"As gravações serão habilitadas quando o servidor de vídeo e o armazenamento forem configurados.",events:"Os eventos de movimento aparecerão aqui após conectar o serviço de análise.",connections:"O gateway ONVIF/RTSP será instalado em um servidor seguro da sua rede."};
    const content = $("#content");
    let note = $("#viewMessage");
    if (!note) { note = document.createElement("div"); note.id = "viewMessage"; note.className = "notice"; content.prepend(note); }
    note.textContent = labels[button.dataset.view];
  } else { $("#viewMessage")?.remove(); }
}));
renderCameras();
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
