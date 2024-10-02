import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface ILocation extends Document {
    name: string;
    type: string;
    description: string;
    building_id: Types.ObjectId;
    department_id: Types.ObjectId;
}

const locationSchema = new Schema<ILocation>(
    {
        name: { type: String, required: true },
        type: { type: String, required: true },
        description: { type: String },
        building_id: { type: Schema.Types.ObjectId, ref: 'Building', required: true },
        department_id: { type: Schema.Types.ObjectId, ref: 'Department', required: true }
    },
    { timestamps: { createdAt: 'created_at' } }
);

const Location: Model<ILocation> = mongoose.model<ILocation>('Location', locationSchema);

export default Location;
