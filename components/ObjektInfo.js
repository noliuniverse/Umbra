
import styles from "@/app/globals.css"
import localFont from "next/font/local"
import { use, useEffect, useState } from "react";
import { supabase } from '@/utils/supabaseClient'
import { useRouter} from "next/navigation";
import Objekt from "./objekt";
const dotMat = localFont({src: "../fonts/dotmat.ttf"})
const helveticaNeueBold = localFont({src: "../fonts/helvetica-neue-bold.ttf"})
const halavrBreitRg = localFont({src: "../fonts/HalvarBreit-Rg copy 2.ttf"})

//{ children },
export default function ObjektInfo( { id }) {
    const router = useRouter()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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
        {var dlen = datas1.length;
            if (datas && (datas.length != 0)) {
                setData({...datas[0], "minted":dlen});
            }
            setLoading(false)
    } }
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
        <div>
        {loading && <div className="lds-dual-ring"></div>}
        {data && <div className="inobjektinfo" style={{background: data["bg_color"]}}>
            {data && <div className="objektflipclass side-1"><Objekt member={data["member"]} season={data["season"]} bckcolor={data["bg_color"]} color={data["text_color"]} id={data["card_id"]} img={data["photo"]} artist={data["artist"]}  eventhost={data["eventhost"]} eventhostlink={data["eventhostlink"]}></Objekt></div>}
            {(data && data["back_photo"]&& (false == true)) && <div className="objektflipclass side-2"><Objekt member={data["member"]} season={data["season"]} bckcolor={data["bg_color"]} color={data["text_color"]} id={data["card_id"]} img={data["back_photo"]} artist={data["artist"]}  eventhost={data["eventhost"]} eventhostlink={data["eventhostlink"]}></Objekt></div>}
            <br></br>
            {data && <div style={{color: data["text_color"], fontSize:"90%",  margin:"auto", width: "70%", border:"3px"}}>
                <div style={{display: "flex"}}>
                    <div style={{display: "block", margin:"auto"}}>
                    <p><b>Name</b></p>
                    <p>{data["member"]}</p> 
                    </div>
                    <div style={{borderLeft: "0.2px solid #000", height:"4vh", margin:"auto", display:"absolute", borderColor: data['text_color']}}></div> 
                    <div style={{display: "block", margin:"auto"}}>
                    <p><b>ID</b></p>
                    <p>{data["card_id"]}</p> 
                    </div>
                    </div>
                    <hr></hr>
                    <div style={{display: "flex"}}>
                    <div style={{display: "block", margin:"auto"}}>
                    <p><b>Artist</b></p>
                    <p>{data["artist"].join(", ")}</p>
                    </div>
                    <div style={{borderLeft: "0.2px solid #000", height:"4vh", margin:"auto", display:"absolute", borderColor: data['text_color']}}></div> 
                    <div style={{display: "block", margin:"auto"}}>
                    <p><b>Minted</b></p>
                    <p>{data["minted"]}</p> 
                    </div>
                    </div>
                    
                    <hr></hr>
                    <p><b>Season</b></p>
                    <p>{data["season"]}</p>
                    <hr></hr>
                    {data["eventhost"] && <div className="info"><p><b>Event Host</b></p>
                    <a href={data["eventhostlink"]}>{data["eventhost"]}</a>
                    <hr></hr></div>}
                    
                </div>}
            </div>}
            </div>
    </div>



}