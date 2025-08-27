// Pomodoro Timer Widget for StreamElements
// Global variables
let fieldData = {};
let timerState = {
  mode: 'work', // 'work', 'shortBreak', 'longBreak'
  isRunning: false,
  isPaused: false,
  currentSession: 1,
  totalTime: 0,
  remainingTime: 0,
  startTime: null,
  timerInterval: null
};

// Audio elements
let workCompleteAudio, breakCompleteAudio, tickAudio;

// DOM elements
let timerMinutes, timerSeconds, timerStateElement, currentSessionElement, totalSessionsElement, progressFill;
let controlButtons, testControls, sessionToggle, timerDisplay, timerTitle;

// Initialize widget when loaded
window.addEventListener('onWidgetLoad', function (obj) {
  console.log('Pomodoro Widget Loading...');
  
  // Get field data from StreamElements
  fieldData = obj.detail.fieldData;
  
  // Initialize DOM elements
  initializeDOMElements();
  
  // Apply custom styling from field data
  applyCustomStyling();
  
  // Initialize timer state
  initializeTimer();
  
  // Load saved timer state (if any)
  loadTimerState();
  
  // Set up event listeners
  setupEventListeners();
  
  // Check if in editor mode
  const overlayStatus = SE_API.getOverlayStatus();
  if (overlayStatus && overlayStatus.isEditorMode) {
    showEditorControls();
  }
  
  console.log('Pomodoro Widget Loaded Successfully');
});

// Initialize DOM elements
function initializeDOMElements() {
  timerMinutes = document.getElementById('timer-minutes');
  timerSeconds = document.getElementById('timer-seconds');
  timerStateElement = document.getElementById('timer-state');
  currentSessionElement = document.getElementById('current-session');
  totalSessionsElement = document.getElementById('total-sessions');
  progressFill = document.getElementById('progress-fill');
  controlButtons = document.getElementById('control-buttons');
  testControls = document.getElementById('test-controls');
  sessionToggle = document.getElementById('session-toggle');
  timerDisplay = document.getElementById('timer-display');
  timerTitle = document.getElementById('timer-title');
  
  // Initialize audio elements
  workCompleteAudio = document.getElementById('work-complete-audio');
  breakCompleteAudio = document.getElementById('break-complete-audio');
  tickAudio = document.getElementById('tick-audio');
}

// Apply custom styling from field data
function applyCustomStyling() {
  const widget = document.querySelector('.pomodoro-widget');
  const root = document.documentElement;
  
  // Apply scaling
  if (fieldData.timerScale) {
    widget.style.transform = `scale(${fieldData.timerScale / 100})`;
  }
  
  // Apply colors
  if (fieldData.cardBackgroundColor) {
    widget.style.backgroundColor = fieldData.cardBackgroundColor;
  }
  
  if (fieldData.timerTextColor) {
    timerDisplay.style.color = fieldData.timerTextColor;
  }
  
  if (fieldData.titleTextColor) {
    timerTitle.style.color = fieldData.titleTextColor;
  }
  
  if (fieldData.sessionBoxColor) {
    document.querySelector('.toggle-switch').style.backgroundColor = fieldData.sessionBoxColor;
  }
  
  if (fieldData.sessionTextColor) {
    document.querySelector('.session-counter').style.color = fieldData.sessionTextColor;
  }
  
  if (fieldData.progressBarColor) {
    progressFill.style.backgroundColor = fieldData.progressBarColor;
  }
  
  if (fieldData.iconColor) {
    document.querySelectorAll('.decorative-icons .icon, .heart-icon').forEach(icon => {
      icon.style.color = fieldData.iconColor;
    });
  }
  
  // Apply font settings
  if (fieldData.fontFamily) {
    widget.style.fontFamily = `'${fieldData.fontFamily}', sans-serif`;
  }
  
  if (fieldData.timerFontSize) {
    timerDisplay.style.fontSize = `${fieldData.timerFontSize}px`;
  }
  
  if (fieldData.titleFontSize) {
    timerTitle.style.fontSize = `${fieldData.titleFontSize}px`;
  }
  
  if (fieldData.fontWeight) {
    timerDisplay.style.fontWeight = fieldData.fontWeight;
  }
  
  // Show/hide elements based on settings
  if (!fieldData.showTitles) {
    timerTitle.style.display = 'none';
  }
  
  if (!fieldData.showSessionBox) {
    sessionToggle.style.display = 'none';
  }
  
  if (!fieldData.showCountdown) {
    timerDisplay.style.display = 'none';
  }
}

