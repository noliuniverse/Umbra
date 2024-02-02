import styles from "@/app/globals.css"
import { useEffect, useState, useRef } from "react"
import { useRouter} from "next/navigation";
import { supabase } from '@/utils/supabaseClient'
import { debounce, has } from 'lodash'
import { usePathname } from 'next/navigation'
import { Suspense } from "react";
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
    const [dropdownEnabled, setDropdownEnabled] = useState(false);
    const dropdown = useRef();
    const router = useRouter();

    const {ref, inView} = useRef();
    let timer;
    let loading = false;

    const pathname = usePathname();
    const handleSort = async (filtertext) => {
        let path = pathname;
        let url = window.location.href;
        console.log(filtertext.split('=')[1])
        if (url.includes("?")) {
            if (url.includes((filtertext.split('=')[0]+'='))){
                let newUrl = new URL(url);
                let params = new URLSearchParams(newUrl.search);
                console.log(params.toString())
                params.set(filtertext.split('=')[0], filtertext.split('=')[1])
                window.location.href = url.split('?')[0] + '?' + params.toString();
            } else {window.location.href = url + filtertext;}
        }
        else {
            window.location.href = url + "?" + filtertext;
        }
       
        
    }
    
    const fetchNextObjekts = async () => {
        if (hasPages == true) {
            const pageNumber = pagesLoaded+1;
            
            fetchObjekts(pageNumber, userid, batchSize).then(res => {
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
        if (datas.length < batchSize) {
            setHasPages(false)
        }
        if (entries[0].isIntersecting && loading == false && hasPages == true) {
            loading =true;
        
       debounce(fetchNextObjekts, 1000);
        
        
      }loading=false;});

    if (hasPages == true) {intersectionObserver.observe(document.querySelector(".more"));} })
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
    

    return <Suspense><div>
        <span style={{color: "rgb(78, 38, 151)", background: "white", padding:"10px", paddingBottom:"5px", paddingTop:"5px", borderRadius:"20px"}} onClick={() => {setDropdownEnabled(!dropdownEnabled)}}>Sort</span>
        {dropdownEnabled && <div className="dropdown-content" style={{marginLeft:"50%"}} id="dropdownmenu" ref={dropdown}>
                <button className='button2' style={{width:"100%"}} onClick={() => {handleSort("sort=oldest")}}>Oldest</button>
                <button className='button2' style={{width:"100%"}} onClick={() => {handleSort("sort=newest")}}>Newest</button>
                <button className='button2' style={{width:"100%"}} onClick={() => {handleSort("sort=serial")}}>Serial (hi-low)</button>
                </div>}
        <div className="objektgrid">
    {objekts.map((item,index)=>{return <Objekt className="grid-objekt" unique={index} key={index} member={item["objektdata"]["member"]} season={item["objektdata"]["season"]} bckcolor={item["objektdata"]["bg_color"]} color={item["objektdata"]["text_color"]} created_at={(Date.now())-(new Date(item["created_at"].toString())) <= 86400000} id={item["objektdata"]["card_id"]} serial={item["serial"]} img={item["objektdata"]["photo"]} artist={item["objektdata"]["artist"]}  eventhost={item["objektdata"]["eventhost"]} eventhostlink={item["objektdata"]["eventhostlink"]} uuid={item["objektdata"]["id"]}/>
})}
                        </div>
                        {hasPages && <button className="button2 more" style={{ marginTop: "60px", opacity:"10%"}}
                        >-</button>} 
</div></Suspense>



}

