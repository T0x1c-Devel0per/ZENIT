import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor ingrese un email válido'],
  },
  phone: {
    type: String,
    trim: true,
    match: [/^(\+57)?\s?(3\d{2})\s?\d{3}\s?\d{4}$|^(\+57)?\s?(3\d{2})\d{7}$/, 'Por favor ingrese un teléfono válido'],
  },
  service: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

export default mongoose.model<IContact>('Contact', contactSchema);