// 🔴 FORCE REMOVE PENDING TRANSFER (DEBUG KILL)
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("*").forEach(el => {
    if (el.innerText && el.innerText.includes("pending confirmation")) {
      el.remove();
    }
  });
});


let balanceVisible = false;

const INTEREST_RATE = 0.012; // 1.2% monthly demo rate

// PWA
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('service-worker.js');
}

// DEMO DATA
const LOGIN_ID="RICKY001", LOGIN_PASS="Rickysecure";
const BALANCE_PIN="0010", TRANSFER_PIN="1222";

if(!localStorage.vault){
  localStorage.vault=JSON.stringify({
    balance:$296744133,
    hidden:false,
    transactions:[],
    failed:[]
  });
}

const V=()=>JSON.parse(localStorage.vault);
const S=v=>localStorage.vault=JSON.stringify(v);
const go=p=>location.href=p;

// LOGIN
function login(){
  if(account.value===LOGIN_ID && wealth.value===LOGIN_PASS){
    go("dashboard.html");
  } else msg.innerText="Login failed";
}

// SEND MONEY DYNAMIC FIELDS
function updateFields(){
  fields.innerHTML="";
  if(region.value==="usa"){
    fields.innerHTML=`
      <input placeholder="Account Number">
      <input placeholder="Routing Number">
      <p>✔ Receiver verified</p>`;
  }
  if(region.value==="eu"||region.value==="uk"){
    fields.innerHTML=`
      <input placeholder="IBAN">
      <p>✔ Receiver verified</p>`;
  }
}

// CHART (simple)
window.onload=()=>{
  const c=document.getElementById("chart");
  if(!c) return;
  const ctx=c.getContext("2d");
  ctx.fillStyle="#f5d36c";
  ctx.fillRect(10,50,200,10);
};
function loadSpendingChart() {
  const ctx = document.getElementById("spendingChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan","Feb","Mar","Apr","May","Jun"],
      datasets: [{
        label: "Monthly Spending",
        data: [1200, 900, 1500, 1100, 1800, 1400],
        borderColor: "#d4af37",
        backgroundColor: "rgba(212,175,55,0.2)",
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", loadSpendingChart);
function validateIBAN(iban) {
  iban = iban.replace(/\s+/g, '').toUpperCase();
  if (!/^[A-Z0-9]+$/.test(iban)) return false;

  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let numeric = '';

  for (let ch of rearranged) {
    numeric += isNaN(ch) ? (ch.charCodeAt(0) - 55) : ch;
  }

  let remainder = numeric;
  while (remainder.length > 2) {
    remainder = (parseInt(remainder.slice(0, 9), 10) % 97) + remainder.slice(9);
  }

  return parseInt(remainder, 10) % 97 === 1;
}

function addNotification(title, message, status = "pending") {
  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];

  notifications.unshift({
    id: Date.now(),
    title,
    message,
    status,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("notifications", JSON.stringify(notifications));
}

function renderNotifications() {
  const container = document.getElementById("notifications");
  if (!container) return;

  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];

  container.innerHTML = notifications.map(n => `
    <div style="padding:10px; border-bottom:1px solid #ddd">
      <strong>${n.title}</strong><br>
      <small>${n.message}</small><br>
      <small style="color:gray">${n.time}</small>
    </div>
  `).join("");
}


let balancevisible = false;
const REAL_BALANCE = $296744133;

function toggleBalance() {
  const el = document.getElementById("balanceAmount");

  if (!balanceVisible) {
    animateBalance(el, REAL_BALANCE);
    balanceVisible = true;
  } else {
    el.textContent = "••••••";
    balanceVisible = false;
  }
}

function animateBalance(el, amount) {
  let current = 0;
  const steps = 40;
  const increment = amount / steps;

  el.textContent = "$0.00";

  const interval = setInterval(() => {
    current += increment;
    if (current >= amount) {
      el.textContent = "$" + amount.toFixed(2);
      clearInterval(interval);
    } else {
      el.textContent = "$" + current.toFixed(2);
    }
  }, 20);
}

window.addEventListener("scroll", () => {
  document.body.style.backgroundPositionY =
    window.scrollY * 0.3 + "px";
});

let balanceisible = false;
const realBalance = "$2.967.441.33"; // later from Firestore

function requestReveal() {
  if (balanceVisible) {
    hideBalance();
    return;
  }

  const password = prompt("Enter your password to view balance");

  if (!password) return;

  // DEMO PASSWORD CHECK
  if (password === "0010") {
    revealBalance();
  } else {
    alert("Incorrect password");
  }
}

function revealBalance() {
  const balanceEl = document.getElementById("balanceAmount");
  balanceEl.classList.remove("blurred");
  balanceEl.textContent = realBalance;
  balanceVisible = true;
}

function hideBalance() {
  const balanceEl = document.getElementById("balanceAmount");
  balanceEl.classList.add("blurred");
  balanceVisible = false;
}

function seedInterestHistory() {
  if (localStorage.getItem("interestSeeded")) return;

  let history = [];
  let balance = 5000; // starting demo balance

  let start = new Date("2012-01-03");
  let end = new Date("2026-01-03");

  while (start <= end) {
    let interest = +(balance * INTEREST_RATE).toFixed(2);
    balance += interest;

    history.push({
      type: "Interest",
      amount: interest,
      date: start.toISOString().split("T")[0],
      balance: balance.toFixed(2)
    });

    start.setMonth(start.getMonth() + 1);
  }

  localStorage.setItem("transactions", JSON.stringify(history));
  localStorage.setItem("balance", balance.toFixed(2));
  localStorage.setItem("interestSeeded", "true");
}

function runMonthlyInterestEngine() {
  const today = new Date();
  const day = today.getDate();
  const monthKey = today.getFullYear() + "-" + today.getMonth();

  if (day !== 3) return;

  const lastRun = localStorage.getItem("lastInterestMonth");
  if (lastRun === monthKey) return;

  let balance = parseFloat(localStorage.getItem("balance") || "0");
  let interest = +(balance * INTEREST_RATE).toFixed(2);
  balance += interest;

  let history = JSON.parse(localStorage.getItem("transactions") || "[]");

  history.push({
    type: "Interest",
    amount: interest,
    date: today.toISOString().split("T")[0],
    balance: balance.toFixed(2)
  });

  localStorage.setItem("transactions", JSON.stringify(history));
  localStorage.setItem("balance", balance.toFixed(2));
  localStorage.setItem("lastInterestMonth", monthKey);
}

seedInterestHistory();
runMonthlyInterestEngine();
