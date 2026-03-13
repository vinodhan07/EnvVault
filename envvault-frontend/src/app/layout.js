import { AuthProvider } from '@/context/AuthContext';
import { EnvironmentProvider } from '@/context/EnvironmentContext';
import './globals.css';

export const metadata = {
  title: 'EnvVault: Secure Area',
  description: 'Developer dashboard to manage environment variables securely',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AuthProvider>
          <EnvironmentProvider>
            {children}
          </EnvironmentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
