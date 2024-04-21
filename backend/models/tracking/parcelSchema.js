import mongoose from 'mongoose';

const parcelSchema = mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming the user model is named 'User'
    required: true,
  },
});

const ParcelModel = mongoose.model('Parcel', parcelSchema);
export default ParcelModel;
