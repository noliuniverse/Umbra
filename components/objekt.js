
import styles from "@/app/globals.css"
import stylestwo from "@/app/sidebar.module.css"
import Image from 'next/image'
import localFont from "next/font/local"
import { useRef, useState, useLayoutEffect } from "react"
const dotMat = localFont({src: "../fonts/dotmat.ttf"})
const helveticaNeueBold = localFont({src: "../fonts/helvetica-neue-bold.ttf"})
const halavrBreitRg = localFont({src: "../fonts/HalvarBreit-Rg copy 2.ttf"})
const HelveticaNeueLight = localFont({src: "../fonts/HelveticaNeueLight.otf"})



//{ children },
const Objekt = ( { unique, bckcolor, color, created_at, id, serial, img, uuid, member, season, eventhost, eventhostlink, artist }) => {
    if (eventhost) {var maxHeight = "100px";} else {var maxHeight = "75px";}
    // 25 EACH LOGO
    const targetRef = useRef()
    const [loaded, setLoaded] = useState(null);
    const [loadedOpacity, setLoadedOpacity] = useState("1%");

    const [heightofBOX, setBOXHEIGHT] = useState("0px")
    const [dimensions, setDimensions] = useState({ width:0, height: 0 });
    const [uuID, setuuID] = useState(uuid);
    const slidefunction = () =>
    {
        try {
            if (heightofBOX == maxHeight){slideUp(); } else {slideDown(); }} catch {console.log("failed!")}

    }

    useLayoutEffect(() => {
          if (targetRef.current) {
            setDimensions({
              width: targetRef.current.offsetWidth,
              height: targetRef.current.offsetHeight
            });
        }
      }, []);


    function slideUp() {
        try {var elem = document.getElementById(unique)
        elem.style.transition = "all 0.5s ease-in-out";
        elem.style.height = "0px"; setBOXHEIGHT("0px")} catch {}
      }
      function slideDown() {
        try {var elem = document.getElementById(unique)
        elem.style.transition = "all 0.5s ease-in-out";
        elem.style.height = maxHeight; setBOXHEIGHT(maxHeight)} catch {}
      }

      
    return <div >
      
            {(loaded == null) && <div className='objekt-skeleton' key={unique}/>}
      <div style={{opacity: loadedOpacity, width: "100%"}}>
        <div className="objektDiv">
            <Image className="objektimg" src={img}onLoad={() => {setLoaded(true); setLoadedOpacity("100%")}} alt={id} width={700}
  height={700} onClick={slidefunction} ref={targetRef}/>
                <div className={stylestwo.sideBar} style={{color: color, fontSize: dimensions.width/7.5/2}}>
                    <span style={helveticaNeueBold.style} className="objekt_preview_text">{id}</span>
                    {serial && <span style={dotMat.style} className="objekt_preview_text3">#{serial.toString().padStart(5, '0')}</span>}
                </div>
                <div style={helveticaNeueBold.style}>
                {created_at && <div style={{ position: "absolute", bottom: dimensions.width/7.5/4.5, left: dimensions.width/7.5/5,background: "rgb(127, 86, 201)", background: "rgb(127, 86, 201, 0.65)", paddingRight: "5%", paddingLeft: "5%",borderRadius: "10px", textAlign: "center",margin: "auto", fontSize: "50%"}} className="whitetext">NEW</div>}
                </div>
                </div>
            <div style={{background: bckcolor,width:"100%", height:"0px", margin: "auto",borderRadius: "10px", overflow: "hidden"}} id={unique}>
            <font color={color}><p style={helveticaNeueBold.style}>{member}</p></font>
            <font color={color}><span style={helveticaNeueBold.style} className="objekt_preview_text2">{id}</span></font>{serial && <font color={color}><span style={dotMat.style} className="objekt_preview_text2">#{serial.toString().padStart(5, '0')}</span></font>}  
            <font color={color}><p style={halavrBreitRg.style}>{season}</p></font>   
            {eventhost && <font color={color}><small style={HelveticaNeueLight.style}>BY: <a href={eventhostlink}><u>{eventhost}</u></a></small></font>}
            </div>
        
            </div>
    </div>



}

export default Objekt;