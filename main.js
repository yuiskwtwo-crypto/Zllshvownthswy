// NAMA RAHASIA UNTUK MASUK (Case-insensitive)
const namaBenar = "zilless";

function cekNama() {
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

    const flame = document.getElementById("flame");
    const smoke = document.getElementById("smoke");
    const blowHint = document.getElementById("blowHint");
    const nextBtn = document.getElementById("nextToVendingBtn");

    flame.style.opacity = "0";
    flame.style.transform = "translateX(-50%) scale(0)";
    smoke.classList.add("active");
    
    candleBlown = true;
    blowHint.innerText = "✨ Widiihh happy birthday ✨";
    
    confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
    });

    setTimeout(() => {
        nextBtn.classList.remove("hidden");
    }, 1000);
}

function goToVending() {
    document.getElementById("candleStep").classList.add("hidden");
    document.getElementById("vendingStep").classList.remove("hidden");
}

// DATABASE ISI KONTEN ITEM VENDING MACHINE
const itemData = {
    "🎁 Special Memory": {
        title: "🎁 Special Memory",
        content: "<p>Ingat gak waktu momen seru bareng? Banyak kenangan kocak yang bikin ngakak kalau diling-eling lagi! 😆</p>"
    },
    "🎵 Favorite Song": {
        title: "🎵 Favorite Song",
        content: "<p>Lagu spesial buat kamu hari ini:</p><strong>Happy Birthday - Stevie Wonder 🎶</strong><br><p style='margin-top:8px; font-size:0.85rem; color:#666;'>Dengerin biar harimu tambah ceria!</p>"
    },
    "💌 Secret Message": {
        title: "💌 Secret Message",
        content: "<p>'Semoga di usiamu yang baru ini makin sukses, sehat selalu, dan dikelilingi hal-hal baik!' ✨</p>"
    },
    "📸 Cute Photo": {
        title: "📸 Surprise Snapshot",
        content: "<div style='font-size:3rem; margin:10px 0;'>🎂🥳🎉</div><p>Ini kue virtual terbesar khusus dibuat buat kamu!</p>"
    },
    "🌟 SPECIAL ITEM UNLOCKED 🌟": {
        title: "🌟 SPECIAL PRIZE!",
        content: "<p style='color:#e67e22; font-weight:bold;'>SELAMAT! Kamu dapet voucher treat khusus! (Tinggal tagih aja ke pembuat web ini!) 😜🔥</p>"
    }
};

// LOGIK VENDING MACHINE
function dispenseItems() {
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
        "🎁 Special Memory",
        "🎵 Favorite Song",
        "💌 Secret Message",
        "📸 Cute Photo"
    ];

    let delay = 0;

    items.forEach((itemText) => {
        delay += 800;
        setTimeout(() => {
            createDispenserItem(itemText, false);
        }, delay);
    });

    delay += 1000;
    setTimeout(() => {
        screen.innerHTML = "<div>🌟 SPECIAL UNLOCKED! 🌟</div>";
        createDispenserItem("🌟 SPECIAL ITEM UNLOCKED 🌟", true);

        document.getElementById("pesanRahasia").style.display = "block";
        
        var duration = 3 * 1000;
        var end = Date.now() + duration;

        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        btn.innerText = "VENDING COMPLETE!";
    }, delay);
}

function createDispenserItem(text, isSpecial) {
    const dispenser = document.getElementById("dispenser");
    const itemDiv = document.createElement("div");
    
    itemDiv.className = isSpecial ? "vending-item special-item" : "vending-item";
    itemDiv.innerHTML = `${text} <span style='font-size:0.75rem; float:right; color:#888;'>(Klik Buka 🔓)</span>`;
    
    itemDiv.addEventListener("click", () => {
        openModal(text);
    });

    dispenser.appendChild(itemDiv);
    dispenser.scrollTop = dispenser.scrollHeight;
}

// LOGIK POP-UP MODAL
const modal = document.getElementById("itemModal");
const closeModal = document.getElementById("closeModal");

if (closeModal) {
    closeModal.onclick = () => { modal.style.display = "none"; };
}
window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
};

function openModal(itemKey) {
    const data = itemData[itemKey] || { title: "Item Info", content: "Tidak ada detail item." };
    document.getElementById("modalTitle").innerText = data.title;
    document.getElementById("modalBody").innerHTML = data.content;
    modal.style.display = "flex";
}
