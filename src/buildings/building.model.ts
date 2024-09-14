import mongoose, { Document, Schema, Model } from 'mongoose';

interface IBuilding extends Document {
    name: string;
    description: string;
}

const buildingSchema = new Schema<IBuilding>(
    {
        name: { type: String, required: true },
        description: { type: String }
    },
    { timestamps: { createdAt: 'created_at' } }
);

const Building: Model<IBuilding> = mongoose.model<IBuilding>('Building', buildingSchema);

export default Building;