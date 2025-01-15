import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/Response";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};
export const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();
  const handleConfirmDelete = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete_message/${message._id}`
    );
    onMessageDelete(message._id as string);
    toast({
      title: response.data.message,
      description: "The message has been successfully deleted.",

      duration: 3000,
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <X className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
    </Card>
  );
};
