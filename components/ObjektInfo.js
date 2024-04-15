
import styles from "@/app/globals.css"
import localFont from "next/font/local"
import { use, useEffect, useState } from "react";
import { supabase } from '@/utils/supabaseClient'
import { useRouter} from "next/navigation";
import Image from 'next/image'
import Objekt from "./objekt";
import Loader from "./Loader";
const dotMat = localFont({src: "../fonts/dotmat.ttf"})
const helveticaNeueBold = localFont({src: "../fonts/helvetica-neue-bold.ttf"})
const halavrBreitRg = localFont({src: "../fonts/HalvarBreit-Rg copy 2.ttf"})

export default function ObjektInfo( { id, serial, userid }) {
   
    const router = useRouter()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFlipped, setFlipped] = useState(false);
    const [tradingScreen, setTradingScreen] = useState(false);
    const [sendUser, setSendUser] = useState('');
    const [userMap, setuserMap] = useState([]);
    const [userLoading, setuserLoading] = useState(false);
    const [user, setuser] = useState('');
    const [done, setdone] = useState(false);

    
    const newShade = (hexColor, magnitude) => {
        hexColor = hexColor.replace(`#`, ``);
        if (hexColor.length === 6) {
            const decimalColor = parseInt(hexColor, 16);
            let r = (decimalColor >> 16) + magnitude;
            r > 255 && (r = 255);
            r < 0 && (r = 0);
            let g = (decimalColor & 0x0000ff) + magnitude;
            g > 255 && (g = 255);
            g < 0 && (g = 0);
            let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
            b > 255 && (b = 255);
            b < 0 && (b = 0);
            return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
        } else {
            return hexColor;
        }
    };
    const newerShade = (hexcode) => {
        if (newShade(hexcode, -20) == '#0') {
            return newShade(hexcode, 20)
        } else {
            return newShade(hexcode, -20)
        }
    }
    

