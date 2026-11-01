import { common } from "@/locales/en/common";

export default function Loading() {
  const { loading } = common;
  return (
    <p role="status" className="text-gray-600">
      {loading}
    </p>
  );
}
