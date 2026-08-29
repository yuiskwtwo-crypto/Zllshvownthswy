const namaBenar = "zilless";
const tanggalLahirBenar = "0101"; // Format DDMM

// WEB AUDIO API FOR SOUND EFFECTS
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
    } else if (type === 'coin') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'drop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.setValueAtTime(880.00, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now); osc.stop(now + 0.25);
    } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.setValueAtTime(1046.50, now + 0.24);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
    } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now); osc.stop(now + 0.2);
    }
}

// BGM & FAVORITE MUSIC MANAGEMENT
const bgm = document.getElementById("bgmAudio");
const favAudio = document.getElementById("audioPlayer");

function startBGM() {
    if (bgm && favAudio.paused) {
        bgm.volume = 0.3;
        bgm.play().catch(() => {});
    }
}

function stopBGM() {
    if (bgm) bgm.pause();
}

// Auto resume BGM jika lagu favorit selesai
if (favAudio) {
    favAudio.onended = () => {
        const playBtn = document.getElementById("playBtn");
        const disc = document.getElementById("musicDisc");
        if (playBtn) playBtn.innerText = "▶️ Play Track";
        if (disc) disc.classList.remove("spinning");
        startBGM();
    };
}

function cekNama() {
    playSound('click');
    startBGM();
    
    const input = document.getElementById("inputNama").value.trim().toLowerCase();
    const error = document.getElementById("errorMsg");

    if (input === namaBenar) {
        document.getElementById("loginBox").classList.add("hidden");
        document.getElementById("candleStep").classList.remove("hidden");
        error.style.display = "none";
    } else {
        playSound('error');
        error.style.display = "block";
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") cekNama();
}

// LILIN HD & ASAP REALISTIS LOGIC
let candleBlown = false;
function blowCandle() {
    if (candleBlown) return;
    playSound('success');
    
    document.getElementById("flame").classList.add("extinguished");
    document.getElementById("smokeGroup").classList.add("active");
    
    candleBlown = true;
    document.getElementById("blowHint").innerText = "✨ Widiihh happy birthday ✨";
    if (typeof confetti === "function") confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });

    setTimeout(() => {
        document.getElementById("nextToVendingBtn").classList.remove("hidden");
    }, 1200);
}

function goToVending() {
    playSound('click');
    document.getElementById("candleStep").classList.add("hidden");
    document.getElementById("vendingStep").classList.remove("hidden");
    document.getElementById("hiddenCoin").classList.remove("hidden");
}

// MODAL PIN KEYPAD
let inputPin = "";
let hasCoin = false;

function openPinModal() {
    playSound('click');
    document.getElementById("pinModal").classList.remove("hidden");
}

function pressPin(num) {
    playSound('click');
    if (inputPin.length < 4) {
        inputPin += num;
        document.getElementById("pinDisplay").innerText = inputPin.padEnd(4, '-');
    }
}

function clearPin() {
    playSound('click');
    inputPin = "";
    document.getElementById("pinDisplay").innerText = "----";
}

function submitPin() {
    if (inputPin === tanggalLahirBenar) {
        playSound('coin');
        hasCoin = true;
        document.getElementById("pinModal").classList.add("hidden");
        
        const coin = document.getElementById("hiddenCoin");
        coin.style.transform = "scale(1.5) translate(-100px, 100px)";
        coin.style.opacity = "0";

        setTimeout(() => {
            coin.classList.add("hidden");
            document.getElementById("marqueeText").innerText = "🪙 UNLOCKED! MASUKKAN KODE SLOT (A1, A2, B1, B2)";
        }, 500);
    } else {
        playSound('error');
        document.getElementById("pinDisplay").innerText = "WRONG";
        setTimeout(clearPin, 800);
    }
}

// KEYPAD VENDING MACHINE LOGIC
let currentCode = "";
const validSlots = {
    "A1": { name: "🎁 Special Memory", pageId: "pageMemory" },
    "A2": { name: "🎵 Favorite Song", pageId: "pageSong" },
    "B1": { name: "💌 Secret Message", pageId: "pageMessage" },
    "B2": { name: "📸 Cute Photo", pageId: "pagePhoto" }
};
let dispensedSlots = [];

function pressKey(char) {
    playSound('click');
    if (currentCode.length < 2) {
        currentCode += char;
        document.getElementById("codeLed").innerText = currentCode;
    }
}

