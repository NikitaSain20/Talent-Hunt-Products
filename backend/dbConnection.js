import mongoose from "mongoose";

const IsDbConnected = (mongoURL) => {
  mongoose
    .connect(mongoURL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
};

export default IsDbConnected;
