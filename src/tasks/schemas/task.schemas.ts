import * as mongoose from 'mongoose';

export const TaskSchema = new mongoose.Schema({
  comment: String,
  dateEnd: Date,
  dateStart: Date,
  dtCreated: Date,
  employee: String,
  type: String,
  employeeCreated: String,
});
