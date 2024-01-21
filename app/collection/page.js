'use client';

import { supabase } from '@/utils/supabaseClient'
import { useRouter} from "next/navigation";
import React, { useRef, useState, useEffect } from 'react';
import Objekt from "@/components/objekt.js";


export default function Collection() {

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


    useEffect(() => {
        async function getUser(){
            const {data: {user}} = await supabase.auth.getUser()
            setUser(user)

            const fetchObjekts = async () => {

                const { data:datas, error:errors } = await supabase
                .from('objektcollection')
                .select('id, serial, uuid, objektdata(member, season, photo, artist, text_color, bg_color, card_id)')
                .eq('user_uuid', user.id.toString())
    
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

            setuser_name(datas[0]["username"].toString());
        
            setLoading(false)
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

    if (user) {return (
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
            <div className="div1">
                <p className="whitetext"><small>Username: </small><span className="big bold">{user_name}</span></p>
                <br/>
            {datas && <div className="objektgrid">
            {datas.map((item,index)=>{return <Objekt className="grid-objekt" unique={index} key={index} member={item["objektdata"]["member"]} season={item["objektdata"]["season"]} bckcolor={item["objektdata"]["bg_color"]} color={item["objektdata"]["text_color"]} id={item["objektdata"]["card_id"]} serial={item["serial"]} img={item["objektdata"]["photo"]} uuid={item["objektdata"]["id"]}/>
})}
                                </div>}
            {(datas && datas.length == 0) && <p className="whitetext">Wow! Looks like you have no objekts!</p>}
            <button className="button2">XXXX</button>
            <p>{user.id.toString()}</p>
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

      <div className="div1">
      <h1 className='whitetext bold'>Collection</h1>
       
            <p className='whitetext'>You need to sign in to get access to collection!</p>
            </div>
    </main>

    )
}  