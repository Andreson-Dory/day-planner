export const getStatusColors = (status: string) => {
  switch (status) {
    case "completed":
      return {
        bg: "bg-emerald-100 dark:bg-emerald-900",
        text: "text-emarald-800 dark:text-emerald-300",
        dot: "bg-teal-500 dark:bg-green-500",
      };
    case "ongoing":
      return {
        bg: "bg-amber-100 dark:bg-amber-950",
        text: "text-orange-800 dark:text-yellow-300",
        dot: "bg-orange-500 dark:bg-amber-400",
      };
    case "overdue":
      return {
        bg: "bg-red-100 dark:bg-red-950",
        text: "text-red-800 dark:text-red-300",
        dot: "bg-red-500 dark:text-red-500",
      };
    case "upcoming":
      return {
        bg: "bg-blue-100 dark:bg-sky-950",
        text: "text-blue-800 dark:text-sky-300",
        dot: "bg-blue-500 dark:bg-sky-400",
      };
    default:
      return {
        bg: "bg-blue-100 dark:bg-sky-950",
        text: "text-blue-800 dark:text-sky-300",
        dot: "bg-blue-500 dark:bg-sky-400",
      };
  }
};

export const getTaskColor = (status: string) => {
  switch (status) {
    case "completed":
      return {
        tc: "bg-emerald-50 dark:bg-emerald-900",
        bc: "border-l-emerald-500 dark:border-l-green-400",
      };

    case "overdue":
      return {
        tc: "bg-red-50 dark:bg-red-950",
        bc: "border-l-red-500 dark:border-l-red-400",
      };

    case "upcoming":
      return {
        tc: "bg-cyan-50 dark:bg-sky-950",
        bc: "border-l-cyan-500 dark:border-l-sky-400",
      };

    case "ongoing":
      return {
        tc: "bg-amber-50 dark:bg-amber-950",
        bc: "border-l-orange-500 dark:border-l-amber-400",
      };

    default:
      return {
        tc: "bg-cyan-50 dark:bg-sky-950",
        bc: "border-l-cyan-500 dark:border-l-sky-400",
      };
  }
};
