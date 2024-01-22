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
      <Image src="/UMBRALOGO.png" alt="Umbra" width="114" height="114" />
        <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
        <nav ref={navRef}>
        </nav>
      </header>
        <div className='div1'>
        <h1 className='whitetext bold big'>Check your email to verify your email!</h1>
        <small className='whitetext'>Without verifying, you are more likely to be flagged as a bot.</small>
        </div>
    </main>
  )
}
