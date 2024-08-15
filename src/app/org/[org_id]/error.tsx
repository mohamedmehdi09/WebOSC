"use client";
export default function OrgError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return <>{"Organization not found!"}</>;
}
