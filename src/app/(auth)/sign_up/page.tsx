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

const page = () => {
  const [username, setUsername] = useState("");
  const [userMessages, setUserMessages] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);

  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "" },
  });
  useEffect(() => {
    const checkUser = () => {
      setIsCheckingUsername(true);
      axios
        .get(`/api/check_username?username=${username}`)
        .then((response) => {
          setIsCheckingUsername(false);
          setUserMessages(response.data.message);
        })
        .catch((error) => {
          const err = error as AxiosError<ApiResponse>;
          setIsCheckingUsername(false);
          setUserMessages(
            error.response?.data.message ?? "User name is not unique "
          );
        });
    };
    checkUser();
  }, [username]);

  const onSubmit = (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    axios
      .post("/api/signup", data)
      .then((response) => {
        setIsSubmitting(false);
        toast({ title: "User registered successfully" });
        form.reset();
        router.push(`/verify/${username}`);
      })
      .catch((error) => {
        const err = error as AxiosError<ApiResponse>;
        setIsSubmitting(false);
        toast({
          title: "User registration failed",
          description:
            error.response?.data.message ??
            "Failed to register user. Please try again.",
          variant: "destructive",
        });
      });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="username"
                    {...field}
                    onChange={(e) => debounced(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {isCheckingUsername && <Loader2 className="h-4 w-4 animate-spin" />}
          {
            <p
              className={`${
                userMessages === "User name is unique"
                  ? "text-green-500"
                  : "text-red-400"
              }`}
            >
              {userMessages}
            </p>
          }
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default page;
