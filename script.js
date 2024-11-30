const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const treeLevels = document.querySelectorAll('.tree div');
const star = document.querySelector('.star');

// Функция для работы с микрофоном
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  const microphone = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  microphone.connect(analyser);

  function animateTree() {
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

    requestAnimationFrame(animateTree);
  }

  animateTree();
});
