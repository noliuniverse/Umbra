"use client";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import styles from "@/app/globals.css"

import { useEffect, useState, useRef } from "react"
import { useRouter} from "next/navigation";
import { supabase } from '@/utils/supabaseClient'

import { useInView } from "react-intersection-observer";
import { useCallback } from "react";

import bootstrap from '../node_modules/bootstrap/dist/js/bootstrap.min.js';

import localFont from "next/font/local"

const dotMat = localFont({src: "../fonts/dotmat.ttf"})
const helveticaNeueBold = localFont({src: "../fonts/helvetica-neue-bold.ttf"})
const halavrBreitRg = localFont({src: "../fonts/HalvarBreit-Rg copy 2.ttf"})

//{ children },
const Carousel = ({interval}) => {
    const [pass, setPass] = useState(false)
    useEffect(()=>{
        if (typeof window !== "undefined") {
            const myCarousel = document.getElementById("carouselExampleIndicators");
    const carouselIndicators = myCarousel.querySelectorAll(
      ".carousel-indicators button span"
    );
    let intervalID;
    
    const carousel = new bootstrap.Carousel(myCarousel);
    carousel.next();
    
    
    window.addEventListener("load", function () {
      fillCarouselIndicator(0);
    });
    
    myCarousel.addEventListener("slide.bs.carousel", function (e) {
      let index = e.to;
      fillCarouselIndicator(++index);
    });
    
    function fillCarouselIndicator(index) {
      let i = 0;
      for (const carouselIndicator of carouselIndicators) {
        carouselIndicator.style.width = 0;
      }
      clearInterval(intervalID);
      carousel.pause();
    
      intervalID = setInterval(function () {
        i++;
        
        myCarousel.querySelector(".carousel-indicators .active span").style.width =
          i + "%";
    
        if (i >= 100) {
          // i = 0; -> just in case
          carousel.next();
        }
      }, 50);
    }
            }
            
     
    })
    
    return <div style={{marginBottom: "10px"}}>
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" data-bs-pause="true">
  <div className="carousel-indicators" style={{marginTop: "10%"}}>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0"  aria-label="Slide 1">
      <span></span>
    </button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2">
      <span></span>
    </button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3">
      <span></span>
    </button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" className="active" aria-current="true" aria-label="Slide 4">
      <span></span>
    </button>
  </div>
  <div className="carousel-inner">
    <div className="carousel-item">
      <img src="YuBin110S.png" style={{width:"40%", maxWidth: "240px", margin: "auto"}} alt="YuBin 110S"/>
    </div>
    <div className="carousel-item">
      <img src="Kotone106SC.png" style={{width:"40%", maxWidth: "240px", margin: "auto"}} alt="Kotone 106S"/>
    </div>
    <div className="carousel-item">
      <img src="JooBin102S.png" style={{width:"40%", maxWidth: "240px", margin: "auto"}} alt="JooBin 102S"/>
    </div>
    <div className="carousel-item active">
      <img src="YooYeon106S.png" style={{width:"40%", maxWidth: "240px", margin: "auto"}} alt="YooYeon 106S"/>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
    </div>



}

export default Carousel;