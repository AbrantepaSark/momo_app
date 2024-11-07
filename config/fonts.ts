import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";
import { Poppins } from "next/font/google";

// export const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

// export const fontMono = FontMono({
//   subsets: ["latin"],
//   variable: "--font-mono",
// });

export const poppins = Poppins({
  subsets: ["latin"],
  style: "normal",
  weight: ["300", "400", "700"],
  variable: "--font-poppins",
});
