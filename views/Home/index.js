'use client'

import React from "react";
import Navbar from "@/views/Home/Navbar";
import Title from "@/views/Home/Title";
import FooterNavbar from "@/views/Home/FooterNavbar";

const HomePage = () => {
return(
   <div className="Container">
    <div>
        <Navbar />
        <Title />
        <FooterNavbar />
    </div>    
   </div>
)
}
export default HomePage;