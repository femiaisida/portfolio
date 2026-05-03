// email-sender.js

document.addEventListener('DOMContentLoaded', () => {
  const toInput      = document.getElementById('toInput');
  const subjectInput = document.getElementById('subjectInput');
  const bodyInput    = document.getElementById('bodyInput');
  const sendBtn      = document.getElementById('sendButton');
  const statusMsg    = document.getElementById('status-msg');
  const charCount    = document.getElementById('char-count');

  // ===== Character counter =====
  bodyInput.addEventListener('input', () => {
    const n = bodyInput.value.length;
    charCount.textContent = n + ' character' + (n !== 1 ? 's' : '');
  });

  // ===== Validation =====
  function setError(msg) {
    statusMsg.textContent = msg;
    statusMsg.className   = 'status-msg error';
  }

  function setSuccess(msg) {
    statusMsg.textContent = msg;
    statusMsg.className   = 'status-msg success';
  }

  function clearStatus() {
    statusMsg.textContent = '';
    statusMsg.className   = 'status-msg';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ===== Send =====
  sendBtn.addEventListener('click', () => {
    clearStatus();

    const to      = toInput.value.trim();
    const subject = subjectInput.value.trim();
    const body    = bodyInput.value.trim();

    if (!to || !subject || !body) {
      setError('Please fill in all fields before sending.');
      return;
    }

    if (!isValidEmail(to)) {
      setError('That email address doesn\'t look right.');
      return;
    }

    sendBtn.disabled = true;
    sendBtn.querySelector('.btn-label').textContent = 'Sending…';

    emailjs.send('service_pliykwl', 'template_y206pdt', {
      to_email: to,
      subject:  subject,
      message:  body,
      reply_to: to,
    })
    .then(() => {
      setSuccess('✅ Email sent successfully!');
      toInput.value = subjectInput.value = bodyInput.value = '';
      charCount.textContent = '0 characters';
    })
    .catch(err => {
      console.error(err);
      setError('❌ Failed to send. Please try again.');
    })
    .finally(() => {
      sendBtn.disabled = false;
      sendBtn.querySelector('.btn-label').textContent = 'Send';
    });
  });
});
