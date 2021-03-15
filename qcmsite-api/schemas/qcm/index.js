const mongoose = require("mongoose");

const { v4: uuid } = require("uuid");
const { default: Category } = require("../category");

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      index: {
        unique: true,
      },
    },
    question: {
      type: String,
      index: {
        unique: true,
      },
    },
    valid: {
      type: [Boolean],
    },
    suggestions: {
      type: [String],
      required: [true, "please add some suggestions"],
    },
    note: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
      required: [true, "please select a corespondant category!"],
    },
    categoryLabel: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    imageUrl:{
      type: String
    }
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

schema.pre("save", async function () {
  if (this.isNew) {
    this.code = uuid();
    if (this.category) {
      let cat = await Category.findById(this.category);
      this.categoryLabel = cat ? cat.label : "Supprimée";
    }
  }

  if (!this.isNew && this.isModified("category")) {
    if (this.category) {
      let cat = await Category.findById(this.category);
      this.categoryLabel = cat ? cat.label : "Supprimée";
    }
  }
});

//delete mongoose.connection.models['Qcm'];
const M = mongoose.connection.models["Qcm"] || mongoose.model("Qcm", schema);

exports.default = M;
exports.schema = schema;
