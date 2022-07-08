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