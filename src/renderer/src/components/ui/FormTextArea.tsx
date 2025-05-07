const FormTextarea = ({ label, name, value, onChange, required = false }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded resize-y min-h-[100px] sm:min-h-[120px] md:min-h-[150px]"
    />
  </div>
)

export default FormTextarea
