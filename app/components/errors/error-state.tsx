import { AlertCircle } from "lucide-react";

export const ErrorState = ({ message }: { message: string }) => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    <div className="text-center py-4">
      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
      <h3 className="font-medium text-gray-900 mb-1">{message}</h3>
      <p className="text-sm text-gray-500">Please try again later</p>
    </div>
  </div>
);
