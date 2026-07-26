import { useState, type FormEvent } from 'react';
import { Mail, Send } from 'lucide-react';
import { contactProvider } from '../data/contactProvider';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
const isConfigured = Boolean(accessKey);

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isConfigured) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append('access_key', accessKey!);
    formData.append('subject', 'New message from the Deploy Sprint dashboard');

    setStatus('submitting');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="panel" id="support">
      <div className="panelHeader">
        <div>
          <p className="eyebrow">Support</p>
          <h2>Contact the team</h2>
        </div>
        <span className={isConfigured ? 'providerBadge ok' : 'providerBadge off'}>
          <Mail size={14} />
          {contactProvider.provider} {isConfigured ? 'configured' : 'not configured'}
        </span>
      </div>

      {!isConfigured && (
        <p className="formNotice">
          The contact form isn't wired up to a provider yet — set the{' '}
          <code>WEB3FORMS_ACCESS_KEY</code> GitHub Secret and rebuild to enable
          submissions.
        </p>
      )}

      <form className="contactForm" onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" name="name" required disabled={!isConfigured} />
        </label>

        <label>
          Email
          <input type="email" name="email" required disabled={!isConfigured} />
        </label>

        <label>
          Message
          <textarea name="message" rows={4} required disabled={!isConfigured} />
        </label>

        <button type="submit" disabled={!isConfigured || status === 'submitting'}>
          <Send size={16} />
          {status === 'submitting' ? 'Sending…' : 'Send message'}
        </button>

        {status === 'success' && <p className="formStatus ok">Message sent — thanks!</p>}
        {status === 'error' && (
          <p className="formStatus error">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  );
}
