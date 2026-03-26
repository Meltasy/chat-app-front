import styles from '../assets/components/Chat.module.css'

interface Props {
    chatName: string
    isGroup: boolean
    isAdmin: boolean
    renaming: boolean
    newName: string
    onNewNameChange: (value: string) => void
    onRenameSubmit: () => void
    onRenameStart: () => void
    onRenameCancel: () => void  
}

function ChatHeader({
  chatName,
  isGroup,
  isAdmin,
  renaming,
  newName,
  onNewNameChange,
  onRenameSubmit,
  onRenameStart,
  onRenameCancel
} : Props) {
  return (
    <div className={`${styles.wrapperDiv} ${styles.buttonDiv} ${styles.header}`}>
      <h4 className={styles.groupName}>{chatName}</h4>
      {isGroup && isAdmin && (
        renaming ? (
          <div className={styles.renameForm}>
            <input
              value={newName}
              onChange={e => onNewNameChange(e.target.value)}
              placeholder={chatName}
              minLength={5}
              maxLength={100}
              className={styles.input}
            />
            <button
              onClick={onRenameSubmit}
              disabled={!newName.trim()}
              className={styles.button}
            >
              Save
            </button>
            <button
              onClick={onRenameCancel}
              className={styles.button}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onRenameStart}
            className={styles.button}
          >
            Rename
          </button>
        )
      )}
    </div>
  )
}

export default ChatHeader