// Initialize timer state
function initializeTimer() {
  timerState.currentSession = 1;
  timerState.mode = 'work';
  timerState.totalTime = (fieldData.workDuration || 25) * 60;
  timerState.remainingTime = timerState.totalTime;
  
  updateDisplay();
  updateSessionCounter();
  updateProgressBar();
}

// Setup event listeners
function setupEventListeners() {
  // Control buttons
  document.getElementById('start-btn').addEventListener('click', startTimer);
  document.getElementById('pause-btn').addEventListener('click', pauseTimer);
  document.getElementById('reset-btn').addEventListener('click', resetTimer);
  
  // Test buttons
  document.getElementById('test-work-complete').addEventListener('click', () => testTimerComplete('work'));
  document.getElementById('test-break-complete').addEventListener('click', () => testTimerComplete('break'));
  document.getElementById('test-session-change').addEventListener('click', testSessionChange);
}

// Show editor controls
function showEditorControls() {
  controlButtons.classList.add('show');
  testControls.classList.add('show');
}

// Timer functions
function startTimer() {
  if (timerState.isPaused) {
    // Resume from pause
    timerState.isPaused = false;
    timerState.startTime = Date.now() - ((timerState.totalTime - timerState.remainingTime) * 1000);
  } else {
    // Start new timer
    timerState.startTime = Date.now();
  }
  
  timerState.isRunning = true;
  
  // Start the timer interval
  timerState.timerInterval = setInterval(updateTimer, 1000);
  
  // Update display
  document.querySelector('.pomodoro-widget').classList.remove('timer-paused');
  
  // Save state immediately when timer starts
  saveTimerState();
  
  console.log(`Timer started: ${timerState.mode} mode`);
}

function pauseTimer() {
  if (timerState.isRunning) {
    timerState.isRunning = false;
    timerState.isPaused = true;
    clearInterval(timerState.timerInterval);
    
    // Update display
    document.querySelector('.pomodoro-widget').classList.add('timer-paused');
    
    // Save state immediately when timer is paused
    saveTimerState();
    
    console.log('Timer paused');
  }
}

function resetTimer() {
  // Stop timer
  timerState.isRunning = false;
  timerState.isPaused = false;
  clearInterval(timerState.timerInterval);
  
  // Reset to current mode's duration
  switch (timerState.mode) {
    case 'work':
      timerState.totalTime = (fieldData.workDuration || 25) * 60;
      break;
    case 'shortBreak':
      timerState.totalTime = (fieldData.shortBreakDuration || 5) * 60;
      break;
    case 'longBreak':
      timerState.totalTime = (fieldData.longBreakDuration || 15) * 60;
      break;
  }
  
  timerState.remainingTime = timerState.totalTime;
  
  // Update display
  document.querySelector('.pomodoro-widget').classList.remove('timer-paused');
  updateDisplay();
  updateProgressBar();
  
  // Save state immediately when timer is reset
  saveTimerState();
  
  console.log('Timer reset');
}

function updateTimer() {
  if (!timerState.isRunning) return;
  
  const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
  timerState.remainingTime = Math.max(0, timerState.totalTime - elapsed);
  
  updateDisplay();
  updateProgressBar();
  
  // Play tick sound if enabled
  if (fieldData.enableSound && tickAudio && tickAudio.src) {
    tickAudio.play().catch(e => console.log('Tick sound failed:', e));
  }
  
  // Check if timer completed
  if (timerState.remainingTime <= 0) {
    timerComplete();
  }
}

