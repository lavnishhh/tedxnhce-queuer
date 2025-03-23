import React from 'react'
import { useEffect } from 'react'
import { useQueue } from './services/firebase'
import ButtonComponent from './components'
import { useState } from 'react';
import { useModal } from './services/modal';

function ViewScreen() {

    const { queue, addToQueue, popTeam, listen, removePerson } = useQueue();
    const { showModal } = useModal();

    const [password, setPassword] = useState(null);

    useEffect(() => {
        const unsubscribe = listen();

        return () => unsubscribe();
    }, [])

    if (password != 'lavnish') {
        return <div className='flex flex-col justify-center items-center p-4 h-dvh'>
            <label className='mb-2'>Who's the GOAT?</label>
            <input type="text" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  placeholder-gray-400" />
        </div>
    }

    const popLocal = async ()=>{
        const result = await showModal("Are you sure? This would remove the current top four people from the queue.", true)
        if(result == true){
            await popTeam()
        }
    }

    const removeLocal = async (id)=>{
        const result = await showModal("Are you sure? This would move REMOVE the person from the queue.");
        if(result == true){
            await removePerson(id)
        }
    }

    return (
        <div className='h-dvh flex flex-col'>
            <div className='p-4 flex justify-between'>
                <h1>Currently in queue: {queue.length}</h1>
                <ButtonComponent onClick={popLocal} >
                    Pop
                    {queue.length > 0 && <div className='size-3 ms-3 aspect-square' style={{ backgroundColor: `hsl(0 50% 80%)` }}></div>}
                </ButtonComponent>

            </div>
            <div className='grid grid-cols-3 overflow-y-auto px-4'>
                {queue.map((person, index) => {
                    return <React.Fragment key={index}>
                        <div className='text-center align-middle' style={{ backgroundColor: `hsl(${Math.floor(index / 4) * 90} 50% 80%)` }} >{person.usn}</div>
                        <div className='text-center' >{person.name}</div>
                        <div>
                            <ButtonComponent onClick={async()=>{await removeLocal(person.id)}} className={'mx-auto'}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>

                            </ButtonComponent>
                        </div>
                    </React.Fragment>
                })}
            </div>
        </div>
    )
}

export default ViewScreen