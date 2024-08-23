import { z } from "zod";

const AuthFormSchema = z.object({
  email: z.string().email({
    message: "Email is invalid.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be no more than 100 characters long" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character",
    }),
});

type AuthFormType = z.infer<typeof AuthFormSchema>;

const PasswordRecoverFormSchema = z.object({
  email: z.string().email({
    message: "Email is invalid.",
  }),
});

type PasswordRecoverFormType = z.infer<typeof PasswordRecoverFormSchema>;

export {
  AuthFormSchema,
  AuthFormType,
  PasswordRecoverFormSchema,
  PasswordRecoverFormType,
};