function timerComplete() {
  clearInterval(timerState.timerInterval);
  timerState.isRunning = false;
  timerState.isPaused = false;
  
  // Play completion sound
  if (fieldData.enableSound) {
    if (timerState.mode === 'work' && workCompleteAudio && workCompleteAudio.src) {
      workCompleteAudio.play().catch(e => console.log('Work complete sound failed:', e));
    } else if ((timerState.mode === 'shortBreak' || timerState.mode === 'longBreak') && breakCompleteAudio && breakCompleteAudio.src) {
      breakCompleteAudio.play().catch(e => console.log('Break complete sound failed:', e));
    }
  }
  
  // Add completion animation
  document.querySelector('.pomodoro-widget').classList.add('pulse');
  setTimeout(() => {
    document.querySelector('.pomodoro-widget').classList.remove('pulse');
  }, 1000);
  
  // Move to next phase
  if (timerState.mode === 'work') {
    timerState.currentSession++;
    
    // Check if it's time for long break
    if (timerState.currentSession > (fieldData.sessionsForLongBreak || 4) && 
        timerState.currentSession <= (fieldData.totalSessions || 6)) {
      switchToMode('longBreak');
    } else if (timerState.currentSession <= (fieldData.totalSessions || 6)) {
      switchToMode('shortBreak');
    } else {
      // All sessions completed
      sessionComplete();
      return;
    }
  } else {
    // Break completed, back to work
    switchToMode('work');
  }
  
  updateSessionCounter();
  console.log(`${timerState.mode} completed, switched to next phase`);
}

function switchToMode(newMode) {
  timerState.mode = newMode;
  
  // Set duration based on mode
  switch (newMode) {
    case 'work':
      timerState.totalTime = (fieldData.workDuration || 25) * 60;
      timerStateElement.textContent = fieldData.workTitle || 'FOCUS';
      break;
    case 'shortBreak':
      timerState.totalTime = (fieldData.shortBreakDuration || 5) * 60;
      timerStateElement.textContent = fieldData.shortBreakTitle || 'SHORT BREAK';
      break;
    case 'longBreak':
      timerState.totalTime = (fieldData.longBreakDuration || 15) * 60;
      timerStateElement.textContent = fieldData.longBreakTitle || 'LONG BREAK';
      break;
  }
  
  timerState.remainingTime = timerState.totalTime;
  
  // Update display classes with smooth transition
  const widget = document.querySelector('.pomodoro-widget');
  
  // Use requestAnimationFrame to ensure smooth DOM updates
  requestAnimationFrame(() => {
    widget.classList.remove('timer-work', 'timer-break', 'timer-long-break');
    
    requestAnimationFrame(() => {
      widget.classList.add(`timer-${newMode.replace('Break', '-break')}`);
      
      // Update display after class changes are applied
      updateDisplay();
      updateProgressBar();
      
      // Save state immediately when mode switches
      saveTimerState();
    });
  });
}

function sessionComplete() {
  console.log('All Pomodoro sessions completed!');
  timerStateElement.textContent = 'COMPLETE!';
  
  // Reset for new cycle
  timerState.currentSession = 1;
  updateSessionCounter();
  
  // Add celebration animation
  document.querySelector('.pomodoro-widget').classList.add('shake');
  setTimeout(() => {
    document.querySelector('.pomodoro-widget').classList.remove('shake');
    switchToMode('work');
  }, 2000);
}

// Update display functions
function updateDisplay() {
  const minutes = Math.floor(timerState.remainingTime / 60);
  const seconds = timerState.remainingTime % 60;
  
  timerMinutes.textContent = minutes.toString().padStart(2, '0');
  timerSeconds.textContent = seconds.toString().padStart(2, '0');
}

function updateSessionCounter() {
  currentSessionElement.textContent = timerState.currentSession;
  totalSessionsElement.textContent = fieldData.totalSessions || 6;
}

function updateProgressBar() {
  const progress = ((timerState.totalTime - timerState.remainingTime) / timerState.totalTime) * 100;
  progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

// Test functions
function testTimerComplete(type) {
  console.log(`Testing ${type} complete`);
  
  if (type === 'work') {
    timerState.mode = 'work';
    timerComplete();
  } else {
    timerState.mode = 'shortBreak';
    timerComplete();
  }
}

function testSessionChange() {
  console.log('Testing session change');
  timerState.currentSession = Math.min(timerState.currentSession + 1, fieldData.totalSessions || 6);
  updateSessionCounter();
}

// Handle chat commands (if enabled)
window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const data = obj.detail.event;
  
  if (listener === 'message') {
    const message = data.data.text.toLowerCase().trim();
    
    // Check for timer commands
    if (message === (fieldData.startCommand || '!pomodoro start').toLowerCase()) {
      startTimer();
    } else if (message === (fieldData.pauseCommand || '!pomodoro pause').toLowerCase()) {
      pauseTimer();
    } else if (message === (fieldData.resetCommand || '!pomodoro reset').toLowerCase()) {
      resetTimer();
    }
  }
});

