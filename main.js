const namaBenar = "zilless";
const tanggalLahirBenar = "2708"; 

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

// AUDIO SYNTHESIS UNTUK SFX
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
    initCoinDraggable();
}

// PIN MODAL
let inputPin = "";
let pinUnlocked = false;
let coinInserted = false;

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
        playSound('success');
        pinUnlocked = true;
        document.getElementById("pinModal").classList.add("hidden");
        
        const marquee = document.getElementById("marqueeText");
        marquee.innerText = "SERET KOIN KE LUBANG KOIN!";
    } else {
        playSound('error');
        document.getElementById("pinDisplay").innerText = "WRONG";
        setTimeout(clearPin, 800);
    }
}

// DRAG & DROP KOIN REALISTIS
function initCoinDraggable() {
    const coin = document.getElementById("hiddenCoin");
    const slotHousing = document.getElementById("coinSlotHousing");
    
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function onStart(e) {
        if (coinInserted) return;
        
        if (!pinUnlocked) {
            openPinModal();
            return;
        }

        isDragging = true;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const rect = coin.getBoundingClientRect();
        
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;

        coin.style.position = 'fixed';
        coin.style.left = `${rect.left}px`;
        coin.style.top = `${rect.top}px`;
        coin.style.right = 'auto';
        coin.style.margin = '0';
        coin.style.transition = 'none';
        
        slotHousing.classList.add("slot-highlight");
    }

    function onMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        coin.style.left = `${clientX - offsetX}px`;
        coin.style.top = `${clientY - offsetY}px`;
    }

    function onEnd() {
        if (!isDragging) return;
        isDragging = false;
        slotHousing.classList.remove("slot-highlight");

        const coinRect = coin.getBoundingClientRect();
        const slotRect = slotHousing.getBoundingClientRect();

        const isOverlapping = !(
            coinRect.right < slotRect.left ||
            coinRect.left > slotRect.right ||
            coinRect.bottom < slotRect.top ||
            coinRect.top > slotRect.bottom
        );

        if (isOverlapping) {
            coinInserted = true;
            playSound('coin');
            coin.style.transition = "all 0.4s ease-in";
            coin.style.left = `${slotRect.left + slotRect.width / 2 - coinRect.width / 2}px`;
            coin.style.top = `${slotRect.top + slotRect.height / 2 - coinRect.height / 2}px`;
            coin.style.transform = "scale(0.2)";
            coin.style.opacity = "0";

            setTimeout(() => {
                coin.classList.add("hidden");
                document.getElementById("marqueeText").innerText = "🪙 KOIN AKTIF! KETIK KODE (A1, A2, B1, B2)";
            }, 400);
        } else {
            coin.style.transition = "transform 0.1s ease";
        }
    }

    coin.addEventListener("mousedown", onStart);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);

    coin.addEventListener("touchstart", onStart, { passive: false });
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);
}

// KEYPAD & VENDING LOGIC
let currentCode = "";
const validSlots = {
    "A1": { name: "📜 Achivements", pageId: "pageCertificate" },
    "A2": { name: "🎵 Playlist Lagu", pageId: "pageMusic" },
    "B1": { name: "💌 Surat Ulang Tahun", pageId: "pageLetter" },
    "B2": { name: "📸 Photo Stack", pageId: "pagePhoto" }
};

function pressKey(char) {
    playSound('click');
    if (!coinInserted) {
        document.getElementById("marqueeText").innerText = "MASUKKAN KOIN DULU!";
        return;
    }
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
    if (!coinInserted) {
        playSound('error');
        document.getElementById("marqueeText").innerText = "MASUKKAN KOIN DULU!";
        return;
    }

    if (validSlots[currentCode]) {
        playSound('drop');
        const item = validSlots[currentCode];
        document.getElementById("marqueeText").innerText = `MEMBUKA: ${item.name}...`;

        setTimeout(() => {
            openDetailPage(item.pageId);
            clearKeypad();
        }, 600);
    } else if (currentCode === "99") {
        playSound('success');
        openDetailPage("pageSpecial");
        clearKeypad();
    } else {
        playSound('error');
        document.getElementById("codeLed").innerText = "ERR";
        setTimeout(clearKeypad, 800);
    }
}

function openDetailPage(pageId) {
    document.getElementById("vendingStep").classList.add("hidden");
    document.getElementById("hiddenCoin").classList.add("hidden");
    
    if (pageId === "pageCertificate") {
        document.getElementById("mainCard").classList.add("card-cert");
    } else {
        document.getElementById("mainCard").classList.remove("card-cert");
    }

    if (pageId === "pagePhoto") {
        initPhotoStack();
    }

    document.getElementById(pageId).classList.remove("hidden");
}

