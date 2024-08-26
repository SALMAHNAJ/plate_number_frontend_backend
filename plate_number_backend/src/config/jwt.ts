import jwt from "jsonwebtoken";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "5h",
  });
};

export default generateToken;