// Handle widget button events (for testing)
window.addEventListener('onEventReceived', function (obj) {
  const data = obj.detail.event;
  if (data.listener === 'widget-button') {
    if (data.field === 'testWorkComplete') {
      testTimerComplete('work');
    } else if (data.field === 'testBreakComplete') {
      testTimerComplete('break');
    } else if (data.field === 'testSessionChange') {
      testSessionChange();
    }
  }
});

// Store timer state in StreamElements storage
function saveTimerState() {
  const stateData = {
    currentSession: timerState.currentSession,
    mode: timerState.mode,
    remainingTime: timerState.remainingTime,
    isRunning: timerState.isRunning,
    isPaused: timerState.isPaused,
    timestamp: Date.now()
  };
  
  SE_API.store.set('pomodoroTimer', stateData).then(() => {
    console.log('Timer state saved successfully');
  }).catch(error => {
    console.error('Failed to save timer state:', error);
  });
}

// Load timer state from StreamElements storage
function loadTimerState() {
  SE_API.store.get('pomodoroTimer').then(data => {
    if (data && data.timestamp) {
      const timeDiff = Math.floor((Date.now() - data.timestamp) / 1000);
      
      timerState.currentSession = data.currentSession || 1;
      timerState.mode = data.mode || 'work';
      timerState.isRunning = false; // Always start as stopped after refresh
      timerState.isPaused = data.isPaused || false;
      
      // Set the correct duration and title for the restored mode
      switch (timerState.mode) {
        case 'work':
          timerState.totalTime = (fieldData.workDuration || 25) * 60;
          timerStateElement.textContent = fieldData.workTitle || 'FOCUS';
          break;
        case 'shortBreak':
          timerState.totalTime = (fieldData.shortBreakDuration || 5) * 60;
          timerStateElement.textContent = fieldData.shortBreakTitle || 'SHORT BREAK';
          break;
        case 'longBreak':
          timerState.totalTime = (fieldData.longBreakDuration || 15) * 60;
          timerStateElement.textContent = fieldData.longBreakTitle || 'LONG BREAK';
          break;
      }
      
      // Apply the correct CSS classes for the restored mode
      const widget = document.querySelector('.pomodoro-widget');
      widget.classList.remove('timer-work', 'timer-break', 'timer-long-break');
      widget.classList.add(`timer-${timerState.mode.replace('Break', '-break')}`);
      
      if (data.isRunning && !data.isPaused) {
        // Calculate remaining time accounting for time passed during refresh
        timerState.remainingTime = Math.max(0, data.remainingTime - timeDiff);
        
        if (timerState.remainingTime > 0) {
          // Timer was running, restore the remaining time but don't auto-start
          // User needs to manually resume the timer after refresh
          timerState.isPaused = true;
          document.querySelector('.pomodoro-widget').classList.add('timer-paused');
          console.log(`Timer was running, paused at ${Math.floor(timerState.remainingTime / 60)}:${(timerState.remainingTime % 60).toString().padStart(2, '0')} remaining`);
        } else {
          // Timer would have completed during the refresh
          timerState.remainingTime = 0;
          console.log('Timer completed during refresh');
        }
      } else if (data.isPaused) {
        // Timer was paused, restore exact remaining time
        timerState.remainingTime = data.remainingTime;
        timerState.isPaused = true;
        document.querySelector('.pomodoro-widget').classList.add('timer-paused');
        console.log(`Timer was paused, restored with ${Math.floor(timerState.remainingTime / 60)}:${(timerState.remainingTime % 60).toString().padStart(2, '0')} remaining`);
      } else {
        // Timer was stopped, restore remaining time
        timerState.remainingTime = data.remainingTime || timerState.totalTime;
        console.log(`Timer was stopped, restored in ${timerState.mode} mode`);
      }
      
      updateDisplay();
      updateSessionCounter();
      updateProgressBar();
      
      console.log(`Timer state restored: ${timerState.mode} mode, session ${timerState.currentSession}`);
    } else {
      console.log('No saved timer state found, starting fresh');
    }
  }).catch(e => {
    console.log('No saved timer state found or error loading:', e);
  });
}

// Save state periodically
setInterval(saveTimerState, 5000);

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, waiting for StreamElements...');
});
