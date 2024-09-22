import mongoose, { Document, Schema, Model } from 'mongoose';

interface IBuilding extends Document {
    name: string;
    description: string;
    isShared: boolean;
    department_id: mongoose.Types.ObjectId[];
}

const buildingSchema = new Schema<IBuilding>(
    {
        name: { type: String, required: true },
        description: { type: String },
        isShared: { type: Boolean, default: false },
        department_id: [{ type: Schema.Types.ObjectId, ref: 'Department' }]
    },
    { timestamps: { createdAt: 'created_at' } }
);

const Building: Model<IBuilding> = mongoose.model<IBuilding>('Building', buildingSchema);

export default Building;
