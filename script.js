c// Инициализация Web Audio API для работы с микрофоном
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function animate() {
            analyser.getByteFrequencyData(dataArray);

            // Проверяем уровень громкости
            const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

            // Уровни ёлки
            if (!isTreeLit) { // Только если "Гори" ещё не сказано
                if (volume > 20) treeLevels[0].style.opacity = '1';
                if (volume > 50) treeLevels[1].style.opacity = '1';
                if (volume > 100) treeLevels[2].style.opacity = '1';
                if (volume > 150) star.style.opacity = '1';
            }

            requestAnimationFrame(animate);
        }
        animate();
    })
    .catch((err) => console.error('Ошибка доступа к микрофону:', err));

// Распознавание речи
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU'; // Устанавливаем русский язык
    recognition.continuous = true;

    let isTreeLit = false;

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();

        console.log('Распознан текст:', transcript);

        if (transcript.toLowerCase() === 'гори') {
            console.log('Слово "гори" распознано!');
            isTreeLit = true;

            // Зажигаем всю ёлку
            treeLevels.forEach((level) => level.style.opacity = '1');
            star.style.opacity = '1';

            // Останавливаем распознавание
            recognition.stop();
        }
    };

    recognition.onerror = (err) => console.error('Ошибка распознавания речи:', err);

    recognition.start();
} else {
    console.error('Ваш браузер не поддерживает Speech Recognition API.');
}

