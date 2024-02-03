'use client';
import Image from 'next/image'
import { supabase } from '@/utils/supabaseClient'
import { useRouter} from "next/navigation";
import React, { useRef, useState, useEffect } from 'react';
import Objekt from "@/components/objekt.js";
import FetchMoreObjekts from '@/components/fetchObjekts.js';
import ObjektGrid from '@/components/ObjektGrid';
import { useInView } from "react-intersection-observer";
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react';
import localFont from '@next/font/local'

const HalvarBreitMd = localFont({src: "../font/HalvarBreit-Md.ttf"})

export default function Objekts() {
    const batchSize = 40;
    const navRef = useRef();
    const pathname = 'objekt'; // URLHERE.COM/pathname

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userid, setUserID] = useState(null);
    const [param, setParam] =  useState(false)

    const [datas, setDatas] = useState(null);
    const [mounted, setMounted] = useState(false);
    const searchParams = useSearchParams()

    const router = useRouter()

    const handleObjekts = (urlparam) => {
        
       window.location.href = window.location.href.split('/' + pathname)[0] + '/' + pathname + '?' + 'host=' + urlparam
       
        
    }
    
    const handleRedirect = (re) => {
        router.push(re)
      }

    useEffect(() => {
        async function getUser(){
            const {data: {user}, error:errors} = await supabase.auth.getUser()
            if (searchParams.get('host')){
                setUserID(searchParams.get('host'))
            }
            if (searchParams.get('host')){
                const fetchObjekts = async () => {
                    var endNumber = batchSize-1;
                    var startNumber = 0;
                    const { data:datas1, error:errors1 } = await supabase
            .from('objektdata')
            .select('member')
            .eq('eventhost', searchParams.get('host').toString())
            if (startNumber+batchSize > datas1.length) {
                endNumber = datas1.length;
            }
         
            var asc = false;
            if (searchParams.get('sort')){
                if (searchParams.get('sort') == "oldest"){
                    asc = true;
                }
                if (searchParams.get('sort') == "newest"){
                    asc = false;
                }
                
            }
            
            const { data:datas, error:errors } = await supabase
            .from('objektdata')
            .select('member, season, photo, artist, text_color, bg_color, card_id, eventhost, eventhostlink')
            .eq('eventhost', searchParams.get('host').toString())
            .order('uuid', { ascending: asc })
            .range(startNumber, endNumber)
        
                if (errors) {
                    console.info(errors)
                }
                if (datas) {
                    
                    setDatas(datas)
                }}
                fetchObjekts();
                   
            }
            setUser(user)
            setLoading(false)
        }

        getUser();
        
        
    }, [])
    useEffect(() => setMounted(true),[])
    
    



if(!mounted) return null;


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
        <div className='objektgrid'>
        {Array.from({length: 20}).map((item,index)=>{return <div className='objekt-skeleton' key={index}/>})}
        </div>
        </div>
    </main>
    )}

    if (user) {return (
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
            <div className="div1" style={{paddingBottom: "10px"}}>
                <font style={HalvarBreitMd.style} className='whitetext'><h1>Event Objekts:</h1></font>
                <div className='scrolling-div'>
                    <div className='scrolling-div-child' onClick={() => {handleObjekts('tripleS+PH')}}>
                        <img src='tripleSPHLogo.png' style={{width: "100px"}}></img>
                        <p className="whitetext" >tripleS Philippines</p>
                    </div>
                    <div className='scrolling-div-child'>
                        <img src='WAVer_INAlogo.png' style={{width: "100px"}}></img>
                        <p className="whitetext" >WAVer_INA</p>
                    </div>
                </div>
                <div style={{marginBottom: "10px", marginTop: "10px"}}>
                    <Suspense>
                {(datas) && <div style={{paddingBottom: "20px"}}> <ObjektGrid datas={datas} userid={userid} searchParams={searchParams}></ObjektGrid></div>}
                </Suspense>
                {(datas && userid && datas.length == 0) && <p className="whitetext">Wow! Looks like the event host has no objekts!</p>}
                </div>
                
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

      <div className="div1">
      <h1 className='whitetext bold'>Objekts</h1>
       
            
        </div>
    </main>

    )
}  