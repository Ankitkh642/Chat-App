const users=[]

// addUser ,removeUser,getUser,usersInRoom
const addUser=({id,username,room})=>{
    //data cleaning
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate data
    if(!username || !room)
    {
        return{
            error:'username and room required'
        }
    }

    // validate username
    const existingUser=users.find((user)=>{
        return user.room===room && user.username===username
    })

    if(existingUser)
    {
        return {
            error:'Username already taken'
        }
    }

    //store user
    const user={id,username,room}
    users.push(user)
    return { user }
}

const removeUser=(id)=>{
    //validate id
    const index=users.findIndex((user)=>{
        return user.id===id
    })
    if(index!=-1)
    {
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })
    if(index!=-1)
    {
        return users[index]
    }
}

const getUsersInRoom=(room)=>{
    // filter room
    room=room.trim().toLowerCase()

    const usersInRoom=users.filter((user)=>{
        return user.room===room
    })
    return usersInRoom
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}