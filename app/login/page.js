'use client';
import Image from 'next/image'

import { supabase } from '@/utils/supabaseClient'
import { useRouter} from "next/navigation";
import React, { useRef, useState, useEffect } from 'react';


export default function LoginPage() {

    const navRef = useRef();
    const dropdown = useRef()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user_name, setuser_name] = useState('');
    const [warning, setWarning] = useState('');
    const [user, setUser] = useState(null);
    const [signIn, setSignIn] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dropdownEnabled, setDropdownEnabled] = useState(false);
    const router = useRouter()
    const handleRedirect = (re) => {
        router.push(re)
      }



    useEffect(() => {
        async function getUser(){
            const {data: {user}} = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }

        getUser();
        
    }, [])
    useEffect(() => setMounted(true),[])
    useEffect(() => {
        if (!dropdownEnabled) return;
        function handleClick(event) {
          if (dropdown.current && !dropdown.current.contains(event.target)) {
            setDropdownEnabled(false);
          }
        }
        document.addEventListener("click", handleClick);
        // clean up
        return () => document.removeEventListener("click", handleClick);
      }, [dropdownEnabled]);

    const [mounted, setMounted] = useState(false);



if(!mounted) return null;

    const handleSignUp = async () => {

        const { data:datas, error:errors } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', user_name)

    if (datas.length != 0) {setWarning("Username already being used"); return}
    if (user_name.replace(" ", "") == user_name == false) {setWarning("No spaces on your username"); return}
    if (user_name.length > 16) {setWarning("Username has to be shorter than 16 characters."); return}
    if (password.length <= 6) {setWarning("Password has to be longer than 6 characters."); return}
    if (email.replace(" ", "") == email == false) {setWarning("No spaces on your email"); return}
    if (password.replace(" ", "") == password == false) {setWarning("No spaces on your password"); return}
    if (user_name == '' || email == '' || password == ''){
        setWarning("No empty usernames, email, or passwords");
        return}
        setLoading(true)
        const res = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {user_name: user_name},
            emailRedirectTo: `${location.origin}/verified`
        }
        })
        //auth/callback
        setPassword('');
        setEmail('');
        setuser_name('');
        router.push("/checkemail")
        router.refresh();
        
        
    
    }
    const handleLogout = async () => {
        const options = {
            scope: "local"
        }
        await supabase.auth.signOut(options);
        router.refresh();
        setUser(null);
    }

    const handleSignIn = async () => {
        const res = await supabase.auth.signInWithPassword({
            email,
            password
        })
        router.refresh();
        setUser(res.data.user);
        setEmail('');
        setPassword('');
        setuser_name('');
    }

    if (loading) {return (
    <main>
            <header className="navbarheader">
            <Image src="/UMBRALOGO.png" alt="Umbra" width="90" height="90" priority={true} />
        <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
        <button className='headerbutton' onClick={() => handleRedirect("/login")}>Login</button>
        <button className='headerbutton' onClick={() => handleRedirect("/scan")}>Scan</button>
        <nav ref={navRef}>
        </nav>
      </header>
        <div className="div1">
        <div className="lds-dual-ring"></div>
        </div>
    </main>
    )}

    if (user) {return (
        <main>
                <header className="navbarheader">
                <Image src="/UMBRALOGO.png" alt="Umbra" width="90" height="90" priority={true}/>
                <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
                <button className='headerbutton' onClick={() => handleRedirect("/login")}>Login</button>
                <button className='headerbutton' onClick={() => handleRedirect("/scan")}>Scan</button>
                <button className='headerbutton' onClick={() => handleRedirect("/collection")}>Collection</button>

                <nav ref={navRef}>
                </nav>
            </header>
            <div className="div1">
            <h1 className="whitetext bigger">You're already logged in.</h1>
            <small className="whitetext">Check your email to make sure you're verified. Without verifying, you are more likely to be flagged as a bot and possibly banned.</small>
            <button className="button2" onClick={handleLogout}>Sign-out?</button>
            </div>
        </main>
        )}

    
    return (

        <main>
        <header className="navbarheader">
        <Image src="/UMBRALOGO.png" alt="Umbra" width="90" height="90" priority={true} />
        <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
        <button className='headerbutton' onClick={() => handleRedirect("/login")}>Login</button>
        <button className='headerbutton' onClick={() => handleRedirect("/scan")}>Scan</button>

        <nav ref={navRef}>
        </nav>
      </header>
            <div className="div1">
            <div className="dropdown">
                <span className='whitetext' style={{background: "rgb(78,38,151)",background: "linear-gradient(90deg, rgba(78,38,151,1) 0%, rgba(0,0,0,1) 35%, rgba(41,28,66,1) 100%)", padding: "10px", borderRadius:"100px", margin:"auto", cursor: "pointer"}} onClick={() => {setDropdownEnabled(!dropdownEnabled)}}><b>Press here to login OR sign up.</b></span>
                {dropdownEnabled && <div className="dropdown-content" id="dropdownmenu" ref={dropdown}>
                <button className='button2' style={{width:"100%"}} onClick={() => {setSignIn(false); setDropdownEnabled(false)}}>Sign-up</button>
                <button className='button2' style={{width:"100%"}} onClick={() => {setSignIn(true); setDropdownEnabled(false)}}>Login</button>
                </div>}
                </div>
                {(signIn == false) && <div style={{marginTop:"5%"}}><h1 className="text1">EMAIL:</h1>
                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input1"/>
                <br/>
                <h1 className="text1">PASSWORD:</h1>
                <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input1"/>
                <br/>
                <h1 className="text1">USERNAME:</h1>
                <h3 className="whitetext">You can not change this later (for now).</h3>
                <input type="username" name="username" value={user_name} onChange={(e) => setuser_name(e.target.value)} className="input1"/>
                <button className='button2' onClick={handleSignUp}>Sign up</button>
                </div>}
                {(signIn == true) && <div style={{marginTop:"5%"}}><h1 className="text1">EMAIL:</h1>
                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input1"/>
                <br/>
                <h1 className="text1">PASSWORD:</h1>
                <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input1"/>
                <br/>
                <button className='button2' onClick={handleSignIn}>Login</button></div>}
                <h1 className="whitetext">{warning}</h1>
            </div>
        </main>

    )
}  