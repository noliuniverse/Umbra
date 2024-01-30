"use client";
import Image from 'next/image'
import React, { useRef, useState, useEffect } from 'react';
import { useRouter} from "next/navigation";
import { supabase } from '@/utils/supabaseClient'
import dynamic from "next/dynamic";
import styles from "@/app/Bootstrap.module.css"
import styles2 from '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Noto_Kufi_Arabic } from 'next/font/google';
import itemsdata from "../json/Items.json";
import { Carousel } from "react-bootstrap";
import localFont from "next/font/local"

const ParaboleDisplay = localFont({src: "../fonts/Parabole-DisplayRegular.otf"})
const ParaboleRegular = localFont({src: "../fonts/Parabole-TextRegular.otf"})

export default function Home() {
  let items = itemsdata["items"];
  const [data, setData] = useState('No result');
  
  const router = useRouter()
  const navRef = useRef();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const INTERVAL_VAL = 2000;

  const { bootstrap } = items;
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };


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
          <Image src="/UMBRALOGO.png" alt="Umbra" width="90" height="90" priority={false}  />
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
      <Image src="/UMBRALOGO.png" alt="Umbra" width="90" height="90" priority={false}  />
        <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
        <button className='headerbutton' onClick={() => handleRedirect("/login")}>Login</button>
        <button className='headerbutton' onClick={() => handleRedirect("/scan")}>Scan</button>
        <button className='headerbutton' onClick={() => handleRedirect("/collection")}>Collection</button>
        <nav ref={navRef}>
        </nav>
      </header>
      <div className='div1' style={{paddingBottom:"10px"}}>
      <div className='carousel'>
      <Carousel activeIndex={index} onSelect={handleSelect}>
          {bootstrap.map((item, index) => (
            <Carousel.Item key={item.id} className={styles.itemP} interval={INTERVAL_VAL}>
              <img src={item.imageUrl} alt="slides" />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <h1 className='whitetext bold big' style={{color: "white"}}><span style={ParaboleDisplay.style}><span style={ParaboleRegular.style}>Wel</span>co<span style={ParaboleRegular.style}>m</span>e <span style={ParaboleRegular.style}>to</span> </span><span style={ParaboleDisplay.style}>U<span style={ParaboleRegular.style}>M</span>B<span style={ParaboleRegular.style}>R</span>A!</span></h1>
      <div style={{width:"90%", margin:"30px"}}>
       <p className='whitetext' style={{padding: "10px", margin: "3%"}}>UMBRA is a fan-made cosmo client where people can collect custom objekts made by other fans. Ways of getting them include cupsleeve events, tripleS fan meetups, and etc! Sign up using the login button above!</p>
        <br></br>
        <p className='whitetext'>If you want to include an objekt of yours in UMBRA, contact @wavnoil on twitter.</p>
       </div>
        <a href="https://forms.gle/rjVYADMtUKjqCqDJA" style={{width: "40%", minWidth: "150px", textAlign: "center"}} className='button2'><u>Bug/Suggestion</u></a>
        </div>
      </main>
      )}
  return (
    <main>
      <header className="navbarheader">
      <Image src="/UMBRALOGO.png" alt="Umbra" width="90" height="90" priority={false}  />
        <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
        <button className='headerbutton' onClick={() => handleRedirect("/login")}>Login</button>
        <button className='headerbutton' onClick={() => handleRedirect("/scan")}>Scan</button>
        <nav ref={navRef}>
        </nav>
      </header>
        <div className='div1' style={{width: "100%", marginBottom: "10px"}}>
        <div className='carousel'>
      <Carousel activeIndex={index} onSelect={handleSelect}>
          {bootstrap.map((item) => (
            <Carousel.Item key={item.id} className={styles.itemP} interval={INTERVAL_VAL}>
              <img src={item.imageUrl} alt="slides" />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
        <h1 className='whitetext bold big' style={{color: "white"}}><span style={ParaboleDisplay.style}><span style={ParaboleRegular.style}>Wel</span>co<span style={ParaboleRegular.style}>m</span>e <span style={ParaboleRegular.style}>to</span> </span><span style={ParaboleDisplay.style}>U<span style={ParaboleRegular.style}>M</span>B<span style={ParaboleRegular.style}>R</span>A!</span></h1>
       <div style={{width:"90%", margin:"auto"}}>
       <p className='whitetext' style={{padding: "10px", margin: "3%"}}>UMBRA is a fan-made cosmo client where people can collect custom objekts made by other fans. Ways of getting them include cupsleeve events, tripleS fan meetups, and etc! Sign up using the login button above!</p>
        <br></br>
        <p className='whitetext'>If you want to include an objekt of yours in UMBRA, contact @wavnoil on twitter.</p>
       </div>
        <a href="https://forms.gle/rjVYADMtUKjqCqDJA" style={{width: "40%", minWidth: "150px", textAlign: "center"}} className='button2'><u>Bug/Suggestion</u></a>
        </div>
    </main>
  )
}