function clearKeypad() {
    playSound('click');
    currentCode = "";
    document.getElementById("codeLed").innerText = "--";
}

function submitCode() {
    if (!hasCoin) {
        playSound('error');
        alert("🔒 Koin belum aktif! Klik koin tersembunyi & masukkan PIN tanggal lahir dulu.");
        return;
    }
    if (currentCode.length < 2) { playSound('error'); return; }

    const led = document.getElementById("codeLed");
    const hint = document.getElementById("dispenserHint");

    if (validSlots[currentCode]) {
        if (dispensedSlots.includes(currentCode)) {
            playSound('error');
            led.innerText = "USED";
            setTimeout(clearKeypad, 800);
            return;
        }

        playSound('drop');
        if (hint) hint.remove();

        const slot = validSlots[currentCode];
        dispensedSlots.push(currentCode);
        
        createDispenserItem(slot.name, slot.pageId, false);
        clearKeypad();

        if (dispensedSlots.length === 4) {
            setTimeout(() => {
                playSound('success');
                createDispenserItem("🌟 SPECIAL ITEM UNLOCKED 🌟", "pageSpecial", true);
                document.getElementById("pesanRahasia").style.display = "block";
                if (typeof confetti === "function") confetti({ particleCount: 110, spread: 85 });
            }, 800);
        }
    } else {
        playSound('error');
        led.innerText = "ERR";
        setTimeout(clearKeypad, 800);
    }
}

function createDispenserItem(text, targetPageId, isSpecial) {
    const dispenser = document.getElementById("dispenser");
    const itemDiv = document.createElement("div");
    itemDiv.className = isSpecial ? "vending-item special-item" : "vending-item";
    itemDiv.innerHTML = `${text} <span style='font-size:0.75rem; float:right; color:#888;'>(Buka 🚀)</span>`;
    itemDiv.onclick = () => openPage(targetPageId);
    dispenser.appendChild(itemDiv);
    dispenser.scrollTop = dispenser.scrollHeight;
}

// NAVIGASI HALAMAN & LAYOUT MEMANJANG (TALL CARD)
function openPage(pageId) {
    playSound('click');
    document.getElementById("vendingStep").classList.add("hidden");
    document.getElementById(pageId).classList.remove("hidden");
    // Ubah wadah utama jadi lebih memanjang & elegan
    document.getElementById("mainCard").classList.add("card-tall");
}

function backToVending() {
    playSound('click');
    // Kembalikan ukuran wadah ke mode normal Vending
    document.getElementById("mainCard").classList.remove("card-tall");

    const detailPages = ["pageMemory", "pageSong", "pageMessage", "pagePhoto", "pageSpecial"];
    detailPages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
    });
    document.getElementById("vendingStep").classList.remove("hidden");
}

// TOGGLE FAVORITE MUSIC (MENIHILKAN KONTRA BGM)
function togglePlayMusic() {
    playSound('click');
    const playBtn = document.getElementById("playBtn");
    const disc = document.getElementById("musicDisc");

    if (favAudio.paused) {
        stopBGM(); // Hentikan BGM saat lagu favorit dimainkan
        favAudio.play();
        playBtn.innerText = "⏸️ Pause Track";
        disc.classList.add("spinning");
    } else {
        favAudio.pause();
        playBtn.innerText = "▶️ Play Track";
        disc.classList.remove("spinning");
        startBGM(); // Resume BGM setelah lagu dipause
    }
}

// POLAROID GALLERY LOGIC
const photos = [
    { src: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80", caption: "Aesthetic Birthday Cake 🎂" },
    { src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80", caption: "Party Party! 🎈✨" },
    { src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80", caption: "Best Wishes For You 🎁" }
];
let photoIdx = 0;

function nextPhoto() {
    playSound('click');
    photoIdx = (photoIdx + 1) % photos.length;
    document.getElementById("polaroidImg").src = photos[photoIdx].src;
    document.getElementById("polaroidCaption").innerText = photos[photoIdx].caption;
}

function prevPhoto() {
    playSound('click');
    photoIdx = (photoIdx - 1 + photos.length) % photos.length;
    document.getElementById("polaroidImg").src = photos[photoIdx].src;
    document.getElementById("polaroidCaption").innerText = photos[photoIdx].caption;
}
