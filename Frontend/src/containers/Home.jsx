import React from "react";
import Hero from "../components/Hero";
import Category from "../components/Category";
import Main from "../components/Main";
import Footer from "../components/Footer";

function Home() {
    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
                <Hero />
                <Category />
                <Main />
            </main>
            <Footer />
        </div>
    );
}

export default Home;
