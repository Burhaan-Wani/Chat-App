import catchAsync from "../lib/catchAsync.js";
import cloudinary from "../lib/cloudinary.js";
import { messageSchema } from "../lib/schemas.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsers = catchAsync(async (req, res, next) => {
  const loggedInUserId = req.user._id.toString();

  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select("-password");

  res.status(200).json({
    status: "success",
    data: {
      users: filteredUsers,
    },
  });
});

export const getMessages = catchAsync(async (req, res, next) => {
  const userToChatWithId = req.params.id;
  const myId = req.user._id;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatWithId },
      { senderId: userToChatWithId, receiverId: myId },
    ],
  });

  res.status(200).json({
    status: "success",
    data: {
      messages,
    },
  });
});

export const sendMessage = catchAsync(async (req, res, next) => {
  const { success, error } = messageSchema.safeParse(req.body);
  if (!success) {
    const err = error.errors.map(error => error.message).join(". ");
    return next(new AppError(err, 400));
  }

  const receiverId = req.params.id;
  const senderId = req.user._id;

  let imageUrl;
  if (req.body.image) {
    const respondedUrl = await cloudinary.uploader.upload(req.body.image);
    imageUrl = respondedUrl.secure_url;
  }

  const newMessage = await Message.create({
    senderId,
    receiverId,
    text: req.body.text,
    image: imageUrl,
  });

  res.status(201).json({
    status: "success",
    data: {
      message: newMessage,
    },
  });
});
