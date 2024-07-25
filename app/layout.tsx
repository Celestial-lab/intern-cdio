
import { Inter } from "next/font/google";
import "@/app/globals.css";


const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body>
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}