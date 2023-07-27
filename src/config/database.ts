import { ConnectOptions, connect } from "mongoose";

const connectDB = async () => {
  
  const mongoURI = process.env.MONGODB_URI;

  if (mongoURI === undefined) {
    console.log('mongo uri undefined');
    return;
  }
  try {
    await connect(mongoURI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true
     } as ConnectOptions);
    console.log("MongoDB Connected.");
  } catch (err: any) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;