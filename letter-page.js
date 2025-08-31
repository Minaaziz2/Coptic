// Letter page specific JavaScript functionality

// Letter navigation order
const letterOrder = [
    'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta',
    'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi',
    'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega',
    'shai', 'fai', 'khei', 'hori', 'gangia', 'shima', 'ti'
];

// Get current letter from URL
function getCurrentLetter() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    return filename.replace('letter-', '').replace('.html', '');
}

// Navigation functions
function goBack() {
    window.location.href = 'index.html';
}

function goToPrevLetter() {
    const currentLetter = getCurrentLetter();
    const currentIndex = letterOrder.indexOf(currentLetter);
    
    if (currentIndex > 0) {
        const prevLetter = letterOrder[currentIndex - 1];
        window.location.href = `letter-${prevLetter}.html`;
    } else {
        // If at first letter, go to last letter (wrap around)
        const lastLetter = letterOrder[letterOrder.length - 1];
        window.location.href = `letter-${lastLetter}.html`;
    }
}

function goToNextLetter() {
    const currentLetter = getCurrentLetter();
    const currentIndex = letterOrder.indexOf(currentLetter);
    
    if (currentIndex < letterOrder.length - 1) {
        const nextLetter = letterOrder[currentIndex + 1];
        window.location.href = `letter-${nextLetter}.html`;
    } else {
        // If at last letter, go to first letter (wrap around)
        const firstLetter = letterOrder[0];
        window.location.href = `letter-${firstLetter}.html`;
    }
}

// Audio playback functions
function playPronunciation(letter, language) {
    // Pause background music if playing
    const backgroundMusic = document.getElementById('backgroundMusic');
    let wasMusicPlaying = false;
    
    if (backgroundMusic && !backgroundMusic.paused) {
        backgroundMusic.pause();
        wasMusicPlaying = true;
    }
    
    // Get the button that was clicked
    const button = event.target;
    const originalText = button.innerHTML;
    
    // Visual feedback
    button.innerHTML = '🔊 Playing...';
    button.disabled = true;
    
    // Use Web Speech API directly for pronunciation
    const pronunciationText = getPronunciationText(letter, language);
    
    if ('speechSynthesis' in window) {
        // Stop any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(pronunciationText);
        utterance.lang = language === 'en' ? 'en-US' : 'ar-SA';
        utterance.rate = 0.6;
        utterance.volume = 0.9;
        utterance.pitch = 1.0;
        
        utterance.onstart = function() {
            console.log('Playing pronunciation:', pronunciationText);
        };
        
        utterance.onend = function() {
            // Resume background music if it was playing
            if (wasMusicPlaying && backgroundMusic) {
                backgroundMusic.play();
            }
            button.innerHTML = originalText;
            button.disabled = false;
        };
        
        utterance.onerror = function(event) {
            console.log('Speech synthesis error:', event.error);
            if (wasMusicPlaying && backgroundMusic) {
                backgroundMusic.play();
            }
            button.innerHTML = originalText;
            button.disabled = false;
            showNotification('Audio playback failed. Please try again.');
        };
        
        speechSynthesis.speak(utterance);
    } else {
        // Browser doesn't support speech synthesis
        if (wasMusicPlaying && backgroundMusic) {
            backgroundMusic.play();
        }
        button.innerHTML = originalText;
        button.disabled = false;
        showNotification('Speech synthesis not supported in this browser.');
    }
}

