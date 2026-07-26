import express from 'express';

const app = express();
app.use(express.json());

const port = process.env.APP_PORT || 8080;
const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
const openWeatherCity = process.env.OPENWEATHER_CITY || 'Colombo';

// RESEND_API_KEY is intentionally read as a plain server env var, never a
// VITE_-prefixed one — it must never reach the browser bundle.
const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'Deploy Sprint <alerts@knurdz.org>';
const alertRecipientEmail = process.env.ALERT_RECIPIENT_EMAIL || 'judges@knurdz.org';

app.get('/health', (_req, res) => {
  res.status(200).send('ok');
});

app.get('/api/weather', async (_req, res) => {
  if (!openWeatherApiKey) {
    res.status(503).json({ error: 'weather provider not configured' });
    return;
  }

  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.searchParams.set('q', openWeatherCity);
  url.searchParams.set('appid', openWeatherApiKey);
  url.searchParams.set('units', 'metric');

  try {
    const upstream = await fetch(url);
    if (!upstream.ok) {
      const body = await upstream.text();
      console.error('OpenWeather request failed', upstream.status, body);
      res.status(502).json({ error: 'weather provider request failed', upstreamStatus: upstream.status });
      return;
    }

    const data = await upstream.json();
    res.status(200).json({
      provider: 'openweather',
      city: data.name,
      temperatureC: data.main?.temp,
      conditions: data.weather?.[0]?.description,
      fetchedAt: new Date().toISOString(),
    });
  } catch {
    res.status(502).json({ error: 'weather provider request failed' });
  }
});

app.post('/api/alert', async (req, res) => {
  if (!resendApiKey) {
    res.status(503).json({ error: 'email provider not configured' });
    return;
  }

  const subject = req.body?.subject || 'Deploy Sprint alert';
  const html = req.body?.html || '<p>Deploy Sprint alert triggered.</p>';

  try {
    const upstream = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [alertRecipientEmail],
        subject,
        html,
      }),
    });

    if (!upstream.ok) {
      const body = await upstream.text();
      console.error('Resend request failed', upstream.status, body);
      res.status(502).json({ error: 'email provider request failed', upstreamStatus: upstream.status });
      return;
    }

    const data = await upstream.json();
    res.status(200).json({ provider: 'resend', id: data.id, sentAt: new Date().toISOString() });
  } catch {
    res.status(502).json({ error: 'email provider request failed' });
  }
});

app.get('/status', (_req, res) => {
  res.status(200).json({
    task: 'T07',
    team: process.env.TEAM_NAME || 'codebreak',
    commit: process.env.GITHUB_SHA || 'local-dev',
    weather: {
      provider: 'openweather',
      configured: Boolean(openWeatherApiKey),
    },
    email: {
      task: 'T16',
      provider: 'resend',
      configured: Boolean(resendApiKey),
      secretRedacted: true,
    },
  });
});

app.listen(port, () => {
  console.log(`weather API listening on port ${port}`);
});
