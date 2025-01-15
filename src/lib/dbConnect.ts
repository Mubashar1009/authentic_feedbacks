import mongoose from "mongoose";

type DBconnection = {
  isConnected?: number;
};

const connection: DBconnection = {};

async function getConnection(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to MongoDB!");
    return;
  }
  try {
    console.log("Connecting to MongoDB");
    const dbConnection = await mongoose.connect(process.env.MONGODB_URI || "", {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("DbConnection", dbConnection);
    connection.isConnected = dbConnection.connections[0].readyState;
    // connection.isConnected = 1;
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB!", error);
    process.exit(1);
  }
}

export default getConnection;
