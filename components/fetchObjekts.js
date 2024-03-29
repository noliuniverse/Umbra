import styles from "@/app/globals.css"
import { useEffect, useState, useRef } from "react"
import { useRouter} from "next/navigation";
import { supabase } from '@/utils/supabaseClient'
import { debounce, has } from 'lodash'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from "react";
import Objekt from "@/components/objekt.js";
import { fetchObjekts } from "@/functions/fetchObjekt.js";
import { useInView } from "react-intersection-observer";
import { useCallback } from "react";
import localFont from "next/font/local"
import ObjektInfo from "./ObjektInfo";
import Loader from "./Loader";
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
    const [modalop, setModal] = useState(false);
    const [dropdownEnabled, setDropdownEnabled] = useState(false);
    const [ids, setIDS] = useState(null);
    const [serials, setSERIAL] = useState(null)
    const dropdown = useRef();
    const router = useRouter();
    var start = 0;

    const searchParams =  useSearchParams()
    const {ref, inView} = useRef();
    let timer;
    let [loading, setLoading] = useState(false);

    const pathname = usePathname();

    const setModals= async (bool) => { 
        setModal(bool);
        var blur = document.getElementById('blur');
        blur.classList.toggle('active');

    }
    const handleSort = async (filtertext) => {
        let path = pathname;
        let url = window.location.href;
        if (url.includes("?")) {
            if (url.includes((filtertext.split('=')[0]+'='))){
                let newUrl = new URL(url);
                let params = new URLSearchParams(newUrl.search);
                params.set(filtertext.split('=')[0], filtertext.split('=')[1])
                window.location.href = url.split('?')[0] + '?' + params.toString();
            } else {window.location.href = url + "&" + filtertext;}
        }
        else {
            window.location.href = url + "?" + filtertext;
        }
       
        
    }
    const debounce = function(fn, d) {
        if (timer) {
          clearTimeout(timer);
        }
      
        timer = setTimeout(fn, d);
      }
    const fetchNextObjekts = async () => {
        start++;
        if (hasPages == true && start == 1) {
            
            const pageNumber = pagesLoaded+1;

            fetchObjekts(pageNumber, userid, batchSize, true, searchParams).then(res => {
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
                setLoading(false);
                start = 0;
                
                
                
            })
            

        } 
    }
    
    useEffect(() => {const intersectionObserver = new IntersectionObserver(entries => {
        
        if (datas.length < batchSize) {
            setHasPages(false)
        }
        if (entries[0].isIntersecting && loading == false && hasPages == true) {
            
            
            setLoading(true);
       debounce(() => {fetchNextObjekts()}, 1000);
        
        
      }});

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
    

    return <Suspense>
        {modalop && <div className="objektinfo"><div className="x" style={{padding:"10px", margin: "auto", position: "absolute", cursor: "pointer"}} onClick={()=>{setModals(false)}}><p>X</p></div><div className="objektinfodiv"><ObjektInfo id={ids} serial={serials}></ObjektInfo></div></div>}
        <div  id="blur">
        <span style={{color: "rgb(78, 38, 151)", background: "white", padding:"10px", paddingBottom:"5px", paddingTop:"5px", borderRadius:"20px"}} onClick={() => {setDropdownEnabled(!dropdownEnabled)}}>Sort</span>
        {dropdownEnabled && <div className="dropdown-content" style={{marginLeft:"50%", position:"absolute"}} id="dropdownmenu" ref={dropdown}>
                <button className='button2' style={{width:"100%"}} onClick={() => {handleSort("sort=oldest")}}>Oldest</button>
                <button className='button2' style={{width:"100%"}} onClick={() => {handleSort("sort=newest")}}>Newest</button>
                <button className='button2' style={{width:"100%"}} onClick={() => {handleSort("sort=serial")}}>Serial (hi-low)</button>
                </div>}
        
        <div className="objektgrid"  style={{zIndex: 1}}>
    {objekts.map((item,index)=>{return <div key={index} onDoubleClick={() => {setIDS(item["uuid"]); setSERIAL(item["serial"]); setModals(true)}}><Objekt className="grid-objekt" unique={index} member={item["objektdata"]["member"]} season={item["objektdata"]["season"]} bckcolor={item["objektdata"]["bg_color"]} color={item["objektdata"]["text_color"]} created_at={(Date.now())-(new Date(item["created_at"].toString())) <= 86400000} id={item["objektdata"]["card_id"]} serial={item["serial"]} img={item["objektdata"]["photo"]} artist={item["objektdata"]["artist"]}  eventhost={item["objektdata"]["eventhost"]} eventhostlink={item["objektdata"]["eventhostlink"]} uuid={item["objektdata"]["id"]}/></div>
})}
                        </div>
                        {hasPages && <div className="more"><Loader style={{ marginTop: "0px", opacity:"50%"}}
                        ></Loader></div>} 
</div></Suspense>



}

