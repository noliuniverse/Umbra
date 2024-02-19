
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

export default function ObjektInfo( { id, serial }) {
   
    const router = useRouter()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFlipped, setFlipped] = useState(false);

    
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
    .select('member, season, photo, artist, text_color, bg_color, back_photo, card_id, eventhost, eventhostlink')
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
    
    return <div>
        

        {(loading == true) && <Loader></Loader>}
        {(data) && <div style={{background: data["bg_color"], margin:"auto", borderRadius:"20px"}} className='objektBackground'>
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
                            {data["back_photo"] && <Objekt member={data["member"]} serial={serial} season={data["season"]} bckcolor={data["bg_color"]} color={data["text_color"]} id={data["card_id"]} img={data["back_photo"]} artist={data["artist"]}  eventhost={data["eventhost"]} eventhostlink={data["eventhostlink"]} back={true}></Objekt>}
                            </div>
                        </div>
                    </div>
                </div>
                </div>}
            <br></br>
            {(data) && <div style={{color: data["text_color"], fontSize:"90%", minWidth:"fit-content",width: "70%", border:"3px", display:"grid", gap:"10px",borderRadius:"10px", background: "rgb(255, 255, 255, 0.25)", padding:"5px"}} className="marginleft">
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
                    {data["eventhost"] && <div style={{display: "block", margin:"auto", marginLeft:"10px", background:newestShade(data['bg_color']), paddingLeft:"10px", paddingRight:"10px", borderRadius:"10px", width:"fit-content"}}>
                    <p style={{whiteSpace:"nowrap", marginBottom:"0px"}}><b>Event</b></p>
                    <a href={data["eventhostlink"]} style={{whiteSpace:"nowrap", marginBottom:"0px"}}>TEST kjnknHOST</a> 
                    </div>}
                    
                    </div>
                    
                    
                </div>}
                </div>
            </div>}
            
    </div>



}