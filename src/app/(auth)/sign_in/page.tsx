"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types/Response";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signinSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
    });
    if (result?.error) {
      if (result?.error === "CredentialsSignin") {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
    if (result?.url) {
      router.push("/dashboard");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <FormControl>
                  <Input placeholder="email/username" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">SignIn</Button>
        </form>
      </Form>
    </div>
  );
};

export default page;
