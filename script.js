// 🔴 Aapka Google Apps Script Web App URL
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbzeFK3EUvTPiSJZhZAEi-KBKEW70169I_11GuV7XuIgqiRml01_u6Dapquh7Wabyo7M/exec";

// Bulletproof Tracking Function (URL Parameters / GET Mode)
function sendDataToSheet(payload) {
    if (!BACKEND_URL || BACKEND_URL.includes("PASTE_YOUR")) return;
    
    const params = new URLSearchParams(payload).toString();
    fetch(`${BACKEND_URL}?${params}`, {
        method: "GET",
        mode: "no-cors"
    }).catch(err => console.log("Backend sync error:", err));
}

let totalBalloons = 6;
let poppedCount = 0;
let selectedGiftName = "";

// Gift Data mapping
const giftsData = {
    1: { icon: "🥂", title: "A Date", desc: "Sponsored by YOU 😜" },
    2: { icon: "✨", title: "Dream Date", desc: "Sponsored by ME ❤️" },
    3: { icon: "🛍️", title: "Shopping Spree", desc: "Sponsored by ME 🛍️" }
};

// Page Router Engine
function goToPage(pageNumber) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });

    const targetPage = document.getElementById(`page-${pageNumber}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        setTimeout(() => targetPage.classList.add('active'), 50);
    }

    if (pageNumber === 3) initPage3();
    if (pageNumber === 4) initPage4();
}

function startJourney() {
    goToPage(1);
    generateBalloons();
    // Track Page Visit in Google Sheets
    sendDataToSheet({ eventType: "Website Visit" });
}

// Web Audio Pop Synthesizer
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playPopSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
}

function triggerVibration() {
    if ("vibrate" in navigator) navigator.vibrate(60);
}

// Balloon Spawner
function generateBalloons() {
    const container = document.getElementById('balloon-container');
    container.innerHTML = '';
    poppedCount = 0;
    const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#c77dff', '#e0aaff', '#ff0054'];

    for (let i = 0; i < totalBalloons; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = `${10 + (i * 15)}%`;
        balloon.style.animationDuration = `${4 + Math.random() * 2.5}s`;
        balloon.style.animationDelay = `${Math.random() * 1.5}s`;
        balloon.style.background = `radial-gradient(circle at 30% 30%, ${colors[i % colors.length]}, #800f2f)`;

        balloon.onclick = function() {
            if (!balloon.classList.contains('popped')) {
                balloon.classList.add('popped');
                playPopSound();
                triggerVibration();
                poppedCount++;
                setTimeout(() => balloon.remove(), 150);
                if (poppedCount === totalBalloons) {
                    setTimeout(showSurpriseModal, 300);
                }
            }
        };
        container.appendChild(balloon);
    }
}

function showSurpriseModal() {
    const modal = document.getElementById('reveal-modal');
    modal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
    modal.classList.add('flex', 'opacity-100', 'pointer-events-auto');
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
}

// Page 2: Secret Gift Reveal & Locking Engine
function selectGift(giftNumber, giftTitle) {
    if (selectedGiftName !== "") return;
    selectedGiftName = giftTitle;
    triggerVibration();

    for (let i = 1; i <= 3; i++) {
        const giftElement = document.getElementById(`gift-${i}`);
        const lockIcon = giftElement.querySelector('.lock-icon');
        const iconElem = giftElement.querySelector('.gift-icon');
        const titleElem = giftElement.querySelector('.gift-title');
        const descElem = giftElement.querySelector('.gift-desc');

        if (i === giftNumber) {
            giftElement.classList.add('selected-gift');
            iconElem.innerText = giftsData[i].icon;
            titleElem.innerText = giftsData[i].title;
            descElem.innerText = giftsData[i].desc;
            descElem.classList.remove('italic', 'text-pink-400/70');
            descElem.classList.add('text-gray-300');
        } else {
            giftElement.classList.add('locked');
            if (lockIcon) lockIcon.classList.remove('hidden');
        }
    }

    const statusDiv = document.getElementById('gift-status');
    statusDiv.classList.remove('opacity-0');
    statusDiv.classList.add('opacity-100');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });

    // Track Selected Gift in Google Sheets
    sendDataToSheet({ eventType: "Gift Selection", selectedGift: giftTitle });
}

// Bulletproof HTML-safe Typewriter Engine
function typeWriterEngineHTML(elementId, textString, buttonId, speed = 25) {
    const elem = document.getElementById(elementId);
    elem.innerHTML = "";
    let i = 0;
    const charArray = Array.from(textString);

    const timer = setInterval(() => {
        if (i < charArray.length) {
            let char = charArray[i];
            if (char === '\n') {
                elem.innerHTML += '<br>';
            } else if (char === ' ') {
                elem.innerHTML += '&nbsp;';
            } else {
                elem.innerHTML += char;
            }
            i++;
        } else {
            clearInterval(timer);
            if (buttonId) {
                const nextBtn = document.getElementById(buttonId);
                if (nextBtn) {
                    nextBtn.classList.remove('opacity-0', 'pointer-events-none');
                    nextBtn.classList.add('opacity-100', 'pointer-events-auto');
                }
            }
        }
    }, speed);
}

