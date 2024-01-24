
import styles from "@/app/globals.css"
import localFont from "next/font/local"
import { useEffect, useState } from "react"
import { useRouter} from "next/navigation";
import Objekt from "@/components/objekt.js";
const dotMat = localFont({src: "../fonts/dotmat.ttf"})
const helveticaNeueBold = localFont({src: "../fonts/helvetica-neue-bold.ttf"})
const halavrBreitRg = localFont({src: "../fonts/HalvarBreit-Rg copy 2.ttf"})

//{ children },
export default function ObjektGrid( { datas}) {
    const batchSize = 30;
    var objektdatas = datas;

    return <div className="objektgrid">
    {datas.map((item,index)=>{return <Objekt className="grid-objekt" unique={index} key={index} member={item["objektdata"]["member"]} season={item["objektdata"]["season"]} bckcolor={item["objektdata"]["bg_color"]} color={item["objektdata"]["text_color"]} id={item["objektdata"]["card_id"]} serial={item["serial"]} img={item["objektdata"]["photo"]} artist={item["objektdata"]["artist"]} uuid={item["objektdata"]["id"]}/>
})}
                        <p className="whitetext"></p> ph</div>



}