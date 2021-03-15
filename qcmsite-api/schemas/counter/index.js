const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  name: {
    type: String,
    index: { unique: true },
  },
  value: {
    type: Number,
    default: 0,
  },
});


CounterSchema.statics.getNext = async function (name) {
  let counter = await m.findOne({ name });
  if (counter) {
    counter.value += 1;
  } else {
    counter = new m({ name });
  }
  return counter.save().then(({ value }) => value);
};

const m =  mongoose.connection.models['Counter'] || mongoose.model("Counter", CounterSchema);

exports.default = m;
