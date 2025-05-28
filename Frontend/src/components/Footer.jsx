import React from "react";
import { footer } from '../assets/assets'
import { Link } from 'react-router-dom'

function Footer() {

  return (
    <>
      <div className="bg-[#edf8f3] px-6 md:px-16 lg:px-24 xl:px-32 mt-24">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
          <div>
            <img src="/images/logo.svg" alt="GreenCart Logo" />
            <p className="max-w-[410px] mt-6">We deliver fresh groceries and snacks straight to your door. Trusted by thousands, we aim to make your shopping experience simple and affordable.</p>
          </div>
          <div className="flex flex-wrap justify-between w-3/8 space-y-5 cursor-pointer">

            {footer.map((item, index) => {
              return (
                <div key={index}>
                  <h2 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{item.head}</h2>
                  <ul className="text-sm space-y-1">
                    {item.links.map((link, index) => {
                      return (
                        <li key={index}>
                          <Link to={link.url} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:underline transition">{link.name}</Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
        <p className="py-4 text-center text-sm md:text-base">Copyright {new Date().getFullYear()} © GreenCart.web All Right Reserved.</p>
      </div>
    </>
  )
}

export default Footer;
