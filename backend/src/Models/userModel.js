//User Schema

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { kMaxLength } from "node:buffer";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required: [true, "Please Enter Your Name"],
            //'                  loki          '
            trim: true,
            maxLength:[50, "Your Name Cannot be Longer than 50 Characters"]
        },
        email: {
            type: String,
            required: [true, "Please Enter Your Email"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Please Enter a Valid Email Address"]

        },
        password: {
            type: String,
            required: [true, "Please Enter Your Password"],
            minLength: [8, "Your Password Muste be Longer than 8 Characters"],
            select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please Confirm Your PAssword"],
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: "Passwords are not the Same!!!"
        }

    },
    phoneNumber: {
        type: String,
        required: [true, "Please Enter Your Phone Number"],
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    avatar: {
        url: {type: String},
        public_id: {type: String}
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: {
        type: String,
        select: false,
        index: true
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },

    },
    {timestamps: true}
)

//Settings to not pass in response from server
userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.passwordConfirm;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
    }
})

//Password Logic
//Hashing

userSchema.pre("save", async function() {
    if (!this.isModified("password")) return ;

    this.password = await bcrypt.hash(this.password,10)
    this.passwordConfirm = undefined;
    
}) 

//Logic Check

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)

}

//

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimeStamp;
    }
    return false;
}

//forget password

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}


const User = mongoose.model("User", userSchema);

export {User};