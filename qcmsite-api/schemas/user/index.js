const mongoose = require("mongoose");
const md5 = require("md5");
const { v4: uuid } = require("uuid");
const shortid = require("shortid");

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      index: {
        unique: true,
      },
    },
    username: {
      type: String,
    },
    firstname: {
      type: String,
      required: [true, "Prénom est obligatoire"],
      maxlength: 50,
    },
    lastname: {
      type: String,
      required: [true, "Nom est obligatoire"],
      maxlength: 50,
    },
    address: {
      type: String,
      maxlength: 120,
    },
    fullname: {
      type: String,
      maxlength: 50,
    },
    mobile: {
      type: String,
      maxlength: 30,
      required: [true, "Mobile est obligatoire"],
      // index: {
      //   unique: true,
      // },
    },
    email: {
      type: String,
      index: {
        unique: true,
      },
      validate: {
        validator: function (v) {
          return /^[a-z][a-z0-9\-\.]{3,22}@([a-z0-9\-\.]{3,22})\.[a-z]{2,5}$/.test(
            v
          );
        },
        message: "{VALUE} n'est pas un e-mail valide",
      },
      required: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: true,
      default: "student",
    },
    photo: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    activatedAt: {
      type: Date,
    },
    activatedBy: {
      type: String,
    },
    wilaya: {
      type: String,
      required: true,
    },
    address: {
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
      password: null,
    };
  },
  resetPassword() {
    let password = shortid.generate();
    this.password = md5(`--${password}--`);

    return password;
  },
};

schema.pre("save", function (next) {
  if (this.isNew) {
    this.code = uuid();
    this.username = `${this.firstname.replace(/\s/, "")}-${this.code.substr(
      0,
      5
    )}`;
  }

  if (this.isNew) {
    this.password = md5(`--${this.password}--`);
  }

  if (
    this.isNew ||
    this.isModified("firstname") ||
    this.isModified("lastname")
  ) {
    this.fullname = `${this.firstname} ${this.lastname}`;
  }

  next();
});

schema.statics.valideUser = function (username, password) {
  return this.model("User").findOne({
    password: md5(`--${password}--`),
    username,
  });
};
//delete mongoose.connection.models['User'];

const M =mongoose.connection.models['User'] || mongoose.model("User", schema);

exports.default = M;
exports.schema = schema