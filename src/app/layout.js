import Head from 'next/head'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Flowmint - Advertisements on Flow',
  description: 'Flowmint platform is an revolutionary approach for advertising and self-expression using NFTs.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Flowmint - Advertisements on Flow</title>
        <meta
          name="description"
          content="Flowmint platform is an revolutionary approach for advertising and self-expression using NFTs"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/fav.png" />
      </Head>

      <body className={inter.className}>{children}</body>
    </html>
  )
}
