import mongoose, { Document, Schema, Model } from 'mongoose';

interface IDepartment extends Document {
    name: string;
    description: string;
}

const departmentSchema = new Schema<IDepartment>(
    {
        name: { type: String, required: true },
        description: { type: String }
    },
    { timestamps: { createdAt: 'created_at' } }
);

const Department: Model<IDepartment> = mongoose.model<IDepartment>('Deparment', departmentSchema);

export default Department;
