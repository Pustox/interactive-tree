const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const treeLevels = document.querySelectorAll('.tree div');
const star = document.querySelector('.star');

let isTreeLit = false; // Флаг: ёлка полностью зажжена

// Функция для работы с микрофоном
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  const microphone = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  microphone.connect(analyser);

  function animateTree() {
    if (!isTreeLit) { // Ёлка мигает, только если не сказано "гори"
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

      // Управление прозрачностью ветвей ёлки
      if (volume > 5) treeLevels[0].style.opacity = '1';
      if (volume > 10) treeLevels[1].style.opacity = '1';
      if (volume > 20) treeLevels[2].style.opacity = '1';
      if (volume > 30) star.style.opacity = '1';

      // Если тише, то гасим
      if (volume < 30) star.style.opacity = '0.2';
      if (volume < 20) treeLevels[2].style.opacity = '0.2';
      if (volume < 10) treeLevels[1].style.opacity = '0.2';
      if (volume < 5) treeLevels[0].style.opacity = '0.2';
    }

    requestAnimationFrame(animateTree);
  }

  animateTree();
});

// Добавляем распознавание речи
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'ru-RU'; // Устанавливаем русский язык
  recognition.continuous = true; // Чтобы распознавание не останавливалось

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim();
    console.log('Распознан текст:', transcript);

    if (transcript.toLowerCase() === 'гори') {
      console.log('Слово "гори" распознано!');
      isTreeLit = true; // Устанавливаем флаг: ёлка полностью зажжена

      // Полностью зажигаем ёлку
      treeLevels.forEach((level) => level.style.opacity = '1');
      star.style.opacity = '1';

      // Можно остановить распознавание речи, если больше не нужно
      recognition.stop();
    }
  };

  recognition.onerror = (err) => console.error('Ошибка распознавания речи:', err);

  recognition.start(); // Запускаем распознавание
} else {
  console.error('Ваш браузер не поддерживает Speech Recognition API.');
}
