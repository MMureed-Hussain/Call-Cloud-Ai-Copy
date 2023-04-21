/* eslint-disable */

import { DefaultRoute } from "../router/routes"

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = (num) => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, "")

// ** Checks if the passed date is today
const isToday = (date) =>
{
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}


export const formatDate = (value, formatting = { month: "short", day: "numeric", year: "numeric" }) =>
{
  if (!value) return value
  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) =>
{
  const date = new Date(value)
  let formatting = { month: "short", day: "numeric" }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: "numeric", minute: "numeric" }
  }

  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem("userData")
export const getUserData = () => JSON.parse(localStorage.getItem("userData"))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) =>
{
  if (userRole === "admin") return DefaultRoute
  if (userRole === "client") return "/access-control"
  return "/login"
}

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "#7367f01a", // for option hover bg-color
    primary: "#7367f0", // for selected option bg-color
    neutral10: "#7367f0", // for tags bg-color
    neutral20: "#ededed", // for input border-color
    neutral30: "#ededed" // for input hover border-color
  }
})

export const millisecondsToTime = (milliseconds) =>
{

  const secs = milliseconds / 1000;
  const hours = Math.floor(secs / (60 * 60));

  const divisor_for_minutes = secs % (60 * 60);
  const minutes = Math.floor(divisor_for_minutes / 60);

  const divisor_for_seconds = divisor_for_minutes % 60;
  const seconds = Math.ceil(divisor_for_seconds);

  return {
    h: hours,
    m: minutes,
    s: seconds
  };
}

export const companySizeOptions = [
  {
    label: "1",
    value: "1",
  },
  {

    label: "2-5",
    value: "2-5",
  },
  {
    label: "6-20",
    value: "6-20",
  },
  {
    label: "21-50",
    value: "21-50",
  },
  {
    label: "51-100",
    value: "51-100",
  },
  {
    label: "100-1000",
    value: "100-1000",
  },
  {
    label: "1000+",
    value: "1000+",
  },
];

export const statusOptions = [
  { value: 'CALL', label: 'CALL' },
  { value: 'CLIENT', label: 'CLIENT' },
  { value: 'LEAD_PROFILE', label: 'LEAD PROFILE' },
  { value: 'PIPELINE', label: 'PIPELINE' },
];


export const perPageOptions = [
  { value: 15, label: 15 },
  { value: 25, label: 25 },
  { value: 50, label: 50 },
  { value: 100, label: 100 }
];


export const filterStatus = (statuses, type) =>
{
  return statuses.filter((op) => op.type === type);

}


