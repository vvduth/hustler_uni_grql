const users:any[] = [] ;

// Join users to chat 
export function userJoin (id: any, username: any, room: any) {
    const user = {id, username, room} ;
    users.push(user) ;
    return user ;
}

export function getCurrentUser (id: any) {
    return users.find(user => user.id === id ) ;
}

// user leaves chaet 
export function userLeaves(id:any)  {
    const index = users.findIndex(user => user.id === id) ;
    if (index !== -1 ) {
        return users.splice(index, 1)[0] ;
    }
} 

// Get room 
export function getRoomUser ( room:any) {
    return users.filter(user => user.room === room)
}