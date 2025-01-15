type ErrorType = {
  success: boolean;
  message: string;
  status: number;
};

export const Responses = ({ success, message, status }: ErrorType) => {
  return Response.json(
    {
      success,
      message,
    },
    { status }
  );
};
