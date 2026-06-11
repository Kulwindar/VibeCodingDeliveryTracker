interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center" data-testid="error-message">
      <p className="text-red-600 font-medium">{message}</p>
    </div>
  );
}