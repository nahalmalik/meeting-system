// ===============================
// LOAD HEADER & FOOTER
// ===============================
fetch("../components/header.html")
  .then(res => res.text())
  .then(html => document.getElementById("header").innerHTML = html);

fetch("../components/footer.html")
  .then(res => res.text())
  .then(html => document.body.appendChild((() => {const f=document.createElement("div"); f.innerHTML = html; return f;})()));

// ===============================
// SAMPLE BOOKINGS DATA
// ===============================
let bookings = [
  {
    type: "30-Minute Discovery Call",
    name: "User 1",
    email: "user1@example.com",
    date: "2026-01-15",
    time: "09:00 AM",
    duration: 30
  },
  {
    type: "Initial Consultation",
    name: "User 2",
    email: "user2@example.com",
    date: "2026-01-16",
    time: "11:00 AM",
    duration: 30
  },
  // Add more sample bookings here
];

// Notifications
let notifications = [
  "User 1 booked a 30-Minute Discovery Call",
  "User 2 booked Initial Consultation"
];

// ===============================
// SHOW NOTIFICATIONS
// ===============================
const notificationList = document.getElementById("notificationList");
notifications.forEach(note => {
  const li = document.createElement("li");
  li.innerText = note;
  notificationList.appendChild(li);
});

// ===============================
// SHOW MEETINGS
// ===============================
const meetingList = document.getElementById("meetingList");

function displayMeetings(view = "week") {
  meetingList.innerHTML = "";

  // Filter by week / month
  const now = new Date();
  const filtered = bookings.filter(b => {
    const meetingDate = new Date(b.date);
    if (view === "week") {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return meetingDate >= weekStart && meetingDate <= weekEnd;
    } else { // month
      return meetingDate.getMonth() === now.getMonth() &&
             meetingDate.getFullYear() === now.getFullYear();
    }
  });

  filtered.forEach(b => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.type}</td>
      <td>${b.name}</td>
      <td>${b.email}</td>
      <td>${b.date}</td>
      <td>${b.time}</td>
      <td>${b.duration} min</td>
    `;
    meetingList.appendChild(tr);
  });
}

// Initial display
displayMeetings("week");

// ===============================
// TAB BUTTONS
// ===============================
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    displayMeetings(btn.dataset.view);
  };
});
