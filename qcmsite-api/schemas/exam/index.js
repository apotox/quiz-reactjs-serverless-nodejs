const { Schema, model,connection } = require("mongoose");

const { v4: uuid } = require("uuid");

const schema = new Schema(
  {
    code: {
      type: String,
      index: {
        unique: true,
      },
    },
    progress: {
      type: Number,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    responces: [
      {
        questionIndex: Number,
        response: [Boolean],
      },
    ],
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

const M = connection.models['Exam'] || model("Exam", schema);

exports.default = M;
