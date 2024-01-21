'use client';

import { supabase } from '@/utils/supabaseClient'
import { useRouter} from "next/navigation";
import React, { useRef, useState, useEffect } from 'react';


export default function LoginPage() {

    const navRef = useRef();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user_name, setuser_name] = useState('');
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
            setLoading(false)
        }

        getUser();
        
    }, [])
    useEffect(() => setMounted(true),[])

    const [mounted, setMounted] = useState(false);



if(!mounted) return null;

    const handleSignUp = async () => {

        const { data:datas, error:errors } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', user_name)
    console.log(datas)
    console.log(user_name)
    if (datas.length != 0) {setWarning("Username already being used"); return}
    if (user_name.replace(" ", "") == user_name == false) {setWarning("No spaces on your username"); return}
    if (email.replace(" ", "") == email == false) {setWarning("No spaces on your email"); return}
    if (password.replace(" ", "") == password == false) {setWarning("No spaces on your password"); return}
    if (user_name == '' || email == '' || password == ''){
        setWarning("No empty usernames, email, or passwords");
        return}

        const res = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {user_name: user_name},
            emailRedirectTo: `${location.origin}/auth/callback`
        }
    })
    setUser(res.data.user);
    router.refresh();
    setEmail('');
    setPassword('');
    setuser_name('');
    }
    const handleLogout = async () => {
        await supabase.auth.signOut();
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
            <h1 className="whitetext bigger">You're already logged in.</h1>
            <small className="whitetext">Check your email to make sure you're verified. Without verifying, you are more likely to be flagged as a bot and possibly banned.</small>
            <button className="button2" onClick={handleLogout}>Sign-out?</button>
            </div>
        </main>
        )}

    console.log(loading, user)
    
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
                <h1 className="text1">EMAIL:</h1>
                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input1"/>
                <br/>
                <h1 className="text1">PASSWORD:</h1>
                <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input1"/>
                <br/>
                <h1 className="text1">USERNAME:</h1>
                <h3 className="whitetext">You can not change this later (for now).</h3>
                <p className="whitetext">!! If you are signing in, no need to put the username !!.</p>
                <input type="username" name="username" value={user_name} onChange={(e) => setuser_name(e.target.value)} className="input1"/>
                <button className='button2' onClick={handleSignUp}>Sign up</button>
                <button className='button2' onClick={handleSignIn}>Sign in</button>
                <h1 className="whitetext">{warning}</h1>
            </div>
        </main>

    )
}  