import z from "zod";

export const formSchemaReset = z.object({
  userId: z.string().min(1, {
    message: " must be at least 2 characters.",
  }),
  oldpassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  newpassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export const formSchema = z.object({
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export const formRegisterSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
});
