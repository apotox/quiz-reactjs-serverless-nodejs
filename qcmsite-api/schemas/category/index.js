const mongoose = require("mongoose");

const { v4: uuid } = require("uuid");

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      index: {
        unique: true,
      },
    },
    label: {
      type: String,
      required: true,
      index: {
        unique: true,
      },
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

schema.methods = {
  View() {
    return {
      ...this._doc,
      id: this._id.toString(),
      createdAt: this.createdAt.toISOString(),
    };
  },
};

schema.pre("save", function (next) {
  if (this.isNew) {
    this.code = uuid();
  }

  next();
});


//if(connection.models['Category']) delete connection.models['Category'];
//delete mongoose.connection.models['Category']
const M = mongoose.connection.models['Category'] || mongoose.model("Category", schema);

exports.default = M;

exports.schema = schema
