import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    accountId: {
        type: String,
        unique: true,
    },

    fullName: {
        type: String,
        required: [true, "Fullname is required"],
        trim: true
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true
    },

    password: {
        type: String,
    },

    role: {
        type: String,
        enum: ["HR", "admin", "employee", "financeManager", "salesManager", "productionManager"],
        required: true
    },

    department: {
        type: String,
        enum: ["Finance", "Sales", "HR", "Production"]
    },

    country: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true,
    },

    refreshToken: {
        type: String
    },
}, { timestamps: true });

// Encrypt the password whenever password changes
userSchema.pre("save", async function(next) {
    
    if (this.isModified("password")) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (error) {
            if (error.name === 'MongoError' && error.code === 11000) {
                next(new Error('Duplicate key error')); 
            } else {
                next(error);
            }
        }
    }

    if (this.isModified("fullName")) {
        try {
            const baseId = this.fullName.replace(/\s+/g, '').toLowerCase();
            let accountId = baseId;
            let suffix = 1;
    
            while (true) {
                const existingUser = await this.constructor.findOne({ accountId });
    
                if (!existingUser) {
                    break; 
                }
    
                accountId = `${baseId}_${suffix}`;
                suffix++;
            }
    
            this.accountId = accountId;
        } catch (error) {
            next(error);
        }
    }

    return next();
});

// Validate Password
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// generate-access-token - it is fast, No async-await
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            role: this.role
        },

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

// generate-refresh-token - it is fast, No async-await
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },

        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User = mongoose.model('User', userSchema);
