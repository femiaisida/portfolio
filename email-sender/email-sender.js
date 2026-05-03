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

    // Send all common EmailJS variable names to match whatever your template uses
    emailjs.send('service_pliykwl', 'template_y206pdt', {
      to_email:  to,
      to_name:   to,
      email:     to,
      subject:   subject,
      title:     subject,
      message:   body,
      body:      body,
      reply_to:  to,
      from_name: 'Portfolio Email Sender',
    })
    .then(() => {
      setSuccess('✅ Email sent! Check your inbox (and spam).');
      toInput.value = subjectInput.value = bodyInput.value = '';
      charCount.textContent = '0 characters';
    })
    .catch(err => {
      console.error('EmailJS error:', JSON.stringify(err));
      // Give a more specific message if we can
      const detail = err?.text || err?.message || '';
      if (detail.includes('recipients')) {
        setError('❌ EmailJS blocked this recipient. Check your template settings allow dynamic To addresses.');
      } else if (detail.includes('template')) {
        setError('❌ Template error — check your EmailJS dashboard for misconfigured variables.');
      } else {
        setError('❌ Failed to send. Open the browser console for details.');
      }
    })
    .finally(() => {
      sendBtn.disabled = false;
      sendBtn.querySelector('.btn-label').textContent = 'Send';
    });
  });
});
