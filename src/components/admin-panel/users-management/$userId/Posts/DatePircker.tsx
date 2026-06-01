import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ReactDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  maxDate?: Date;
  minDate?: Date;
}

const ReactDatePicker = ({
  selected,
  onChange,
  placeholderText = "Select date",
  maxDate,
  minDate,
}: ReactDatePickerProps) => {
  return (
    <div className="relative w-full flex">
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="yyyy-MM-dd"
        placeholderText={placeholderText}
        maxDate={maxDate}
        minDate={minDate}
        wrapperClassName="w-full"
        className="w-full px-6 py-3 bg-gray-900 border border-gray-700 rounded-lg 
                   focus:outline-none focus:border-cyan-500 text-white cursor-pointer"
        calendarClassName="bg-gray-900 border border-gray-700 text-white rounded-xl shadow-2xl"
        filterDate={(date) => {
          if (minDate && date < minDate) return false;
          if (maxDate && date > maxDate) return false;
          return true;
        }}
        dayClassName={(date) => {
          if (minDate && date < minDate)
            return "text-gray-600 opacity-50 cursor-not-allowed hover:cursor-not-allowed";
          if (maxDate && date > maxDate)
            return "text-gray-600 opacity-50 cursor-not-allowed hover:cursor-not-allowed";
          return "";
        }}
        popperClassName="z-50"
      />

      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
        <Calendar size={18} />
      </div>
    </div>
  );
};

export default ReactDatePicker;
