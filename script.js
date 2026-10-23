// Fitness With Om - Final Working Code
const TELEGRAM_BOT_TOKEN = "8989347720:AAHEMDbWMiBt3kcWSTuJouWvwBOVumhN-kA";
const TELEGRAM_CHAT_ID = "7948483152";

async function sendToTelegram(name, phone, email, message = "") {
  const text = `🔥 NEW LEAD - FitnessWithOm

👤 Name: ${name}
📞 Phone: ${phone}
📧 Email: ${email}
💬 Message: ${message}

Time: ${new Date().toLocaleString()}`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text
      })
    });
    const data = await response.json();
    console.log("Telegram Response:", data);
    if (data.ok) {
      alert("Form Submitted Successfully! ✅");
      return true;
    } else {
      alert("Error: " + data.description);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to send. Check console.");
    return false;
  }
}

// Ye wala function tumhare form se connect hoga
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form"); // tumhara form
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const name = form.querySelector('input[name="name"]')?.value || form.querySelector('#name')?.value || "N/A";
      const phone = form.querySelector('input[name="phone"]')?.value || form.querySelector('#phone')?.value || "N/A";
      const email = form.querySelector('input[name="email"]')?.value || form.querySelector('#email')?.value || "N/A";
      const msg = form.querySelector('textarea')?.value || "";

      // Button loading
      const btn = form.querySelector('button[type="submit"]');
      const oldText = btn ? btn.innerText : "";
      if(btn) btn.innerText = "Sending...";

      await sendToTelegram(name, phone, email, msg);
      
      if(btn) btn.innerText = oldText;
      form.reset();
    });
  }
});