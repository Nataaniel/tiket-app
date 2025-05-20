// Data users
let users = [
  { email: "test@gmail.com", password: "rahasia123", tickets: [] }
];

let loggedInUser = null;

// Harga per rute
const hargaRute = {
  "Jakarta-Bandung": 150000,
  "Bandung-Jakarta": 150000,
  "Jakarta-Surabaya": 300000,
  "Bandung-Surabaya": 250000,
  "Bandung-Semarang": 200000,
  "Jakarta-Yogyakarta": 250000,
  "Yogyakarta-Jakarta": 250000,
  "Jakarta-Malang": 320000,
  "Malang-Jakarta": 320000,
  "Surabaya-Yogyakarta": 220000,
  "Yogyakarta-Surabaya": 220000,
  "Jakarta-Semarang": 230000,
  "Semarang-Jakarta": 230000,
  "Surabaya-Malang": 80000,
  "Malang-Surabaya": 80000,
  "Bandung-Yogyakarta": 240000,
  "Yogyakarta-Bandung": 240000
};

// Ambil elemen-elemen
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const bookingSection = document.getElementById("bookingSection");
const settingSection = document.getElementById("settingSection");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const btnLogin = document.getElementById("btnLogin");
const loginError = document.getElementById("loginError");
const showRegister = document.getElementById("showRegister");

const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerConfirmPassword = document.getElementById("registerConfirmPassword");
const btnRegister = document.getElementById("btnRegister");
const registerError = document.getElementById("registerError");
const registerSuccess = document.getElementById("registerSuccess");
const showLogin = document.getElementById("showLogin");

const routeSelect = document.getElementById("routeSelect");
const jumlahPenumpang = document.getElementById("jumlahPenumpang");
const btnBuy = document.getElementById("btnBuy");
const ticketInfo = document.getElementById("ticketInfo");
const ticketDetails = document.getElementById("ticketDetails");
const btnLogout = document.getElementById("btnLogout");
const btnShowSetting = document.getElementById("btnShowSetting");

const currentPassword = document.getElementById("currentPassword");
const newPassword = document.getElementById("newPassword");
const confirmNewPassword = document.getElementById("confirmNewPassword");
const btnChangePassword = document.getElementById("btnChangePassword");
const settingError = document.getElementById("settingError");
const btnBackToBooking = document.getElementById("btnBackToBooking");

// Fungsi switch section
function showSection(sectionToShow) {
  [loginSection, registerSection, bookingSection, settingSection].forEach(sec => {
    sec.classList.add("hidden");
  });
  sectionToShow.classList.remove("hidden");
  clearMessagesAndInputs();
}

// Bersihin pesan error/success dan input form
function clearMessagesAndInputs() {
  loginError.textContent = "";
  registerError.textContent = "";
  registerSuccess.textContent = "";
  settingError.textContent = "";
  settingError.style.color = "red";

  if (!loggedInUser) {
    loginEmail.value = "";
    loginPassword.value = "";
  }

  registerEmail.value = "";
  registerPassword.value = "";
  registerConfirmPassword.value = "";

  currentPassword.value = "";
  newPassword.value = "";
  confirmNewPassword.value = "";

  routeSelect.value = "";
  jumlahPenumpang.value = "1";

  ticketDetails.value = "";
  ticketInfo.classList.add("hidden");
}

// Validasi email simple
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Login
btnLogin.addEventListener("click", () => {
  const email = loginEmail.value.trim().toLowerCase();
  const pass = loginPassword.value;

  if (!email || !pass) {
    loginError.textContent = "Email dan password wajib diisi";
    return;
  }

  const user = users.find(u => u.email === email && u.password === pass);
  if (!user) {
    loginError.textContent = "Email atau password salah";
    return;
  }

  loggedInUser = user;
  showSection(bookingSection);
});

// Pindah ke register dari login
showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  showSection(registerSection);
});

