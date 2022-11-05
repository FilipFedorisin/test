/* eslint-disable @next/next/no-img-element */
//! need to cure this bullsit of a image usage
import { useFocused, useSelected } from 'slate-react'
import styles from 'src/styles/Slate/Image.module.scss'

const Image = ({ attributes, element, children }) => {
  const { url, width, height } = element
  const selected = useSelected()
  const focused = useFocused()
  console.log(width, height)
  return (
    <div
      {...attributes}
      className={styles.element_image}
      style={{
        display: 'flex',
        justifyContent: 'center',
        boxShadow: selected && focused && '0 0 3px 3px lightgray',
      }}
    >
      <div contentEditable={false} style={{ width: width, height: height }}>
        <img alt={element.alt} src={url} />
      </div>
      {children}
    </div>
  )
}
export default Image
