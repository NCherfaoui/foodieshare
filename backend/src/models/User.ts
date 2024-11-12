import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  recipes: mongoose.Types.ObjectId[];
  favorites: mongoose.Types.ObjectId[];
  role: "user" | "admin";
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: { type: Date, default: Date.now },
  recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
  favorites: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
});

// Hash password avant sauvegarde
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Méthode de comparaison de mot de passe
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<UserDocument>("User", userSchema);
