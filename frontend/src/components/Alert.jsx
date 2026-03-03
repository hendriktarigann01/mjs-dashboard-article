import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const Alert = ({ type = "info", message }) => {
  const config = {
    success: {
      icon: <CheckCircle className="text-primary" />,
      bg: "bg-secondary text-primary",
    },
    error: {
      icon: <AlertCircle className="text-red-400" />,
      bg: "bg-red-100 text-red-400",
    },
    warning: {
      icon: <AlertTriangle className="text-yellow-400" />,
      bg: "bg-yellow-100 text-yellow-400",
    },
    info: {
      icon: <Info className="text-blue-400" />,
      bg: "bg-blue-100 text-blue-400",
    },
  };

  return (
    <div
      className={`flex items-center w-full py-8 px-4 h-10 justify-between rounded-md ${config[type].bg}`}
    >
      <div className="flex items-center gap-5">
        {config[type].icon}
        <span className="text-sm">{message}</span>
      </div>
      <div>
        <X className="w-6 h-6 cursor-pointer" />
      </div>
    </div>
  );
};

export default Alert;
