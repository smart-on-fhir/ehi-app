export default function SelectDropdown<T>({
  options,
  placeholder,
}: {
  options: T[];
  placeholder: string;
}) {
  return (
    <select className="h-fit p-2">
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option value={"Approve"}>Approve</option>
      ))}
      <option value={"Reject"}>Reject</option>
    </select>
  );
}
