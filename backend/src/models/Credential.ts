import mongoose, { Document, Schema } from 'mongoose';

export interface ICredential extends Document {
  user: mongoose.Types.ObjectId;
  category: string;
  accountName: string;
  username: string;
  password: string; // encrypted
  mpin?: string;
  securityQuestions?: string;
  notes?: string;
}

const CredentialSchema = new Schema<ICredential>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  accountName: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  mpin: { type: String },
  securityQuestions: { type: String },
  notes: { type: String },
});

export default mongoose.model<ICredential>('Credential', CredentialSchema); 