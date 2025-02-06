// Description:
// This file is the entry point for the application.
// It sets up an HTTP server, connects to MongoDB,
// and listens for connections on the specified port.

// Module dependencies
import app from "../app.js";
import mongoose from "mongoose";
import { createServer } from "http";
import dotenv from "dotenv";


//dotenv is a popular package for loading environment variables from a .env file into a Node.js application.
// This can be useful for keeping sensitive information (such as API keys) out of version control and easily 
//configurable on different environments (such as development, staging, and production). 

dotenv.config();

// Get port from environment variable or default to 8000
const PORT = process.env.PORT || "8000";
const HOST = process.env.HOST || "localhost";

// Get MongoDB connection URI from environment variable 
const MURI = process.env.ATLAS_URI;

// Create HTTP server.
const server = createServer(app);

// Connect to DB and start the server
async function startServer() {
  try {
    await mongoose.connect(MURI);
    console.log("Connected to MongoDB");
    server.listen(PORT);
    server.on("error", onError);
    server.on("listening", onListening);
    console.log(`Server running at http://${HOST}:${PORT}/`);
  } catch (error) {
    console.error("Mongo Error: " + error);
  }
}

startServer();

// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = `Port ${PORT}`;

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const { port } = server.address();
  console.log(`Listening on Port ${port}`);
}