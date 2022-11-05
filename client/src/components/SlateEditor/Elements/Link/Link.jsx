/* eslint-disable @next/next/no-img-element */
import { useFocused, useSelected, useSlateStatic } from 'slate-react'

import styles from 'src/styles/Slate/Link.module.scss'
import unlink from '../../Toolbar/toolbarIcons/unlink.svg'
import { removeLink } from '../../utils/link.js'

const Link = ({ attributes, element, children }) => {
  const editor = useSlateStatic()
  const selected = useSelected()
  const focused = useFocused()
  return (
    <div className="link">
      <a href={element.href} {...attributes}>
        {children}
      </a>
      {selected && focused && (
        <div className={styles.link_popup} contentEditable="false">
          <a href={element.href}>{element.href}</a>
          <button onClick={() => removeLink(editor)}>
            <img src={unlink} alt="" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Link
