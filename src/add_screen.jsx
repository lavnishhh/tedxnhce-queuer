import { useState } from 'react'
import ButtonComponent, { spinner } from './components';
import { useQueue } from './services/firebase';
import { useEffect } from 'react';

function AddScreen() {

  const { queue, addToQueue, popTeam, listenCurrentlyPlaying, playing, registered } = useQueue();

  useEffect(() => {
    const unsubscribe = listenCurrentlyPlaying()
    return () => unsubscribe();
  }, [])

  const register = JSON.parse(localStorage.getItem('registered'))

  return (
    <div className='flex flex-col p-4 h-dvh justify-center'>
      <div className='flex justify-center items-center'>
        <img src='/logo-black.png'></img>
      </div>
      <div>
        <h1 className='text-lg text-center'>Currently Playing</h1>
        {playing.length < 4 && <div className='flex justify-center items-center my-10'>{spinner}</div>}
        {playing.length >= 4 && <div className='grid grid-cols-2'>
          {
            playing.map((player, index) => {
              return <div className='flex justify-center items-center text-white aspect-square m-10' key={index} style={{ backgroundColor: `hsl(${Math.random() * 360} 50% 80%)` }} >
                {player.name}
              </div>
            })
          }
        </div>}
      </div>
      {
        (registered) && 
        <div className='flex justify-center flex-col items-center'>
          <div className='text-2xl'>You have registered as {register.name}</div>
          <div className='mt-2'>ID: {register.id}</div>
        </div>
      }
      <RegisterComponent></RegisterComponent>
    </div>
  )
}

function RegisterComponent() {

  const { addToQueue, registered } = useQueue();

  const [team, setTeam] = useState([
    {
      usn: '1NH',
      name: ''
    },
  ]);


  const changeUsn = (i, usn) => {
    const updatedTeam = [...team];
    updatedTeam[i].usn = usn;
    setTeam(updatedTeam);
  }

  const changeName = (i, name) => {
    const updatedTeam = [...team];
    updatedTeam[i].name = name;
    setTeam(updatedTeam);
  }

  const addTeam = async () => {
    const team_id = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    await addToQueue(team[0], team_id)
  }

  const register = JSON.parse(localStorage.getItem('registered'))

  if(registered && ((Date.now() - register.time) < 30 * 60 * 1000)){
    return <div className='text-center'>
      You can register again at {new Date(register.time + (30 * 60 * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
    </div>
  }

  return <div className="flex justify-center flex-col">
    <h1 className='text-3xl text-center'>Register</h1>
    {
      team.map((person, i) => {
        return <div className='mb-4' key={i}>
          <label htmlFor={`player-${i}`} className="block mb-2 text-sm font-medium text-gray-900">Player Details</label>
          <div className='grid grid-cols-1 gap-4'>
            <input type="text" placeholder='USN' value={person.usn} onChange={(e) => changeUsn(i, e.target.value)} id={`player-${i}-usn`} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  placeholder-gray-400" />
            <input type="text" placeholder='Name' value={person.name} onChange={(e) => changeName(i, e.target.value)} id={`player-${i}-name`} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  placeholder-gray-400" />
          </div>
        </div>
      })
    }
    <ButtonComponent onClick={addTeam}>Register</ButtonComponent>
  </div>
}

export default AddScreen
