

import styles from "@/app/globals.css"
import localFont from "next/font/local"
import { useEffect, useState, useRef } from "react"
import { useRouter} from "next/navigation";
import Objekt from "@/components/objekt.js";
import { fetchObjekts } from "@/functions/fetchObjekt.js";
import { useInView } from "react-intersection-observer";

const dotMat = localFont({src: "../fonts/dotmat.ttf"})
const helveticaNeueBold = localFont({src: "../fonts/helvetica-neue-bold.ttf"})
const halavrBreitRg = localFont({src: "../fonts/HalvarBreit-Rg copy 2.ttf"})

//{ children },
export default function FetchMoreObjekts({datas, userid}) {
    const [objekts, setObjekts] = useState(datas)
    const [pagesLoaded, setPagesLoaded] = useState(1);
    const {ref, inView} = useRef();
    

    const fetchNextObjekts = async () => {
            const pageNumber = pagesLoaded+1;
        fetchObjekts(pageNumber, userid).then(function (result) {
            try {if (result == null){} else {setObjekts((oldObjekts) => [...oldObjekts, ...result])}} catch{}
        })
        //setObjekts(
        setPagesLoaded(pageNumber);

        
    }
   


    return <div><div className="objektgrid">
    {objekts.map((item,index)=>{return <Objekt className="grid-objekt" unique={index} key={index} member={item["objektdata"]["member"]} season={item["objektdata"]["season"]} bckcolor={item["objektdata"]["bg_color"]} color={item["objektdata"]["text_color"]} id={item["objektdata"]["card_id"]} serial={item["serial"]} img={item["objektdata"]["photo"]} artist={item["objektdata"]["artist"]} uuid={item["objektdata"]["id"]}/>
})}
                        </div>
                        <button className="button2" onClick={fetchNextObjekts} style={{marginBottom: "20px", marginTop: "20px"}}>Load More</button>
</div>



}
