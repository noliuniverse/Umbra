
import styles from "@/app/globals.css"
import stylestwo from "@/app/sidebar.module.css"
import Image from 'next/image'
import localFont from "next/font/local"
import { useRef, useState, useLayoutEffect, useEffect } from "react"
import ObjektInfo from '@/components/ObjektInfo';
import languagedata from "@/app/other/languages.json"

const dotMat = localFont({src: "../fonts/dotmat.ttf"})
const helveticaNeueBold = localFont({src: "../fonts/helvetica-neue-bold.ttf"})
const halavrBreitRg = localFont({src: "../fonts/HalvarBreit-Rg copy 2.ttf"})
const HelveticaNeueLight = localFont({src: "../fonts/HelveticaNeueLight.otf"})



//{ children },
const Objekt = ( { unique, bckcolor, color, created_at, id, serial, img, uuid, member, season, eventhost, eventhostlink, artist, back, typeOfFormat, scale}) => {

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
  
    if (eventhost) {var maxHeight = "100px";} else {var maxHeight = "75px";}
    if (back) {var theRight = "20px"} else {var theRight = "0px"}
    if (typeOfFormat) {if (parseInt(typeOfFormat)==2) {var theRightQR = "21%";}} else {var theRightQR = "24%";}
    if (typeOfFormat) {if (parseInt(typeOfFormat)==2) {var theBottomQR = "15.6%";}} else {var theBottomQR = "20.6%";}
    if (typeOfFormat) {if (parseInt(typeOfFormat)==2) {var theWidthQR = "28%"}} else {var theWidthQR = "28%"}
    if (scale) {var theScale = scale.toString();} else {var theScale="100%"}
    
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
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

    const openImage = async () =>
    {
        for ( let i = 0; i < 26; i++){
          await sleep(0.1)
          setLoadedOpacity(i*4 + '%')
        }

    }

    useLayoutEffect(() => {
      if (targetRef.current) {
        
        function updateDimension() {
          var theWidth = targetRef.current.offsetWidth;
        if (targetRef.current.offsetWidth < 90)  {
          theWidth = 200;
        }
          setDimensions({
            width: theWidth,
            height: targetRef.current.offsetHeight
          });
        }
        window.addEventListener('resize', updateDimension);
        updateDimension();
        return () => {window.removeEventListener('resize', updateDimension)}
    }
  }, []);

  useLayoutEffect(()=>{
    function updateDimension() {
      var theWidth = targetRef.current.offsetWidth;
    if (targetRef.current.offsetWidth < 90)  {
      theWidth = 200;
    }
      setDimensions({
        width: theWidth,
        height: targetRef.current.offsetHeight
      });
    }
    setTimeout(function(){
      updateDimension()
  }, 100);
    
  }, [loaded])


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

      
    return <div style={{height:"100%", scale:theScale}}>
      
            {(loaded == null) && <div className='objekt-skeleton' key={unique}/>}
      <div style={{opacity: loadedOpacity, width: "100%"}}>
        <div className="objektDiv">
            <Image className="objektimg" src={img}onLoad={() => {setLoaded(true); openImage();}} alt={id} width={700}
  height={700} onClick={slidefunction} ref={targetRef}/>
            {back && <img className="infoQR" src="UMBRA_QR.png" style={{position:"absolute", width:theWidthQR, bottom:theBottomQR, right:theRightQR}}></img>}
                <div className={stylestwo.sideBar} style={{color: color, fontSize: dimensions.width/7.5/2, right:theRight}}>
                    <span style={helveticaNeueBold.style} className="objekt_preview_text">{id}</span>
                    {serial && <span style={dotMat.style} className="objekt_preview_text3">#{serial.toString().padStart(5, '0')}</span>}
                </div>
                <div style={helveticaNeueBold.style}>
                {created_at && <div style={{ position: "absolute", bottom: dimensions.width/7.5/4.5, left: dimensions.width/7.5/5,background: "rgb(127, 86, 201)", background: "rgb(127, 86, 201, 0.65)", paddingRight: "5%", paddingLeft: "5%",borderRadius: "10px", textAlign: "center",margin: "auto", minWidth:"40px", fontSize: "80%", width:"30%"}} className="whitetext">{translate('new')}</div>}
                </div>
                </div>
            <div style={{background:"gray",background: bckcolor,width:"100%", height:"0px", margin: "auto",borderRadius: "10px", overflow: "hidden"}} id={unique}>
            <font color={color}><p style={{...helveticaNeueBold.style, margin: "0px"}}>{member}</p></font>
            <font color={color}><span style={{...helveticaNeueBold.style, margin: "0px"}} className="objekt_preview_text2">{id}</span></font>{serial && <font color={color}><span style={dotMat.style} className="objekt_preview_text2">#{serial.toString().padStart(5, '0')}</span></font>}  
            <font color={color}><p style={{...halavrBreitRg.style, margin: "0px"}}>{season}</p></font>   
            {eventhost && <font color={color}><small style={{...HelveticaNeueLight.style, margin: "0px"}}>BY: <a href={eventhostlink} target="_blank"><u>{eventhost}</u></a></small></font>}
            </div>
        
            </div>
    </div>



}

export default Objekt;