import styles from 'src/styles/Slate/Video.module.scss'

const Image = ({ attributes, element, children }) => {
  const { url, width, height } = element
  return (
    <div {...attributes} style={{ display: 'flex', justifyContent: 'center' }}>
      <div contentEditable={false} style={{ width: width, height: height }}>
        <div className={styles.video_wrapper}>
          <iframe src={url} frameBorder="0" title={url} />
        </div>
      </div>
      {children}
    </div>
  )
}
export default Image
