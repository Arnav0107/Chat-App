import jwt from "jsonwebtoken";
import User from "../model/User.js";
import dotnev from "dotenv";
dotnev.config();

export const ProtectRoute = async (req, res, next) => {
  try{
    const token = req.cookies.jwt;
    if(!token) return res.status (401).json({message : "Unauthorized"});

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    if(!decoded) return res.status(401).json({message : "Unauthorized"});

    const user = await User.findById(decoded.userId).select("-password"); 
    if(!user) return res.status(401).json({message : "Unauthorized"});

    req.user = user;
    next();
  }catch(error){
    console.log("Error in ProtectRoute middleware:", error);
    res.status(500).json({message : "Server error"}); 
  }
}