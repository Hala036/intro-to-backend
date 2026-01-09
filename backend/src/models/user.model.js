import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
    {
        username: { 
            type: String, 
            required: true, 
            unique: true ,
            lowercase: true ,
            trim: true ,
            minlength: 3,
            maxlength: 30
        },
        email: { 
            type: String, 
            required: true, 
            unique: true,
            lowercase: true,
            trim: true
        },
        password: { 
            type: String, 
            required: true,
            minlength: 6,
            maxlength: 50
        },
    },

    {
        timestamps: true
    }
)

// hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
})

// compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model('User', userSchema);
