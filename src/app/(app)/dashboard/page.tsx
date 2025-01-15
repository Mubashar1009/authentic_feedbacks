"use client";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/Response";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteMessage = (messageid: string) => {
    setMessages(messages.filter((message) => message._id !== messageid));
    // setLoading(true);
    // try {
    //   await axios.delete(`/api/messages/${messageid}`);
    //   setMessages(messages.filter(m => m._id!== messageid));
    //   toast({title: "Message deleted", description: "The message has been successfully deleted."});
    // } catch (error) {
    //   toast.error({title: "Error deleting message", description: "Failed to delete the message."});
    // } finally {
    //   setLoading(false);
    // }
  };
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");
  const fetchAcceptingMessages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept_messages`);
      setValue("acceptMessages", response.data.isAcceptingMessage);
      // setMessages(response.data);
    } catch (error) {
      toast({
        title: "Error fetching messages",
        description: "Failed to fetch messages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [setValue]);
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true);
      setIsSwitchLoading(false); //
      try {
        const response = await axios.get<ApiResponse>(`/api/get_messages`);
        setMessages(response.data?.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        toast({
          title: "Error fetching messages",
          description: "Failed to fetch messages.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setIsSwitchLoading(false); //
      }
    },
    [setLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptingMessages();
    fetchMessages();
  }, [session, setValue, fetchMessages, fetchAcceptingMessages]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post(`/api/accept_messages`, {
        isAcceptingMessage: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        description: "The status of accepting messages has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error updating message switch status",
        description: "Failed to update the status of accepting messages.",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };
  const { username } = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  const CopyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Profile URL copied",
      description: "The URL has been copied to your clipboard.",
    });
  };
  if (!session || !session.user) {
    return <div>You are not logged in.</div>;
  }
  return <div>Dashboard</div>;
};

export default page;
