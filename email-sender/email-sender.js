// email-sender.js
// NOTE: EmailJS free tier does not allow dynamic To addresses.
// All emails go to your account's registered address. The recipient
// is included in the message body instead.

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

  // ===== Status helpers =====
  function setError(msg)   { statusMsg.textContent = msg; statusMsg.className = 'status-msg error'; }
  function setSuccess(msg) { statusMsg.textContent = msg; statusMsg.className = 'status-msg success'; }
  function clearStatus()   { statusMsg.textContent = '';  statusMsg.className = 'status-msg'; }

  function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  // ===== Send =====
  sendBtn.addEventListener('click', () => {
    clearStatus();

    const to      = toInput.value.trim();
    const subject = subjectInput.value.trim();
    const body    = bodyInput.value.trim();

    if (!to || !subject || !body) { setError('Please fill in all fields before sending.'); return; }
    if (!isValidEmail(to))        { setError("That email address doesn't look right."); return; }

    sendBtn.disabled = true;
    sendBtn.querySelector('.btn-label').textContent = 'Sending…';

    // EmailJS free tier blocks dynamic recipients (causes 422).
    // We pass only {{message}} and {{reply_to}} — matching your template exactly.
    // The intended "To" is included in the message text.
    emailjs.send('service_pliykwl', 'template_y206pdt', {
      message:  `To: ${to}\nSubject: ${subject}\n\n${body}`,
      reply_to: to,
    })
    .then(() => {
      setSuccess('✅ Email sent!');
      toInput.value = subjectInput.value = bodyInput.value = '';
      charCount.textContent = '0 characters';
    })
    .catch(() => {
      setError('❌ Failed to send. Please try again.');
    });
  });
});
