"use client";
import Image from 'next/image'
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useRouter} from "next/navigation";
import { supabase } from '@/utils/supabaseClient'

import dynamic from "next/dynamic";
import { Noto_Kufi_Arabic } from 'next/font/google';


export default function Verified() {
  const navRef = useRef();
  const router = useRouter();
  const handleRedirect = (re) => {
    router.push(re)
  }

  return (
    <main>
      <header className="navbarheader">
      <Image src="/UMBRALOGO.png" alt="Umbra" width="90" height="90" priority={true}  />
        <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
        <nav ref={navRef}>
        </nav>
      </header>
        <div className='div1'>
        <h1 className='whitetext bold big'>You are verified!</h1>
        <small className='whitetext'>Click the home button to go back home!</small>
        </div>
    </main>
  )
}
