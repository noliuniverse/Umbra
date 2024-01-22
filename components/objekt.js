
import styles from "@/app/globals.css"
import stylestwo from "@/app/sidebar.module.css"

import localFont from "next/font/local"
import { useRef, useState, useLayoutEffect } from "react"
const dotMat = localFont({src: "../fonts/dotmat.ttf"})
const helveticaNeueBold = localFont({src: "../fonts/helvetica-neue-bold.ttf"})
const halavrBreitRg = localFont({src: "../fonts/HalvarBreit-Rg copy 2.ttf"})

//{ children },
const Objekt = ( { unique, bckcolor, color, id, serial, img, uuid, member, season }) => {
    const maxHeight = "75px";
    const targetRef = useRef()
    const [loaded, setLoaded] = useState(false);
    const [heightofBOX, setBOXHEIGHT] = useState("0px")
    const [dimensions, setDimensions] = useState({ width:0, height: 0 });
    const [uuID, setuuID] = useState(uuid);
    const slidefunction = () =>
    {
        try {
            if (heightofBOX == maxHeight){slideUp(); console.log('1')} else {slideDown(); console.log('2')}} catch {console.log("failed!")}

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

      
    return <div>
        <div className="objektDiv">
            <img className="objektimg" src={img} onLoad={() => setLoaded(true)} alt={id} onClick={slidefunction} ref={targetRef}/>
                <div className={stylestwo.sideBar} style={{color: color, fontSize: dimensions.width/7.5/2}}>
                    <span style={helveticaNeueBold.style} className="objekt_preview_text">{id}</span>
                    {serial && <span style={dotMat.style} className="objekt_preview_text3">#{serial.toString().padStart(5, '0')}</span>}
                </div>
                </div>
            <div style={{background: bckcolor,width:"100%", height:"0px", margin: "auto",borderRadius: "10px", overflow: "hidden"}} id={unique}>
            <font color={color}><p style={helveticaNeueBold.style}>{member}</p></font>
            <font color={color}><span style={helveticaNeueBold.style} className="objekt_preview_text2">{id}</span></font>{serial && <font color={color}><span style={dotMat.style} className="objekt_preview_text2">#{serial.toString().padStart(5, '0')}</span></font>}  
            
            <font color={color}><p style={halavrBreitRg.style}>{season}</p></font>           
            </div>
            
    </div>



}

export default Objekt;