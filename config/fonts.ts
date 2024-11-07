import { Poppins } from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  style: "normal",
  weight: ["300", "400", "700"],
  variable: "--font-poppins",
});
