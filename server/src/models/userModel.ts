import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

interface User extends Document {
  username: string;
  email: string;
  photo: string;
  password: string;
  createdAt: Date;
  messages: Schema.Types.ObjectId[];
  correctPassword: Function;
}

const userSchema: Schema<User> = new mongoose.Schema<User>({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    unique: true,
    validate: [validator.isEmail],
    required: [true, "Email is required"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    select: false,
    minlength: 8,
    require: [true, "Provide a password"],
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<User>("User", userSchema);

export default User;
