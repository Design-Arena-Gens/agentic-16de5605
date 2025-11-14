import './globals.css';

export const metadata = {
  title: 'LDAP – Lightweight Directory Access Protocol',
  description: 'Präsentation über Grundlagen, Nutzen und Funktionsweise von LDAP.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
