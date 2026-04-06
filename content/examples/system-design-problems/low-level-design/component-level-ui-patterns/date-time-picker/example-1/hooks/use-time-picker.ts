// Custom hook for time picker logic — input handling, format switching, scroll adjustment

import { useCallback, useMemo } from "react";
import { useTimePickerStore } from "../lib/time-picker-store";
import { formatTime } from "../lib/datetime-utils";

export function useTimePicker() {
  const {
    hour,
    minute,
    second,
    isPM,
    format,
    setHour,
    setMinute,
    setSecond,
    toggleAmPm,
    setFormat,
  } = useTimePickerStore();

  // Get display hour based on format
  const displayHour = useMemo(() => {
    if (format === "12h") {
      return hour % 12 || 12;
    }
    return hour;
  }, [hour, format]);

  // Get formatted time string
  const formattedTime = useMemo(() => {
    return formatTime(hour, minute, second, format);
  }, [hour, minute, second, format]);

  // Handle hour input change
  const handleHourChange = useCallback(
    (value: string) => {
      const num = parseInt(value, 10);
      if (!isNaN(num)) {
        setHour(num);
      }
    },
    [setHour]
  );

  // Handle minute input change
  const handleMinuteChange = useCallback(
    (value: string) => {
      const num = parseInt(value, 10);
      if (!isNaN(num)) {
        setMinute(num);
      }
    },
    [setMinute]
  );

  // Handle second input change
  const handleSecondChange = useCallback(
    (value: string) => {
      const num = parseInt(value, 10);
      if (!isNaN(num)) {
        setSecond(num);
      }
    },
    [setSecond]
  );

  // Handle scroll wheel on time list (adjusts minutes)
  const handleScroll = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 1 : -1;
      const newMinute = minute + delta;
      setMinute(newMinute < 0 ? 59 : newMinute > 59 ? 0 : newMinute);
    },
    [minute, setMinute]
  );

  // Handle format switch
  const handleFormatSwitch = useCallback(() => {
    const newFormat = format === "12h" ? "24h" : "12h";
    setFormat(newFormat);
  }, [format, setFormat]);

  // Generate time options for scrollable list (30-min intervals)
  const timeOptions = useMemo(() => {
    const options: { label: string; hour: number; minute: number }[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const displayH = h % 12 || 12;
        const period = h >= 12 ? "PM" : "AM";
        options.push({
          label: format === "24h"
            ? `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
            : `${displayH}:${m.toString().padStart(2, "0")} ${period}`,
          hour: h,
          minute: m,
        });
      }
    }
    return options;
  }, [format]);

  // Validate time values
  const isValid = useMemo(() => {
    if (format === "12h") {
      return hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59 && second >= 0 && second <= 59;
    }
    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 && second >= 0 && second <= 59;
  }, [hour, minute, second, format]);

  return {
    hour,
    minute,
    second,
    displayHour,
    isPM,
    format,
    formattedTime,
    handleHourChange,
    handleMinuteChange,
    handleSecondChange,
    handleScroll,
    handleFormatSwitch,
    toggleAmPm,
    timeOptions,
    isValid,
    setFormat,
  };
}
