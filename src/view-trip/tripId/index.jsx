import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';

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
        <div>
            {/* Information Section */}
            
            {/* Recommended Hotels */}

            {/* Daily Plan */}

            {/* Footer */}
        </div>
    )
}