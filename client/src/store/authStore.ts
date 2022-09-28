import React from 'react' 
import create from 'zustand'
import {persist} from 'zustand/middleware'
import {io} from 'socket.io-client'


const authStore = (set: any) => ({
    userProfile: null  , 
    allUsers: [] , 
    addUser: (user: any) =>set({userProfile: user}) ,
    removeUser: () => set({userProfile: null})
})

const useAuthStore = create(
    persist(authStore, {
        name: 'auth' , 
        
    })
)

export default useAuthStore 