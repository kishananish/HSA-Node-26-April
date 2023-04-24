import express from 'express';
import multer from 'multer';
import {
  s3Uploadv2,
  s3Uploadv3,
  uploadCategoryImage,
  uploadProfilePic,
  uploadServiceFile,
  s3Upload,
  uploadFile,
  deleteFile,
} from '../handler/AWSServicek';
import logger from '../../utils/logger';
import Customer from '../models/Customer';
import * as auth from '../middlewares/auth';
import formatResponse from '../../utils/formatResponse';
import { ensureAdminAuth, ensureAuth } from '../middlewares/auth';

const router = express.Router({ caseSensitive: true });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
  }
};

// ["image", "jpeg"]

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000, files: 2 },
});
// app.post("/upload", upload.array("file"), async (req, res) => {
//   try {
//     const results = await s3Uploadv2(req.files);
//     console.log(results);
//     return res.json({ status: "success" });
//   } catch (err) {
//     console.log(err);
//   }
// });

router.post('/upload', upload.array('file'), async (req, res) => {
  try {
    const results = await s3Uploadv3(req.files);
    console.log(results);
    return res.json({
      status: 'success',
      key: results[0].key,
      imageurl: results[0].Location,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post(
  '/uploadCategoryImage',
  upload.array('category_image'),
  async (req, res) => {
    try {
      const results = await uploadCategoryImage(req.files);
      console.log(results);
      return res.json({
        status: 'success',
        key: results[0].key,
        imageurl: results[0].Location,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.post(
  '/uploadProfilePic',
  upload.array('profile_pic'),
  async (req, res) => {
    try {
      const results = await uploadProfilePic(req.files);
      console.log(results);
      return res.json({
        status: 'success',
        key: results[0].key,
        imageurl: results[0].Location,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.post(
  '/uploadServiceFile',
  upload.array('service_files'),
  async (req, res) => {
    try {
      const results = await uploadServiceFile(req.files);
      console.log(results);
      return res.json({
        status: 'success',
        key: results[0].key,
        imageurl: results[0].Location,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.post(
  '/uploadFile',
  auth.ensureAuth,
  upload.array('file'),
  async (req, res) => {
    try {
      const userId = req.user;
      const user = await Customer.findById(userId);

      if (user.mobile_no != '') {
        const results = await uploadFile(req.files);
        console.log(results);
        logger.info({ mess: 'Uploaded file data info' });

        logger.info({ mess: results });
        logger.info({ mess: 'Uploaded file data info' });

        logger.info({ mess: 'Uploaded file data debug' });
        logger.debug(JSON.stringify(results));

        logger.info({ mess: 'Uploaded file data debug' });

        // logger.info({ mess: 'Error in Uploaded file data 11111' });
        // logger.info({ mess: err });
        // logger.info({ mess: 'Error in Uploaded file data 111' });

        //logger.error({ awsUpload: err, file: req.file });
        return res.json({
          status: 'success',
          key: results[0].key,
          imageurl: results[0].Location,
        });
      } else {
        let error = new Error('Customer not registered!');
        error.ar_message = 'العميل غير مسجل!';
        error.name = 'DataNotFound';
        return formatResponse(res, error);
      }
    } catch (err) {
      logger.info({ mess: 'Error in Uploaded file data' });
      logger.error({ mess: err });
      logger.info({ mess: 'Error in Uploaded file data' });
      console.log(err);
    }
  }
);

// router.delete("/delete/:filename", async (req, res) => {
//   const filename = req.body.key;
//   await s3
//     .deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: filename })
//     .promise();
//   res.send("File Deleted Successfully");
// });

router.post('/deleteFile', async (req, res) => {
  const filename = req.body.key;
  try {
    const results = await deleteFile(filename);
    console.log(results);
    return res.json({
      status: 'success',
      key: req.body.key,
      message: 'File deleted successfully',
    });
  } catch (err) {
    console.log(err);
  }
});

router.post('/uploadBase64Image', async (req, res) => {
  try {
    const binary_image = req.body.binary_image;

    // const type = "PNG";
    // // const params = {
    // //   binary_image,
    // //   type,
    // // };

    // const params = {
    //   base64Data: binary_image,
    //   type: type,
    // };

    const base64Data = new Buffer(
      binary_image.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );
    const type = binary_image.split(';')[0].split('/')[1];
    const params = {
      base64Data,
      type,
    };

    const result = await s3Upload(params);
    const data = { image: result.Key };
    return formatResponse(res, data);
  } catch (err) {
    return formatResponse(res, err);
  }
});

// router.post(
//   '/uploadFile',
//   ensureAuth,
//   uploadFile.single('file'),
//   async (req, res) => {
//     try {
//       const image = `${req.file.fieldname}/${req.file.key}`;
//       let data = { image };
//       return formatResponse(res, data);
//     } catch (err) {
//       return formatResponse(res, err);
//     }
//   }
// );

// router.post(
//   '/uploadCategoryImage',
//   ensureAuth,
//   uploadCategoryImage.single('category_image'),
//   async (req, res) => {
//     try {
//       const image = `${req.file.fieldname.replace('_', '-')}s/${req.file.key}`;
//       let data = { image };
//       return formatResponse(res, data);
//     } catch (err) {
//       return formatResponse(res, err);
//     }
//   }
// );

router.use((error, req, res, next) => {
  console.log(error);
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'file is too large',
      });
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'File limit reached',
      });
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: 'File must be an image',
      });
    }
  }
});

router.get('/createBucket', ensureAdminAuth, async (req, res) => {
  try {
    const result = await createBucket();
    return formatResponse(res, result);
  } catch (err) {
    return formatResponse(res, err);
  }
});

// router.post(
//   '/upload',
//   ensureAuth,
//   uploadServiceFile.single('service_file'),
//   (req, res) => {
//     console.log('upload info-->', req.file);

//     try {
//       const image = `${req.file.fieldname
//         .replace(/ /g, '')
//         .replace('_', '-')}s/${req.file.key.replace(/ /g, '')}`;
//       console.log('upload image====>', image);

//       let data = { image };
//       return formatResponse(res, data);
//     } catch (err) {
//       logger.error({ awsUpload: err, file: req.file });

//       return formatResponse(res, err);
//     }
//   }
// );

// router.post(
//   '/uploadProfilePic',
//   ensureAuth,
//   uploadProfilePic.single('profile_pic'),
//   async (req, res) => {
//     try {
//       const image = `${req.file.fieldname.replace('_', '-')}s/${req.file.key}`;
//       let data = { image };
//       return formatResponse(res, data);
//     } catch (err) {
//       return formatResponse(res, err);
//     }
//   }
// );

// router.post(
//   '/uploadCategoryImage',
//   ensureAuth,
//   uploadCategoryImage.single('category_image'),
//   async (req, res) => {
//     try {
//       const image = `${req.file.fieldname.replace('_', '-')}s/${req.file.key}`;
//       let data = { image };
//       return formatResponse(res, data);
//     } catch (err) {
//       return formatResponse(res, err);
//     }
//   }
// );

// router.post(
//   '/uploadFile',
//   ensureAuth,
//   uploadFile.single('file'),
//   async (req, res) => {
//     try {
//       const image = `${req.file.fieldname}/${req.file.key}`;
//       let data = { image };
//       return formatResponse(res, data);
//     } catch (err) {
//       return formatResponse(res, err);
//     }
//   }
// );

// router.get('/sendSMS', async (req, res) => {
//   try {
//     const params = {
//       Message: 'this is a test message',
//       PhoneNumber: '919970776148',
//     };
//     const result = await snsSendSMS(params);
//     //const data = { result };
//     return formatResponse(res, result);
//   } catch (err) {
//     return formatResponse(res, err);
//   }
// });

router.get('/sendNotification', async (req, res) => {
  try {
    const params = {
      Message: 'this is a test message',
      PhoneNumber: '+917291864691',
    };
    await snsService(params);
    //const result = await snsService(params);
    //console.log('result = ', result.response);

    //const data = { result };
    return formatResponse(res, {});
  } catch (err) {
    return formatResponse(res, err);
  }
});

export default router;
