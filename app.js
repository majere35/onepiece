const TOTAL_EPISODES = 1156;
const episodeList = document.getElementById('episode-list');
const watchedCountEl = document.getElementById('watched-count');
const progressPercentEl = document.getElementById('progress-percent');
const progressBar = document.getElementById('progress-bar');
const searchInput = document.getElementById('episode-search');
const jumpBtn = document.getElementById('jump-btn');
const scrollToCurrentBtn = document.getElementById('scroll-to-current');

// State: Store the highest watched episode number
let lastWatchedEpisode = parseInt(localStorage.getItem('lastWatchedEpisode')) || 0;

// Initialize app
function init() {
    renderEpisodes();
    updateProgress();
    setupEventListeners();
}

// Render 1156 Episodes
function renderEpisodes() {
    const fragment = document.createDocumentFragment();
    
    for (let i = 1; i <= TOTAL_EPISODES; i++) {
        const card = document.createElement('div');
        card.className = `episode-card ${i <= lastWatchedEpisode ? 'watched' : ''}`;
        card.id = `episode-${i}`;
        card.dataset.num = i;
        
        card.innerHTML = `
            <img src="straw-hat-pirates-logo-one-piece-free-vector.jpg" class="skull-icon" alt="Skull icon">
            <div class="episode-info">
                <span class="episode-number">${i}. Bölüm</span>
                <span class="episode-status">${i <= lastWatchedEpisode ? 'İzlendi' : 'İzlenmedi'}</span>
            </div>
            <div class="checkbox-custom"></div>
        `;
        
        card.addEventListener('click', () => toggleWatched(i));
        fragment.appendChild(card);
    }
    
    episodeList.appendChild(fragment);
    
    // Initial scroll to last watched if exists
    if (lastWatchedEpisode > 0) {
        setTimeout(() => {
            scrollToEpisode(lastWatchedEpisode, 'auto');
        }, 300);
    }
}

// Toggle logic (auto-marks previous)
function toggleWatched(num) {
    // If clicked an already watched episode, we treat it as setting the "last watched" to that point
    // but the user usually wants to mark new progress.
    // If we click a later episode, mark all up to it.
    // If we click an earlier one, we ask? No, let's keep it simple: 
    // Set last watched to this number.
    
    const newLastWatched = num === lastWatchedEpisode ? num - 1 : num;
    lastWatchedEpisode = newLastWatched;
    localStorage.setItem('lastWatchedEpisode', lastWatchedEpisode);
    
    updateUI();
}

// Update UI state for all cards
function updateUI() {
    const cards = document.querySelectorAll('.episode-card');
    cards.forEach(card => {
        const num = parseInt(card.dataset.num);
        if (num <= lastWatchedEpisode) {
            card.classList.add('watched');
            card.querySelector('.episode-status').textContent = 'İzlendi';
        } else {
            card.classList.remove('watched');
            card.querySelector('.episode-status').textContent = 'İzlenmedi';
        }
    });
    
    updateProgress();
}

// Update Progress bar and text
function updateProgress() {
    watchedCountEl.textContent = lastWatchedEpisode;
    const percent = ((lastWatchedEpisode / TOTAL_EPISODES) * 100).toFixed(1);
    progressPercentEl.textContent = `%${percent}`;
    progressBar.style.width = `${percent}%`;
    
    // Show/Hide FAB
    if (lastWatchedEpisode > 0) {
        scrollToCurrentBtn.classList.remove('oculto');
    } else {
        scrollToCurrentBtn.classList.add('oculto');
    }
}

// Jump/Search logic
function scrollToEpisode(num, behavior = 'smooth') {
    const target = document.getElementById(`episode-${num}`);
    if (target) {
        const offset = 220; // Header height approximate
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: behavior
        });
        
        // Brief highlight effect
        target.style.borderColor = 'var(--accent-yellow)';
        setTimeout(() => target.style.borderColor = '', 2000);
    }
}

function setupEventListeners() {
    jumpBtn.addEventListener('click', () => {
        const val = parseInt(searchInput.value);
        if (val >= 1 && val <= TOTAL_EPISODES) {
            scrollToEpisode(val);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            jumpBtn.click();
        }
    });

    scrollToCurrentBtn.addEventListener('click', () => {
        if (lastWatchedEpisode > 0) {
            scrollToEpisode(lastWatchedEpisode);
        }
    });
}

init();
