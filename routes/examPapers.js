const express = require('express');
const multer = require('multer');
const { encrypt } = require('../utils/encryption');
const ExamPaper = require('../models/ExamPaper');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', auth([roles.admin, roles.examiner]), upload.single('paper'), async (req, res) => {
  const { title } = req.body;
  const encryptedContent = encrypt(req.file.buffer);
  const paper = new ExamPaper({ title, content: Buffer.from(encryptedContent.content, 'hex'), uploadedBy: req.user._id });
  await paper.save();
  res.send('Paper uploaded successfully');
});

router.get('/view/:id', auth([roles.admin, roles.examiner, roles.invigilator]), async (req, res) => {
  const paper = await ExamPaper.findById(req.params.id);
  if (!paper) {
    return res.status(404).send('Paper not found');
  }
  res.set('Content-Type', 'application/pdf');
  res.send(Buffer.from(paper.content, 'hex'));
});

module.exports = router;
