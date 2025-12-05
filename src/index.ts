import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { getEnvVariable } from './utils/helpers';
import cookieParser from 'cookie-parser';
import webpush from 'web-push';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
connectDB();

// Middlewares
app.use(
  cors({
    origin: [getEnvVariable('FRONT_END_URL')],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// In-memory subscriptions (replace with DB in production)
let subscriptions: any[] = [];

// Use VAPID keys from environment variables
const publicKey = getEnvVariable('VAPID_PUBLIC_KEY');
const privateKey = getEnvVariable('VAPID_PRIVATE_KEY');

webpush.setVapidDetails('mailto:sonavbinu567@gmail.com', publicKey, privateKey);

// Save subscription
app.post('/subscribe', (req, res) => {
  const subscription = req.body.subscription;
  subscriptions.push(subscription);
  res.status(201).json({ message: 'Subscribed' });
});

// Send notification to all
app.post('/send', async (req, res) => {
  const payload = JSON.stringify({
    title: 'New video alert!',
    body: 'Check out our latest video on Youtube!',
  });

  const results = await Promise.allSettled(
    subscriptions.map(subscriber =>
      webpush.sendNotification(subscriber, payload)
    )
  );

  console.log('Notification results:', results);
  res.json({ message: 'Notifications sent', results });
});

// Root
app.get('/', (_req, res) => {
  res.send('Hai there, API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
