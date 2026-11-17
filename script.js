/* ====== EDIT DI SINI SAJA ====== */
const KATING = [
  "Viana Salsabila Fairuz Syahla",
  "Clarenca Sweetdiva Pereira",
  "Fakhrul Fauzi Nugraha Tarigan",
  "Muhammad Hanief Febriasyah",
  "Sasikirana Ramadhanty Setiawan Putri",
  "Fauzan Arroyyan",
  "Kashrina Masyid Azka",
  "Ridho Chaerullah"
];
// Nama file tiap halaman (urutan sama dengan KATING). Kalau diganti, ganti juga nama filenya.
const SLUG = ['kak-viana', 'kak-diva', 'bang-oji', 'bang-hanip', 'kak-putri', 'bang-roy', 'kak-kash', 'bang-ridho'];
// Lagu: nomor 0 = Home, 1-8 = halaman kating (urutan sama dengan KATING)
const LAGU = ["musik/lagu.mp3","musik/viana.mp3","musik/diva.mp3","musik/oji.mp3","musik/hanip.mp3","musik/putri.mp3","musik/roy.mp3","musik/kash.mp3","musik/ridho.mp3"];
// Judul & artis tiap lagu (urutan sama dengan LAGU)
const JUDUL = [["Sesi Potret","eñau feat. Ari Lesmana"],["Hopelessly Devoted to You","Olivia Newton-John"],["Smile","Avril Lavigne"],["Little Bit Better","Caleb Hearn ft. Rosie"],["Maggots for Brains","Olivia Rodrigo"],["You're on Your Own, Kid","Taylor Swift"],["The Winner Takes It All","ABBA"],["Starlight","Westlife"],["Tattoo","Official髭男dism"]];
const DIBUAT_OLEH = "adik-adik SEIC"; // ganti: nama / angkatan kamu
/* =============================== */
const HALAMAN = ["index.html", ...SLUG.map(s => s + ".html")];
const file = i => HALAMAN[i];
const $ = s => document.querySelector(s);
let halaman = Number(document.body.dataset.page); // 0 = home, 1-8 = kating

// ---------- Navbar: daftar isi ----------
document.body.insertAdjacentHTML("afterbegin",
 `<nav class="nav"><a class="brand" href="index.html">Selamat Wisuda</a>
  <button class="burger" aria-expanded="false" aria-controls="daftar-isi">Daftar isi</button>
  <div class="panel" id="daftar-isi"><ul class="menu">${["Home",...KATING].map((n,i)=>`<li><a href="${file(i)}"><span class="nm">${n}</span><i class="titik"></i><span class="hal">${String(i).padStart(2,"0")}</span></a></li>`).join("")}</ul></div></nav>`);
