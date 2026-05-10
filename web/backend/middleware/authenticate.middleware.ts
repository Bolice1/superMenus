import { Request, Response, NextFunction } from "express";

export const validate = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        return res.status(500).json({ msg: "authentication failed" })
    }



    next()

}