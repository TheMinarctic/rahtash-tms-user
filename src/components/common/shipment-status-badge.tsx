const ShipmentStatusBadge = ({ status }: { status: number }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 1:
        return {
          text: "Pending",
          color:
            "bg-amber-100/40 text-amber-800 dark:text-amber-100 dark:bg-amber-700/20 border border-amber-400 dark:border-amber-500/70",
        };
      case 2:
        return {
          text: "In Progress",
          color:
            "bg-blue-100/40 text-blue-800 dark:text-blue-100 dark:bg-blue-800/20 border border-blue-400 dark:border-blue-500/70",
        };
      case 3:
        return {
          text: "Completed",
          color:
            "bg-green-100/40 text-green-800 dark:text-green-100 dark:bg-green-800/20 border border-green-400 dark:border-green-500/70",
        };
      case 4:
        return {
          text: "Cancelled",
          color:
            "bg-red-100/40 text-red-800 dark:text-red-100 dark:bg-red-800/20 border border-red-400 dark:border-red-500/70",
        };
      default:
        return {
          text: "Unknown",
          color:
            "bg-gray-100/40 text-gray-800 dark:text-gray-100 dark:bg-gray-800/20 border border-gray-400 dark:border-gray-500/70",
        };
    }
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadge().color}`}
    >
      {getStatusBadge().text}
    </span>
  );
};

export default ShipmentStatusBadge;