function playWord(letter) {
    // Pause background music if playing
    const backgroundMusic = document.getElementById('backgroundMusic');
    let wasMusicPlaying = false;
    
    if (backgroundMusic && !backgroundMusic.paused) {
        backgroundMusic.pause();
        wasMusicPlaying = true;
    }
    
    // Get the button that was clicked
    const button = event.target;
    const originalText = button.innerHTML;
    
    // Visual feedback
    button.innerHTML = '🔊 Playing...';
    button.disabled = true;
    
    // Get example word for the letter
    const wordText = getExampleWord(letter);
    
    if ('speechSynthesis' in window && wordText) {
        // Stop any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(wordText);
        utterance.lang = 'en-US'; // Use English for Coptic words
        utterance.rate = 0.5; // Slower for better pronunciation
        utterance.volume = 0.9;
        utterance.pitch = 1.0;
        
        utterance.onstart = function() {
            console.log('Playing word:', wordText);
        };
        
        utterance.onend = function() {
            // Resume background music if it was playing
            if (wasMusicPlaying && backgroundMusic) {
                backgroundMusic.play();
            }
            button.innerHTML = originalText;
            button.disabled = false;
        };
        
        utterance.onerror = function(event) {
            console.log('Word speech synthesis error:', event.error);
            if (wasMusicPlaying && backgroundMusic) {
                backgroundMusic.play();
            }
            button.innerHTML = originalText;
            button.disabled = false;
            showNotification('Word audio playback failed. Please try again.');
        };
        
        speechSynthesis.speak(utterance);
    } else {
        // Browser doesn't support speech synthesis or no word found
        if (wasMusicPlaying && backgroundMusic) {
            backgroundMusic.play();
        }
        button.innerHTML = originalText;
        button.disabled = false;
        showNotification(wordText ? 'Speech synthesis not supported.' : 'No example word available.');
    }
}

// Fallback functions for when audio files are not available
function showAudioFallback(letter, language) {
    const languageName = language === 'en' ? 'English' : 'Arabic';
    const pronunciationText = getPronunciationText(letter, language);
    const message = `🔊 Audio not available for ${letter} in ${languageName}.\n\nPronunciation: ${pronunciationText}`;
    
    showNotification(message);
    
    // Use Web Speech API for text-to-speech as fallback
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(pronunciationText);
        utterance.lang = language === 'en' ? 'en-US' : 'ar-SA';
        utterance.rate = 0.7;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
    }
}

function getPronunciationText(letter, language) {
    // Get actual Coptic phonetic sounds for text-to-speech
    const pronunciations = {
        'alpha': {
            'en': 'ah',
            'ar': 'alif'
        },
        'beta': {
            'en': 'vee',
            'ar': 'vee ta'
        },
        'gamma': {
            'en': 'gah',
            'ar': 'ghain'
        },
        'delta': {
            'en': 'thah',
            'ar': 'thal'
        },
        'epsilon': {
            'en': 'eh',
            'ar': 'alif'
        },
        'zeta': {
            'en': 'zee',
            'ar': 'zay'
        },
        'eta': {
            'en': 'ay',
            'ar': 'yaa'
        },
        'theta': {
            'en': 'th',
            'ar': 'thaa'
        },
        'iota': {
            'en': 'ee',
            'ar': 'yaa'
        },
        'kappa': {
            'en': 'kah',
            'ar': 'kaaf'
        },
        'lambda': {
            'en': 'lah',
            'ar': 'laam'
        },
        'mu': {
            'en': 'mah',
            'ar': 'meem'
        },
        'nu': {
            'en': 'nah',
            'ar': 'noon'
        },
        'xi': {
            'en': 'ks',
            'ar': 'kaaf seen'
        },
        'omicron': {
            'en': 'oh',
            'ar': 'waaw'
        },
        'pi': {
            'en': 'pah',
            'ar': 'baa'
        },
        'rho': {
            'en': 'rah',
            'ar': 'raa'
        },
        'sigma': {
            'en': 'sah',
            'ar': 'seen'
        },
        'tau': {
            'en': 'tah',
            'ar': 'taa'
        },
        'upsilon': {
            'en': 'oo',
            'ar': 'waaw'
        },
        'phi': {
            'en': 'fah',
            'ar': 'faa'
        },
        'chi': {
            'en': 'khah',
            'ar': 'khaa'
        },
        'psi': {
            'en': 'ps',
            'ar': 'baa seen'
        },
        'omega': {
            'en': 'oh',
            'ar': 'waaw'
        },
        'shai': {
            'en': 'shah',
            'ar': 'sheen'
        },
        'fai': {
            'en': 'fah',
            'ar': 'faa'
        },
        'khei': {
            'en': 'khah',
            'ar': 'khaa'
        },
        'hori': {
            'en': 'hah',
            'ar': 'haa'
        },
        'gangia': {
            'en': 'jah',
            'ar': 'jeem'
        },
        'shima': {
            'en': 'chah',
            'ar': 'taa sheen'
        },
        'ti': {
            'en': 'tee',
            'ar': 'taa yaa'
        }
    };
    
    return pronunciations[letter] && pronunciations[letter][language] 
        ? pronunciations[letter][language] 
        : letter;
}

