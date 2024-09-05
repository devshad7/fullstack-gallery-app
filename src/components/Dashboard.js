import React from 'react'
import Navbar from './Navbar'
import Gallery from './Gallery'

const Dashboard = () => {
    return (
        <>
            <div className="flex min-h-screen w-full flex-col">
                <Navbar />
                <Gallery />
            </div>
        </>
    )
}

export default Dashboard