import React from "react";
import Hero from "../components/Hero";
import Category from "../components/Category";
import Main from "../components/Main";
import Footer from "../components/Footer";

function Home() {
    return (
        <>
            <div className="px-6 md:px-16 lg:px-24 xl:px-32">
                <Hero />
                <Category/>
                <Main/>
            </div>
                <Footer/>

        </>
    )
}

export default Home;
