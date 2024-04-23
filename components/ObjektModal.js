
import styles from "@/app/globals.css"
import localFont from "next/font/local"
import { useState } from "react"
import { useRouter} from "next/navigation";
const dotMat = localFont({src: "../fonts/dotmat.ttf"})
const helveticaNeueBold = localFont({src: "../fonts/helvetica-neue-bold.ttf"})
const halavrBreitRg = localFont({src: "../fonts/HalvarBreit-Rg copy 2.ttf"})
import languagedata from "@/app/other/languages.json"

//{ children },
export default function ObjektModal( { id, serial, img, member, season }) {

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

    const router = useRouter()

    const handleRedirect = () => {
        router.push('/')
      }
      
    return <div>
        <div>
            <div style={{backgroundColor: "gray", height: "auto",width:"90%", margin: "auto",borderRadius: "10px", color: "white", padding: "30px"}} >
            <h1 className="whitetext bigel bold">{translate("loadedinto")} 🌑</h1>
            <font color="white"><span style={helveticaNeueBold.style}>{member}</span> </font><font color="white"><span style={helveticaNeueBold.style}>{id}</span></font><font color="white"><span style={dotMat.style}>#{serial.toString().padStart(5, '0')}</span></font>
            <img style={{margin: "auto"}}src={img}/>
            <br></br>
            <button style={{width: "100%", backgroundColor: "#4e2696", padding:"10px", borderRadius: "10px"}} onClick={handleRedirect}>Confirm</button>
            </div>
            </div>
    </div>



}