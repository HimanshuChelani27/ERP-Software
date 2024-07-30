import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user-model.js";
import { addUserSchema } from "../schemas/addUserSchema.js";
import bcrypt from 'bcrypt';
import {z} from 'zod';
import { generateAccessAndRefreshTken } from "../utils/authUtils.js";
import { updateSchema } from "../schemas/updateSchema.js";

function generateRandomPassword(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
  }

  return password;
}

const addUser = asyncHandler( async(req, res) => {
    let {fullName, email, role, department, country, phoneNumber} = req.body;

    const validation = addUserSchema.safeParse(req.body);
    
    if (!validation.success) {
      const errors = validation.error.flatten(); 
      const errorResponse = {
          fullNameError: errors.fieldErrors.fullName || "",
          emailError: errors.fieldErrors.email || "",
          roleError: (errors.fieldErrors.role ? "Invalid role":""),
          departmentError: (errors.fieldErrors.department ? "Invalid department" : ""),
          countryError: errors.fieldErrors.country || "",
          phoneNumberError: errors.fieldErrors.phoneNumber || "",
      };

      return res.status(400).json(new ApiResponse(400, errorResponse, "Error in feilds"));
  }

  const password = generateRandomPassword(6);

  const existingUserByEmail = await User.findOne({email});

  if(existingUserByEmail) {
    const errorResponse = {
      emailError: "email is already taken",
    };
    return res
      .status(400)
      .json(
          new ApiResponse(400, errorResponse, "Signup failed")
      )
  }

  const existingUserByPhoneNumber = await User.findOne({phoneNumber});

  if(existingUserByPhoneNumber) {
    const errorResponse = {
      phoneNumberError: "Phone number is already taken",
    };
    return res
      .status(400)
      .json(
          new ApiResponse(400, errorResponse, "Signup failed")
      )
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role,
    department,
    country,
    phoneNumber
  })

  const {accessToken, refreshToken} = await generateAccessAndRefreshTken({"userId":user._id})

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" 
  )

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  }

  if(!createdUser) {
    throw new ApiError(500, "Something went wrong while adding the user")
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: createdUser, refreshToken, accessToken
            },
            "User added successfully"
        )
    )
} )

export {addUser};