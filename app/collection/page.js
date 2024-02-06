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

export default function Collection() {
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
        .select('id, serial, uuid, objektdata(member, season, photo, artist, text_color, bg_color, card_id)')
        .eq('user_uuid', user.id.toString())
        if (startNumber+batchSize > datas1.length) {
            endNumber = datas1.length;
        }
        var asc = false;
        var row = 'created_at'
        
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
        const { data:datas, error:errors } = await supabase
        .from('objektcollection')
        .select('id, serial, created_at, uuid, objektdata(member, season, photo, artist, text_color, bg_color, card_id, eventhost, eventhostlink)')
        .eq('user_uuid', user.id.toString())
        .order(row, { ascending: asc })
        .range(startNumber, endNumber)
    
            if (errors) {
                console.info(errors)
            }
            if (datas) {
                
                setDatas(datas)
            }}
            
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
        <small className="whitetext" style={{ margin: "auto"}}>Double press on objekt to view info.</small>
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
                <p className="whitetext"><small>Username: </small><span className="big bold">{user_name}</span></p>
                <small className="whitetext" style={{ margin: "auto"}}>Double press on objekt to view info.</small>
                <br/>
                <Suspense>
            {datas && <div style={{paddingBottom: "20px", paddingTop: "10px"}}> <FetchMoreObjekts datas={datas} userid={user.id}></FetchMoreObjekts></div>}
            </Suspense>
            {(datas && datas.length == 0) && <p className="whitetext">Wow! Looks like you have no objekts!</p>}
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