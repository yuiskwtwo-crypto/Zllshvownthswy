// NAMA RAHASIA UNTUK MASUK (Case-insensitive)
const namaBenar = "zilless";

// EFEK SUARA SINTETIS (WEB AUDIO API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } else if (type === 'coin') {
        osc.frequency.setValueAtTime(900, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'drop') {
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    }
}

function cekNama() {
    playSound('click');
    const input = document.getElementById("inputNama").value.trim().toLowerCase();
    const error = document.getElementById("errorMsg");

    if (input === namaBenar) {
        document.getElementById("loginBox").classList.add("hidden");
        document.getElementById("candleStep").classList.remove("hidden");
        error.style.display = "none";
    } else {
        error.style.display = "block";
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") cekNama();
}

// LOGIK TIUP LILIN
let candleBlown = false;

function blowCandle() {
    if (candleBlown) return;

    playSound('click');
    const flame = document.getElementById("flame");
    const smoke = document.getElementById("smoke");
    const blowHint = document.getElementById("blowHint");
    const nextBtn = document.getElementById("nextToVendingBtn");

    flame.style.opacity = "0";
    flame.style.transform = "translateX(-50%) scale(0)";
    smoke.classList.add("active");
    
    candleBlown = true;
    blowHint.innerText = "✨ Widiihh happy birthday ✨";
    
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    setTimeout(() => {
        nextBtn.classList.remove("hidden");
    }, 1000);
}

function goToVending() {
    playSound('click');
    document.getElementById("candleStep").classList.add("hidden");
    document.getElementById("vendingStep").classList.remove("hidden");
}

// LOGIK VENDING MACHINE DISPENSE
function dispenseItems() {
    playSound('coin');
    const btn = document.getElementById("coinBtn");
    const screen = document.getElementById("machineScreen");
    const dispenser = document.getElementById("dispenser");
    
    btn.disabled = true;
    btn.classList.remove("pulse-anim");
    btn.style.opacity = "0.6";
    btn.innerText = "PROCESSING...";
    dispenser.innerHTML = "";
    screen.innerHTML = "<div>VENDING IN PROGRESS...</div>";

    const items = [
        { text: "🎁 Special Memory", pageId: "pageMemory" },
        { text: "🎵 Favorite Song", pageId: "pageSong" },
        { text: "💌 Secret Message", pageId: "pageMessage" },
        { text: "📸 Cute Photo", pageId: "pagePhoto" }
    ];

    let delay = 0;

    items.forEach((itemObj) => {
        delay += 800;
        setTimeout(() => {
            playSound('drop');
            createDispenserItem(itemObj.text, itemObj.pageId, false);
        }, delay);
    });

    delay += 1000;
    setTimeout(() => {
        playSound('drop');
        screen.innerHTML = "<div>🌟 SPECIAL UNLOCKED! 🌟</div>";
        createDispenserItem("🌟 SPECIAL ITEM UNLOCKED 🌟", "pageSpecial", true);

        document.getElementById("pesanRahasia").style.display = "block";
        
        var duration = 3 * 1000;
        var end = Date.now() + duration;

        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());

        btn.innerText = "VENDING COMPLETE!";
    }, delay);
}

function createDispenserItem(text, targetPageId, isSpecial) {
    const dispenser = document.getElementById("dispenser");
    const itemDiv = document.createElement("div");
    
    itemDiv.className = isSpecial ? "vending-item special-item" : "vending-item";
    itemDiv.innerHTML = `${text} <span style='font-size:0.75rem; float:right; color:#888;'>(Buka 🚀)</span>`;
    
    itemDiv.addEventListener("click", () => {
        openPage(targetPageId);
    });

    dispenser.appendChild(itemDiv);
    dispenser.scrollTop = dispenser.scrollHeight;
}

// LOGIK NAVIGASI PINDAH HALAMAN (VENDING <-> ITEM)
function openPage(pageId) {
    playSound('click');
    document.getElementById("vendingStep").classList.add("hidden");
    document.getElementById(pageId).classList.remove("hidden");
}

function backToVending() {
    playSound('click');
    // Matikan lagu jika sedang memutar musik saat klik kembali
    const audio = document.getElementById("audioPlayer");
    if (audio) {
        audio.pause();
        document.getElementById("playBtn").innerText = "▶️ Play";
        document.getElementById("musicDisc").classList.remove("spinning");
    }

    // Sembunyikan semua halaman detail item
    const detailPages = ["pageMemory", "pageSong", "pageMessage", "pagePhoto", "pageSpecial"];
    detailPages.forEach(id => document.getElementById(id).classList.add("hidden"));

    // Tampilkan kembali Vending Machine
    document.getElementById("vendingStep").classList.remove("hidden");
}

// LOGIK MUSIC PLAYER (PAGE 2)
function togglePlayMusic() {
    playSound('click');
    const audio = document.getElementById("audioPlayer");
    const playBtn = document.getElementById("playBtn");
    const disc = document.getElementById("musicDisc");

    if (audio.paused) {
        audio.play();
        playBtn.innerText = "⏸️ Pause";
        disc.classList.add("spinning");
    } else {
        audio.pause();
        playBtn.innerText = "▶️ Play";
        disc.classList.remove("spinning");
    }
}

// LOGIK POLAROID GALLERY (PAGE 4)
// Kamu bisa ganti URL foto di bawah ini dengan foto kamu sendiri
const photos = [
    { src: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80", caption: "Aesthetic Birthday Cake 🎂" },
    { src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80", caption: "Party Party! 🎈✨" },
    { src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80", caption: "Best Wishes For You 🎁" }
];
let photoIdx = 0;

function updatePolaroid() {
    const img = document.getElementById("polaroidImg");
    const cap = document.getElementById("polaroidCaption");
    img.src = photos[photoIdx].src;
    cap.innerText = photos[photoIdx].caption;
}

function nextPhoto() {
    playSound('click');
    photoIdx = (photoIdx + 1) % photos.length;
    updatePolaroid();
}

function prevPhoto() {
    playSound('click');
    photoIdx = (photoIdx - 1 + photos.length) % photos.length;
    updatePolaroid();
}
