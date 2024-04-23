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
import hostsdata from "./other/eventhosts.json";
import languagedata from "./other/languages.json";
import Loader from '@/components/Loader';




const ParaboleDisplay = localFont({src: "../fonts/Parabole-DisplayRegular.otf"})
const ParaboleRegular = localFont({src: "../fonts/Parabole-TextRegular.otf"})

// {translate('trade')}
export default function Home() {
  // language set-up

  
  let transcript = languagedata["langs"];
  const validLangs = languagedata["validLangs"];
  const [languageABR, setLanguageABR] = useState("en")
  useEffect(()=>{
    if (localStorage.getItem("umbraLang") == null) {
      localStorage.setItem("umbraLang", "en");
      var langabr = "en";
    } else {
      var langabr = localStorage.getItem("umbraLang");
    }
    //console.log(validLangs)
    if (validLangs.includes(langabr) == true) {
      setLanguageABR(langabr);
      localStorage.setItem("umbraLang", langabr.toString());
    } else {
      setLanguageABR("en");
      localStorage.setItem("umbraLang", "en");
    }
    
    
  }, [])
  const translate = (str) => {
    return transcript[languageABR][str] ? transcript[languageABR][str] : transcript["en"][str]
  }
  const changeLanguage = (str) => {
    if (validLangs.includes(str.toString()) == true) {
      setLanguageABR(str);
      localStorage.setItem("umbraLang", str.toString());
    } else {
      setLanguageABR("en");
      localStorage.setItem("umbraLang", "en");
    }
  }
  // other code
  
  

  
  let items = itemsdata["items"];
  const { bootstrap } = items;
  let hosts = hostsdata["hosts"];
  const { hostlist } = hosts;

  const [data, setData] = useState('No result');
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const router = useRouter()
  const navRef = useRef();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const INTERVAL_VAL = 2000;

  
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
          <Image src="/UMBRALOGO.png" alt="Umbra" width="90" height="90" priority={true}  />
      <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
      <button className='headerbutton' onClick={() => handleRedirect("/login")}>Login</button>
      <button className='headerbutton' onClick={() => handleRedirect("/scan")}>Scan</button>
      <nav ref={navRef}>
      </nav>
    </header>
      <div className="div1">
      <Loader></Loader>
      </div>
  </main>
  )}
      
  return (
    <main>
      <header className="navbarheader">
      <Image src="/UMBRALOGO.png" alt="Umbra" width="90" height="90" priority={true}  />
        <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
        <button className='headerbutton' onClick={() => handleRedirect("/login")}>Login</button>
        <button className='headerbutton' onClick={() => handleRedirect("/scan")}>Scan</button>
        {user &&  <button className='headerbutton' onClick={() => handleRedirect("/collection")}>Collection</button>}
        <nav ref={navRef}>
        </nav>
      </header>
        <div className='div1' style={{width: "100%", marginBottom: "10px"}}>
          <p className='whitetext'>{translate('clicktofind')}</p>
        <a href="https://twitter.com/UMBRAcosmos/status/1782172827241623616" target="_blank"  style={{width: "100%", minWidth: "150px", textAlign: "center", marginBottom:"10px", textDecoration:"none", background:"#f2ebff", color:"black", borderRadius:"0px"}} className='button2'>{translate('trade-open')}</a>
        <div className='carousel'>
      <Carousel activeIndex={index} onSelect={handleSelect}>
          {bootstrap.map((item) => (
            <Carousel.Item key={item.id} className={styles.itemP} interval={INTERVAL_VAL}>
              <img src={item.imageUrl} alt="slides" />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <h1 className='whitetext big' style={{color: "white", fontWeight: "0px",letterSpacing:"-1px"}}><span style={ParaboleDisplay.style}><span style={ParaboleRegular.style}>Wel</span>co<span style={ParaboleRegular.style}>m</span>e <span style={ParaboleRegular.style}>to</span> </span><span style={ParaboleDisplay.style}>U<span style={ParaboleRegular.style}>M</span>B<span style={ParaboleRegular.style}>R</span>A!</span></h1>
      <div style={{width:"90%", margin:"auto"}}>
       <p className='whitetext' style={{padding: "10px", margin: "3%"}}>{translate('umbra-is1')}</p>
        <br></br>
        <p className='whitetext'>{translate('include1p1')} <a target="_blank"  href='https://twitter.com/UMBRAcosmos'>@UMBRAcosmos</a> {translate('include1p2')}</p>
       </div>

        <a href="https://forms.gle/rjVYADMtUKjqCqDJA" target="_blank"  style={{width: "40%", minWidth: "150px", textAlign: "center"}} className='button2'><u>{translate('bugsug')}</u></a>
        <h1 className='whitetext' style={{marginTop:"20px"}}>{translate('partnerh')}</h1>
        <button className='button2' style={{width: "40%", width:"fit-content",  minWidth: "200px", textAlign: "center", fontSize:"100%"}}  onClick={() => handleRedirect("/saros")}>{translate('eventcards')}</button>
        <div className='partners whitetext' style={{margin:"auto", marginTop:"10px"}}>
        {hostlist.map((item, index) => {
                        return <a key={index} href={item["twtlink"]} target="_blank" className='partner'>
                        <img src={item["logo"]} style={{display: "block", width: "100px", margin: "auto"}}></img>
                        <p>
                        {item["display_name"]}</p>
                        </a>
                    })}
        
        
        </div>
        <hr style={{color:"white", marginTop:"10px"}}></hr>
        <div className='footer'>
          <button className='button2' onClick={()=>{setSettingsOpen(!settingsOpen)}} style={{margin:"auto"}}>Settings</button>
          {settingsOpen && <div className='settings'>
            <p>{translate('language')}</p>
            <div className='langGrid'>
              <button className='button3' onClick={()=>{changeLanguage("en")}}>🇺🇸 English</button>
              <button className='button3' onClick={()=>{changeLanguage("pt-br")}}>🇧🇷 Português</button>
            </div>
            <br></br>
            <p>English: <a target="_blank"  href='https://twitter.com/UMBRAcosmos'><u>@UMBRAcosmos</u></a></p>
            <p>Português: <a target="_blank"  href='https://twitter.com/bbangkyos'><u>@bbangkyos</u></a></p>
            </div>}
          
          
        </div>
        </div>
    </main>
  )
}
