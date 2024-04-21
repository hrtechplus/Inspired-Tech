import mongoose from 'mongoose';

const { Schema } = mongoose;

const parcelSchema = new Schema({
  parcelId: {
    type: String,
    unique: true,
    required: [true, "Parcel ID can't be blank"],
  },
  status: {
    type: String,
    enum: ['In Transit', 'Delivered', 'Pending'],
    default: 'Pending',
  },
  handOverDate: {
    type: Date,
    default: null,
  },
  deliveryCost: {
    type: Number,
    required: [true, "Delivery cost can't be blank"],
  },
  trackingNumber: {
    type: String,
    required: [true, "Tracking number can't be blank"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
});

export default mongoose.model('Parcel', parcelSchema);
