// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDIlf6nPnM4EhW1Cel2lN4--m62S-qAQyM",
  authDomain: "purifyappfinal.firebaseapp.com",
  projectId: "purifyappfinal",
  storageBucket: "purifyappfinal.firebasestorage.app",
  messagingSenderId: "573837864154",
  appId: "1:573837864154:web:15c1e15c56045b6d5889e3",
  measurementId: "G-JJMYJRCB5R"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar Firebase Cloud Messaging
const messaging = firebase.messaging();

// Manipular mensagens em background
messaging.onBackgroundMessage((payload) => {
  console.log('Mensagem em background recebida:', payload);
  
  const notificationTitle = payload.notification?.title || 'Purify';
  const notificationOptions = {
    body: payload.notification?.body || 'Nova notificação!',
    icon: '/placeholder-logo.png',
    badge: '/placeholder-logo.png',
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/placeholder-logo.png'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manipular cliques nas notificações
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    // Abrir ou focar na janela do app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Se já tem uma janela aberta, focar nela
          for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          // Senão, abrir nova janela
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
}); 