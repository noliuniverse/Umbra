'use client';
import Image from 'next/image'
import { supabase } from '@/utils/supabaseClient'
import { useRouter} from "next/navigation";
import React, { useRef, useState, useEffect } from 'react';
import Objekt from "@/components/objekt.js";
import FetchMoreObjekts from '@/components/fetchObjekts.js';
import { useInView } from "react-intersection-observer";
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react';
import languagedata from "../other/languages.json";

export default function Collection() {
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


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user_name, setuser_name] = useState('');
    const [datas, setDatas] = useState(null);
    const [warning, setWarning] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const router = useRouter()
    const handleRedirect = (re) => {
        router.push(re)
      }

      const searchParams = useSearchParams()
    useEffect(() => {
        async function getUser(){
            const {data: {user}, error:errors} = await supabase.auth.getUser()
            setUser(user)

            if (user == null) {} else
            {const fetchObjekts = async () => {
                var endNumber = batchSize-1;
                var startNumber = 0;
                const { data:datas1, error:errors1 } = await supabase
        .from('objektcollection')
        .select('id, serial, uuid, created_at, objektdata(member, season, photo, artist, text_color, bg_color, card_id, eventhost, eventhostlink)')
        .eq('user_uuid', user.id.toString())
        if (startNumber+batchSize > datas1.length) {
            endNumber = datas1.length;
        }
        var asc = false;
        var row = 'created_at';
        var group = null;
        var idol = null;
        
        if (searchParams.get('sort')){
            if (searchParams.get('sort') == "oldest"){
                asc = true;
            }
        
            if (searchParams.get('sort') == "newest"){
                asc = false;
            }

            if (searchParams.get('sort') == "serial"){
                asc = true;
                row = 'serial'
        }
            
        }
        if (searchParams.get('group')){
            group = searchParams.get('group');
            
        }
        if (searchParams.get('idol')){
            idol = searchParams.get('idol');
            
        }

        
            const { data:datas, error:errors } = await supabase
        .from('objektcollection')
        .select('id, serial, created_at, uuid, objektdata(member, season, photo, artist, text_color, bg_color, card_id, eventhost, eventhostlink, type)')
        .eq('user_uuid', user.id.toString())
        .order(row, { ascending: asc })
        .range(startNumber, endNumber)
        if (group != null){
            const { data:datas2, error:errors2 } = await supabase
        .from('objektcollection')
        .select('id, serial, created_at, uuid, objektdata(member, season, photo, artist, text_color, bg_color, card_id, eventhost, eventhostlink, type)')
        .eq('user_uuid', user.id.toString())
        .order(row, { ascending: asc })
        
            var datass = Object.values(datas2).filter(item => item.objektdata.artist.includes(group));
            if (idol != null) {
                datass = Object.values(datass).filter(item => item.objektdata.member.includes(idol));
            }
            datass = datass.splice(0, 40)
            if (errors) {
                console.info(errors)
            }
            if (datas) {
                setDatas(datass)
            }
        }
        else {
            if (errors) {
                console.info(errors)
            }
            if (datas) {
                setDatas(datas)
            }
        }
        
    
            }
            
            fetchObjekts()
            
            const {data:datas, error:errors} = await supabase
            .from('profiles')
            .select('username')
            .eq("id", user.id.toString())

            setuser_name(datas[0]["username"].toString());}
            setTimeout(function(){
                setLoading(false)
            }, 50);
            
        }

        getUser();
        
        
    }, [])
    useEffect(() => setMounted(true),[])
    
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        
    }, [])


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
        <p className="whitetext"><small>Username: </small><span className="big bold"></span></p>
        <small className="whitetext" style={{ fontSize:"80%", position:"absolute", left:"10%", right:"10%", top:"22.5%"}}>{translate('doublepress')}</small>
        <br></br>
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
                <p className="whitetext"><small>{translate('username')}: </small><span className="big bold">{user_name}</span></p>
                <small className="whitetext" style={{ fontSize:"80%", position:"absolute", left:"10%", right:"10%", top:"22.5%"}}>{translate('doublepress')}</small>
                <br/>
                <Suspense>
            {datas && <div style={{paddingBottom: "20px", paddingTop: "10px"}}> <FetchMoreObjekts datas={datas} userid={user.id}></FetchMoreObjekts></div>}
            </Suspense>
            {(datas && datas.length == 0) && <p className="whitetext">{translate('donthavesaros')}</p>}
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
      <h1 className='whitetext bold'>Collection</h1>
       
            <p className='whitetext'>You need to sign in to get access to collection!</p>
            </div>
    </main>

    )
}  