const newestShade = (hexcode) => {
    let theShade = ''
    let secondvar = hexcode;
if (secondvar.substring(0, 15) == 'linear-gradient') {
    let howMany = 0;
    theShade += 'linear-gradient('
    var newStr = secondvar.substring(16, secondvar.length-1)
    var splStr = newStr.split(',')
    for (let index = 0; index < splStr.length; index++) {
        const element = splStr[index];
        if (element.substring(0,1) == "#") {
            howMany++;
            theShade += newerShade(element) + ','
            if (howMany == 2) {
                break
            }
        } else if (element.includes("deg")) {
            theShade += element + ','
        }
        
    }
    return theShade.substring(0, theShade.length-1) + ')'
} else {
    return newerShade(secondvar)
}
}

    

    const handleFlip = () => {
      setFlipped(!isFlipped);
  };

    const getObjekt = async () => {
        const { data:datas, error:errors } = await supabase
    .from('objektdata')
    .select('member, season, photo, artist, text_color, bg_color, back_photo, card_id, eventhost, eventhostlink, type')
    .eq('uuid', parseInt(id))
    const { data:datas1, error:errors1 } = await supabase
    .from('objektcollection')
    .select('serial')
    .eq('uuid', parseInt(id))
    if (datas1 != null){
        var dlen = datas1.length;
            if (datas && (datas.length != 0)) {
                
                
                setData({...datas[0], "minted":dlen});
                
            }
            setLoading(false)
            
    }
    else {
        setLoading(false)
    }
    }
    getObjekt();
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
    const sendToUser = async () => {
        setuserLoading(true);
        const theUser = user;
        const { data:datas, error:errors} = await supabase
        .from('objektcollection')
        .select('id, serial, created_at, uuid, objektdata(member, season, photo, artist, text_color, bg_color, card_id, eventhost, eventhostlink, type)')
        .eq('user_uuid', userid.toString())
        .eq('uuid', parseInt(id))
        .eq('serial', parseInt(serial))
        console.log(theUser)
        if (datas.length != 1) {
            
            console.log("You don't own this anymore!")
            return
        } else {
            const { error } = await supabase
            .from('objektcollection')
            .update({ user_uuid: theUser[0].toString(), created_at: ((new Date()).toISOString()).toLocaleString('en-US')})
            .eq('user_uuid', userid.toString())
        .eq('uuid', parseInt(id))
        .eq('serial', serial)
        setuserLoading(false);
        setdone(true);
        }
            
        
    }
    const searchFor = async () => {
        if (sendUser.length <= 0) {
            setSendUser("Type more than 1 letter.")
            return
        }
        setuserLoading(true)
        const { data:datas, error:errors } = await supabase
    .from('profiles')
    .select('id, avatar_url, username')
    .ilike('username', '%' + sendUser +'%');
    const split = datas.filter(
        (el) => el.id != userid
      )
        setuserMap(split);
        setuserLoading(false);
      }

    const handleRedirect = () => {
        router.push('/')
      }
      const handleSide2 = () => {
        if (data && data['back_photo']){
            document.getElementById( 'side-2' ).className = 'flip';
        document.getElementById( 'side-1' ).className = 'flip';
        }
  }
      const handleSide1 = () => {
        if (data && data['back_photo']){
            document.getElementById( 'side-2' ).className = 'flip flip-side-1';
            document.getElementById( 'side-1' ).className = 'flip flip-side-2';
        }
            
      }
    
      if (loading) {return ( <Loader></Loader>)
    }
    if (done == true) {
        return <div className="sending" style={{zIndex:"20", background:"#9e7dc7", color:"black", padding:"4px", bottom:"50%", width:"300px", margin:"auto", borderRadius:"20px",  paddingTop:"20px"}}>
            {!userLoading && <div><button className='backButton trading' onClick={() => {window.location.href = window.location.href.split('?')[0];}}>{"<"}</button>
            <h1 style={{fontSize:"27px"}}><b>You have Sent....</b></h1>
            <h2 style={{fontSize:"20px", width:"60%", margin:"auto"}}>{data["artist"]} {data["member"]} {data["card_id"]}#{serial.toString().padStart(5, '0')} to <u>{user[1]}</u></h2>
            <p style={{marginTop:"10px"}}>🎊 Success!</p>
            <div style={{height:"100px", position:"relative"}}><Objekt scale={"60%"} member={data["member"]} season={data["season"]} serial={serial} bckcolor={data["bg_color"]} color={data["text_color"]} id={data["card_id"]} img={data["photo"]} artist={data["artist"]}  eventhost={data["eventhost"]} eventhostlink={data["eventhostlink"]}></Objekt>
            </div>
            </div>}
            {userLoading && <Loader></Loader>}
            {!userLoading && <button className="buttonYesSure" style={{padding:"10px", background:"rgb(78, 38, 151)", fontWeight:"bold", color:"white", position:"sticky"}} onClick={()=>{setLoading(true);window.location.href = window.location.href.split('?')[0];}}>Exit.</button>}

        </div>
    }
    if (tradingScreen == null) {
        return <div className="sending" style={{zIndex:"20", background:"#9e7dc7", color:"black", padding:"4px", bottom:"50%", width:"300px", margin:"auto", borderRadius:"20px", paddingBottom:"10px",  paddingTop:"20px"}}>
            {!userLoading && <div><button className='backButton trading' onClick={() => {setTradingScreen(false);}}>{"<"}</button>
            <h1 style={{fontSize:"27px"}}><b>Are you sure you want to send:</b></h1>
            <h2 style={{fontSize:"20px", width:"60%", margin:"auto"}}><u>{data["artist"]} {data["member"]} {data["card_id"]}#{serial.toString().padStart(5, '0')}</u> to {user[1]}</h2>
            <div style={{height:"100px", position:"relative"}}><Objekt scale={"50%"} member={data["member"]} season={data["season"]} serial={serial} bckcolor={data["bg_color"]} color={data["text_color"]} id={data["card_id"]} img={data["photo"]} artist={data["artist"]}  eventhost={data["eventhost"]} eventhostlink={data["eventhostlink"]}></Objekt>
            </div>
            <div style={{padding:"1px", height:"400px"}}></div>
            </div>}
            {userLoading && <Loader></Loader>}
            {!userLoading && <button className="buttonYesSure" style={{padding:"10px", background:"rgb(78, 38, 151)", fontWeight:"bold", color:"white", position:"sticky"}} onClick={sendToUser}>Yes!</button>}
        </div>
    }
    if (tradingScreen == true) {
        return <div className="sending" style={{zIndex:"20", background:"#9e7dc7", color:"black", padding:"4px", bottom:"50%", width:"300px", margin:"auto", borderRadius:"20px", paddingTop:"20px"}}>
            <button className='backButton trading' onClick={() => {setTradingScreen(false);}}>{"<"}</button>
            <h1 style={{fontSize:"23px"}}><b>Search for the UMBRA User:</b></h1>
            <form action={searchFor}><input style={{background:"rgb(78, 38, 151)", color:"white", marginTop:"10px", width:"150px", borderRadius:"20px 0px 0px 20px", paddingLeft:"5px"}} value={sendUser} onChange={(e) => setSendUser(e.target.value)}></input><input type="submit" style={{paddingLeft:"10px", paddingRight:"10px",background:"rgb(78, 38, 151)", borderRadius:"0px 20px 20px 0px"}} value="🔎"></input></form>
            <div style={{overflowY:"scroll", height:"77%", marginTop:"7px"}}><div className="sendGrid" >{userMap.map((item, index)=> {return <button key={index} style={{...halavrBreitRg.style}} onClick={() => {setuser([item['id'], item['username']]);setTradingScreen(null)}}><div><img style={{width:"30px", marginRight:"4px", borderRadius:"20px"}} src={item['avatar_url']}></img>{item['username']}</div></button>})}</div></div>
            {userLoading && <Loader></Loader>}
        </div>
    }
    if (data) {return  <div style={{background: data["bg_color"], margin:"auto"}} className='objektBackground'>

    <div className="inobjektinfo">
    {data &&
        <div className="marginright">
        <div className={`flip-card ${isFlipped ? "flipped" : ""}`}
            onClick={handleFlip} style={{margin: "auto"}}>
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <div className="card-content" >
                    <Objekt member={data["member"]} season={data["season"]} serial={serial} bckcolor={data["bg_color"]} color={data["text_color"]} id={data["card_id"]} img={data["photo"]} artist={data["artist"]}  eventhost={data["eventhost"]} eventhostlink={data["eventhostlink"]}></Objekt>
                    </div>
                </div>
                <div className="flip-card-back">
                    <div className="card-content">
                    {data["back_photo"] && <Objekt member={data["member"]} serial={serial} season={data["season"]} bckcolor={data["bg_color"]} color={data["text_color"]} id={data["card_id"]} img={data["back_photo"]} artist={data["artist"]}  eventhost={data["eventhost"]} eventhostlink={data["eventhostlink"]} back={true} typeOfFormat={data["type"]}></Objekt>}
                    </div>
                </div>
            </div>
        </div>
        </div>}
    <br></br>
     <div style={{color: data["text_color"], fontSize:"90%", minWidth:"fit-content",width: "70%", border:"3px", display:"grid", gap:"10px",borderRadius:"10px", background: "rgb(255, 255, 255, 0.25)", padding:"5px"}} className="marginleft">
        <div style={{display: "flex"}}>
            <div style={{display: "block", margin:"auto", background:newestShade(data['bg_color']), paddingLeft:"10px", paddingRight:"10px", borderRadius:"10px", width:"100%"}}>
            <p style={{whiteSpace:"nowrap", marginBottom:"0px"}}><b>Name</b></p>
            <p style={{whiteSpace:"nowrap", marginBottom:"0px"}}>{data["member"]}</p> 
            </div>
            <div style={{display: "block", background:newestShade(data['bg_color']), margin:"auto", marginLeft:"10px", paddingLeft:"10px", paddingRight:"10px", borderRadius:"10px", width:"fit-content"}}>
            <p style={{whiteSpace:"nowrap", marginBottom:"0px"}}><b>ID</b></p>
            <p style={{whiteSpace:"nowrap", marginBottom:"0px"}}>{data["card_id"]}</p> 
            </div>
            </div>
            
            <div style={{display: "flex"}}>
            <div style={{display: "block", margin:"auto", background:newestShade(data['bg_color']), paddingLeft:"10px", paddingRight:"10px", borderRadius:"10px", width:"100%"}}>
            <p style={{whiteSpace:"nowrap", marginBottom:"0px"}}><b>Artist</b></p>
            <p style={{whiteSpace:"nowrap", marginBottom:"0px"}}>{data["artist"].join(", ")}</p>
            </div>
            <div style={{display: "block", margin:"auto", marginLeft:"10px", background:newestShade(data['bg_color']), paddingLeft:"10px", paddingRight:"10px", borderRadius:"10px", width:"fit-content"}}>
            <p style={{whiteSpace:"nowrap", marginBottom:"0px"}}><b>Minted</b></p>
            <p style={{whiteSpace:"nowrap", marginBottom:"0px"}}>{data["minted"]}</p> 
            </div>
            </div>
            

            

            <div style={{display: "flex"}}>
            <div style={{display: "block", margin:"auto", background:newestShade(data['bg_color']), paddingLeft:"10px", paddingRight:"10px", borderRadius:"10px", width:"100%"}}>
            <p style={{whiteSpace:"nowrap", marginBottom:"0px"}}><b>Season</b></p>
            <p style={{whiteSpace:"nowrap", marginBottom:"0px"}}>{data["season"]}</p>
            </div>
            <div style={{background:"rgb(56,56,58)", background:"linear-gradient(138deg, rgba(56,56,58,1) 0%, rgba(79,79,81,1) 46%, rgba(163,162,165,1) 53%, rgba(56,56,58,1) 83%)", marginLeft:"10px", padding:"2px", borderRadius:"10px", cursor:"pointer"}} onClick={()=>{setTradingScreen(true);}}>
            <div style={{display: "grid", margin:"auto",background:"rgb(236,236,236)", background:"linear-gradient(138deg, rgba(236,236,236,1) 0%, rgba(62,62,62,1) 46%, rgba(62,62,62,1) 52%, rgba(196,196,196,1) 100%)",paddingLeft:"10px", paddingRight:"10px", borderRadius:"10px", width:"fit-content", height:"100%"}}>
            <p style={{margin:"auto", color:"white"}}><b>SEND</b></p>
            </div>
            </div>
            </div>
            {data["eventhost"] && <div style={{fontSize:"10px",display: "block", margin:"auto", marginLeft:"10px", background:newestShade(data['bg_color']), paddingLeft:"10px", paddingRight:"10px", borderRadius:"10px", width:"90%"}}>
            This SAROS was given at an Event by <a href={data["eventhostlink"]} target="_blank" style={{whiteSpace:"nowrap", marginBottom:"0px", color:data["text_color"]}}><u>{data["eventhost"]}</u></a> 
            </div>}
        </div>
        
        </div>
        
    </div>}
    return (
        <Loader></Loader>
    )
        
            
    



}