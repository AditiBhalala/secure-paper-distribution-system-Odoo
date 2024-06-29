const mongoose = require('mongoose');
const examPaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: Buffer, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ExamPaper', examPaperSchema);
