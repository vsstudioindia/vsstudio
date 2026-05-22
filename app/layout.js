import './globals.css';

export const metadata = {
  title: 'VS Studio — Luxury Wedding Photography',
  description: 'Luxury destination wedding photographers. Vrinda & Shristi | Canon Wizards | 11yrs+',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
