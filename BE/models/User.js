const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["customer", "staff", "admin"],
      default: "customer",
    },
    avatar: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    addresses: [{
      label: { type: String, trim: true, default: "Nhà riêng" },
      recipient: { type: String, trim: true, required: true },
      phone: { type: String, trim: true, required: true },
      address: { type: String, trim: true, required: true },
      city: { type: String, trim: true, required: true },
      postalCode: { type: String, trim: true, default: "" },
      country: { type: String, trim: true, default: "Việt Nam" },
      isDefault: { type: Boolean, default: false },
    }],
    phone: {
      type: String,
      default: "",
    },
    rewardPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    membershipTier: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Diamond"],
      default: "Bronze",
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Auto-calculate tier and encrypt password using bcrypt
userSchema.pre("save", async function () {
  if (this.isModified("rewardPoints") || !this.membershipTier) {
    const pts = this.rewardPoints || 0;
    if (pts >= 3000) {
      this.membershipTier = "Diamond";
    } else if (pts >= 1500) {
      this.membershipTier = "Gold";
    } else if (pts >= 500) {
      this.membershipTier = "Silver";
    } else {
      this.membershipTier = "Bronze";
    }
  }

  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
