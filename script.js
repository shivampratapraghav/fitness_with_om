let selectedPdfFile = '';
let selectedPlanName = '';
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

const MY_DETAILS = {
  whatsappNumber: "919084897757"
};

function getCurrentPrice(plan) {
  return 1; // Rs 1 offer - baad me change kar sakta hai
}

window.addEventListener('DOMContentLoaded', () => {
  // Login check
  if(currentUser){
    const loginBtn = document.getElementById('loginBtn');
    if(loginBtn) loginBtn.innerText = currentUser.mobile;
  }
});

function orderNow(plan) {
  if(!currentUser) { 
    document.getElementById('loginModal').classList.add('show'); 
    return; 
  }
  let amount = getCurrentPrice(plan);
  
  // Telegram pe lead bhejo - Order Clicked
  if(typeof sendToTelegramLead === 'function'){
    sendToTelegramLead(currentUser.mobile, currentUser.mobile, currentUser.email || 'no-email', "Plan: " + plan + " | Amount: Rs " + amount + " | Clicked Order Now");
  }

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
  const utr = document.getElementById('utrInput').value;
  if(!utr || utr.length < 6) { alert("Sahi UTR dalo"); return; }

  // Telegram pe UTR bhejo - Payment Done
  if(typeof sendToTelegramLead === 'function'){
    sendToTelegramLead(currentUser.mobile, currentUser.mobile, currentUser.email || 'no-email', "PAYMENT DONE! Plan: " + selectedPlanName + " | UTR: " + utr + " | File: " + selectedPdfFile);
  }

  const link = document.createElement('a'); link.href = selectedPdfFile; link.download = selectedPdfFile;
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
  alert(`Payment Verify! ${selectedPlanName} download ho gaya`);
  window.open(`https://wa.me/${MY_DETAILS.whatsappNumber}?text=NEW SALE! Plan: ${selectedPlanName} User: ${currentUser.mobile} UTR: ${utr}`);
  document.getElementById('upiModal').style.display = 'none';
}

// Close modal helper (agar tere me pehle se hai to ye duplicate hata dena)
function closeUpiModal(){ document.getElementById('upiModal').style.display = 'none'; }
function closeLoginModal(){ document.getElementById('loginModal').classList.remove('show'); }

// Telegram Integration - Added
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
  } catch(e){ console.log(e); }
}