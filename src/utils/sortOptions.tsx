import {
  ArrowDown01,
  ArrowUp01,
  ArrowUpAZ,
  ArrowUpDown,
  CalendarArrowDown,
  CalendarArrowUp,
  ClockArrowDown,
  ClockArrowUp,
} from "lucide-react";

export const userSortOptions = [
  { icon: <ArrowUpDown size={14} />, value: "", label: "Sort by…" },
  { icon: <ArrowUp01 size={14} />, value: "id_asc", label: "ID (ascending)" },
  {
    icon: <ArrowDown01 size={14} />,
    value: "id_des",
    label: "ID (descending)",
  },
  {
    icon: <ArrowUpAZ size={14} />,
    value: "username_asc",
    label: "Username (A → Z)",
  },
  {
    icon: <ArrowDown01 size={14} />,
    value: "username_des",
    label: "Username (Z → A)",
  },
  { icon: <ArrowUpAZ size={14} />, value: "name_asc", label: "Name (A → Z)" },
  { icon: <ArrowDown01 size={14} />, value: "name_des", label: "Name (Z → A)" },
  { icon: <ArrowUpAZ size={14} />, value: "email_asc", label: "Email (A → Z)" },
  {
    icon: <ArrowDown01 size={14} />,
    value: "email_des",
    label: "Email (Z → A)",
  },
  {
    icon: <CalendarArrowUp size={14} />,
    value: "registered_newest",
    label: "Registered (Newest first)",
  },
  {
    icon: <CalendarArrowDown size={14} />,
    value: "registered_oldest",
    label: "Registered (Oldest first)",
  },
  {
    icon: <ClockArrowUp size={14} />,
    value: "last_login_newest",
    label: "Last Login (Newest first)",
  },
  {
    icon: <ClockArrowDown size={14} />,
    value: "last_login_oldest",
    label: "Last Login (Oldest first)",
  },
];

export const postSortOptions = [
  { icon: <ArrowUpDown size={14} />, value: "", label: "Sort by…" },
  { icon: <ArrowUp01 size={14} />, value: "id_asc", label: "ID (ascending)" },
  {
    icon: <ArrowDown01 size={14} />,
    value: "id_des",
    label: "ID (descending)",
  },
  { icon: <ArrowUpAZ size={14} />, value: "title_asc", label: "Title (A → Z)" },
  {
    icon: <ArrowDown01 size={14} />,
    value: "title_des",
    label: "Title (Z → A)",
  },
  {
    icon: <ArrowUpAZ size={14} />,
    value: "category_name_asc",
    label: "Category (A → Z)",
  },
  {
    icon: <ArrowDown01 size={14} />,
    value: "category_name_des",
    label: "Category (Z → A)",
  },
  {
    icon: <CalendarArrowUp size={14} />,
    value: "created_newest",
    label: "Created (Newest first)",
  },
  {
    icon: <CalendarArrowDown size={14} />,
    value: "created_oldest",
    label: "Created (Oldest first)",
  },
];
