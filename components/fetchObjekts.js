import styles from "@/app/globals.css"
import { useEffect, useState, useRef, use } from "react"
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
import groupsdata from "@/app/other/groups.json"
import languagedata from "@/app/other/languages.json"

const dotMat = localFont({src: "../fonts/dotmat.ttf"})
const helveticaNeueBold = localFont({src: "../fonts/helvetica-neue-bold.ttf"})
const halavrBreitRg = localFont({src: "../fonts/HalvarBreit-Rg copy 2.ttf"})

//{ children },
export default function FetchMoreObjekts  ({datas, userid}) {
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


    const [objekts, setObjekts] = useState(datas)
    const [hasPages, setHasPages] = useState(true)
    const NEW_LIMIT = 86400000; // created less than a day ago is considered new
    const batchSize = 40;
    const [pagesLoaded, setPagesLoaded] = useState(1);
    const [modalop, setModal] = useState(false);
    const [dropdownEnabled, setDropdownEnabled] = useState(false);
    const dropdown = useRef();
    const [filterdropdownEnabled, setFilterDropdownEnabled] = useState(false);
    const filterDropdown = useRef();
    const [ids, setIDS] = useState(null);
    const [thisID, setThisID] = useState(null)
    const [group, setGroup] = useState(false);
    const [idol, setIdol] = useState(false);
    const [serials, setSERIAL] = useState(null)
    let groupListsData = groupsdata["listOfGroups"];
    
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
    function getGroup() {
        if (Object.keys(groupListsData).includes(searchParams.get('group'))) {
            return searchParams.get('group')
        }
        else {return "808 Return : Not Found"}
    }
    function getIdol() {
        return searchParams.get('idol')
    }
    async function handleSort (filtertext, returns) {
        let path = pathname;
        let url = window.location.href;
        if (returns==true) {
            if (url.includes("?")) {
                return true
        }
        else {
            return false
        }
        } else {
            if (url.includes("?")) {
                if (url.includes((filtertext.split('=')[0]+'='))){
                    let newUrl = new URL(url);
                    let params = new URLSearchParams(newUrl.search);
                    params.set(filtertext.split('=')[0], filtertext.split('=')[1])
                    if (window.location.href == url.split('?')[0] + '?' + params.toString() ) {
                        
                    } else {
                        window.location.href = url.split('?')[0] + '?' + params.toString();
                    }
                
                } else {window.location.href = url + "&" + filtertext;}
            }
            else {
                window.location.href = url + "?" + filtertext;
            }
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
        handleSort('', true).then((val)=> {setGroup(val)})
        if (searchParams.get('idol')){setIdol(true)}
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

      useEffect(() => {
        if (!filterdropdownEnabled) return;
        function handleClick(event) {
          if (filterDropdown.current && !filterDropdown.current.contains(event.target)) {
            setFilterDropdownEnabled(false);
          }
          
        }
        document.addEventListener("click", handleClick);
        // clean up
        return () => document.removeEventListener("click", handleClick);
      }, [filterdropdownEnabled]);
    

    return <Suspense>
        {modalop && <div className="objektinfo"><div className="x" style={{padding:"10px", margin: "auto", position: "absolute", cursor: "pointer"}} onClick={()=>{setModals(false)}}><p>X</p></div><div className="objektinfodiv"><ObjektInfo id={ids} serial={serials} userid={userid} thisID={thisID}></ObjektInfo></div></div>}
        <div  id="blur">
        {(group == true || idol == true) && <p style={{color: "rgb(78, 38, 151)", margin:"auto auto 10px auto", scale:"60%", cursor:"pointer", width:"200px", background: "white", padding:"10px", paddingBottom:"5px", paddingTop:"5px", borderRadius:"20px"}} onClick={() => {window.location.href = window.location.href.split('?')[0];}}>Remove Filter</p>}
        <span style={{color: "rgb(78, 38, 151)", background: "white", padding:"10px", paddingBottom:"5px", cursor:"pointer", paddingTop:"5px", borderRadius:"20px"}} onClick={() => {setDropdownEnabled(!dropdownEnabled)}}>Sort</span>
        <span style={{color: "rgb(78, 38, 151)", marginLeft:"10px", background: "white", padding:"10px", cursor:"pointer", paddingBottom:"5px", paddingTop:"5px", borderRadius:"20px"}} onClick={() => {setFilterDropdownEnabled(!filterdropdownEnabled)}}>Filter</span>
        {dropdownEnabled && <div className="dropdown-content" style={{marginLeft:"50%", position:"absolute"}} id="dropdownmenu" ref={dropdown}>
                <button className='button2' style={{width:"100%"}} onClick={() => {handleSort("sort=oldest")}}>{translate('oldest')}</button>
                <button className='button2' style={{width:"100%"}} onClick={() => {handleSort("sort=newest")}}>{translate('newest')}</button>
                <button className='button2' style={{width:"100%"}} onClick={() => {handleSort("sort=serial")}}>{translate('serialhl')}</button>
                </div>}
        {filterdropdownEnabled && <div className="dropdown-content" style={{marginLeft:"50%", position:"absolute", height:"fit-content", maxHeight:"180px", overflowY:"scroll"}} id="dropdownmenu" ref={filterDropdown}>
                {(group == true) && <div style={{width:"100%", color:"rgb(78, 38, 151)", backgroundColor:"white", margin:"auto"}}>Artist: {getGroup()}</div>}
                {(idol == true) && <div style={{width:"100%", color:"rgb(78, 38, 151)", backgroundColor:"white", margin:"auto"}}>Idol: {getIdol()}</div>}
                {(group == true) && <div>
                    {groupListsData[getGroup()]['members'].map((item, index) => {return <button key={index} className='button2' style={{width:"100%"}} onClick={() => {handleSort("idol=" + item)}}>{item}</button>})}</div>}
                {(group == false) && <div>
                    {Object.keys(groupListsData).slice(0, -1).map((item, index) => {return <button key={index} className='button2' style={{width:"100%"}} onClick={() => {handleSort("group=" + item)}}>{(groupListsData[item]["logo"]) && <img src={groupListsData[item]["logo"]} style={{width:"28px", position:"absolute"}}></img>}{item}</button>})}
                </div>}
                </div>}
        
        <div className="objektgrid"  style={{zIndex: 1}}>
    {objekts.map((item,index)=>{return <div key={index} onDoubleClick={() => {setThisID(item["id"]); setIDS(item["uuid"]); setSERIAL(item["serial"]); setModals(true);}}><Objekt className="grid-objekt" unique={index} member={item["objektdata"]["member"]} season={item["objektdata"]["season"]} bckcolor={item["objektdata"]["bg_color"]} color={item["objektdata"]["text_color"]} created_at={(Date.now())-(new Date(item["created_at"].toString())) <= 86400000} id={item["objektdata"]["card_id"]} serial={item["serial"]} img={item["objektdata"]["photo"]} artist={item["objektdata"]["artist"]}  eventhost={item["objektdata"]["eventhost"]} eventhostlink={item["objektdata"]["eventhostlink"]} uuid={item["objektdata"]["id"]} typeOfFormat={item["objektdata"]["type"]}/></div>
})}
                        </div>
                        {hasPages && <div className="more"><Loader style={{ marginTop: "0px", opacity:"50%"}}
                        ></Loader></div>} 
</div></Suspense>



}

