import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPost from '../components/DashPost';
import DashUser from '../components/DashUser';
import DashComment from '../components/DashComment';
import DashboardComponent from '../components/DashboardComponent';

export default function Dashboard() {
    const location = useLocation()
    const [tab, setTab] = useState("");
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab")
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }
    }, [location.search])

    return (

        <div className='min-h-screen flex flex-col md:flex-row'>
            {/* sidebar */}
            <div className="md:w-56">
                <DashSidebar />
            </div>
            {/* profile */}
            {tab === "profile" && <DashProfile />}
            {tab === 'posts' && <DashPost />}
            {tab === 'users' && <DashUser />}
            {tab === 'comments' && <DashComment />}
            {tab === 'dash' && <DashboardComponent />}
        </div>
    )
}
