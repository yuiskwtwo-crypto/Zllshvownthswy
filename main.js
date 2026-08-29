const namaBenar = "zilless";
const tanggalLahirBenar = "0101"; // Format: DDMM (Contoh: 0101 = 1 Januari)

// 1. WEB AUDIO API - SOUND EFFECTS AESTHETIC
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // Tone C5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
    } 
    else if (type === 'coin') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987.77, now); // Tone B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // Tone E6
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } 
    else if (type === 'drop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.setValueAtTime(880.00, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now); osc.stop(now + 0.25);
    } 
    else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.setValueAtTime(1046.50, now + 0.24);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
    }
    else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now); osc.stop(now + 0.2);
    }
}

// 2. KONTROL BGM
function startBGM() {
    const bgm = document.getElementById("bgmAudio");
    if (bgm) {
        bgm.volume = 0.3;
        bgm.play().catch(err => console.log("Autoplay ditahan browser, butuh interaksi:", err));
    }
}

// 3. LOGIKA LOGIN
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

// 4. LOGIKA TIUP LILIN
let candleBlown = false;
function blowCandle() {
    if (candleBlown) return;
    playSound('success');
    
    document.getElementById("flame").style.opacity = "0";
    document.getElementById("smoke").classList.add("active");
    
    candleBlown = true;
    document.getElementById("blowHint").innerText = "✨ Widiihh happy birthday ✨";
    
    if (typeof confetti === "function") {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }

    setTimeout(() => {
        document.getElementById("nextToVendingBtn").classList.remove("hidden");
    }, 1000);
}

function goToVending() {
    playSound('click');
    document.getElementById("candleStep").classList.add("hidden");
    document.getElementById("vendingStep").classList.remove("hidden");
    document.getElementById("hiddenCoin").classList.remove("hidden");
}

// 5. MODAL KEYPAD PIN TANGGAL LAHIR
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
        updatePinDisplay();
    }
}

function clearPin() {
    playSound('click');
    inputPin = "";
    updatePinDisplay();
}

function updatePinDisplay() {
    document.getElementById("pinDisplay").innerText = inputPin.padEnd(4, '-');
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

// 6. LOGIKA KEYPAD VENDING MACHINE
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
        alert("🔒 Koin belum aktif! Klik koin emas tersembunyi & masukkan PIN tanggal lahir dulu.");
        return;
    }

    if (currentCode.length < 2) {
        playSound('error');
        return;
    }

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

        // Cek jika semua item sudah diambil
        if (dispensedSlots.length === 4) {
            setTimeout(() => {
                playSound('success');
                createDispenserItem("🌟 SPECIAL ITEM UNLOCKED 🌟", "pageSpecial", true);
                document.getElementById("pesanRahasia").style.display = "block";
                if (typeof confetti === "function") {
                    confetti({ particleCount: 100, spread: 80 });
                }
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

// 7. NAVIGASI DETAIL PAGES
function openPage(pageId) {
    playSound('click');
    document.getElementById("vendingStep").classList.add("hidden");
    document.getElementById(pageId).classList.remove("hidden");
}

function backToVending() {
    playSound('click');
    const audio = document.getElementById("audioPlayer");
    if (audio) {
        audio.pause();
        const playBtn = document.getElementById("playBtn");
        const disc = document.getElementById("musicDisc");
        if (playBtn) playBtn.innerText = "▶️ Play";
        if (disc) disc.classList.remove("spinning");
    }

    const detailPages = ["pageMemory", "pageSong", "pageMessage", "pagePhoto", "pageSpecial"];
    detailPages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
    });
    document.getElementById("vendingStep").classList.remove("hidden");
}

// 8. MUSIC PLAYER & GALERI POLAROID
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
