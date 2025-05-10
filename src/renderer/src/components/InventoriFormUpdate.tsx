import React from 'react'
import * as Type from '@renderer/types/inventori_type'
import FormAction from '@renderer/components/ui/FormAction'
import FormInput from '@renderer/components/ui/FormInput'

interface Props {
  initialValues: Type.InventoriFormValues & { id: string | number }
  onSubmit: (formData: Type.InventoriFormValues) => void
  onCancel: () => void
}

const InventoriFormUpdate: React.FC<Props> = ({ initialValues, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState<Type.InventoriFormValues>({
    stok_minimal: initialValues.stok_minimal
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value) || 0
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Edit Inventori</h2>
      <FormInput
        label="Stok Minimal"
        name="stok_minimal"
        value={formData.stok_minimal.toString()}
        onChange={handleChange}
        type="number"
        required
      />
      <FormAction label="Ubah Inventori" onCancel={onCancel} />
    </form>
  )
}

export default InventoriFormUpdate
