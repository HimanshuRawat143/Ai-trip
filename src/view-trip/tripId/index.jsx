import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function Viewtrip() {
    const {tripId} = useParams();
    const [trip,setTrip] = useState();


    const GetTripData= async()=>{
        const docRef = doc(db,'AITrips',tripId);
        const docSnap = await getDoc(docRef);
        useEffect(()=>{
            tripId&&GetTripData();
        },[tripId])

        // used to get trip information from firebase

        if(docSnap.exists()){
            console.log("Document:",docSnap.data());
            setTrip(docSnap.data());
        }
        else{
            console.log("No Such Documents");
            toast('No trip Found !');
        }
    }
    return (
        <div className='p-10 '>
            {/* Information Section */}
                <InfoSection trip={trip}/>
            {/* Recommended Hotels */}
                <Hotels trip={trip}/>
            {/* Daily Plan */}
                <PlacesToVisit trip={trip}/>
            {/* Footer */}
            <Footer trip={trip}/>
        </div>
    )
}