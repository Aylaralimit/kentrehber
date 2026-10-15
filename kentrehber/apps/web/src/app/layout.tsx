import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { themeVariables } from '@kentrehber/config/theme';
import { ThemeProvider } from '@kentrehber/ui/ThemeProvider';
import { Toast } from '@kentrehber/ui/Toast';
import { getVerticalTheme } from '@/lib/theme';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: { default: 'KentRehber — Dijital katalog', template: '%s | KentRehber' },
  description: 'Seçili işletmeler ve koleksiyonlar için görsel katalog.',
  robots: { index: false, follow: false },
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getVerticalTheme();
  return (
    <html
      lang="tr"
      style={themeVariables(theme) as CSSProperties}
      data-density={theme.cardDensity}
      data-hero={theme.heroStyle}
    >
      <body>
        <ThemeProvider theme={theme}>
          <a
            href="#icerik"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4"
          >
            İçeriğe geç
          </a>
          <Header />
          <main id="icerik" className="min-h-[70dvh]">
            {children}
          </main>
          <Footer />
          <Toast />
        </ThemeProvider>
      </body>
    </html>
  );
}