const burger = $(".burger"), menu = $(".panel");
const tutupMenu = () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded","false"); burger.textContent = "Daftar isi"; };
burger.onclick = () => { const buka = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", buka); burger.textContent = buka ? "Tutup" : "Daftar isi"; };

// ---------- Musik: satu pemutar, lagu ganti per halaman ----------
const audio = new Audio(); audio.loop = true;
let laguSekarang = "", tmVol, musikAktif = localStorage.getItem("musikOn") !== "0";
const tombol = document.createElement("button"); tombol.className = "musik"; document.body.appendChild(tombol);
const judulEl = document.createElement("div"); judulEl.className = "judul-lagu"; judulEl.setAttribute("aria-hidden","true"); document.body.appendChild(judulEl);
const isiJudul = i => { const [t, a] = JUDUL[i] || ["",""]; judulEl.innerHTML = ""; const b = document.createElement("b"), s = document.createElement("span"); b.textContent = t; s.textContent = a; judulEl.append(b, s); };
const NADA='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3v11.3A3.5 3.5 0 1 0 11 17.5V7h6V3z"/></svg>', MATI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
const tampil = on => { judulEl.classList.toggle("tampil", on); tombol.innerHTML = on ? NADA : MATI; tombol.classList.toggle("putar", on); tombol.setAttribute("aria-label", on ? "Hentikan musik" : "Putar musik"); };
audio.addEventListener("play", () => tampil(true)); audio.addEventListener("pause", () => tampil(false)); audio.addEventListener("error", () => tampil(false));
function naikVolume(){ clearInterval(tmVol); let v = 0; audio.volume = 0; tmVol = setInterval(() => { v = Math.min(1, v + .05); audio.volume = v; if (v >= 1) clearInterval(tmVol); }, 40); }
function putar(){ const p = audio.play(); if (p) p.then(naikVolume).catch(() => {}); }
function setLagu(i){
  if (!LAGU[i]) return;
  if (laguSekarang !== LAGU[i]) { audio.pause(); laguSekarang = LAGU[i]; audio.src = laguSekarang; isiJudul(i); }
  if (musikAktif && audio.paused) putar();
}
tombol.onclick = () => {
  if (audio.paused) { musikAktif = true; localStorage.setItem("musikOn","1"); setLagu(halaman); putar(); }
  else { musikAktif = false; localStorage.setItem("musikOn","0"); audio.pause(); }
};
// Browser memblokir suara otomatis sebelum ada interaksi; sentuhan/ketukan pertama langsung memutar lagunya
["pointerdown","keydown","touchend"].forEach(ev => addEventListener(ev, e => {
  if (e.target.closest && e.target.closest(".musik")) return;
  if (musikAktif && audio.paused && laguSekarang) putar();
}, {passive:true}));
tampil(false);

// ---------- Modal "Happy Graduation!" + confetti ----------
const modal = document.createElement("div");
modal.className = "modal"; modal.setAttribute("role","status"); modal.setAttribute("aria-live","polite");
modal.innerHTML = `<canvas></canvas><div class="kotak"><b class="hand">Happy Graduation!</b><small>sebentar ya, lagi dibukain...</small></div>`;
document.body.appendChild(modal);
const cv = modal.querySelector("canvas"), cx = cv.getContext("2d");
let partikel = [], raf, jalan = false;
const WARNA = ["#ff6b4a","#ffc83d","#7fd1ae","#fffaf0","#6fa8ff"];
function confetti(){
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  cv.width = innerWidth; cv.height = innerHeight;
  partikel = Array.from({length:90},()=>({x:Math.random()*cv.width,y:-20-Math.random()*cv.height*.5,w:6+Math.random()*5,h:10+Math.random()*8,vy:2+Math.random()*3.5,vx:-1.5+Math.random()*3,r:Math.random()*6,vr:-.2+Math.random()*.4,c:WARNA[Math.random()*WARNA.length|0]}));
  (function frame(){
    cx.clearRect(0,0,cv.width,cv.height);
    partikel.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.w/2,-p.h/2,p.w,p.h);cx.restore()});
    raf = requestAnimationFrame(frame);
  })();
}

// ---------- Confetti kecil (saat ucapan berhasil dibuka) ----------
const kv = document.createElement("canvas"); kv.className = "konfeti"; document.body.appendChild(kv);
const kx = kv.getContext("2d");
function konfeti(el){
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  kv.width = innerWidth; kv.height = innerHeight;
  const r = el.getBoundingClientRect(), ox = r.left + r.width/2, oy = Math.min(Math.max(r.top + 40, 80), innerHeight - 80);
  const ps = Array.from({length:70}, () => ({x:ox, y:oy, vx:-5+Math.random()*10, vy:-(5+Math.random()*7), w:5+Math.random()*4, h:8+Math.random()*6, r:Math.random()*6, vr:-.25+Math.random()*.5, c:WARNA[Math.random()*WARNA.length|0]}));
  let f = 0;
  (function langkah(){
    kx.clearRect(0, 0, kv.width, kv.height);
    ps.forEach(p => { p.vy += .24; p.x += p.vx; p.y += p.vy; p.r += p.vr; kx.save(); kx.globalAlpha = Math.max(0, 1 - f/110); kx.translate(p.x, p.y); kx.rotate(p.r); kx.fillStyle = p.c; kx.fillRect(-p.w/2, -p.h/2, p.w, p.h); kx.restore(); });
    if (++f < 110) requestAnimationFrame(langkah); else kx.clearRect(0, 0, kv.width, kv.height);
  })();
}

