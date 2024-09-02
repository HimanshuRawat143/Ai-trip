import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { AI_PROMPT, SelectBudgetOptions, SelectTravelerList } from '@/constants/options'
import { Button } from '@/components/ui/button'
import { toast, Toaster } from "sonner"
import { chatSession } from '@/service/AImodal'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { db } from '@/service/FirebaseConfig'
import { doc, setDoc } from "firebase/firestore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom'



function CreateTrip() {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }
  useEffect(() => {
    console.log(formData);
  }, [formData])
  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  })

  const OnGenerateTrip = async () => {

    if (!formData?.location || !formData?.budget || !formData?.traveller) {
      toast("Please fill all details.")
      return;
    }
    if (formData?.noOfDays > 5 || formData?.noOfDays <= 0) {
      toast("No. of days should be more than 0 and less than 6.")
      return;
    }
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true)
      return;
    }
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location)
      .replace('{noOfDays}', formData?.noOfDays)
      .replace('{traveller}', formData?.traveller)
      .replace('{budget}', formData?.budget)
      .replace('{noOfDays}', formData?.noOfDays)
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log(result?.response?.text());
    setLoading(false);
    saveAItrip(result?.response?.text())
  }
  const saveAItrip = async (Tripdata) => {

    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docID = Date.now().toString()
    await setDoc(doc(db, "AItrips", docID), {
      userSelection: formData,
      tripData: JSON.parse(Tripdata),
      userEmail: user?.email,
      id: docID

    });
    setLoading(false);
    navigate('/view-trip/'+docId)
  }


  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      OnGenerateTrip();
    })
  }
  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>
        Tell us your travel preferences 🏕️
      </h2>
      <p className='mt-3 text-gray-500 text-xl'>
        Just provide some basic information, and our trip will generate a customized itinerary based on your preferences.
      </p>
      <div className='mt-20 flex flex-col gap-10'>
        <div>
          <h2 className='text-xl my-3 font-medium'>
            Choose your Destination.
          </h2>
          <Input placeholder={'Name of the place.'}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </div>
        <div>
          <h2 className='text-xl my-3 font-medium'>
            How many days are you planning your trip for?
          </h2>
          <Input placeholder={'Ex.4'} type='number'
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>
        <div>
          <h2 className='text-xl my-3 font-medium'>
            What is your Budget?
          </h2>
          <p className='mt-3 text-gray-500 text-m'>
            The Budget is exclusively allocated for activities and dining purpose.
          </p>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectBudgetOptions.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer
              ${formData?.budget == item.title && 'shadow-lg border-black'}
              `}>
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className='text-xl my-3 font-medium'>
            Who are you Travelling with?
          </h2>
          <div className='grid grid-cols-4 gap-5 mt-5'>
            {SelectTravelerList.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange('traveller', item.people)}
                className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer
                ${formData?.traveller == item.people && 'shadow-lg border-black'}
                `}>
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                <h2 className='text-sm text-gray-500'>{item.people}</h2>
              </div>
            ))}
          </div>
        </div>
        <div className='my-10 justify-end flex'>
          <Button
            disabled={loading}
            onClick={OnGenerateTrip}>
            {loading ?
              <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : 'Generate Trip'
            }
          </Button>
        </div>
        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <img src="logo.svg" />
                <h2 className='font-bold text-lg mt-7'>Sign In with Google</h2>
                <p>Sign In to the app with Google Authentication securely</p>
                <Button
                  onClick={login} className='w-full mt-5 flex gap-4 items-center'>
                  <FcGoogle className='h-6 w-6' />
                  Sign In with Google</Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}

export default CreateTrip
