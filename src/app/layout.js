import localFont from "next/font/local";
import { Bruno_Ace, Lufga, ABeeZee } from "next/font/google";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const brunoAce = Bruno_Ace({
  subsets: ["latin"],
  weight: "400", // Adjust weight according to available options
  variable: "--font-bruno-ace",
});

// const lufga = Lufga({
//   subsets: ["latin"],
//   weight: ["400", "500"], // Adjust weight according to available options
//   variable: "--font-lufga",
// });

const abeeZee = ABeeZee({
  subsets: ["latin"],
  weight: "400", // Adjust weight according to available options
  variable: "--font-abeezee",
});


export const metadata = {
  title: "Goal OS",
  description: "Goal OS",  
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">      
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${brunoAce.variable} ${abeeZee.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
