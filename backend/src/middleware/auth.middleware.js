import Jwt from "jsonwebtoken";


export const jwtVerify = (token)=>{
    return Jwt.verify(token, process.env.SECRETKEY, {complete: true});
}

