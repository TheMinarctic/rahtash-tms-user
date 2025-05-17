export const objectToQueryString = (
  object: any,
  options: { isValidNullValue?: boolean } = { isValidNullValue: false },
) => {
  const searchParams = new URLSearchParams(object);
  const cleanedSearchParams = new URLSearchParams();

  Object.keys(object).forEach((key) => {
    const value = searchParams.get(key);

    if (value?.trim() === "" || value === "undefined" || value === null) {
      return null;
    }

    if (!options.isValidNullValue && value === "null") {
      return null;
    }

    cleanedSearchParams.append(key, value);
  });

  const cleanedSearchParamsLength = [...cleanedSearchParams.keys()].length;

  if (cleanedSearchParamsLength > 0) {
    return `?${cleanedSearchParams.toString()}`;
  }

  return "";
};
