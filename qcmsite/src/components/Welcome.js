

import React from 'react'

function Welcome() {
    return (
        <div className="welcome">
            <div className="bg-overlay" />

             <div className="text-container">
             
             <h1 style={{
                 textTransform:"uppercase"
             }}>nos <span>QCM</span> vous aident à comprendre et à mémoriser l'information plus rapidement.</h1>
             
             
             {/* <span className="unsplash">Photo by <a href="https://unsplash.com/@whykei?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">why kei</a> on <a href="https://unsplash.com/s/photos/driving?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
              */}
             </div>
        </div>
    )
}

export default Welcome
