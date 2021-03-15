

import React from 'react'

function Layout({children,margin}) {
    return (
        <div className="layout" style={{marginTop: margin ? "12vh":0}}>
            {children}
        </div>
    )
}

export default Layout
