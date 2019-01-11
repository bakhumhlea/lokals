export const switchIcon = (value) => {
  switch (value) {
    case "restaurant":
      return "utensils";
    case "bar":
      return "glass-martini";
    case "coffee":
      return "coffee";
    default:
      return "building";
  }
};