import { FC, useRef, useState } from 'react'
import Slider from 'rc-slider'
import { Image } from '@react-pdf/renderer'
import useOnClickOutside from '../hooks/useOnClickOutside'
import compose from '../styles/compose'
import 'rc-slider/assets/index.css'

interface Props {
  className?: string
  placeholder?: string
  value?: string
  width?: number
  minWidth?: number
  maxWidth?: number
  onChangeImage?: (value: string) => void
  onChangeWidth?: (value: number) => void
  pdfMode?: boolean
}

const EditableFileImage: FC<Props> = ({
  className,
  placeholder,
  value,
  width,
  minWidth = 100,
  maxWidth = 250,
  onChangeImage,
  onChangeWidth,
  pdfMode,
}) => {
  const fileInput = useRef<HTMLInputElement>(null)
  const widthWrapper = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const step = Math.round((maxWidth - minWidth) / 3)
  const marks: Record<number, string> = {}
  for (let i = 0; i <= 3; i++) {
    const val = minWidth + step * i
    marks[val] = `${val}px`
  }

  const handleClickOutside = () => {
    if (isEditing) {
      setIsEditing(false)
    }
  }

  useOnClickOutside(widthWrapper, handleClickOutside)

  const handleUpload = () => {
    fileInput?.current?.click()
  }

  const handleChangeImage = () => {
    if (fileInput?.current?.files) {
      const files = fileInput.current.files

      if (files.length > 0 && typeof onChangeImage === 'function') {
        const reader = new FileReader()

        reader.addEventListener('load', () => {
          if (typeof reader.result === 'string') {
            onChangeImage(reader.result)
          }
        })

        reader.readAsDataURL(files[0])
      }
    }
  }

  const handleChangeWidth = (value: number) => {
    if (typeof onChangeWidth === 'function') {
      onChangeWidth(value)
    }
  }

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const clearImage = () => {
    if (typeof onChangeImage === 'function') {
      onChangeImage('')
    }
  }

  if (pdfMode) {
    if (value) {
      return (
        <Image
          style={{
            ...compose(`image ${className ? className : ''}`),
            maxWidth: width,
          }}
          src={value}
        />
      )
    } else {
      return <></>
    }
  }

  return (
    <div className={`image ${value ? 'mb-5' : ''} ${className ? className : ''}`}>
      {!value ? (
        <button type="button" className="image__upload" onClick={handleUpload}>
          {placeholder}
        </button>
      ) : (
        <>
          <img
            src={value}
            className="image__img"
            alt={placeholder}
            style={{ maxWidth: width || 100 }}
          />

          <button type="button" className="image__change" onClick={handleUpload}>
            Change Image
          </button>

          <button type="button" className="image__edit" onClick={handleEdit}>
            Resize Image
          </button>

          <button type="button" className="image__remove" onClick={clearImage}>
            Remove
          </button>

          {isEditing && (
            <div ref={widthWrapper} className="image__width-wrapper">
              <Slider
                min={minWidth}
                max={maxWidth}
                marks={marks}
                included={false}
                step={1}
                onChange={handleChangeWidth as any}
                defaultValue={width || minWidth}
              />
            </div>
          )}
        </>
      )}

      <input
        ref={fileInput}
        tabIndex={-1}
        type="file"
        accept="image/*"
        className="image__file"
        onChange={handleChangeImage}
      />
    </div>
  )
}

export default EditableFileImage
