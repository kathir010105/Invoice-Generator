import { FC, PropsWithChildren } from 'react'
import { View as PdfView } from '@react-pdf/renderer'
import compose from '../styles/compose'

interface Props {
  className?: string
  pdfMode?: boolean
}

const View: FC<PropsWithChildren<Props>> = ({
  className = '',
  pdfMode,
  children,
}) => {
  if (pdfMode) {
    return (
      <PdfView style={compose(`view ${className}`)}>
        {children}
      </PdfView>
    )
  }

  return <div className={`view ${className}`}>{children}</div>
}

export default View
