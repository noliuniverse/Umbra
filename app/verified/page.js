"use client";
import Image from 'next/image'
import React, { useRef, useState, useEffect } from 'react';
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
        <img src='https://i.imgur.com/I3ouDmc.png'  className='logo'/>
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
