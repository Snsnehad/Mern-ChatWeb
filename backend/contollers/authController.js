import User from '../models/user.js'
import bcrypt from 'bcryptjs' 
import generateTokenAndSetCookie from '../utils/jwt.js'
export const signup = async (req, res) => {
    try {
      const{fullName, userName, password, gender, confirmPassword} = req.body

      if(password !== confirmPassword){ 
        return res.status(400).json({message: "Passwords don't match"})
      }

      const existingUser = await User.findOne({userName}) 
      if(existingUser){
        return res.status(400).json({message: "User name already taken"})
      }
      const hashedPassword = await bcrypt.hash(password, 12)

      // https://avatar.iran.liara.run/public/job/doctor/male
      const boyProfilePicture =
        `https://avatar.iran.liara.run/public/boy?username=${userName}`;
      const girlProfilePicture = `https://avatar.iran.liara.run/public/girl?username=%${userName}`;

      const newUser = new User ({
        fullName,
        userName,
        password: hashedPassword,
        gender,
        profilePicture: gender === "male"? boyProfilePicture : girlProfilePicture
      })

      generateTokenAndSetCookie(newUser._id, res)
      await newUser.save();

      res.status(201).json({
        _id: newUser._id, 
        fullName: newUser.fullName,
        userName: newUser.userName,
        profilePicture: newUser.profilePicture
    })
    } catch (error) {
      console.log(error)
      res.status(500).json({error: "Internal server error"})
    }
}

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid userName or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.userName,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};