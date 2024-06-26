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
import localFont from "next/font/local"
import hostsdata from "../other/eventhosts.json";
import languagedata from "../other/languages.json";
import Loader from '@/components/Loader';

const HalvarBreitMd = localFont({src: "../other/HalvarBreit-Md.ttf"})

export default function Objekts() {
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
      var returnStr = transcript[languageABR][str] ? transcript[languageABR][str] : transcript["en"][str];
      if (returnStr == null) {
          returnStr = "808 Error : Words not found";
      }
      return returnStr 
  }
  // other code
    
    const batchSize = 40;
    const navRef = useRef();
    const pathname = 'saros'; // URLHERE.COM/pathname
    const [pageloading, setPageLoading] = useState(false)
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userid, setUserID] = useState(null);
    const [datas, setDatas] = useState(null);
    const [mounted, setMounted] = useState(false);
    const searchParams = useSearchParams()

    const router = useRouter()

    let hosts = hostsdata["hosts"];
    const { hostlist } = hosts;
    
    

    const handleObjekts = (urlparam) => {
        setPageLoading(true)
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
            setPageLoading(false)
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
            <div className="div1" style={{paddingBottom: "10px"}}>
            {pageloading == true && <l-grid size="120" speed="1.5" color="white" ></l-grid>}
                {pageloading == false && <div>
                    <font style={HalvarBreitMd.style} className='whitetext'><h1>{translate('eventcards2')}:</h1></font>
                    <small className='whitetext'>{translate('whichcard')}</small>
                <div className='scrolling-div'>
                    {hostlist.map((item, index) => {
                        return (
                            <div key={index} className='scrolling-div-child' onClick={() => {handleObjekts(item['eventhostname'].toString().replace(/ /g,"+"))}}>
                            <img src={item['logo']} style={{width: "80px"}}></img>
                            <p >{item['name']}</p>
                        </div>
                        );
                    })}
                </div>
                {userid && <h1 className='whitetext bold bigel'>{userid}</h1>}
                <div style={{marginBottom: "10px", marginTop: "10px"}}>
                    <Suspense>
                {(datas) && <div style={{paddingBottom: "20px"}}> <ObjektGrid datas={datas} userid={userid} searchParams={searchParams}></ObjektGrid></div>}
                </Suspense>
                {(datas && userid && datas.length == 0) && <p className="whitetext">{translate('hostdonthavesaros')}</p>}
                </div></div>}
                
            </div>
        </main>
    );
}  