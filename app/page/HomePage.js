import React from "react";
import Navbar from "@/app/page/Navbar";
import Title from "@/app/page/Title";
import FooterNavbar from "@/app/page/FooterNavbar";

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