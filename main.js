const namaBenar = "zilless";
const tanggalLahirBenar = "0101"; 

// PLAYLIST LAGU FAVORIT
const playlist = [
    { title: "Blank Space", artist: "Taylor Swift", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "K.", artist: "Cigarettes After Sex", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Watch", artist: "Billie Eilish", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { title: "Rocketeer", artist: "Far East Movement", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { title: "Wildflower", artist: "Billie Eilish", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { title: "Cry", artist: "Cigarettes After Sex", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { title: "Guilty as Sin?", artist: "Taylor Swift", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    { title: "All Too Well", artist: "Taylor Swift", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" }
];

let currentTrackIdx = 0;

// AUDIO SYNTHESIS UNTUK SFX REALISTIS
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'click') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(523.25, now);
        gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
    } else if (type === 'coin') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.08);
        gain.gain.setValueAtTime(0.12, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'paper') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
        gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now); osc.stop(now + 0.15);
    } else if (type === 'drop') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.setValueAtTime(880.00, now + 0.1);
        gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now); osc.stop(now + 0.25);
    } else if (type === 'success') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.setValueAtTime(1046.50, now + 0.24);
        gain.gain.setValueAtTime(0.12, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
    } else if (type === 'error') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(180, now);
        gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now); osc.stop(now + 0.2);
    }
}

// BGM CONTROL
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

// LILIN & CONFETTI
let candleBlown = false;
function blowCandle() {
    if (candleBlown) return;
    candleBlown = true;
    playSound('success');

    document.getElementById("flame").classList.add("extinguished");

    setTimeout(() => {
        document.getElementById("smokeGroup").classList.add("active");
    }, 300);

    document.getElementById("blowHint").innerText = "✨ Happy Birthday, zilless! ✨";

    setTimeout(() => {
        if (typeof confetti === "function") {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
        document.getElementById("nextToVendingBtn").classList.remove("hidden");
    }, 2500);
}

function goToVending() {
    playSound('click');
    document.getElementById("candleStep").classList.add("hidden");
    document.getElementById("vendingStep").classList.remove("hidden");
    document.getElementById("hiddenCoin").classList.remove("hidden");
}

// PIN MODAL
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
            document.getElementById("marqueeText").innerText = "🪙 KOIN AKTIF! MASUKKAN KODE SLOT (A1, A2, B1, B2)";
        }, 500);
    } else {
        playSound('error');
        document.getElementById("pinDisplay").innerText = "WRONG";
        setTimeout(clearPin, 800);
    }
}

function triggerCoinSlotAnimation() {
    if(!hasCoin) {
        playSound('error');
        openPinModal();
    } else {
        playSound('coin');
    }
}

// KEYPAD & VENDING LOGIC
let currentCode = "";
const validSlots = {
    "A1": { name: "🎁 Special Memory", pageId: "pageMemory" },
    "A2": { name: "🎵 Favorite Songs", pageId: "pageSong" },
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
        alert("🔒 Koin belum dimasukkan! Klik koin tersembunyi & buka PIN tanggal lahir dulu.");
        return;
    }
    if (currentCode.length < 2) { playSound('error'); return; }

    const led = document.getElementById("codeLed");

    if (validSlots[currentCode]) {
        if (dispensedSlots.includes(currentCode)) {
            playSound('error');
            led.innerText = "USED";
            setTimeout(clearKeypad, 800);
            return;
        }

        playSound('drop');
        const lockedAnim = document.getElementById("dispenserLocked");
        if (lockedAnim) lockedAnim.remove();

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
    itemDiv.innerHTML = `${text} <span style='font-size:0.75rem; float:right; color:#888;'>Buka 🚀</span>`;
    itemDiv.onclick = () => openPage(targetPageId);
    dispenser.appendChild(itemDiv);
    dispenser.scrollTop = dispenser.scrollHeight;
}

// NAVIGASI HALAMAN
function openPage(pageId) {
    playSound('click');
    document.getElementById("vendingStep").classList.add("hidden");
    document.getElementById(pageId).classList.remove("hidden");
    document.getElementById("mainCard").classList.add("card-tall");

    if (pageId === "pageSong") renderPlaylist();
}

