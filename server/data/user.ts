import bcrypt from 'bcryptjs'

const users =  [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'Aino Ista',
        email: 'aino@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'Luna',
        email: 'luna@example.com',
        password: bcrypt.hashSync('123456', 10),
    },
    {
        name: 'Bruno',
        email: 'bruno@example.com',
        password: bcrypt.hashSync('123456', 10),
    }
]

export default users