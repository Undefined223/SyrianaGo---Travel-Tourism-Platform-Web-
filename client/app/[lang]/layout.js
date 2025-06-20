'use client';

import { usePathname } from 'next/navigation';
import Navbar from "../components/home/Navbar";


export default function LangLayout({ children }) {
  const pathname = usePathname();
  const shouldShowNavbar = !pathname.includes('/dashboard');

  return (
    <>
      {shouldShowNavbar && <Navbar />}

      {children}

 
    </>
  );
}