// Page 3 Initializer (Sunset Walk)
function initPage3() {
    document.getElementById('you-avatar').classList.add('start-walk-left');
    document.getElementById('bauni-avatar').classList.add('start-walk-right');

    setTimeout(() => {
        document.getElementById('center-heart').classList.remove('opacity-0');
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 } });
    }, 3500);

    const fullText = 'Every beautiful story begins with a simple "Hello"...\n\nOurs became one I\'ll never forget. ❤️';
    typeWriterEngineHTML('typewriter-text', fullText, 'page3-next-btn', 35);

    generateLeaves();
}

function generateLeaves() {
    const container = document.getElementById('leaves-container');
    container.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.style.width = `${8 + Math.random() * 8}px`;
        leaf.style.height = `${8 + Math.random() * 8}px`;
        leaf.style.left = `${Math.random() * 100}%`;
        leaf.style.animationDuration = `${4 + Math.random() * 4}s`;
        container.appendChild(leaf);
    }
}

// Page 4 Initializer
function initPage4() {
    const shayariText = `Bauni, tu bahut khaas hai...
Mere dil ke bahut paas hai...

Haan, tera mazaak udaata hoon,
Kyunki tu meri khusi ka ehsaas he...
Aur sun...

Teri ek muskaan meri har dua ka jawaab hai,
Tera saath hi meri zindagi ki kitaab hai.

Teri baaton mein jo nasha hai, wo sharaab mein kahaan,
Tera zikr hi meri har ghazal ka intekhaab hai.

Tu hansi to mausam bhi mehka-mehka sa lage,
Tu udaas ho to har lamha be-hisaab hai.

Tu saamne ho to alfaaz khud sher ban jaate hain,
Tu door ho to dil bhi adhoora sa khwaab hai.

Bas itna samajh le...
Tu meri pasand nahi, meri pehchaan hai...
Aur is shayar ki har nazm ka sabse haseen unwaan hai.`;

    typeWriterEngineHTML('shayari-text', shayariText, 'page4-next-btn', 20);

    generatePetals();
}

function generatePetals() {
    const container = document.getElementById('petals-container');
    container.innerHTML = '';
    for (let i = 0; i < 15; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.width = `${10 + Math.random() * 6}px`;
        petal.style.height = `${10 + Math.random() * 6}px`;
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.animationDuration = `${3.5 + Math.random() * 3.5}s`;
        container.appendChild(petal);
    }
}

// Proposal Logic & Outcome Render
function confirmNo() {
    if (confirm("Are you sure? 🥺")) {
        handleProposalAnswer('NO');
    }
}

function handleProposalAnswer(answer) {
    goToPage(6);
    const container = document.getElementById('outcome-container');

    // Track Proposal Answer in Google Sheets
    sendDataToSheet({ eventType: "Proposal Answer", proposalAnswer: answer, selectedGift: selectedGiftName });

    if (answer === 'YES') {
        container.innerHTML = `
            <div class="glass-card p-8 rounded-3xl border border-pink-500/30 text-center">
                <h2 class="font-['Dancing_Script'] text-3xl text-pink-400 mb-3">You just made me the happiest person alive! ❤️</h2>
                <p class="text-xs text-gray-300 font-light mb-6">Here are my 3 promises to you:</p>
                <div class="space-y-3 text-xs text-pink-200">
                    <p class="p-2.5 bg-pink-950/40 rounded-xl border border-pink-500/20">✨ 1. I will always respect you.</p>
                    <p class="p-2.5 bg-pink-950/40 rounded-xl border border-pink-500/20">✨ 2. I will always support you.</p>
                    <p class="p-2.5 bg-pink-950/40 rounded-xl border border-pink-500/20">✨ 3. I will always choose you.</p>
                </div>
            </div>
        `;
        let duration = 3 * 1000;
        let end = Date.now() + duration;
        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    } else {
        container.innerHTML = `
            <div class="glass-card p-8 rounded-3xl border border-gray-700 text-center">
                <h2 class="font-['Dancing_Script'] text-3xl text-gray-300 mb-4">Thank you for reading everything. ❤️</h2>
                <p class="text-xs text-gray-400 font-light leading-relaxed">
                    No matter what your answer is, you will always have my respect and a very special place in my heart.
                </p>
            </div>
        `;
    }
}
