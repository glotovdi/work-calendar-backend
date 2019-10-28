import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  userName: String,
  location: String,
  position: String,
  whenCreated: String,
  email: String,
  telNumber: String,
  physicalDeliveryOfficeName: String,
  mailNickname: String,
});
