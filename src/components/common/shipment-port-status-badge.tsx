const ShipmentPortStatusBadge = ({ status }: { status: number }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 1:
        return {
          text: "Active",
          color:
            "bg-green-100/40 text-green-800 border-green-400 dark:border-green-500/70 border dark:text-green-100 dark:bg-green-800/20",
        };
      case 2:
        return {
          text: "Inactive",
          color:
            "bg-red-100/40 text-red-800 border-red-400 dark:border-red-500/70 border dark:text-red-100 dark:bg-red-800/20",
        };
      default:
        return {
          text: "Unknown",
          color:
            "bg-gray-100/40 text-gray-800 border-gray-400 dark:border-gray-500/70 border dark:text-gray-100 dark:bg-gray-800/20",
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

export default ShipmentPortStatusBadge;
