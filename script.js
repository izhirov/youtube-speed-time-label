// Config
const videoElement = document.querySelector('.html5-main-video');
let speedLabel = null;


// Initial page...
// Todo: find a way with event listener. Seems like doesnt work now
if (canAddDurationLabel(videoElement)) {
    addSpeedLabel(videoElement);
    updateSpeedLabel(videoElement);
}

//
// Events
//
videoElement.addEventListener('loadedmetadata', e => {
  const video = e.target;
  if (canAddDurationLabel(video)) {
    addSpeedLabel(video);
    updateSpeedLabel(video);
  }
});

videoElement.addEventListener('ratechange', e => {
  const video = e.target;

  if (canAddDurationLabel(video)) {
    if (!isRateLabelExists()) {
      addSpeedLabel(video)
    }
    updateSpeedLabel(video)
  } else {
    cleanDrawSpeedLabel()
  }
});

videoElement.addEventListener('timeupdate', e => {
  updateSpeedLabel(e.target);
});

//
// Label controls
//
function canAddDurationLabel(video) {
  return (
    video.playbackRate !== 1.0 || isLive()  // fixme: isLive and add ? whaat?
  );
}

function isLive() {
  const attributes = document.querySelector('.ytp-live-badge').attributes;
  return Boolean(attributes.disabled.value === '')
}

function isRateLabelExists() {
  return Boolean(document.querySelector('.speed-time-label'))
}

function addSpeedLabel(video) {
  if (!canAddDurationLabel(video)) {
    return;
  }

  const originalTimeLabel = document.querySelector('.ytp-time-display');

  const rateSpan = document.createElement('span');
  rateSpan.textContent = '1.00x';
  rateSpan.classList.add('rate-span');

  speedLabel = originalTimeLabel.cloneNode(true);
  speedLabel.classList.add('speed-time-label');
  speedLabel.querySelector('.ytp-live-badge').remove();
  speedLabel.prepend(rateSpan);

  originalTimeLabel.parentNode.appendChild(speedLabel);
}

function updateSpeedLabel(video) {

  if (!isRateLabelExists()) {
    return
  }

  const timeLabel = speedLabel.querySelector('.ytp-time-current');
  const durationLabel = speedLabel.querySelector('.ytp-time-duration');
  const rateLabel = speedLabel.querySelector('.rate-span');

  timeLabel.textContent = msToTime(video.currentTime / video.playbackRate);
  durationLabel.textContent = msToTime(video.duration / video.playbackRate);
  rateLabel.textContent = video.playbackRate + 'x';
}

function cleanDrawSpeedLabel() {
  speedLabel.remove()
}

//
// Work with data
//
function pad(c) {
    let s = String(c);
    if (s.length < 2) {
      s = "0" + s;
    }
    return s;
}

function msToTime(duration) {
  let  seconds = Math.floor((duration) % 60);
  let  minutes = Math.floor((duration / 60) % 60);
  let  hours = Math.floor((duration / (60 * 60)) % 24);
  if (hours !== 0) {
    return hours + ":" + pad(minutes) + ":" + pad(seconds);
  }
  return minutes + ":" + pad(seconds);
}