// Register
btnRegister.addEventListener("click", () => {
  const email = registerEmail.value.trim().toLowerCase();
  const pass = registerPassword.value;
  const confirmPass = registerConfirmPassword.value;

  registerError.textContent = "";
  registerSuccess.textContent = "";

  if (!email || !pass || !confirmPass) {
    registerError.textContent = "Semua field wajib diisi";
    return;
  }

  if (!validateEmail(email)) {
    registerError.textContent = "Format email salah!";
    return;
  }

  if (pass !== confirmPass) {
    registerError.textContent = "Password dan konfirmasi tidak cocok";
    return;
  }

fetch("https://script.google.com/macros/s/AKfycbxyhU0QKof0y88qwg3wYYkoQEqEvEp1Fwly91osG95L3_MmWLc2k_hRoS-GCnxWA7tAUA/exec", {
  method: "POST",
  body: JSON.stringify({ email, password: pass }),
  headers: {
    "Content-Type": "application/json"
  }
})
    .then(res => res.text())
    .then(msg => {
      registerSuccess.textContent = "Registrasi berhasil!";
      registerError.textContent = "";
    })
    .catch(err => {
      registerError.textContent = "Gagal kirim ke Google Sheets.";
      registerSuccess.textContent = "";
    });
});

// Pindah ke login dari register
showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  showSection(loginSection);
});

// Pesan tiket
btnBuy.addEventListener("click", () => {
  const rute = routeSelect.value;
  const jumlah = parseInt(jumlahPenumpang.value);

  if (!rute) {
    alert("Pilih rute dulu, bro");
    return;
  }

  if (!jumlah || jumlah < 1) {
    alert("Jumlah penumpang minimal 1");
    return;
  }

  const harga = hargaRute[rute];
  if (!harga) {
    alert("Rute tidak valid");
    return;
  }

  // Tambah tiket baru sesuai jumlah yang dipesan
  for(let i=1; i<=jumlah; i++) {
    const tiketBaru = {
      passengerNumber: loggedInUser.tickets.length + 1,
      route: rute,
      price: harga
    };
    loggedInUser.tickets.push(tiketBaru);
  }

  // Tampilkan semua tiket user ini
  showTicketDetails(loggedInUser.tickets);

  // Reset input
  routeSelect.value = "";
  jumlahPenumpang.value = "1";
});

// Tampil tiket
function showTicketDetails(tickets) {
  let text = "";
  tickets.forEach(t => {
    text += `Penumpang ${t.passengerNumber}\n`;
    text += `Rute: ${t.route}\n`;
    text += `Harga: Rp${t.price.toLocaleString()}\n`;
    text += "----------------------\n";
  });

  ticketDetails.value = text;
  ticketInfo.classList.remove("hidden");
}

// Logout
btnLogout.addEventListener("click", () => {
  loggedInUser = null;
  showSection(loginSection);
});

// Setting ganti password
btnShowSetting.addEventListener("click", () => {
  showSection(settingSection);
});

btnBackToBooking.addEventListener("click", () => {
  showSection(bookingSection);
});

btnChangePassword.addEventListener("click", () => {
  const oldPass = currentPassword.value;
  const newPass = newPassword.value;
  const confirmNewPass = confirmNewPassword.value;

  if (!oldPass || !newPass || !confirmNewPass) {
    settingError.textContent = "Semua form wajib diisi";
    return;
  }

  if (oldPass !== loggedInUser.password) {
    settingError.textContent = "Kata sandi lama salah";
    return;
  }

  if (newPass !== confirmNewPass) {
    settingError.textContent = "Konfirmasi kata sandi baru tidak cocok";
    return;
  }

  loggedInUser.password = newPass;
  settingError.style.color = "green";
  settingError.textContent = "Kata sandi berhasil diganti";

  currentPassword.value = "";
  newPassword.value = "";
  confirmNewPassword.value = "";

  setTimeout(() => {
    settingError.textContent = "";
    settingError.style.color = "red";
    showSection(bookingSection);
  }, 2000);
});

// Mulai dari login section
showSection(loginSection);
