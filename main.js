// NAMA RAHASIA UNTUK MASUK (Case-insensitive)
const namaBenar = "zilless";

function cekNama() {
    const input = document.getElementById("inputNama").value.trim().toLowerCase();
    const error = document.getElementById("errorMsg");

    if (input === namaBenar) {
        // Pindah dari Step 1 (Login) ke Step 2 (Tiup Lilin)
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

    // Matikan Api & Munculkan Asap
    flame.style.opacity = "0";
    flame.style.transform = "translateX(-50%) scale(0)";
    smoke.classList.add("active");
    
    candleBlown = true;
    blowHint.innerText = "✨ Wahh Selamat Ulang Tahun! ✨";
    
    // Konfeti ringan saat lilin ditiup
    confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Tampilkan tombol lanjut ke Vending Machine
    setTimeout(() => {
        nextBtn.classList.remove("hidden");
    }, 1000);
}

function goToVending() {
    // Pindah dari Step 2 (Tiup Lilin) ke Step 3 (Vending Machine)
    document.getElementById("candleStep").classList.add("hidden");
    document.getElementById("vendingStep").classList.remove("hidden");
}

// LOGIK VENDING MACHINE
function dispenseItems() {
    const btn = document.getElementById("coinBtn");
    const screen = document.getElementById("machineScreen");
    const dispenser = document.getElementById("dispenser");
    
    // Disable tombol saat animasi berjalan
    btn.disabled = true;
    btn.style.opacity = "0.6";
    btn.innerText = "PROCESSING...";
    dispenser.innerHTML = "";
    screen.innerText = "DISPENSING...";

    const items = [
        "🎁 Special Memory",
        "🎵 Favorite Song",
        "💌 Secret Message",
        "📸 Cute Photo"
    ];

    let delay = 0;

    // Item jatuh satu per satu
    items.forEach((itemText) => {
        delay += 800;
        setTimeout(() => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "vending-item";
            itemDiv.innerText = itemText;
            dispenser.appendChild(itemDiv);
            dispenser.scrollTop = dispenser.scrollHeight;
        }, delay);
    });

    // Unlock Item Spesial & Hadiah Utama
    delay += 1000;
    setTimeout(() => {
        screen.innerText = "SPECIAL UNLOCKED!";
        
        const specialDiv = document.createElement("div");
        specialDiv.className = "vending-item special-item";
        specialDiv.innerText = "🌟 SPECIAL ITEM UNLOCKED 🌟";
        dispenser.appendChild(specialDiv);
        dispenser.scrollTop = dispenser.scrollHeight;

        // Tampilkan Hadiah Utama & Pesta Konfeti Meriah
        document.getElementById("pesanRahasia").style.display = "block";
        
        // Fireworks Effect Confetti
        var duration = 3 * 1000;
        var end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        btn.innerText = "VENDING COMPLETE!";
    }, delay);
}
