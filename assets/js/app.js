// ===============================
// LOAD HEADER & FOOTER
// ===============================
fetch("../components/header.html")
  .then(res => res.text())
  .then(html => document.getElementById("header").innerHTML = html);

fetch("../components/footer.html")
  .then(res => res.text())
  .then(html => {
    const f = document.createElement("div");
    f.innerHTML = html;
    document.body.appendChild(f);
  });

// ===============================
// FAKE AVAILABILITY (UI ONLY)
// ===============================
const availability = {
  "2026-01-15": ["09:00 AM", "10:00 AM", "02:00 PM"],
  "2026-01-16": ["11:00 AM", "01:00 PM", "03:00 PM"],
  "2026-01-18": ["10:00 AM", "12:00 PM"]
};

// ===============================
// STATE
// ===============================
let selectedMeeting = null;
let selectedDate = null;
let selectedTime = null;

// ===============================
// ELEMENT REFERENCES
// ===============================
const datesDiv = document.querySelector(".dates");
const timesDiv = document.querySelector(".times");
const confirmBox = document.querySelector(".confirm-box");

const errorType = document.getElementById("error-type");
const errorDate = document.getElementById("error-date");
const errorTime = document.getElementById("error-time");

// ===============================
// LOAD AVAILABLE DATES
// ===============================
Object.keys(availability).forEach(date => {
  const btn = document.createElement("button");
  btn.innerHTML = formatDate(date);
  btn.dataset.date = date;

  btn.onclick = () => selectDate(btn, date);
  datesDiv.appendChild(btn);
});

// ===============================
// MEETING TYPE SELECTION
// ===============================
document.querySelectorAll(".card").forEach(card => {
  card.onclick = () => {
    document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    selectedMeeting = {
      type: card.dataset.type,
      duration: card.dataset.duration
    };

    errorType.innerText = ""; // Remove error instantly
    updateConfirm();
  };
});

// ===============================
// DATE SELECTION
// ===============================
function selectDate(btn, date) {
  document.querySelectorAll(".dates button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  selectedDate = date;
  selectedTime = null;

  errorDate.innerText = ""; // Remove date error
  errorTime.innerText = ""; // Remove time error

  loadTimes(date);
  updateConfirm();
}

// ===============================
// LOAD TIME SLOTS
// ===============================
function loadTimes(date) {
  timesDiv.innerHTML = "";
  timesDiv.classList.remove("hidden");
  document.querySelector(".time-title").classList.remove("hidden");

  availability[date].forEach(time => {
    const btn = document.createElement("button");
    btn.innerText = time;

    btn.onclick = () => {
      document.querySelectorAll(".times button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedTime = time;
      errorTime.innerText = ""; // Remove time error
      updateConfirm();
    };

    timesDiv.appendChild(btn);
  });
}

// ===============================
// CONFIRMATION UPDATE
// ===============================
function updateConfirm() {
  if (selectedMeeting && selectedDate && selectedTime) {
    confirmBox.classList.remove("hidden");

    document.getElementById("confirmType").innerText =
      `📌 ${selectedMeeting.type} (${selectedMeeting.duration} min)`;

    document.getElementById("confirmDate").innerText =
      `📅 ${formatFullDate(selectedDate)}`;

    document.getElementById("confirmTime").innerText =
      `⏰ ${selectedTime}`;
  } else {
    confirmBox.classList.add("hidden");
  }
}

// User info elements
const userNameInput = document.getElementById("userName");
const userEmailInput = document.getElementById("userEmail");
const errorName = document.getElementById("error-name");
const errorEmail = document.getElementById("error-email");
const userInfoTitle = document.querySelector(".user-info-title");

// Show inputs when time is selected
function updateConfirm() {
  if (selectedMeeting && selectedDate && selectedTime) {
    confirmBox.classList.remove("hidden");
    userNameInput.classList.remove("hidden");
    userEmailInput.classList.remove("hidden");
    userInfoTitle.classList.remove("hidden");

    document.getElementById("confirmType").innerText =
      `📌 ${selectedMeeting.type} (${selectedMeeting.duration} min)`;
    document.getElementById("confirmDate").innerText =
      `📅 ${formatFullDate(selectedDate)}`;
    document.getElementById("confirmTime").innerText =
      `⏰ ${selectedTime}`;
    document.getElementById("confirmUser").innerText =
      userNameInput.value ? `👤 ${userNameInput.value}` : '';
  } else {
    confirmBox.classList.add("hidden");
    userNameInput.classList.add("hidden");
    userEmailInput.classList.add("hidden");
    userInfoTitle.classList.add("hidden");
  }
}

// Update confirm text when user types
userNameInput.addEventListener("input", updateConfirm);

// ===============================
// CONFIRM BUTTON CLICK
// ===============================
document.querySelector(".confirm-btn").addEventListener("click", () => {
  let valid = true;

  // Clear previous errors
  errorType.innerText = "";
  errorDate.innerText = "";
  errorTime.innerText = "";
  errorName.innerText = "";
  errorEmail.innerText = "";

  // Validate Meeting Type
  if (!selectedMeeting) {
    errorType.innerText = "Please select a meeting type!";
    valid = false;
  }

  // Validate Date
  if (!selectedDate) {
    errorDate.innerText = "Please select a date!";
    valid = false;
  }

  // Validate Time
  if (!selectedTime) {
    errorTime.innerText = "Please select a time!";
    valid = false;
  }

  // Validate Name
  if (!userNameInput.value.trim()) {
    errorName.innerText = "Please enter your name!";
    valid = false;
  }

  // Validate Email
  if (!userEmailInput.value.trim()) {
    errorEmail.innerText = "Please enter your email!";
    valid = false;
  } else if (!/\S+@\S+\.\S+/.test(userEmailInput.value)) {
    errorEmail.innerText = "Please enter a valid email!";
    valid = false;
  }

  if (valid) {
    showPopup(
      `Your booking for ${selectedMeeting.type} on ${formatFullDate(selectedDate)} at ${selectedTime} is confirmed!`,
      true
    );

    // === SEND EMAILS ===
    // Here you would POST this data to a PHP backend
    // Example payload:
    const bookingData = {
      meeting: selectedMeeting.type,
      duration: selectedMeeting.duration,
      date: selectedDate,
      time: selectedTime,
      name: userNameInput.value,
      email: userEmailInput.value
    };

    // fetch('/send-booking-email.php', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(bookingData)
    // })
    // .then(res => res.json())
    // .then(data => console.log('Emails sent', data));

    // Reset form (optional)
    selectedMeeting = null;
    selectedDate = null;
    selectedTime = null;
    userNameInput.value = '';
    userEmailInput.value = '';
    updateConfirm();
  } else {
    showPopup("Please fill all required fields.", false);
  }
});


// ===============================
// POPUP FUNCTION
// ===============================
function showPopup(message, success = true) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.style.background = success ? "#16a34a" : "#dc2626";
  popup.innerText = message;
  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add("show"), 50);
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, 3000);
}

// ===============================
// DATE FORMATTERS
// ===============================
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.toLocaleDateString("en-US", { weekday: "short" })}<br><b>${d.getDate()}</b>`;
}

function formatFullDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
