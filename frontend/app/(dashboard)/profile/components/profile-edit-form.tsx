import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Profile } from "@prisma/client";
import { ProfileUpdateValues, profileUpdateSchema } from "@/types";
import { updateProfileFields } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ControllerRenderProps } from "react-hook-form";

interface ProfileEditFormProps {
  profile: Profile;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProfileEditForm({
  profile,
  onSuccess,
  onCancel,
}: ProfileEditFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<ProfileUpdateValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: profile.name || "",
      location: profile.location || "",
      bio: profile.bio || "",
    },
  });

  const mutation = useMutation({
    mutationFn: updateProfileFields,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  const onSubmit = (data: ProfileUpdateValues) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({
            field,
          }: {
            field: ControllerRenderProps<ProfileUpdateValues, "name">;
          }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({
            field,
          }: {
            field: ControllerRenderProps<ProfileUpdateValues, "location">;
          }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Your location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({
            field,
          }: {
            field: ControllerRenderProps<ProfileUpdateValues, "bio">;
          }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending} size="sm">
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
