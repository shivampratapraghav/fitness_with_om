const MY_DETAILS = {
  whatsappNumber: "919084897757", 
  email: "c32054764@gmail.com",
  instagram: "@fitness_with_yo",
  instagramLink: "https://www.instagram.com/fitness_with_yo"
};

let currentUser = JSON.parse(localStorage.getItem('fitnessUser')) || null;

window.addEventListener('DOMContentLoaded', () => {
  // Contact details bharo
  const emailEl = document.getElementById('emailText');
  if(emailEl) emailEl.innerText = MY_DETAILS.email;
  const wpEl = document.getElementById('whatsappText');
  if(wpEl) wpEl.innerText = "+" + MY_DETAILS.whatsappNumber;
  const instaTextEl = document.getElementById('instaText');
  if(instaTextEl) instaTextEl.innerText = MY_DETAILS.instagram;
  const instaLinkEl = document.getElementById('instaLink');
  if(instaLinkEl) instaLinkEl.href = MY_DETAILS.instagramLink;

  // Login check
  if(!currentUser) {
    document.getElementById('loginModal').classList.add('show');
  }

  document.getElementById('sendOtpBtn').addEventListener('click', () => {
    const mobile = document.getElementById('userMobile').value;
    const email = document.getElementById('userEmail').value;
    if(!mobile || !email) { alert('Mobile aur Email dono dalo'); return; }
    document.getElementById('loginStatus').innerText = `OTP sent! Demo OTP: 1234`;
    document.getElementById('otpSection').style.display = 'block';
  });

  document.getElementById('verifyOtpBtn').addEventListener('click', () => {
    const otp = document.getElementById('otpInput').value;
    if(otp === '1234') {
      currentUser = {
        mobile: document.getElementById('userMobile').value,
        email: document.getElementById('userEmail').value
      };
      localStorage.setItem('fitnessUser', JSON.stringify(currentUser));
      document.getElementById('loginModal').classList.remove('show');
      alert('Login Success! Ab aap plan kharid sakte ho');
    } else { alert('Galat OTP, 1234 dalo'); }
  });
});

// PDF Download Function
function downloadPDF(filename) {
  const link = document.createElement('a');
  link.href = filename;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

let selectedPdfFile = '';
let selectedPlanName = '';

function orderNow(plan) {
  if(!currentUser) {
    document.getElementById('loginModal').classList.add('show');
    return;
  }

  let amount = 0;
  if(plan === 'weightloss') { selectedPdfFile = 'weightloss.pdf'; selectedPlanName = 'Weight Loss Plan'; amount = 99; }
  if(plan === 'musclegain') { selectedPdfFile = 'musclegain.pdf'; selectedPlanName = 'Muscle Gain Plan'; amount = 99; }
  if(plan === 'combo') { selectedPdfFile = 'combo.pdf'; selectedPlanName = 'Combo Plan'; amount = 149; }

  const UPI_ID = "9084897757@ptyes";
  const MERCHANT_NAME = "FitnessWithOm";
  
  // UPI Link banao
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${MERCHANT_NAME}&am=${amount}&cu=INR&tn=${selectedPlanName}`;
  
  // QR Code banao
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;
  
  document.getElementById('upiPlanName').innerText = `${selectedPlanName} - Rs ${amount}`;
  document.getElementById('upiQR').src = qrApi;
  document.getElementById('upiPayBtn').href = upiLink;
  document.getElementById('upiModal').style.display = 'flex';
}

function verifyAndDownload() {
  const utr = document.getElementById('utrInput').value;
  if(!utr || utr.length < 6) {
    alert("Sahi UTR / Transaction No. dalo, jo payment ke baad dikhta hai");
    return;
  }

  // PDF Download
  const link = document.createElement('a');
  link.href = selectedPdfFile;
  link.download = selectedPdfFile;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  alert(`Payment Verify Ho Gaya! 🎉\n${selectedPlanName} download ho gaya!`);
  
  // Tujhe WhatsApp par notification
  const msg = `NEW SALE! %0APlan: ${selectedPlanName}%0AAmount: Rs 99%0AUser Email: ${currentUser.email}%0AMobile: ${currentUser.mobile}%0AUTR: ${utr}%0APDF: ${selectedPdfFile}`;
  window.open(`https://wa.me/${MY_DETAILS.whatsappNumber}?text=${msg}`, '_blank');
  
  document.getElementById('upiModal').style.display = 'none';
  document.getElementById('utrInput').value = '';
}