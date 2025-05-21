"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";

export function CurrentTime() {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setDateTime(dayjs().format("dddd, MMMM D, h:mm A"));
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);

    return () => clearInterval(interval);
  }, []);

  return <span className="text-muted-foreground text-sm">{dateTime}</span>;
}
