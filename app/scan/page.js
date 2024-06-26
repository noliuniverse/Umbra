"use client";
import Image from 'next/image'
import React, { useRef, useState, useEffect } from 'react';
import { useRouter} from "next/navigation";
import { QrReader } from "react-qr-reader";
import dynamic from "next/dynamic";
import ObjektModal from '@/components/ObjektModal';
import { supabase } from '@/utils/supabaseClient'
import { Noto_Kufi_Arabic } from 'next/font/google';
import Loader from '@/components/Loader';
import languagedata from "../other/languages.json";


export default function Scan() {
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

  
  // SAROS MODAl
  const [img, setimg] = useState('https://i.seadn.io/s/raw/files/42f630850aabd230c0bf508183fb4961.png?auto=format&dpr=1&w=256')
  const [theID, setTheID] = useState('309A')
  const [member, setMember] = useState('SooMin')
  const [serial, setSerial] = useState('1')
  const [color, setColor] = useState('#000000')
  const [bckcolor, setBckcolor] = useState('#FFFFFF')

  const [isModalOpen, setModalOpen] = useState(false)
  const [dataID, setData] = useState('');
  const [isRecording, setIsRecording] = useState(true)
  const [delayScan, setDelayScan] = useState(500)
  const [cameraDirection, setcameraDirection] = useState("environment")
  const router = useRouter()
  const navRef = useRef();
  const qrRef = useRef(null);
  const lastResult = useRef();
  let stateloading = 0;
    const handleRedirect = (re) => {
        router.push(re)
        router.refresh();


      }

      const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

      const handleScan = async (result, error) => {
            if (!!result) {
            var string = result?.text;
            
            const searchParams = new URLSearchParams(string.split("?")[1]);
            if (searchParams.get('i').toString() == null) {setData("Not a valid code!");} else if (string.split("?")[0] != ('https://umbra.wav.haus/saros')){setData("Not a valid code!");}
            else {
              if (lastResult.current === result.text) {
                return
              }
              if (isRecording == true){
              const searchI = searchParams.get('i');
              const { data:datas, error:errors } = await supabase
              .from('objektqrdata')
              .select('card_uuid')
              .eq('qr_id', searchI)
              .eq('used', false)

            if (datas.length == 0) {
              setData('This objekt is not valid.');
              stateloading = 0;

            } 
            else if (datas.length == 1) {
              var uuid = datas[0]["card_uuid"];
              setData('Checking... DO NOT CLOSE YOUR BROWSER NOR POWER OFF YOUR DEVICE OR YOU MAY LOSE YOUR CARD.');
              setDelayScan(false);
              setIsRecording(false);
              const { data:datas2, error:errors2 } = await supabase
              .from('objektdata')
              .select()
              .eq('uuid', uuid)
              const { data:collection, error:errors3 } = await supabase
              .from('objektcollection')
              .select()
              .eq('uuid', uuid)
              // OBJEKT MODAL
              setimg(datas2[0]["photo"])
              setTheID(datas2[0]["card_id"])
              setMember(datas2[0]["member"])
              setColor(datas2[0]["text_color"])
              setBckcolor(datas2[0]["bg_color"])
              setSerial(collection.length+1)

              const { error4 } = await supabase
              .from('objektqrdata')
              .update({ used: true })
              .eq('qr_id', searchI)
              .eq('used', false)
              const { data:alrthere, error:errors4 } = await supabase
              .from('objektcollection')
              .select()
              .eq('uuid', parseInt(uuid))
              .eq('serial', collection.length+1)
              if (alrthere.length > 0) {} else {const { data, error } = await supabase.from('objektcollection').insert({ uuid: parseInt(uuid), serial: parseInt(collection.length+1), user_uuid: user.id.toString(), user_minted:user.id.toString()})}
              const { data:alrthere2, error:errors42 } = await supabase
              .from('objektcollection')
              .select()
              .eq('uuid', parseInt(uuid))
              .eq('serial', collection.length+1)
              if (alrthere2.length > 1) {} else {const { data, error } = await supabase.from('objektcollection').delete().eq("user_uuid", user.id.toString()).eq("uuid", parseInt(uuid)).eq("serial", parseInt(collection.length+1))}
              setData('')
              setModalOpen(true)
              

              
              
              
              
            }}

            

            }}
        

            if (!!error) {
              //console.info("llll");
            }
        }

  useEffect(() => {
    async function getUser(){
        const {data: {user}} = await supabase.auth.getUser()
        setUser(user)
        setLoading(false)
    }
    
    getUser();
    
}, [])

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

if (user) { return (
  <main >
    <header className="navbarheader">
    <Image src="/UMBRALOGO.png" alt="Umbra" width="90" height="90" priority={true}  />
      <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
      <button className='headerbutton' onClick={() => handleRedirect("/login")}>Login</button>
      <button className='headerbutton' onClick={() => handleRedirect("/scan")}>Scan</button>
      <button className='headerbutton' onClick={() => handleRedirect("/collection")}>Collection</button>
      <nav ref={navRef}>
      </nav>
    </header>

    <div className="div1" style={{paddingBottom:"20px"}}>
    <h1 className='whitetext bold'>{translate('scan')}</h1>
    <small className='whitetext'>{translate('placeyour')}</small>
    { isRecording && <div className='qrreader' style={{margin: "auto"}}>
     <QrReader
              
              onResult={(result, error) => {
                if (result){
                  if (stateloading == 0) {
                    stateloading = 0;
                  setTimeout(() => {
                    stateloading++
                    if (stateloading == 1) {
                      handleScan(result, error);
                    }
                  }, 1000);
                  }
                }
              }}
              constraints={{ facingMode: cameraDirection }}
              style={{ width: "40%", height: "40%", margin: "auto"}}
              ref={qrRef}
              scanDelay={delayScan}

            />
    
     <button className='button2 sc' onClick={(e) => {setcameraDirection("user")}}>Front</button>
     <button className='button2 sc' onClick={(e) => {setcameraDirection("environment")}}>Rear</button>
     </div>}
          <p className='whitetext'>{dataID.toString()}</p>
          {isModalOpen && <ObjektModal img={img} id={theID} member={member} serial={serial} color={color} bckcolor={bckcolor}/>}
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
      <h1 className='whitetext bold'>{translate('scan')}</h1>
       
            <p className='whitetext'>You need to sign in to get access to scanning!</p>
            </div>
    </main>
  )
}
