const MY_DETAILS = {
  whatsappNumber: "919084897757", 
  email: "c32054764@gmail.com",
  instagram: "@fitness_with_yo",
  instagramLink: "https://www.instagram.com/fitness_with_yo"
};

// ===== OFFER SETTING - YAHI SE PRICE CONTROL HOGA =====
const OFFER_CONFIG = {
  startDate: "2026-10-23", // Aaj se start - 23 Oct 2026
  offerDays: 15,           // 15 din tak Rs 1
  offerPrice: 1,           // Offer price
  normalPrice: 99,         // Normal price 15 din ke baad
  comboOfferPrice: 1,      // Combo ka offer
  comboNormalPrice: 149    // Combo normal
};

function getCurrentPrice(planType) {
  const start = new Date(OFFER_CONFIG.startDate);
  const today = new Date();
  const diffTime = today - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= OFFER_CONFIG.offerDays) {
    // Offer chal raha hai
    if (planType === 'combo') return OFFER_CONFIG.comboOfferPrice;
    return OFFER_CONFIG.offerPrice;
  } else {
    // Offer khatam
    if (planType === 'combo') return OFFER_CONFIG.comboNormalPrice;
    return OFFER_CONFIG.normalPrice;
  }
}

let currentUser = JSON.parse(localStorage.getItem('fitnessUser')) || null;
let selectedPdfFile = '';
let selectedPlanName = '';

function updateNav(){
  const myProfileLink = document.getElementById('myProfileLink');
  const logoutLink = document.getElementById('logoutLink');
  if(!myProfileLink || !logoutLink) return;
  if(currentUser){
    myProfileLink.textContent = 'Hi, ' + (currentUser.email.split('@')[0] || 'User');
    logoutLink.style.display = 'inline-block';
  } else {
    myProfileLink.textContent = 'My Profile';
    logoutLink.style.display = 'none';
  }
}

