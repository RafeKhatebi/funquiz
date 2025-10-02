document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    
    // Progress, Score and Timer elements
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    
    let currentScore = 0;
    let startTime = Date.now();
    let timerInterval;

    const feedbackMessages = {
        q1: "خوب بود! همه ما یک بار این بهانه را زده‌ایم 😄",
        q2: "آره دیگر، همین‌طور بهتر است! 👍",
        q3: "عالی است! چای با دوستان همیشه خوب است! ☕",
        default: "برویم ببینیم بعدی چیست!"
    };

    const secretCode = "کار میکنه دست نزن";
    
    // Start Timer
    function startTimer() {
        timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    // Update Progress
    function updateProgress(step) {
        const totalSteps = 5;
        const progress = (step / totalSteps) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `مرحله ${step} از ${totalSteps}`;
    }
    
    // Add Score
    function addScore(points) {
        currentScore += points;
        scoreElement.textContent = currentScore;
    }
    
    // Start timer when page loads
    startTimer();

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStepElem = button.closest('.step');
            const currentStep = parseInt(currentStepElem.id.split('-')[1]);
            const nextStep = parseInt(button.getAttribute('data-next'));
            const feedbackElem = currentStepElem.querySelector('.feedback');

            let canProceed = false;

            // --- Validation Logic ---
            if (currentStep === 1) { // Welcome screen
                canProceed = true;
            } else if (currentStep === 2 || currentStep === 3 || currentStep === 4) { // Radio button questions
                const questionName = `q${currentStep - 1}`;
                const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);
                if (selectedOption) {
                    feedbackElem.textContent = feedbackMessages[questionName] || feedbackMessages.default;
                    feedbackElem.style.color = '#27ae60';
                    feedbackElem.style.background = '#d4edda';
                    addScore(20); // Add 20 points for correct answer
                    canProceed = true;
                } else {
                    feedbackElem.textContent = 'یک گزینه را انتخاب کنید!';
                    feedbackElem.style.color = '#e74c3c';
                    feedbackElem.style.background = '#f8d7da';
                }
            } else if (currentStep === 5) { // Secret code challenge
                const selectElement = document.getElementById('secret-code');
                const userInput = selectElement.value.trim();
                if (userInput === '') {
                    feedbackElem.textContent = 'یک گزینه را انتخاب کنید!';
                    feedbackElem.style.color = '#e74c3c';
                    feedbackElem.style.background = '#f8d7da';
                } else if (userInput.toLowerCase() === secretCode.toLowerCase()) {
                    feedbackElem.textContent = 'عالی! کد را درست زدید! 🎉';
                    feedbackElem.style.color = '#27ae60';
                    feedbackElem.style.background = '#d4edda';
                    addScore(40); // Add 40 points for challenge
                    canProceed = true;
                } else {
                    feedbackElem.textContent = 'اشتباه است! یک کمی بیشتر فکر کنید... 🤔';
                    feedbackElem.style.color = '#e74c3c';
                    feedbackElem.style.background = '#f8d7da';
                }
            }
            
            // --- Transition to Next Step ---
            if (canProceed) {
                setTimeout(() => {
                    currentStepElem.classList.remove('active');
                    const nextStepElem = document.getElementById(`step-${nextStep}`);
                    if (nextStepElem) {
                        nextStepElem.classList.add('active');
                        updateProgress(nextStep - 1);
                        
                        // Stop timer and show final stats on last step
                        if (nextStep === 6) {
                            clearInterval(timerInterval);
                            document.getElementById('final-time').textContent = timerElement.textContent;
                            document.getElementById('final-score').textContent = currentScore;
                        }
                    }
                    if (feedbackElem) {
                        feedbackElem.textContent = '';
                    }
                }, 500);
            }
        });
    });
    
    // Back button functionality
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStepElem = button.closest('.step');
            const prevStep = parseInt(button.getAttribute('data-prev'));
            
            currentStepElem.classList.remove('active');
            const prevStepElem = document.getElementById(`step-${prevStep}`);
            if (prevStepElem) {
                prevStepElem.classList.add('active');
                updateProgress(prevStep - 1);
            }
        });
    });

    // Real download button - downloads the file
    const realDownloadLink = document.getElementById('real-download-link');
    // This button works normally and downloads the file
    
    // Funny download button - shows joke message
    const funnyDownloadLink = document.getElementById('funny-download-link');
    if (funnyDownloadLink) {
        funnyDownloadLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('😂 دوست چه فکر کردید؟\n\nاستاد همراز رایگان درس می‌دهد و سوالات را هم می‌دهد!\n\nحالا بروید درس بخوانید و بعد بیایید 📚😄');
        });
    }
    
    // Share button functionality
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const shareText = `من این کوئیز جالب رو تموم کردم! 🎉\n⏱️ زمان: ${timerElement.textContent}\n🏆 امتیاز: ${currentScore}\n\nتو هم امتحان کن!`;
            
            // Check if Web Share API is available
            if (navigator.share) {
                navigator.share({
                    title: 'کوئیز جالب',
                    text: shareText,
                    url: window.location.href
                }).catch(err => console.log('Error sharing:', err));
            } else {
                // Fallback: Copy to clipboard
                navigator.clipboard.writeText(shareText + '\n' + window.location.href)
                    .then(() => {
                        alert('✅ متن کپی شد!\n\nحالا می‌تونید برای دوستانتان بفرستید.');
                    })
                    .catch(() => {
                        alert('📋 متن زیر را کپی کنید:\n\n' + shareText + '\n' + window.location.href);
                    });
            }
        });
    }
});
