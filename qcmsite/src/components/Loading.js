import React from 'react'
import {useSelector} from 'react-redux'
function Loading() {
    const isLoading = useSelector(state=>state.appReducer.loading)

    if(!isLoading) return <></>
    return (
        <div className="loading-bar">
            <span>chargement...</span>
        </div>
    )
}

export default Loading
