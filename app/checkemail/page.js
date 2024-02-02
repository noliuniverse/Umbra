"use client";
import Image from 'next/image'
import React, { useRef, useState, useEffect } from 'react';
import { useRouter} from "next/navigation";
import { supabase } from '@/utils/supabaseClient'

import dynamic from "next/dynamic";
import { Noto_Kufi_Arabic } from 'next/font/google';


export default function CheckEmail() {
  const navRef = useRef();
  const router = useRouter();

  const handleRedirect = (re) => {
    router.push(re)
  }


  return (
    <main>
      <header className="navbarheader">
      <Image src="/UMBRALOGO.png" alt="Umbra" width="90" height="90" priority={false}  />
        <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
        <nav ref={navRef}>
        </nav>
      </header>
        <div className='div1'>
        <h1 className='whitetext bold big'>Please check your email to verify your account!</h1>
        <small className='whitetext'>Without verifying, you will not be able to sign in to UMBRA and use the software.</small>
        </div>
    </main>
  )
}
