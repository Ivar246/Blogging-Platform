import jwt from "jsonwebtoken"

const tokenUtil = {
    getAtToken: (payload, at_secret) => {
        return jwt.sign(payload, at_secret, { expiresIn: "1d" })
    }
}

export default tokenUtil;