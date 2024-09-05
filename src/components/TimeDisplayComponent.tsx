"use client";

export default function TimeDisplayComponent({ date }: { date: Date }) {
  return (
    <span>
      {date.toLocaleDateString("en-UK", {
        weekday: "long",
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      })}
    </span>
  );
}
