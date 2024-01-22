
import styles from "@/app/globals.css"
import localFont from "next/font/local"
import { useState } from "react"
import { useRouter} from "next/navigation";
const dotMat = localFont({src: "../fonts/dotmat.ttf"})
const helveticaNeueBold = localFont({src: "../fonts/helvetica-neue-bold.ttf"})
const halavrBreitRg = localFont({src: "../fonts/HalvarBreit-Rg copy 2.ttf"})

//{ children },
export default function ObjektModal( { id, serial, img, member, season }) {
    const router = useRouter()

    const handleRedirect = () => {
        router.push('/')
      }
      
    return <div>
        <div>
            <div style={{backgroundColor: "gray", height: "auto",width:"90%", margin: "auto",borderRadius: "10px", color: "white", padding: "30px"}} >
            <h1 className="whitetext bigel bold">Loaded into Umbra! 🌑</h1>
            <font color="white"><span style={helveticaNeueBold.style}>{member}</span> </font><font color="white"><span style={helveticaNeueBold.style}>{id}</span></font><font color="white"><span style={dotMat.style}>#{serial.toString().padStart(5, '0')}</span></font>
            <img style={{margin: "auto"}}src={img}/>
            <br></br>
            <button style={{width: "100%", backgroundColor: "#4e2696", padding:"10px", borderRadius: "10px"}} onClick={handleRedirect}>Confirm</button>
            </div>
            </div>
    </div>



}