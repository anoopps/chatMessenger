// validator
import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const userValidator = [
    body("name").isString().notEmpty().withMessage("Name is required"),
    body("email").isEmail().notEmpty().withMessage("EMail is required"),
    body("password").notEmpty().isLength({ min: 6 }).withMessage("Password min 6 chars")
];

export const loginValidator = [
    body("email").isEmail().notEmpty().withMessage("EMail is required"),
    body("password").notEmpty().isLength({ min: 6 }).withMessage("Password min 6 chars")
];

export const validateRequest = async (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }
    next();
};