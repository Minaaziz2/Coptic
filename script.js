// Background music control
let backgroundMusic;
let isMusicPlaying = true;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeMusic();
    createMusicControl();
    addCardAnimations();
});

// Initialize background music
function initializeMusic() {
    backgroundMusic = document.getElementById('backgroundMusic');
    
    if (backgroundMusic) {
        backgroundMusic.volume = 0.3; // Set volume to 30%
        
        // Handle autoplay restrictions
        backgroundMusic.play().catch(function(error) {
            console.log('Autoplay prevented:', error);
            showAudioPrompt();
        });
        
        backgroundMusic.addEventListener('canplaythrough', function() {
            hideAudioLoading();
        });
        
        backgroundMusic.addEventListener('error', function() {
            console.log('Error loading background music');
            hideAudioLoading();
        });
    }
}

// Create music control button
function createMusicControl() {
    const musicButton = document.createElement('button');
    musicButton.className = 'music-control';
    musicButton.innerHTML = '🎵';
    musicButton.title = 'Toggle Music';
    musicButton.onclick = toggleMusic;
    document.body.appendChild(musicButton);
}

// Toggle background music
function toggleMusic() {
    if (backgroundMusic) {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            document.querySelector('.music-control').innerHTML = '🔇';
            isMusicPlaying = false;
        } else {
            backgroundMusic.play().catch(function(error) {
                console.log('Error playing music:', error);
            });
            document.querySelector('.music-control').innerHTML = '🎵';
            isMusicPlaying = true;
        }
    }
}

// Show audio prompt for autoplay restrictions
function showAudioPrompt() {
    const prompt = document.createElement('div');
    prompt.className = 'audio-loading';
    prompt.innerHTML = '🎵 Click anywhere to enable music!';
    prompt.style.cursor = 'pointer';
    document.body.appendChild(prompt);
    
    // Remove prompt and start music on first user interaction
    document.addEventListener('click', function enableMusic() {
        if (backgroundMusic) {
            backgroundMusic.play();
        }
        prompt.remove();
        document.removeEventListener('click', enableMusic);
    }, { once: true });
}

// Hide audio loading indicator
function hideAudioLoading() {
    const loading = document.querySelector('.audio-loading');
    if (loading) {
        loading.remove();
    }
}

