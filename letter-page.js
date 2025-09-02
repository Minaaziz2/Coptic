// Letter page specific JavaScript functionality

// Letter navigation order - 32 Coptic letters in correct sequence
const letterOrder = [
    'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'soo', 'zeta', 'eta', 'theta',
    'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi',
    'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega',
    'shai', 'fai', 'khei', 'hori', 'shima', 'ti', 'gangia'
];

// Mapping between letter names and their file numbers in 'Letters and Words' folder
const letterToFileNumber = {
    'alpha': 1, 'beta': 2, 'gamma': 3, 'delta': 4, 'epsilon': 5, 'soo': 6,
    'zeta': 7, 'eta': 8, 'theta': 9, 'iota': 10, 'kappa': 11, 'lambda': 12,
    'mu': 13, 'nu': 14, 'xi': 15, 'omicron': 16, 'pi': 17, 'rho': 18,
    'sigma': 19, 'tau': 20, 'upsilon': 21, 'phi': 22, 'chi': 23, 'psi': 24,
    'omega': 25, 'shai': 26, 'fai': 27, 'khei': 28, 'hori': 29, 'shima': 30,
    'ti': 31, 'gangia': 32
};

// Mapping between file numbers and actual letter names in files
const fileNumberToLetterName = {
    1: 'Alpha', 2: 'Bita', 3: 'Gamma', 4: 'Delta', 5: 'Aie', 6: 'Soo',
    7: 'Zeta', 8: 'Eta', 9: 'Theta', 10: 'Youta', 11: 'Kappa', 12: 'Lavla',
    13: 'Mai', 14: 'Nai', 15: 'Eksi', 16: 'Omekron', 17: 'Pai', 18: 'Ro',
    19: 'Cima', 20: 'Tav', 21: 'Epslon', 22: 'Fi', 23: 'Kai', 24: 'Epsi',
    25: 'Omega', 26: 'Shai', 27: 'Phai', 28: 'Khai', 29: 'Hory', 30: 'Jinja',
    31: 'Chima', 32: 'Tie'
};

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
    
    // Get the appropriate audio element using generic IDs from HTML
    const audioElementId = language === 'en' ? 'letterAudioEn' : 'letterAudioAr';
    const audioElement = document.getElementById(audioElementId);
    
    // Update the audio source to the correct file from 'Letters and Words' folder
    if (audioElement) {
        const fileNumber = letterToFileNumber[letter];
        const letterName = fileNumberToLetterName[fileNumber];
        const fileSuffix = language === 'en' ? '' : ' Arabic';
        const audioSrc = `Letters and Words/${fileNumber} - ${letterName}${fileSuffix}.wav`;
        
        // Update the audio source
        const sourceElement = audioElement.querySelector('source');
        if (sourceElement) {
            sourceElement.src = audioSrc;
            audioElement.load(); // Reload the audio element with new source
        }
    }
    
    if (audioElement) {
        // Reset audio to beginning
        audioElement.currentTime = 0;
        
        audioElement.onended = function() {
            // Resume background music if it was playing
            if (wasMusicPlaying && backgroundMusic) {
                backgroundMusic.play();
            }
            button.innerHTML = originalText;
            button.disabled = false;
        };
        
        audioElement.onerror = function() {
            if (wasMusicPlaying && backgroundMusic) {
                backgroundMusic.play();
            }
            button.innerHTML = originalText;
            button.disabled = false;
            showNotification('Audio playback failed. Please try again.');
        };
        
        audioElement.play().catch(error => {
            // Audio play error
            if (wasMusicPlaying && backgroundMusic) {
                backgroundMusic.play();
            }
            button.innerHTML = originalText;
            button.disabled = false;
            showNotification('Audio playback failed. Please try again.');
        });
    } else {
        // Fallback to speech synthesis if audio element not found
        const pronunciationText = getPronunciationText(letter, language);
        
        if ('speechSynthesis' in window && pronunciationText) {
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(pronunciationText);
            utterance.lang = language === 'en' ? 'en-US' : 'ar-SA';
            utterance.rate = 0.6;
            utterance.volume = 0.9;
            utterance.pitch = 1.0;
            
            utterance.onend = function() {
                if (wasMusicPlaying && backgroundMusic) {
                    backgroundMusic.play();
                }
                button.innerHTML = originalText;
                button.disabled = false;
            };
            
            utterance.onerror = function(event) {
                if (wasMusicPlaying && backgroundMusic) {
                    backgroundMusic.play();
                }
                button.innerHTML = originalText;
                button.disabled = false;
                showNotification('Audio playback failed. Please try again.');
            };
            
            speechSynthesis.speak(utterance);
        } else {
            if (wasMusicPlaying && backgroundMusic) {
                backgroundMusic.play();
            }
            button.innerHTML = originalText;
            button.disabled = false;
            showNotification('Audio not available.');
        }
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
    
    // Get the word audio element using generic ID from HTML
    const wordAudioElement = document.getElementById('wordAudio');
    
    // Update the audio source to the correct file from 'Letters and Words' folder
    if (wordAudioElement) {
        const fileNumber = letterToFileNumber[letter];
        const letterName = fileNumberToLetterName[fileNumber];
        const audioSrc = `Letters and Words/${fileNumber} - ${letterName} Word.wav`;
        
        // Update the audio source
        const sourceElement = wordAudioElement.querySelector('source');
        if (sourceElement) {
            sourceElement.src = audioSrc;
            wordAudioElement.load(); // Reload the audio element with new source
        }
    }
    
    if (wordAudioElement) {
        // Reset audio to beginning
        wordAudioElement.currentTime = 0;
        
        wordAudioElement.onended = function() {
            // Resume background music if it was playing
            if (wasMusicPlaying && backgroundMusic) {
                backgroundMusic.play();
            }
            button.innerHTML = originalText;
            button.disabled = false;
        };
        
        wordAudioElement.onerror = function() {
            if (wasMusicPlaying && backgroundMusic) {
                backgroundMusic.play();
            }
            button.innerHTML = originalText;
            button.disabled = false;
            showNotification('Word audio playback failed. Please try again.');
        };
        
        wordAudioElement.play().catch(error => {
            // Word audio play error
            if (wasMusicPlaying && backgroundMusic) {
                backgroundMusic.play();
            }
            button.innerHTML = originalText;
            button.disabled = false;
            showNotification('Word audio playback failed. Please try again.');
        });
    } else {
        // Fallback to speech synthesis if audio element not found
        const wordText = getExampleWord(letter);
        
        if ('speechSynthesis' in window && wordText) {
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(wordText);
            utterance.lang = 'en-US';
            utterance.rate = 0.5;
            utterance.volume = 0.9;
            utterance.pitch = 1.0;
            
            utterance.onend = function() {
                if (wasMusicPlaying && backgroundMusic) {
                    backgroundMusic.play();
                }
                button.innerHTML = originalText;
                button.disabled = false;
            };
            
            utterance.onerror = function(event) {
                if (wasMusicPlaying && backgroundMusic) {
                    backgroundMusic.play();
                }
                button.innerHTML = originalText;
                button.disabled = false;
                showNotification('Word audio playback failed. Please try again.');
            };
            
            speechSynthesis.speak(utterance);
        } else {
            if (wasMusicPlaying && backgroundMusic) {
                backgroundMusic.play();
            }
            button.innerHTML = originalText;
            button.disabled = false;
            showNotification('Word audio not available.');
        }
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
            'en': 'Alpha',
            'ar': 'Alpha'
        },
        'beta': {
            'en': 'Bita',
            'ar': 'Bita'
        },
        'gamma': {
            'en': 'Gamma',
            'ar': 'Gamma'
        },
        'delta': {
            'en': 'Delta',
            'ar': 'Delta'
        },
        'epsilon': {
            'en': 'Aie',
            'ar': 'Aie'
        },
        'soo': {
            'en': 'Soo',
            'ar': 'Soo'
        },
        'zeta': {
            'en': 'Zeta',
            'ar': 'Zeta'
        },
        'eta': {
            'en': 'Eta',
            'ar': 'Eta'
        },
        'theta': {
            'en': 'Theta',
            'ar': 'Theta'
        },
        'iota': {
            'en': 'Youta',
            'ar': 'Youta'
        },
        'kappa': {
            'en': 'Kappa',
            'ar': 'Kappa'
        },
        'lambda': {
            'en': 'Lavla',
            'ar': 'Lavla'
        },
        'mu': {
            'en': 'Mai',
            'ar': 'Mai'
        },
        'nu': {
            'en': 'Nai',
            'ar': 'Nai'
        },
        'xi': {
            'en': 'Eksi',
            'ar': 'Eksi'
        },
        'omicron': {
            'en': 'Omekron',
            'ar': 'Omekron'
        },
        'pi': {
            'en': 'Pai',
            'ar': 'Pai'
        },
        'rho': {
            'en': 'Ro',
            'ar': 'Ro'
        },
        'sigma': {
            'en': 'Cima',
            'ar': 'Cima'
        },
        'tau': {
            'en': 'Tav',
            'ar': 'Tav'
        },
        'upsilon': {
            'en': 'Epslon',
            'ar': 'Epslon'
        },
        'phi': {
            'en': 'Fi',
            'ar': 'Fi'
        },
        'chi': {
            'en': 'Kai',
            'ar': 'Kai'
        },
        'psi': {
            'en': 'Epsi',
            'ar': 'Epsi'
        },
        'omega': {
            'en': 'Omega',
            'ar': 'Omega'
        },
        'shai': {
            'en': 'Shai',
            'ar': 'Shai'
        },
        'fai': {
            'en': 'Phai',
            'ar': 'Phai'
        },
        'khei': {
            'en': 'Khai',
            'ar': 'Khai'
        },
        'hori': {
            'en': 'Hory',
            'ar': 'Hory'
        },
        'gangia': {
            'en': 'Jinja',
            'ar': 'Jinja'
        },
        'shima': {
            'en': 'Chima',
            'ar': 'Chima'
        },
        'ti': {
            'en': 'Tie',
            'ar': 'Tie'
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