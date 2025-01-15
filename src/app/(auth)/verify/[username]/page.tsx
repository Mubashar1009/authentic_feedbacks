"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signUpSchema } from "@/schemas/signUpSchema";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const page = () => {
  const router = useRouter();
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = (data: z.infer<typeof verifySchema>) => {
    toast({ title: "Verification successful" });
    try {
      const userVerification = axios.post("/api/verify_code", {
        username,
        code: data.code,
      });

      toast({ title: "User verified successfully" });
      router.push(`/sign_in`);
    } catch (error) {
      toast({ title: "Verification failed", variant: "destructive" });
    }
  };

  return (
    <div className="w-screen h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input placeholder="Code" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default page;
