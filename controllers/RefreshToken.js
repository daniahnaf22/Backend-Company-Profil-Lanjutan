import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(401);
    }

    const user = await User.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) {
      return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }

      const { id, name, email } = user;
      const accessToken = jwt.sign(
        { userId: id, name, email },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "15s",
        }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
