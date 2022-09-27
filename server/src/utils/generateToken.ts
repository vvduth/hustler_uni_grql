import jwt from 'jsonwebtoken'

export const JWT_SECRET = "123ab"
const generateToken = (id:string) => {
    return jwt.sign({id}, JWT_SECRET, {
        expiresIn: '30d'
    })
}
export default generateToken