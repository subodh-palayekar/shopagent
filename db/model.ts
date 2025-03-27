import mongoose from 'mongoose';

export interface ProductType {
  id: string;
  name: string;
  brand: string;
  business_id: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
  embeddings?: number[];
  attributes: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new mongoose.Schema<ProductType>(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    business_id: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
    },
    attributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    embeddings: {
      type: [Number], // Array of float values for embeddings
      default: [],
      index: '2dsphere', // Indexing (useful if using MongoDB vector search)
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model<ProductType>('Product', productSchema);
