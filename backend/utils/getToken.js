import jwt from "jsonwebtoken"

const tokenUtil = {
    getAtToken: async (payload, at_secret) => {
        return await jwt.sign(payload, at_secret, { expiresIn: "60s" })
    }
}

export default tokenUtil;