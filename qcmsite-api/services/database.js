const mongoose = require("mongoose");

let connected;

const connectToDatabase = async () => {
  if (connected) {
    //trace("info", "using existing connection");
    //console.log("using existing connection", Object.keys(mongoose.connection.models));
    return true;
  }

  mongoose.Types.ObjectId.prototype.view = function () {
    return { id: this.toString() };
  };

  mongoose.set("useCreateIndex", true);

  mongoose.Promise = global.Promise;

  try {
    const conns = {
      pro: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_ADR}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
      dev: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_ADR}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
      test: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_ADR}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    };

    if (process.env.NODE_ENV != "production") {
      console.log(
        "try to connect to database...",
        process.env.MONGO_ADR,
        process.env.STAGE
      );
    }

    let db = await mongoose.connect(conns[process.env.STAGE], {
      // Buffering means mongoose will queue up operations if it gets
      // disconnected from MongoDB and send them when it reconnects.
      // With serverless, better to fail fast if not connected.
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // and MongoDB driver buffering
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    //isConnected = db.connections[0].readyState;

    connected = db.connections[0].readyState;

    return connected;
  } catch (err) {
    console.log("err mongodb connectDB", err);
    return false;
  }
};

module.exports = {
  connectToDatabase,
};
