"use client";

export default function RemoveEditor({ editor_id }: { editor_id: string }) {
  return (
    <form
      action={() => {
        const form = new FormData();
        form.append("editor_id", editor_id);
        console.log(form);
      }}
      className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md"
    >
      <button type="submit">Remove</button>
    </form>
  );
}