function backToVending() {
    playSound('click');
    document.querySelectorAll(".detail-page").forEach(p => p.classList.add("hidden"));
    document.getElementById("mainCard").classList.remove("card-cert");
    document.getElementById("vendingStep").classList.remove("hidden");
    if (coinInserted) {
        document.getElementById("marqueeText").innerText = "PILIH ITEM DENGAN KEYPAD!";
    }
}

// MUSIC PLAYER LOGIC
function loadTrack(idx) {
    const track = playlist[idx];
    document.getElementById("songTitle").innerText = track.title;
    document.getElementById("songArtist").innerText = track.artist;
    favAudio.src = track.src;
}

function togglePlay() {
    playSound('click');
    const vinyl = document.getElementById("vinyl");
    const playBtn = document.getElementById("playBtn");

    if (favAudio.paused) {
        stopBGM();
        favAudio.play();
        vinyl.classList.add("spinning");
        playBtn.innerText = "⏸️";
    } else {
        favAudio.pause();
        vinyl.classList.remove("spinning");
        playBtn.innerText = "▶️";
        startBGM();
    }
}

function nextSong() {
    playSound('click');
    currentTrackIdx = (currentTrackIdx + 1) % playlist.length;
    loadTrack(currentTrackIdx);
    if (!favAudio.paused) favAudio.play();
}

function prevSong() {
    playSound('click');
    currentTrackIdx = (currentTrackIdx - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIdx);
    if (!favAudio.paused) favAudio.play();
}

favAudio.addEventListener("ended", nextSong);

// ----------------------------------------------------
// LOGIC FITUR PHOTO STACK
// ----------------------------------------------------
const photoData = [
    { src: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80", caption: "where it all started" },
    { src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80", caption: "somehow, things got more chaotic" },
    { src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80", caption: "one of those days worth remembering" },
    { src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80", caption: "proof that we actually had fun" },
    { src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80", caption: "and somehow, here we are" }
];

// Presets rotasi & offset tumpukan fisik
const stackTransforms = [
    { rotate: -2, scale: 1, x: 0, y: 0 },
    { rotate: 3, scale: 0.96, x: 4, y: 4 },
    { rotate: -4, scale: 0.92, x: -5, y: 7 },
    { rotate: 2, scale: 0.88, x: 5, y: 10 },
    { rotate: -3, scale: 0.84, x: -3, y: 13 }
];

let photoOrder = [0, 1, 2, 3, 4];
let isAnimatingStack = false;

function initPhotoStack() {
    renderStack();
}

function renderStack() {
    const wrapper = document.getElementById("photoStack");
    wrapper.innerHTML = "";

    // Render dari belakang ke depan agar z-index sesuai
    for (let i = photoOrder.length - 1; i >= 0; i--) {
        const photoIndex = photoOrder[i];
        const data = photoData[photoIndex];
        const transform = stackTransforms[i];

        const card = document.createElement("div");
        card.className = "stack-card";
        card.dataset.position = i; // 0 adalah foto paling depan
        
        // Z-Index: posisi 0 (depan) mendapat z-index paling tinggi
        card.style.zIndex = photoOrder.length - i;
        card.style.transform = `translate(${transform.x}px, ${transform.y}px) rotate(${transform.rotate}deg) scale(${transform.scale})`;

        card.innerHTML = `
            <div class="stack-img-wrapper">
                <img src="${data.src}" alt="Memory Photo ${photoIndex + 1}">
            </div>
        `;

        if (i === 0) {
            card.onclick = handleFrontCardClick;
        }

        wrapper.appendChild(card);
    }

    updateCaptionAndIndicators();
}

function handleFrontCardClick() {
    if (isAnimatingStack) return;
    isAnimatingStack = true;

    playSound('click');

    const wrapper = document.getElementById("photoStack");
    // Foto paling depan (posisi 0)
    const frontCard = wrapper.querySelector('.stack-card[data-position="0"]');

    if (!frontCard) return;

    // Tambahkan kelas animasi swipe out & move to back
    frontCard.classList.add("anim-out");

    // Fade out caption
    const captionEl = document.getElementById("stackCaption");
    captionEl.classList.add("fade-out");

    setTimeout(() => {
        // Pindahkan elemen depan ke paling belakang array (Looping: 1 -> 2 -> 3 -> 4 -> 5 -> 1)
        const movedItem = photoOrder.shift();
        photoOrder.push(movedItem);

        // Render ulang susunan tumpukan
        renderStack();

        // Fade in caption baru
        captionEl.classList.remove("fade-out");
        isAnimatingStack = false;
    }, 500);
}

function updateCaptionAndIndicators() {
    const activePhotoIndex = photoOrder[0];
    const captionEl = document.getElementById("stackCaption");
    captionEl.innerText = `"${photoData[activePhotoIndex].caption}"`;

    const dots = document.querySelectorAll("#stackIndicator .dot");
    dots.forEach((dot, idx) => {
        if (idx === activePhotoIndex) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}