function backToVending() {
    playSound('click');
    document.getElementById("mainCard").classList.remove("card-tall");
    const detailPages = ["pageMemory", "pageSong", "pageMessage", "pagePhoto", "pageSpecial"];
    detailPages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
    });
    document.getElementById("vendingStep").classList.remove("hidden");
}

// REVISI AMPLOP REALISTIS, PITA MERAH & EFEK TYPING INTERAKTIF
let envelopeStage = 0; // 0: Terkunci/Tertutup, 1: Terbuka Setengah & Kertas Keluar Sedikit, 2: Kertas Penuh di Depan
let isTypingActive = false;
let typewriterTimeout = null;
const fullMessageText = "Semoga di usiamu yang baru ini kamu selalu dikelilingi oleh hal-hal baik, diberi kesehatan, kemudahan dalam setiap langkah, dan makin sukses dalam apapun yang sedang diperjuangkan! ✨✨\n\nWith best wishes, ❤️";

function handleEnvelopeClick() {
    if (isTypingActive) return;

    const flap = document.getElementById("envelopeFlap");
    const ribbon = document.getElementById("ribbonRed");
    const paper = document.getElementById("letterPaper");
    const hint = document.getElementById("envelopeHint");

    if (envelopeStage === 0) {
        // KLIK 1: Lepas pita, buka flap, kertas keluar sedikit secara halus
        playSound('paper');
        ribbon.classList.add("ribbon-detached");
        flap.classList.add("flap-open");
        
        setTimeout(() => {
            paper.classList.add("paper-peek");
        }, 300);

        hint.innerText = "Klik sekali lagi untuk membuka kertas penuh (2/2)";
        envelopeStage = 1;
    } else if (envelopeStage === 1) {
        // KLIK 2: Kertas maju ke depan amplop & penuh
        playSound('paper');
        paper.classList.remove("paper-peek");
        paper.classList.add("paper-full-front");

        hint.innerText = "✨ Special Letter ✨";
        document.getElementById("btnCloseLetter").classList.remove("hidden");
        envelopeStage = 2;

        setTimeout(startTypewriter, 700);
    }
}

function startTypewriter() {
    const target = document.getElementById("typewriterTarget");
    target.innerHTML = "";
    let i = 0;
    isTypingActive = true;
    
    function typeChar() {
        if (i < fullMessageText.length) {
            const char = fullMessageText.charAt(i);
            target.innerHTML += (char === "\n") ? "<br>" : char;
            i++;
            typewriterTimeout = setTimeout(typeChar, 35);
        } else {
            isTypingActive = false;
        }
    }
    typeChar();
}

function closeLetterToEnvelope() {
    playSound('paper');
    clearTimeout(typewriterTimeout);
    isTypingActive = false;

    const flap = document.getElementById("envelopeFlap");
    const ribbon = document.getElementById("ribbonRed");
    const paper = document.getElementById("letterPaper");
    const hint = document.getElementById("envelopeHint");
    const btnClose = document.getElementById("btnCloseLetter");

    // Kembalikan kertas ke dalam amplop
    paper.classList.remove("paper-full-front");
    paper.classList.remove("paper-peek");
    document.getElementById("typewriterTarget").innerHTML = "";
    btnClose.classList.add("hidden");

    setTimeout(() => {
        flap.classList.remove("flap-open");
        ribbon.classList.remove("ribbon-detached");
        hint.innerText = "Klik amplop untuk membuka (1/2)";
        envelopeStage = 0;
    }, 500);
}

// MUSIC PLAYER & PLAYLIST LOGIC WITH TONEARM ANIMATION
function renderPlaylist() {
    const container = document.getElementById("playlistItems");
    container.innerHTML = "";
    playlist.forEach((song, idx) => {
        const item = document.createElement("div");
        item.className = idx === currentTrackIdx ? "playlist-item active" : "playlist-item";
        item.innerHTML = `<span>${idx + 1}. ${song.title}</span> <small>${song.artist}</small>`;
        item.onclick = () => selectTrack(idx);
        container.appendChild(item);
    });
}

