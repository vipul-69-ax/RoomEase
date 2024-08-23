import { z } from "zod";

const ProfileCreationFormSchema = z.object({
  name: z.string().min(2).max(30),
  phone: z.string().min(10).max(10),
});

const editProfileSchema = z.object({
  phone:z.string().min(10).max(12),
  office:z.string().max(100).min(0),
})

type EditProfileFormType = z.infer<typeof editProfileSchema>
type ProfileCreationFormType = z.infer<typeof ProfileCreationFormSchema>;

export { ProfileCreationFormSchema, ProfileCreationFormType, editProfileSchema, EditProfileFormType };