function updatePricesOnPage(){
  const price1 = getCurrentPrice('weightloss');
  const price2 = getCurrentPrice('musclegain');
  const priceCombo = getCurrentPrice('combo');
  
  // Diet plan prices update
  if(document.getElementById('price-weightloss')) document.getElementById('price-weightloss').innerHTML = `Rs ${price1} <span>Rs 499</span>`;
  if(document.getElementById('price-musclegain')) document.getElementById('price-musclegain').innerHTML = `Rs ${price2} <span>Rs 499</span>`;
  if(document.getElementById('price-combo')) document.getElementById('price-combo').innerHTML = `Rs ${priceCombo} <span>Rs 999</span>`;
  
  // Button text update
  if(document.getElementById('btn-weightloss')) document.getElementById('btn-weightloss').innerText = `Order Now @ Rs ${price1}`;
  if(document.getElementById('btn-musclegain')) document.getElementById('btn-musclegain').innerText = `Order Now @ Rs ${price2}`;
  if(document.getElementById('btn-combo')) document.getElementById('btn-combo').innerText = `Get Combo @ Rs ${priceCombo}`;
  
  // Offer badge
  const start = new Date(OFFER_CONFIG.startDate);
  const today = new Date();
  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const daysLeft = OFFER_CONFIG.offerDays - diffDays;
  
  const badges = document.querySelectorAll('.offer-days-left');
  badges.forEach(badge => {
    if(daysLeft >= 0){
      badge.style.display = 'block';
      badge.innerText = `🔥 ONLY Rs ${price1} FOR ${daysLeft} DAYS LEFT!`;
    } else {
      badge.style.display = 'none';
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('emailText').innerText = MY_DETAILS.email;
  document.getElementById('whatsappText').innerText = "+" + MY_DETAILS.whatsappNumber;
  document.getElementById('instaText').innerText = MY_DETAILS.instagram;
  document.getElementById('instaLink').href = MY_DETAILS.instagramLink;
  updateNav();
  updatePricesOnPage();
  if(!currentUser) document.getElementById('loginModal').classList.add('show');

  document.getElementById('myProfileLink').addEventListener('click', (e)=>{
    e.preventDefault();
    if(!currentUser) document.getElementById('loginModal').classList.add('show');
    else alert(`My Profile\nEmail: ${currentUser.email}\nMobile: ${currentUser.mobile}`);
  });
  document.getElementById('logoutLink').addEventListener('click', (e)=>{
    e.preventDefault();
    localStorage.removeItem('fitnessUser');
    currentUser = null;
    updateNav();
    alert('Logged out!');
    document.getElementById('loginModal').classList.add('show');
  });
  document.getElementById('sendOtpBtn').addEventListener('click', () => {
    const mobile = document.getElementById('userMobile').value;
    const email = document.getElementById('userEmail').value;
    if(!mobile || !email) { alert('Mobile aur Email dono dalo'); return; }
    document.getElementById('loginStatus').innerText = `OTP sent! Demo OTP: 1234`;
    document.getElementById('otpSection').style.display = 'block';
  });
  document.getElementById('verifyOtpBtn').addEventListener('click', () => {
    if(document.getElementById('otpInput').value === '1234') {
      currentUser = { mobile: document.getElementById('userMobile').value, email: document.getElementById('userEmail').value };
      localStorage.setItem('fitnessUser', JSON.stringify(currentUser));
      document.getElementById('loginModal').classList.remove('show');
      updateNav();
      alert('Login Success!');
    } else alert('Galat OTP, 1234 dalo');
  });
});

function orderNow(plan) {
  if(!currentUser) { document.getElementById('loginModal').classList.add('show'); return; }
  let amount = getCurrentPrice(plan);
  try{ sendToTelegramLead(currentUser.mobile, currentUser.mobile, currentUser.email, "Clicked: "+plan+" Rs:"+amount); }catch(e){}
  if(plan === 'weightloss') { selectedPdfFile = './weightloss.pdf'; selectedPlanName = 'Weight Loss Plan'; }
  if(plan === 'musclegain') { selectedPdfFile = './musclegain.pdf'; selectedPlanName = 'Muscle Gain Plan'; }
  if(plan === 'combo') { selectedPdfFile = './combo.pdf'; selectedPlanName = 'Combo Plan'; }
  const UPI_ID = "9084897757@ptyes";
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=FitnessWithOm&am=${amount}&cu=INR&tn=${selectedPlanName}`;
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;
  document.getElementById('upiPlanName').innerText = `${selectedPlanName} - Rs ${amount}`;
  document.getElementById('upiQR').src = qrApi;
  document.getElementById('upiPayBtn').href = upiLink;
  document.getElementById('upiModal').style.display = 'flex';
}
function verifyAndDownload() {
  const utr = document.getElementById('utrInput').value.trim();

  // Real UTR = 12 digit number
  if (!/^[0-9]{12}$/.test(utr)) {
    alert("Please enter valid UTR No.");
    return;
  }

  if (/^(\d)\1{11}$/.test(utr)) {
    alert("Please enter valid UTR No.");
    return;
  }

  // Fake dobara use rokna
  let usedUTRs = JSON.parse(localStorage.getItem('usedUTRs') || '[]');
  if (usedUTRs.includes(utr)) {
    alert("This UTR already used!");
    return;
  }
  usedUTRs.push(utr);
  localStorage.setItem('usedUTRs', JSON.stringify(usedUTRs));

  try { 
    sendToTelegramLead(currentUser.mobile, currentUser.mobile, currentUser.email || "no-email", "💰 REAL PAYMENT! UTR: " + utr + " Plan: " + selectedPlanName); 
  } catch(e){}

  const link = document.createElement('a');
  link.href = selectedPdfFile;
  link.download = selectedPdfFile;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  alert(`Payment Verify! ${selectedPlanName} download ho gaya!`);
  document.getElementById('upiModal').style.display = 'none';
}
// Telegram Integration
const TELEGRAM_BOT_TOKEN = "8989347720:AAHEMDbWMiBt3kcWSTuJouWvwBOVumhN-kA";
const TELEGRAM_CHAT_ID = "7948483152";
async function sendToTelegramLead(name, phone, email, msg="") {
  const text = `🔥 NEW LEAD\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nMsg: ${msg}`;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({chat_id: TELEGRAM_CHAT_ID, text: text})
    });
  } catch(e){}
}