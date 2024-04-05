import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String
        },
        username: {
            type: String,
            unique: true
        },
        email: String,
        password: {
            type: String,
            required: [true, "Please add a password"],
            minLength: [6, "Password must be at least 6 characters"],
        },
        profile_picture: {
            type: String,
            // default: "https://res.cloudinary.com/ddnbvnvlg/image/upload/v1707559171/Untitled_design_1_bcstg8.png"
        },
        bio: {
            type: String,
            default: "no bio"
        },
        onBoarded: {
            type: Boolean,
            default: false
        },
        threads: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Thread'
        }],
        communities: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Community'
        }]




    },



    {
        timestamps: true,
    }
);




const User = models.User || mongoose.model("User", userSchema);
export default User;