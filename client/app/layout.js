
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <LanguageProvider>
          <UserProvider>

            <header className="p-4 border-b">
            </header>
            <main>{children}</main>
          </UserProvider>

        </LanguageProvider>
      </body>
    </html>
  );
}