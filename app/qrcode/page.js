"use client";
import Image from 'next/image'
import React, { useRef, useState, useEffect } from 'react';
import { useRouter} from "next/navigation";
import { useQRCode } from 'next-qrcode';
import { saveAs } from 'file-saver';
import { v4 } from 'uuid';
import { supabase } from '@/utils/supabaseClient'
import html2canvas from 'html2canvas';

import dynamic from "next/dynamic";
import { Noto_Kufi_Arabic } from 'next/font/google';


export default function QR() {

  const [data, setData] = useState('No result');
  const { Canvas } = useQRCode();
  const printRef = React.useRef();

  const router = useRouter()
  const navRef = useRef();
  const [user, setUser] = useState(null);
  const [a, setA] = useState('');
  const [imagesrc, setImageSRC] = useState('')
  const [errormessage, setError] = useState(null)
  const [aQ, setAQ] = useState('');

  const [loading, setLoading] = useState(true);
  const handleDownloadImage = async () => {
    try {const element = printRef.current;
        const canvas = await html2canvas(element, { letterRendering: 1, useCORS:true, allowTaint     : true, onrendered     : function (canvas) {                 } });
    
        const data = canvas.toDataURL('image/png');
        const link = document.createElement('a');
    
        if (typeof link.download === 'string') {
          link.href = data;
          link.download = 'image.png';
    
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          window.open(data);
        }} catch (e) {console.info(e)}
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

      const handleGenerate = async () => {
        const { data:datas, error:errors } = await supabase
        .from('objektdata')
        .select()
        .eq('uuid', a)
        if (datas == null) {
            setError('This objekt is not valid.');
          } 
        else if (datas.length == 0) {
            setError('This objekt is not valid.');
          } 
          else if (datas.length == 1) {
            var loop = true;
            var theUU = '';
            while (loop == true) {
                var newUU = v4();
            const { data:datas2, error:errors2 } = await supabase
            .from('objektqrdata')
            .select()
            .eq('qr_id', newUU)
            if (datas2.length == 0) {
                loop = false;
                theUU = newUU;
            }
            }
            const { data, error } = await supabase.from('objektqrdata').insert({ card_uuid: a, qr_id: theUU.toString()})
            setAQ("https://umbra-two.vercel.app/objekt?i=" +theUU.toString())
            setError(null)
            handleDownloadImage();
            console.log("Downloaded!")



          }
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
      <h1 className="whitetext bigger">Loading...</h1>
      </div>
  </main>
  )}
      if (user && user.id.toString() == 'a0fc8a77-ac16-448f-8045-1a14edfd2d1d') { return (
        <main>
      <header className="navbarheader">
      <Image src="/UMBRALOGO.png" alt="Umbra" width="90" height="90" priority={true}  />
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
        <p className='whitetext'>PUT ID. (EX. 4)</p>
        <input type="username" name="qrname" value={a} onChange={(e) => setA(e.target.value)} className="input1"/>
        <button id="thisbutton" className='button2' onClick={handleGenerate}>Generate</button>
        
        {aQ && <div ref={printRef}><div style={{width: "60%", margin:"auto", marginTop: "30px", marginBottom:"40px"}}> 
            <Canvas style={{margin: "0px"}} 
    logo={{src: "URLCODEUMBRA.png", options: {width:"104"}}}
      text={aQ}
      options={{
        errorCorrectionLevel: 'M',
        margin: 3,
        scale: 5,
        width: 400,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }}
    /><p className='whitetext'>{imagesrc.toString()}</p></div></div>}
        {errormessage && <p className='whitetext'>{errormessage}</p>}
        
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
        <nav ref={navRef}>
        </nav>
      </header>
        <div className='div1' style={{width: "90%"}}>
        <h1 className='whitetext bold big' style={{color: "rgb(127, 86, 201)"}}>Welcome to UMBRA!</h1>
        <p className='whitetext'>UMBRA is a fan-made cosmo client where people can collect custom objekts made by other fans. Ways of getting them include cupsleeve events, tripleS fan meetups, and etc! Sign up using the login button above!</p>
        </div>
    </main>
  )
}