// ---------- Pindah halaman tanpa reload (supaya musik tidak putus & autoplay diizinkan) ----------
async function muat(i, dorong = true){
  try {
    const r = await fetch(file(i)); if (!r.ok) throw 0;
    const doc = new DOMParser().parseFromString(await r.text(), "text/html");
    const m = doc.querySelector("main"), pg = doc.querySelector(".pager");
    document.querySelectorAll("body > main, body > .pager").forEach(e => e.remove());
    $(".nav").after(m); if (pg) m.after(pg);
    document.body.dataset.page = i; halaman = i;
    if (dorong) history.pushState({}, "", file(i));
    scrollTo(0, 0); initHalaman();
  } catch(e) { location.href = file(i); } // mis. dibuka lewat file:// tanpa server
}
function pergi(i, pakaiModal){
  if (jalan) return;
  setLagu(i); // dipanggil langsung di dalam klik, jadi diizinkan autoplay
  const sama = i === halaman;
  if (!pakaiModal) { if (!sama) muat(i); return; }
  jalan = true; modal.classList.add("show"); confetti();
  const selesai = () => { cancelAnimationFrame(raf); jalan = false; modal.classList.remove("show"); if (!sama) muat(i); };
  const t = setTimeout(selesai, 1500);
  modal.onclick = () => { clearTimeout(t); selesai(); };
}
document.addEventListener("click", e => {
  const a = e.target.closest("a[href]");
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button || a.target) return;
  const i = HALAMAN.indexOf(a.getAttribute("href")); if (i < 0) return;
  e.preventDefault(); tutupMenu(); pergi(i, !!a.closest(".nav"));
});
addEventListener("popstate", () => { const i = HALAMAN.indexOf(location.pathname.split("/").pop() || "index.html"); muat(i < 0 ? 0 : i, false); });
addEventListener("pageshow", () => { modal.classList.remove("show"); jalan = false; cancelAnimationFrame(raf); });
document.addEventListener("pointerdown", e => { if (menu.classList.contains("open") && !e.target.closest(".nav")) tutupMenu(); });

// ---------- Lightbox ----------
const box = document.createElement("div");
box.className = "lightbox"; box.innerHTML = "<img alt=''>";
document.body.appendChild(box);
box.onclick = () => box.classList.remove("show");
document.addEventListener("keydown", e => { if (e.key === "Escape") { tutupMenu(); box.classList.remove("show"); } });
document.body.addEventListener("click", e => {
  const f = e.target.closest(".bingkai .foto, .bareng .foto");
  if (!f || f.classList.contains("kosong")) return;
  box.querySelector("img").src = f.querySelector("img").src; box.classList.add("show");
});

// ---------- Footer ----------
document.body.insertAdjacentHTML("beforeend", `<footer class="kaki">dibuat oleh ${DIBUAT_OLEH}, buat kakak dan abang hebat</footer>`);

