import styles from "@/app/globals.css"
import { useEffect, useState, useRef } from "react"
import { useRouter} from "next/navigation";
import { supabase } from '@/utils/supabaseClient'
import { debounce, has } from 'lodash'

import Objekt from "@/components/objekt.js";
import { fetchObjekts } from "@/functions/fetchObjekt.js";
import { useInView } from "react-intersection-observer";
import { useCallback } from "react";
import localFont from "next/font/local"

const dotMat = localFont({src: "../fonts/dotmat.ttf"})
const helveticaNeueBold = localFont({src: "../fonts/helvetica-neue-bold.ttf"})
const halavrBreitRg = localFont({src: "../fonts/HalvarBreit-Rg copy 2.ttf"})

//{ children },
export default function FetchMoreObjekts  ({datas, userid}) {
    const [objekts, setObjekts] = useState(datas)
    const [hasPages, setHasPages] = useState(true)
    const NEW_LIMIT = 86400000; // created less than a day ago is considered new
    const batchSize = 40;
    const [pagesLoaded, setPagesLoaded] = useState(1);
    const {ref, inView} = useRef();
    let timer;
    let loading = false;

    

    
    const fetchNextObjekts = async () => {
        if (hasPages == true) {
            const pageNumber = pagesLoaded+1;
            
            fetchObjekts(pageNumber, userid, batchSize).then(res => {
                console.log(res.length)
                var vl = res.length;
                
                
                if (vl == 0) {
                    setObjekts([...objekts, ...res]);
                    setHasPages(false)
                }
                else if (vl < batchSize) {
                    setObjekts([...objekts, ...res]);
                    setHasPages(false)
                }
                else {
                    setObjekts([...objekts, ...res]);
                }
                
                
                setPagesLoaded(pageNumber);
                loading = false;
                
            });

        }

        

        
    }
    const debounce = function(fn, d) {
        if (timer) {
          clearTimeout(timer);
        }
      
        timer = setTimeout(fn, d);
      }
    useEffect(() => {const intersectionObserver = new IntersectionObserver(entries => {
        console.log(hasPages)
        if (datas.length < batchSize) {
            setHasPages(false)
        }
        if (entries[0].isIntersecting && loading == false && hasPages == true) {
            loading =true;
        
       debounce(fetchNextObjekts, 1000);
        
        
      }loading=false;});

    if (hasPages == true) {intersectionObserver.observe(document.querySelector(".more"));} })

    

    return <div style={{marginBottom: "0px"}}><div className="objektgrid">
    {objekts.map((item,index)=>{return <Objekt className="grid-objekt" unique={index} key={index} member={item["objektdata"]["member"]} season={item["objektdata"]["season"]} bckcolor={item["objektdata"]["bg_color"]} color={item["objektdata"]["text_color"]} created_at={(Date.now())-(new Date(item["created_at"].toString())) <= 86400000} id={item["objektdata"]["card_id"]} serial={item["serial"]} img={item["objektdata"]["photo"]} artist={item["objektdata"]["artist"]}  eventhost={item["objektdata"]["eventhost"]} eventhostlink={item["objektdata"]["eventhostlink"]} uuid={item["objektdata"]["id"]}/>
})}
                        <div style={{marginBottom: "100px"}}></div></div>
                        {hasPages && <button className="button2 more" style={{ marginTop: "60px", opacity:"10%"}}
                        >-</button>} 
</div>



}