// Add hover animations to cards
function addCardAnimations() {
    const cards = document.querySelectorAll('.letter-card');
    
    cards.forEach((card, index) => {
        // Add staggered animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', function() {
            // You can add hover sound effects here if needed
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Open letter detail page
function openLetter(letterName) {
    // Add click animation
    event.target.closest('.letter-card').style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        // Navigate to letter detail page
        window.location.href = `letter-${letterName}.html`;
    }, 150);
}

// Letter data for generating pages
const letterData = {
    alpha: {
        letter: 'Ⲁ ⲁ',
        name: 'Alpha',
        pronunciation: {
            english: 'ah (as in father)',
            arabic: 'أ (alif)'
        },
        phonetic: '[a]',
        example: {
            word: 'ⲁⲅⲁⲡⲏ (agape)',
            meaning: 'love',
            arabic: 'محبة (mahaba)'
        },
        origin: 'Greek'
    },
    beta: {
        letter: 'Ⲃ ⲃ',
        name: 'Beta',
        pronunciation: {
            english: 'b (as in boy) or v (as in very)',
            arabic: 'ب (ba) أو ف (fa)'
        },
        phonetic: '[β] or [v]',
        example: {
            word: 'ⲃⲓⲃⲗⲟⲥ (biblos)',
            meaning: 'book',
            arabic: 'كتاب (kitab)'
        },
        origin: 'Greek'
    },
    gamma: {
        letter: 'Ⲅ ⲅ',
        name: 'Gamma',
        pronunciation: {
            english: 'g (as in go)',
            arabic: 'ج (jim)'
        },
        phonetic: '[g]',
        example: {
            word: 'ⲅⲁⲣ (gar)',
            meaning: 'for, because',
            arabic: 'لأن (li-anna)'
        },
        origin: 'Greek'
    },
    delta: {
        letter: 'Ⲇ ⲇ',
        name: 'Delta',
        pronunciation: {
            english: 'd (as in dog)',
            arabic: 'د (dal)'
        },
        phonetic: '[d]',
        example: {
            word: 'ⲇⲓⲕⲁⲓⲟⲥ (dikaios)',
            meaning: 'righteous',
            arabic: 'بار (bar)'
        },
        origin: 'Greek'
    },
    epsilon: {
        letter: 'Ⲉ ⲉ',
        name: 'Epsilon',
        pronunciation: {
            english: 'e (as in bet)',
            arabic: 'إ (e)'
        },
        phonetic: '[e]',
        example: {
            word: 'ⲉⲓⲣⲏⲛⲏ (eirene)',
            meaning: 'peace',
            arabic: 'سلام (salam)'
        },
        origin: 'Greek'
    },
    zeta: {
        letter: 'Ⲍ ⲍ',
        name: 'Zeta',
        pronunciation: {
            english: 'z (as in zoo)',
            arabic: 'ز (zay)'
        },
        phonetic: '[z]',
        example: {
            word: 'ⲍⲱⲏ (zoe)',
            meaning: 'life',
            arabic: 'حياة (hayah)'
        },
        origin: 'Greek'
    }
    // Add more letters as needed
};

// Generate letter detail pages (this would be called to create individual pages)
function generateLetterPage(letterName) {
    const data = letterData[letterName];
    if (!data) return;
    
    const pageContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Learn ${data.name} - Coptic Alphabet</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="letter-page.css">
</head>
<body>
    <div class="container">
        <header>
            <button class="back-button" onclick="goBack()">← Back to Alphabet</button>
            <h1 class="letter-title">${data.letter}</h1>
            <h2 class="letter-name">${data.name}</h2>
        </header>
        
        <main class="letter-content">
            <div class="letter-display-large">
                <div class="letter-shapes">
                    <div class="shape-container">
                        <h3>Capital Letter</h3>
                        <div class="letter-big">${data.letter.split(' ')[0]}</div>
                    </div>
                    <div class="shape-container">
                        <h3>Small Letter</h3>
                        <div class="letter-big">${data.letter.split(' ')[1]}</div>
                    </div>
                </div>
            </div>
            
            <div class="pronunciation-section">
                <h3>🗣️ Pronunciation</h3>
                <div class="pronunciation-grid">
                    <div class="pronunciation-item">
                        <h4>English</h4>
                        <p>${data.pronunciation.english}</p>
                        <button class="play-sound" onclick="playPronunciation('${letterName}', 'en')">🔊 Play</button>
                    </div>
                    <div class="pronunciation-item">
                        <h4>Arabic</h4>
                        <p>${data.pronunciation.arabic}</p>
                        <button class="play-sound" onclick="playPronunciation('${letterName}', 'ar')">🔊 Play</button>
                    </div>
                </div>
                <div class="phonetic">
                    <h4>Phonetic</h4>
                    <p>${data.phonetic}</p>
                </div>
            </div>
            
            <div class="example-section">
                <h3>📖 Example Word</h3>
                <div class="example-word">
                    <div class="word-coptic">${data.example.word}</div>
                    <div class="word-meaning">
                        <span class="meaning-en">${data.example.meaning}</span>
                        <span class="meaning-ar">${data.example.arabic}</span>
                    </div>
                    <button class="play-sound" onclick="playWord('${letterName}')">🔊 Play Word</button>
                </div>
            </div>
            
            <div class="origin-section">
                <h3>📜 Origin</h3>
                <p>This letter comes from the <strong>${data.origin}</strong> alphabet.</p>
            </div>
        </main>
    </div>
    
    <audio id="backgroundMusic" loop autoplay>
        <source src="background song.mp3" type="audio/mpeg">
    </audio>
    
    <script src="script.js"></script>
    <script src="letter-page.js"></script>
</body>
</html>
    `;
    
    return pageContent;
}

// Navigation function
function goBack() {
    window.location.href = 'index.html';
}

// Audio playback functions (placeholders for actual audio files)
function playPronunciation(letter, language) {
    // This would play actual audio files
    console.log(`Playing pronunciation for ${letter} in ${language}`);
    // Example: new Audio(`sounds/${letter}-${language}.mp3`).play();
}

function playWord(letter) {
    // This would play the example word audio
    console.log(`Playing example word for ${letter}`);
    // Example: new Audio(`sounds/${letter}-word.mp3`).play();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { letterData, generateLetterPage };
}