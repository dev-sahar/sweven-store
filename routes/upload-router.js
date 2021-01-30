import express from 'express';
import cloudinary from 'cloudinary';
import fs from 'fs';

import auth from '../middleware/auth.js';
import authAdmin from '../middleware/auth-admin.js';

const router = express.Router();

router.post('/upload', auth, authAdmin, (req, res) => {
  try {
    (!req.files || Object.keys(req.files).length === 0) &&
      res.status(400).json({ msg: 'Please upload an image.' });

    const file = req.files.file;
    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: 'File size is too large' });
    }

    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: 'File format is not supported.' });
    }

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: 'sweven' },
      async (error, result) => {
        if (error) throw error;

        removeTmp(file.tempFilePath);

        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
});

router.post('/destroy', auth, authAdmin, (req, res) => {
  try {
    const { public_id } = req.body;

    !public_id && res.status(400).json({ msg: 'No images selected.' });

    cloudinary.v2.uploader.destroy(public_id, async (error, result) => {
      if (error) throw error;

      res.json({ msg: 'Image deleted successfully.' });
    });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
});

const removeTmp = (path) => {
  fs.unlink(path, (error) => {
    if (error) throw error;
  });
};

export default router;
