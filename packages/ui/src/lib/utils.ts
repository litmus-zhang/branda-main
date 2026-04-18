import { clsx, type ClassValue } from "clsx";
import { Country } from "country-list-with-dial-code-and-flag";
import { twMerge } from "tailwind-merge";
import { compareAsc, format, formatDistanceToNow } from "date-fns";
import { filesize } from "filesize";



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractCountryInfo = (countries: Country[]) => {
  const seen = new Set<string>();

  return countries
    .map((country) => ({
      value: country.code,
      label: country.name,
      flag: country.flag,
    }))
    .filter((item) => {
      if (!seen.has(item.value)) {
        seen.add(item.value);
        return true;
      }
      return false;
    });
};

//a utility function to check if the createdAt field is within 24 hrs, then add make it a new opportunity
export const isNewOpportunity = (createdAt: string) => {
  return formatDistanceToNow(createdAt, { addSuffix: true })

};

//a utility function to return the day difference between today and deadline date using date-fns
export const getDeadlineDays = (deadline: string) => {
  return formatDistanceToNow(deadline, { addSuffix: true })

}
export const formatDate = (date: string = new Date().toISOString()) => {
  return format(new Date(date), "dd MMM, yyyy")
}
export const formatGraphDate = (date: string = new Date().toISOString()) => {
  return format(new Date(date), "yyyy-MM-dd")
}
export const formatDateWithHr = (date: string = new Date().toISOString()) => {
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a")
}

export const checkValue = (val1: any, val2: string) => val1 === val2

export const arrayToString = (arr: string[]) => arr.join(" ,")
export const getFileSize = (size: number) => filesize(size, { standard: "jedec" }); // "259.1 KB"


type InterfaceFields<T> = {
  [K in keyof T]: K;
}[keyof T];



// export function getInterfaceKeys<T>(obj?: T): Array<InterfaceFields<T>> {
//   return Object.keys(obj || {}) as Array<keyof T>;
// }
