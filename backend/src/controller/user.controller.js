import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateRefreshTokenAndAccessToken = async (userId) => {
  try {
    console.log(userId);
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (e) {
    throw new ApiError(
      500,
      "something went wrong while generating tokens: ",
      e,
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email + " " + password);
  if (!email || !password) {
    throw new ApiError(400, "all fields are required");
  }

  const present = await User.findOne({ email });
  if (present) throw new ApiError(400, "user already exist");

  const user = await User.create({ email, password });
  const created = await User.findById(user._id).select("-password");
  if (!created) throw new ApiError(400, "failed to create new user");

  return res
    .status(200)
    .json(new ApiResponse(200, created, "user created succesfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email + " " + password);
  if (!email || !password)
    throw new ApiError(400, "email and password are required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "user does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "invalid user credentials");
  }

  const { refreshToken, accessToken } =
    await generateRefreshTokenAndAccessToken(user?._id);
  const loggedInUser = await User.findById(user?._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged in succesfully..",
      ),
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { user } = req.user;
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user is fetched"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"));
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const user = req.user;
  if (!user) throw new ApiError(400, "user is not logged in");
  const task = await Task.create({
    userId: user._id,
    title,
    description,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "task is generated succesfully..."));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.body;
  const task = await Task.findByIdAndDelete(taskId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "task deleted succesfully..."));
});

const completionToggle = asyncHandler(async (req, res) => {
  const { taskId } = req.body;
  if (!taskId) {
  throw new ApiError(400, "Task ID is required");
}
  const task = await Task.findByIdAndUpdate(taskId, [
    {
      $set: {
        completed: { $not: "$completed" },
      },
    },
  ]);

  task.completed = !task.completed

  return res
  .status(200)
  .json(new ApiResponse(200, task, "complete toggele done"))
});

const getAllTask = asyncHandler(async (req, res)=>{
    const tasks = await Task.find({userId: req.user?._id});
    if(!tasks){
        throw new ApiError(400,"no task are created by user")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,tasks,"all tasks are fetched..."))
})
export {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  createTask,
  deleteTask,
  completionToggle,
  getAllTask
};
