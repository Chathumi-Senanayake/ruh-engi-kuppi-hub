import mongoose, { Schema, Document } from 'mongoose';

export interface IModule extends Document {
  code: string;
  name: string;
  department?: mongoose.Types.ObjectId;
  year: number;
  semester: number;
  description?: string;
}

const ModuleSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department' },
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
  description: { type: String },
});

export default mongoose.model<IModule>('Module', ModuleSchema);
