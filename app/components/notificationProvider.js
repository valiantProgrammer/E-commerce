'use client';

// This is the implementation of the NotificationProvider
// You should import this in your root layout.js file
// and wrap your children with it.

import { NotificationProvider as Provider } from './Notification';

export default function NotificationProvider({ children }) {
  return <Provider>{children}</Provider>;
}

/*
  --- How to use it in app/layout.js ---

  import NotificationProvider from '../components/NotificationProvider';

  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </body>
      </html>
    );
  }
*/