// ---------- Isi halaman (dipanggil saat buka & setiap pindah halaman) ----------
function initHalaman(){
  document.querySelectorAll(".menu a").forEach(a => {
    const ok = a.getAttribute("href") === file(halaman);
    a.classList.toggle("aktif", ok); ok ? a.setAttribute("aria-current","page") : a.removeAttribute("aria-current");
  });
  if (halaman > 0) {
    const n = KATING[halaman-1];
    document.title = `${n} · ${$(".profil .hand").textContent}`;
    document.querySelectorAll("[data-nama]").forEach(e => e.textContent = n);
    const ip = halaman > 1 ? halaman-1 : 0, ik = halaman < 8 ? halaman+1 : 0;
    const pv = $("[data-prev]"), nx = $("[data-next]");
    pv.href = file(ip); pv.textContent = "← " + (ip ? KATING[ip-1] : "Home");
    nx.href = file(ik); nx.textContent = (ik ? KATING[ik-1] : "Home") + " →";
  } else document.title = "Selamat wisuda, kakak dan abang";
  const g = $("#galeri");
  if (g) g.innerHTML = KATING.map((n,i)=>`<a class="polaroid" href="${file(i+1)}"><div class="foto" data-label="img/kating${i+1}-potret.jpg"><img loading="lazy" decoding="async" src="img/kating${i+1}-potret.jpg" alt="Foto ${n}"></div><span>${n}</span></a>`).join("");
  document.querySelectorAll(".foto img").forEach(img => {
    const gagal = () => { img.style.display = "none"; img.parentElement.classList.add("kosong"); };
    img.addEventListener("error", gagal); if (img.complete && img.naturalWidth === 0) gagal();
  });
  bukaKunci(); setLagu(halaman);
}

// Ucapan terkunci: dienkripsi AES-GCM, kunci diturunkan dari kata sandi (PBKDF2). Tanpa sandi, teks ucapan tidak ada di sumber halaman.
function bukaKunci(){
  const k = $("#kunci"); if (!k) return;
  const d = k.dataset, nama = KATING[halaman-1];
  const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  k.className = "memo tape kunci";
  k.innerHTML = `<svg class="gembok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
    <p class="kunci-judul">Ucapan ini khusus buat ${nama}.</p>
    <form><input type="text" autocapitalize="none" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="Kata sandi" placeholder="kata sandi"><button type="submit">Buka</button></form>
    <p class="kunci-pesan" role="alert"></p><p class="kunci-hint"></p>`;
  if (d.hint) k.querySelector(".kunci-hint").textContent = "Petunjuk: " + d.hint;
  const form = k.querySelector("form"), input = form.querySelector("input"), pesan = k.querySelector(".kunci-pesan");
  async function coba(sandi){
    const kunci = await crypto.subtle.importKey("raw", new TextEncoder().encode(sandi.trim().toLowerCase()), "PBKDF2", false, ["deriveKey"]);
    const kk = await crypto.subtle.deriveKey({name:"PBKDF2", salt:b64(d.salt), iterations:+d.iter, hash:"SHA-256"}, kunci, {name:"AES-GCM", length:256}, false, ["decrypt"]);
    return new TextDecoder().decode(await crypto.subtle.decrypt({name:"AES-GCM", iv:b64(d.iv)}, kk, b64(d.ct)));
  }
  function tampil(html, sandi, rayakan){
    const m = document.createElement("div");
    m.className = "memo tape terbuka"; m.innerHTML = html; k.replaceWith(m);
    if (rayakan) konfeti(m);
    try { sessionStorage.setItem("sandi"+halaman, sandi); } catch(e){}
  }
  async function kirim(sandi, otomatis){
    if (!(window.crypto && crypto.subtle)) { pesan.textContent = "Browser ini belum bisa membuka ucapan. Buka lewat alamat https (bukan http)."; return; }
    if (!sandi.trim()) return;
    form.querySelector("button").disabled = true; pesan.textContent = otomatis ? "" : "Membuka...";
    try { tampil(await coba(sandi), sandi, !otomatis); }
    catch(e){ form.querySelector("button").disabled = false; if (!otomatis) { pesan.textContent = "Sandinya belum cocok. Coba lagi ya."; k.classList.remove("salah"); void k.offsetWidth; k.classList.add("salah"); } else pesan.textContent = ""; }
  }
  form.addEventListener("submit", e => { e.preventDefault(); kirim(input.value, false); });
  let simpan = null; try { simpan = sessionStorage.getItem("sandi"+halaman); } catch(e){}
  if (simpan) kirim(simpan, true);
}

initHalaman();
