import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please provide an image file to upload.', 400));
  }

  res.status(200).json({
    success: true,
    data: {
      secure_url: req.file.path,
      public_id: req.file.filename,
    },
  });
});
