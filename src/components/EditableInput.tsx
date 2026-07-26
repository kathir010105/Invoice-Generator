import { FC } from 'react'
import { Text } from '@react-pdf/renderer'
import compose from '../styles/compose'

interface Props {
  className?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  pdfMode?: boolean
}

const EditableInput: FC<Props> = ({
  className = '',
  placeholder = '',
  value = '',
  onChange,
  pdfMode,
}) => {
  if (pdfMode) {
    return (
      <Text style={compose(`span ${className}`)}>
        {value}
      </Text>
    )
  }

  return (
    <input
      type="text"
      className={`input ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  )
}

export default EditableInput
