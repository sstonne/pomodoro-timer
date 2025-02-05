const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const timeDisplay = document.getElementById("timeDisplay");
const circle = document.getElementById("circle");
const sessionType = document.getElementById("sessionType"); 

const focusTimeInput = document.getElementById("focusTime"); // 집중 시간 입력
const breakTimeInput = document.getElementById("breakTime"); // 휴식 시간 입력

let timerInterval = null;
let remainingTime = 0;
let totalTime = 0;
let isPaused = false;
let isBreak = false; 
let focusTime = 4800; // 기본값 80분 (초)
let breakTime = 600;  // 기본값 10분 (초)

// 알람 사운드
const focusAlarm = new Audio("CHIME8.mp3"); // 집중 시작 알람
const breakAlarm = new Audio("CHIME7.mp3"); // 휴식 시작 알람

focusAlarm.preload = "auto"; 
breakAlarm.preload = "auto";

// 🛠️ 사용자가 설정한 값으로 타이머 초기화
const resetTimer = () => {
    clearInterval(timerInterval);
    timerInterval = null;
    
    // 남은 시간 설정 (사용자가 입력한 값 적용)
    remainingTime = isBreak ? breakTime : focusTime; 
    totalTime = remainingTime;
    isPaused = false;

    timeDisplay.textContent = formatTime(remainingTime);
    circle.style.background = `conic-gradient(transparent 0%, transparent 100%)`;

    startButton.disabled = false;
    stopButton.disabled = true;
    stopButton.textContent = "Stop";
};

// 시간을 MM:SS 형식으로 변환하는 함수
const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// 🛠️ 사용자가 입력한 값으로 집중 & 휴식 시간을 설정하는 함수
const setUserTimes = () => {
    const focusMinutes = parseInt(focusTimeInput.value, 10);
    const breakMinutes = parseInt(breakTimeInput.value, 10);

    if (isNaN(focusMinutes) || focusMinutes <= 0 || isNaN(breakMinutes) || breakMinutes <= 0) {
        alert("📌 집중 시간과 휴식 시간을 올바르게 입력해주세요!");
        return false;
    }

    focusTime = focusMinutes * 60; // 분 → 초 변환
    breakTime = breakMinutes * 60; // 분 → 초 변환
    return true;
};

// 🛠️ 타이머 시작 함수
const startTimer = () => {
    // 처음 시작할 때만 사용자의 입력을 반영
    if (!isPaused) {
        if (!setUserTimes()) return; // 입력값이 올바르지 않으면 타이머 실행 안 함
        resetTimer();
    }

    isPaused = false;

    // 🎯 Start 버튼 클릭 시 소리가 겹치지 않도록 play()를 여기서만 실행
    if (isBreak) {
        sessionType.textContent = "☕ 휴식 시간";
        breakAlarm.play().catch(error => console.warn("Audio play error:", error)); 
    } else {
        sessionType.textContent = "📚 집중 시간";
        focusAlarm.play().catch(error => console.warn("Audio play error:", error)); 
    }

    startButton.disabled = true;
    stopButton.disabled = false;
    stopButton.textContent = "Stop";

    // 타이머 실행
    timerInterval = setInterval(() => {
        remainingTime -= 0.01;

        if (remainingTime < 0) remainingTime = 0;

        // 시간 업데이트
        timeDisplay.textContent = formatTime(remainingTime);

        // 원형 애니메이션 업데이트
        const percentage = (remainingTime / totalTime) * 100;
        circle.style.background = `conic-gradient(#DCD0D0 0% ${percentage}%, transparent ${percentage}% 100%)`;

        // 타이머 종료 시
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            isBreak = !isBreak; // 다음 세션 전환 (집중 <-> 휴식)
            startTimer(); // 자동으로 다음 세션 시작
        }
    }, 10);
};

// 타이머 정지 함수
const stopTimer = () => {
    if (!isPaused) {
        clearInterval(timerInterval);
        isPaused = true;
        stopButton.textContent = "Restart";
    } else {
        startTimer();
        stopButton.textContent = "Stop";
    }
};

// ✅ Start 버튼 이벤트 (사용자 입력을 적용)
startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);

// 초기 상태 설정
resetTimer();
