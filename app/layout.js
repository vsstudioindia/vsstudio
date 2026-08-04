import './globals.css';

export const metadata = {
  title: 'VS Studio — Luxury Wedding Photography & Films',
  description: 'Immersive visual narratives for the world\'s most discerning couples. Fashion-forward. Emotionally luxurious. Cinematic.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'VS Studio — Luxury Wedding Photography & Films',
    description: 'Immersive visual narratives for the world\'s most discerning couples.',
    url: 'https://pitch.vsstudio.in',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
      }
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
