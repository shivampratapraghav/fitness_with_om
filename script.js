// ===== CONFIG =====
const MY_DETAILS = {
  whatsappNumber: "919084897757",
  upiId: "9084897757@ptyes",
  name: "FitnessWithOm"
};

let currentUser = { mobile: "", email: "no-email" };
let selectedPlanName = "";
let selectedPdfFile = "";
const BOT_TOKEN = "8989347720:AAEz4jJqVqVJqVq..."; // tera token
const CHAT_ID = "7708999014";

function getCurrentPrice(plan) { return 1; }

function sendToTelegramLead(name, phone, email, msg) {
  let text = `🔥 NEW LEAD\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nMsg: ${msg}`;
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}`);
}

// ===== ORDER NOW =====
function orderNow(plan) {
  let mobileInput = document.getElementById('userMobile');
  if(mobileInput) currentUser.mobile = mobileInput.value || "9568000000";
  
  selectedPlanName = plan;
  if(plan === "musclegain") selectedPdfFile = "MuscleGain.pdf";
  else if(plan === "fatloss") selectedPdfFile = "FatLoss.pdf";
  else selectedPdfFile = "Combo.pdf";

  let amount = getCurrentPrice(plan);

  // 1. CLICK KA MESSAGE (ye already kaam kar raha hai)
  try{ 
    sendToTelegramLead(currentUser.mobile, currentUser.mobile, currentUser.email, `Clicked: ${plan} Rs:${amount}`); 
  }catch(e){}

  // QR Generate
  let upiLink = `upi://pay?pa=${MY_DETAILS.upiId}&pn=${MY_DETAILS.name}&am=${amount}&cu=INR`;
  document.getElementById('qrImage').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
  document.getElementById('upiModal').style.display = 'flex';
}

// ===== VERIFY & DOWNLOAD - PURA NAYA CODE =====
function verifyAndDownload() {
  const utrInput = document.getElementById('utrInput');
  const utr = utrInput.value.trim();

  // Strict Check: 12 digit number hi real UTR hota hai
  if(!/^[0-9]{12}$/.test(utr)){
    alert("❌ Sahi 12 digit ka UTR dalo. UPI App me 'Transaction ID / UTR' pe milta hai.\nExample: 412345678901");
    return;
  }

  // Fake UTR rokna
  if(/^(\d)\1+$/.test(utr)){
    alert("❌ Fake UTR mat dalo, real UTR dalo");
    return;
  }

  // Ek UTR ek baar
  let usedUTRs = JSON.parse(localStorage.getItem('usedUTRs') || '[]');
  if(usedUTRs.includes(utr)){
    alert("❌ Ye UTR pehle use ho chuka hai");
    return;
  }
  usedUTRs.push(utr);
  localStorage.setItem('usedUTRs', JSON.stringify(usedUTRs));

  // 2. PAYMENT KA MESSAGE - YAHI NAYA HAI - AB UTR TELEGRAM PE AYEGA
  try{ 
    sendToTelegramLead(currentUser.mobile, currentUser.mobile, currentUser.email || "no-email", `💰 PAYMENT DONE! UTR: ${utr} Plan: ${selectedPlanName}`); 
  }catch(e){}

  // PDF Download
  const link = document.createElement('a');
  link.href = selectedPdfFile;
  link.download = selectedPdfFile;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  alert(`✅ UTR Verified! ${selectedPlanName} download ho gaya`);
  document.getElementById('upiModal').style.display = 'none';
  
  // WhatsApp pe bhi UTR bhej
  window.open(`https://wa.me/${MY_DETAILS.whatsappNumber}?text=PAYMENT+RECEIVED%0APlan:+${selectedPlanName}%0AUser:+${currentUser.mobile}%0AUTR:+${utr}`, '_blank');
}

function closeUpiModal(){
  document.getElementById('upiModal').style.display = 'none';
}