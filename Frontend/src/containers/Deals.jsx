import React, { useEffect } from "react";

function Deals() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-center">No Deals Available</h2>
      </div>

    </>
  )
}

export default Deals;
