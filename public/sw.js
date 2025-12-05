self.addEventListener('push', event => {
  if (!event.data) {
    console.log('Push event but no data');
    return;
  }

  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/bell.png', // optional icon
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://www.youtube.com/') // or your app URL
  );
});
