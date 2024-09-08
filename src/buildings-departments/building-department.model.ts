import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface IBuildingDepartment extends Document {
    department_id: Types.ObjectId;
    building_id: Types.ObjectId;
}

const buildingDepartmentSchema = new Schema<IBuildingDepartment>(
    {
        department_id: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
        building_id: { type: Schema.Types.ObjectId, ref: 'Building', required: true }
    },
    { timestamps: { createdAt: 'created_at' } }
);

const BuildingDepartment: Model<IBuildingDepartment> = mongoose.model<IBuildingDepartment>(
    'Building-Department',
    buildingDepartmentSchema
);

export default BuildingDepartment;