function selectTrack(idx) {
    playSound('click');
    currentTrackIdx = idx;
    loadTrack(currentTrackIdx);
    playMusic();
    renderPlaylist();
}

function loadTrack(idx) {
    const track = playlist[idx];
    document.getElementById("currentSongTitle").innerText = track.title;
    document.getElementById("currentSongArtist").innerText = track.artist;
    favAudio.src = track.src;
}

function playMusic() {
    stopBGM();
    favAudio.play();
    document.getElementById("playBtn").innerText = "⏸️";
    document.getElementById("musicDisc").classList.add("spinning");
    document.getElementById("tonearmArm").classList.add("arm-on-record");
}

function togglePlayMusic() {
    playSound('click');
    const playBtn = document.getElementById("playBtn");
    const disc = document.getElementById("musicDisc");
    const arm = document.getElementById("tonearmArm");

    if (favAudio.paused) {
        playMusic();
    } else {
        favAudio.pause();
        playBtn.innerText = "▶️";
        disc.classList.remove("spinning");
        arm.classList.remove("arm-on-record");
        startBGM();
    }
}

function nextTrack() {
    playSound('click');
    currentTrackIdx = (currentTrackIdx + 1) % playlist.length;
    selectTrack(currentTrackIdx);
}

function prevTrack() {
    playSound('click');
    currentTrackIdx = (currentTrackIdx - 1 + playlist.length) % playlist.length;
    selectTrack(currentTrackIdx);
}

function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function seekAudio(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    favAudio.currentTime = pos * favAudio.duration;
}

if (favAudio) {
    favAudio.ontimeupdate = () => {
        const progress = (favAudio.currentTime / favAudio.duration) * 100;
        document.getElementById("progressBar").style.width = `${progress}%`;
        document.getElementById("currentTime").innerText = formatTime(favAudio.currentTime);
    };

    favAudio.onloadedmetadata = () => {
        document.getElementById("totalDuration").innerText = formatTime(favAudio.duration);
    };

    favAudio.onended = () => {
        nextTrack();
    };
}

// POLAROID GALLERY WITH SHAKE & FLASH EFEK
const photos = [
    { src: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80", caption: "Aesthetic Birthday Cake 🎂" },
    { src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80", caption: "Party Party! 🎈✨" },
    { src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80", caption: "Best Wishes For You 🎁" }
];
let photoIdx = 0;

function triggerCameraFlash() {
    const flash = document.getElementById("flashOverlay");
    flash.classList.add("flash-active");
    setTimeout(() => flash.classList.remove("flash-active"), 300);
}

function shakePolaroid() {
    playSound('click');
    const card = document.getElementById("polaroidCard");
    card.classList.add("polaroid-shake");
    setTimeout(() => card.classList.remove("polaroid-shake"), 600);
}

function nextPhoto() {
    playSound('click');
    triggerCameraFlash();
    photoIdx = (photoIdx + 1) % photos.length;
    setTimeout(() => {
        document.getElementById("polaroidImg").src = photos[photoIdx].src;
        document.getElementById("polaroidCaption").innerText = photos[photoIdx].caption;
    }, 150);
}

function prevPhoto() {
    playSound('click');
    triggerCameraFlash();
    photoIdx = (photoIdx - 1 + photos.length) % photos.length;
    setTimeout(() => {
        document.getElementById("polaroidImg").src = photos[photoIdx].src;
        document.getElementById("polaroidCaption").innerText = photos[photoIdx].caption;
    }, 150);
}

// 3D TILT EFFECT ON MEMORY CARD
const tiltCard = document.getElementById("tiltMemoryCard");
if (tiltCard) {
    tiltCard.addEventListener("mousemove", (e) => {
        const rect = tiltCard.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        tiltCard.style.transform = `rotateY(${x / 15}deg) rotateX(${-y / 15}deg)`;
    });

    tiltCard.addEventListener("mouseleave", () => {
        tiltCard.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
}
