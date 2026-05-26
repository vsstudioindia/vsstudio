import './globals.css';

export const metadata = {
  title: 'VS Studio — Luxury Wedding Photography',
  description: 'Luxury destination wedding photographers. Vrinda & Shristi | Canon Wizards | 11yrs+',
  icons: {
    icon: 'https://res.cloudinary.com/drn6x6hbd/image/upload/v1779744741/logo_reverse.png',
    apple: 'https://res.cloudinary.com/drn6x6hbd/image/upload/v1779744741/logo_reverse.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
