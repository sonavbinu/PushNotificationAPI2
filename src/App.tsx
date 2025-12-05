import React from 'react';
import axios from 'axios';
import './App.css';

const publicKey =
  'BG__oonpKACSldsSpQdCcQHrTzDiFQsoHw2kj3JJPW6CeZKS-TLoVJ8F1q2AmUzdpUgnjlFIbPxx9G7vGjAXHBA';

const subscribeUser = async () => {
  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register('/sw.js');

    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    // Send subscription to backend
    await axios.post('http://localhost:3000/subscribe', { subscription });

    alert('Subscribed Successfully!');
  } catch (err) {
    console.error('Subscription failed:', err);
    alert('Failed to subscribe');
  }
};

const sendNotification = async () => {
  try {
    await axios.post('http://localhost:3000/send');
    alert('Notification sent successfully');
  } catch (err) {
    console.error('Notification failed:', err);
    alert('Failed to send notification');
  }
};

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const App = () => {
  return (
    <div className="button">
      <button onClick={subscribeUser}>Subscribe</button>
      <button onClick={sendNotification}>Send Notification</button>
    </div>
  );
};

export default App;
