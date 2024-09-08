// src/users/user.model.ts
import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    department_id: Types.ObjectId;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, required: true },
        department_id: { type: Schema.Types.ObjectId, ref: 'Department' }
    },
    { timestamps: { createdAt: 'created_at' } }
);

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
