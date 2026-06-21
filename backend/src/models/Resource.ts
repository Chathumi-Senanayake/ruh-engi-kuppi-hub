import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description?: string;
  type: 'kuppi' | 'past_paper' | 'assignment' | 'quiz';
  module: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  fileUrl?: string;
  link?: string;
  tags: string[];
  likes: number;
  bookmarks: number;
  reports: number;
  
  year?: number;
  examType?: 'Mid' | 'End Semester' | 'Model';
  itemNumber?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['kuppi', 'past_paper', 'assignment', 'quiz'], required: true },
  module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String },
  link: { type: String },
  tags: [{ type: String }],
  likes: { type: Number, default: 0 },
  bookmarks: { type: Number, default: 0 },
  reports: { type: Number, default: 0 },
  
  year: { type: Number },
  examType: { type: String, enum: ['Mid', 'End Semester', 'Model'] },
  itemNumber: { type: Number },
}, { timestamps: true });

export default mongoose.model<IResource>('Resource', ResourceSchema);
