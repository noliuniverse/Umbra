"use client";
import Image from 'next/image'
import React, { useRef, useState, useEffect } from 'react';
import { useRouter} from "next/navigation";
import { supabase } from '@/utils/supabaseClient'

import dynamic from "next/dynamic";
import { Noto_Kufi_Arabic } from 'next/font/google';


export default function Home() {

  
  const [data, setData] = useState('No result');
  
  const router = useRouter()
  const navRef = useRef();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser(){
        const {data: {user}} = await supabase.auth.getUser()
        setUser(user)
        setLoading(false)
    }
    
    getUser();
    
}, [])
    const handleRedirect = (re) => {
        router.push(re)
      }

if (loading) {return (
  <main>
          <header className="navbarheader">
      <img src='https://i.imgur.com/I3ouDmc.png'  className='logo'/>
      <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
      <button className='headerbutton' onClick={() => handleRedirect("/login")}>Login</button>
      <button className='headerbutton' onClick={() => handleRedirect("/scan")}>Scan</button>
      <nav ref={navRef}>
      </nav>
    </header>
      <div className="div1">
      <h1 className="whitetext bigger">Loading...</h1>
      </div>
  </main>
  )}
      if (user) { return (
        <main>
      <header className="navbarheader">
        <img src='https://i.imgur.com/I3ouDmc.png'  className='logo'/>
        <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
        <button className='headerbutton' onClick={() => handleRedirect("/login")}>Login</button>
        <button className='headerbutton' onClick={() => handleRedirect("/scan")}>Scan</button>
        <button className='headerbutton' onClick={() => handleRedirect("/collection")}>Collection</button>
        <nav ref={navRef}>
        </nav>
      </header>
      <div className='div1'>
      <h1 className='whitetext bold big' style={{color: "rgb(127, 86, 201)"}}>Welcome to UMBRA!</h1>
        <p className='whitetext'>UMBRA is a fan-made cosmo client where people can collect custom objekts made by other fans. Ways of getting them include cupsleeve events, tripleS fan meetups, and etc! Sign up using the login button above!</p>

        </div>
      </main>
      )}
  return (
    <main>
      <header className="navbarheader">
        <img src='https://i.imgur.com/I3ouDmc.png'  className='logo'/>
        <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
        <button className='headerbutton' onClick={() => handleRedirect("/login")}>Login</button>
        <button className='headerbutton' onClick={() => handleRedirect("/scan")}>Scan</button>
        <nav ref={navRef}>
        </nav>
      </header>
        <div className='div1' style={{width: "90%"}}>
        <h1 className='whitetext bold big' style={{color: "rgb(127, 86, 201)"}}>Welcome to UMBRA!</h1>
        <p className='whitetext' style={{margin: "auto"}}>UMBRA is a fan-made cosmo client where people can collect custom objekts made by other fans. Ways of getting them include cupsleeve events, tripleS fan meetups, and etc! Sign up using the login button above!</p>
        </div>
    </main>
  )
}
