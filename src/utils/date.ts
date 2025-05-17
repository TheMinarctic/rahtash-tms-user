import moment from "jalali-moment";

type Options = {
  locale?: "fa" | "en";
};

const defaultOptions: Options = {
  locale: "en",
};

export const DateFormat = {
  YYYY_MM_DD: (date: Date | string | number, options: Options = defaultOptions) =>
    moment(new Date(date))
      .locale(options.locale)
      .format(options.locale === "en" ? "YYYY-MM-DD" : "jYYYY/jMM/jDD"),
};
