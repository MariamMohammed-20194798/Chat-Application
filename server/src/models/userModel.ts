import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  email: string;
  photo: string;
  password: string;
  createdAt: Date;
  correctPassword: Function;
}

const userSchema: Schema<IUser> = new mongoose.Schema<IUser>({
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
    default:
      "https://res.cloudinary.com/dwjot1zhy/image/upload/v1698150265/cqwmda1eys6hbf8wlcvo.jpg",
  },
  password: {
    type: String,
    select: false,
    minlength: 8,
    require: [true, "Provide a password"],
  },
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

const User = mongoose.model<IUser>("User", userSchema);

export default User;