function getExampleWord(letter) {
    const exampleWords = {
        'alpha': 'agapy',
        'beta': 'bwk', 
        'gamma': 'gar',
        'delta': 'doxa',
        'epsilon': 'eneh',
        'zeta': 'zoe',
        'eta': 'ehoou',
        'theta': 'theos',
        'iota': 'iwt',
        'kappa': 'kahi',
        'lambda': 'logoc',
        'mu': 'mau',
        'nu': 'noute',
        'xi': 'xenos',
        'omicron': 'ouwini',
        'pi': 'pneuma',
        'rho': 'romi',
        'sigma': 'salam',
        'tau': 'tapro',
        'upsilon': 'uios',
        'phi': 'phos',
        'chi': 'pikhristos',
        'psi': 'psalmos',
        'omega': 'ouwrp',
        'shai': 'shai',
        'fai': 'fi',
        'khei': 'khen',
        'hori': 'het',
        'gangia': 'ji',
        'shima': 'jini',
        'ti': 'timai'
    };
    
    return exampleWords[letter] || letter;
}

function showWordFallback(letter) {
    const wordMessages = {
        'alpha': 'Example word: "agape" (love)',
        'beta': 'Example word: "biblos" (book)',
        'gamma': 'Example word: "gar" (for, because)'
        // Add more letters as needed
    };
    
    const message = wordMessages[letter] || `Example word for ${letter}`;
    showNotification(message);
}

// Notification system
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(145deg, #00b894, #00a085);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-size: 1rem;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(style);
}

// Interactive tracing functionality
function initializeTracing() {
    const traceLetters = document.querySelectorAll('.trace-letter');
    
    traceLetters.forEach(letter => {
        letter.addEventListener('click', function() {
            // Add tracing animation
            this.style.animation = 'traceAnimation 1s ease-in-out';
            
            // Reset animation after completion
            setTimeout(() => {
                this.style.animation = '';
            }, 1000);
            
            // Show encouragement message
            showNotification('Great job tracing! 🌟');
        });
    });
}

// Add tracing animation styles
function addTracingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes traceAnimation {
            0% { 
                background: rgba(255, 183, 77, 0.3);
                transform: scale(1);
            }
            25% { 
                background: rgba(76, 175, 80, 0.3);
                transform: scale(1.1);
            }
            50% { 
                background: rgba(33, 150, 243, 0.3);
                transform: scale(1.05);
            }
            75% { 
                background: rgba(156, 39, 176, 0.3);
                transform: scale(1.1);
            }
            100% { 
                background: rgba(255, 183, 77, 0.3);
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

// Keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                goToPrevLetter();
                break;
            case 'ArrowRight':
                event.preventDefault();
                goToNextLetter();
                break;
            case 'Escape':
                event.preventDefault();
                goBack();
                break;
            case 'Home':
                event.preventDefault();
                goBack();
                break;
        }
    });
}

// Initialize letter page functionality
document.addEventListener('DOMContentLoaded', function() {
    addNotificationStyles();
    addTracingStyles();
    initializeTracing();
    initializeKeyboardNavigation();
    
    // Show keyboard shortcuts hint
    setTimeout(() => {
        showNotification('💡 Use arrow keys to navigate between letters!');
    }, 2000);
});

// Touch/swipe navigation for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - go to previous letter
            goToPrevLetter();
        } else {
            // Swipe left - go to next letter
            goToNextLetter();
        }
    }
}

// Progress tracking (optional feature)
function trackProgress() {
    const currentLetter = getCurrentLetter();
    const visitedLetters = JSON.parse(localStorage.getItem('visitedLetters') || '[]');
    
    if (!visitedLetters.includes(currentLetter)) {
        visitedLetters.push(currentLetter);
        localStorage.setItem('visitedLetters', JSON.stringify(visitedLetters));
        
        // Show progress message
        const progress = Math.round((visitedLetters.length / letterOrder.length) * 100);
        setTimeout(() => {
            showNotification(`🎯 Progress: ${progress}% of alphabet learned!`);
        }, 1000);
    }
}

// Initialize progress tracking
document.addEventListener('DOMContentLoaded', function() {
    trackProgress();
});