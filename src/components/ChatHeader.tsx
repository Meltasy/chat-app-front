import { useState, useRef, useEffect } from 'react'
import styles from '../assets/components/Chat.module.css'

interface Member {
  id: string
  username: string
  role: string
}

interface Props {
  chatName: string
  isGroup: boolean
  isAdmin: boolean
  renaming: boolean
  newName: string
  members: Member[]
  nonMembers: { id: string, username: string }[]
  currentUserId: string
  onNewNameChange: (value: string) => void
  onRenameSubmit: () => void
  onRenameStart: () => void
  onRenameCancel: () => void
  onDeleteChat: () => void
  onAddMember: (userId: string) => void
  onRemoveMember: (userId: string) => void
}

type MenuView = 'main' | 'addMember' | 'removeMember' | 'confirmDelete'

function ChatHeader({
  chatName,
  isGroup,
  isAdmin,
  renaming,
  newName,
  members,
  nonMembers,
  currentUserId,
  onNewNameChange,
  onRenameSubmit,
  onRenameStart,
  onRenameCancel,
  onDeleteChat,
  onAddMember,
  onRemoveMember
} : Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuView, setMenuView] = useState<MenuView>('main')
  const menuRef = useRef<HTMLDivElement>(null)

  // Should I move the useEffect into a CustomHook?

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu()
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    setMenuView('main')
  }

  const handleRenameClick = () => {
    closeMenu()
    onRenameStart()
  }

  const handleAddMember = (userId: string) => {
    onAddMember(userId)
    closeMenu()
  }

  const handleRemoveMember = (userId: string) => {
    onRemoveMember(userId)
    closeMenu()
  }

  const removableMembers = members.filter(m => m.id !== currentUserId)

  return (
    <div className={`${styles.wrapperDiv} ${styles.buttonDiv} ${styles.header}`}>
      {renaming ? (
        <div className={styles.renameForm}>
          <input
            value={newName}
            onChange={e => onNewNameChange(e.target.value)}
            placeholder={chatName}
            minLength={5}
            maxLength={100}
            className={styles.input}
            autoFocus
          />
          <button
            onClick={onRenameSubmit}
            disabled={!newName.trim()}
            className={styles.button}
          >
            Save
          </button>
          <button onClick={onRenameCancel} className={styles.button}>
            Cancel
          </button>
        </div>
      ) : (
        <h4 className={styles.groupName}>{chatName}</h4>
      )}
      {isGroup && isAdmin && !renaming && (
        <div className={styles.menuContainer} ref={menuRef}>
          <button
            className={styles.iconButton}
            onClick={() => { setMenuOpen(o => !o); setMenuView('main') }}
            aria-label='Chat options'
            title='Chat options'
          >
            ☰
          </button>
          {menuOpen && (
            <div className={styles.dropdown}>
              {menuView === 'main' && (
                <>
                  <button
                    className={styles.dropdownItem}
                    onClick={handleRenameClick}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => setMenuView('addMember')}
                  >
                    Add members
                  </button>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => setMenuView('removeMember')}
                  >
                    Remove members
                  </button>
                  <hr className={styles.dropdownDivider} />
                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                    onClick={() => setMenuView('confirmDelete')}
                  >
                    Delete
                  </button>
                </>
              )}
              {menuView === 'addMember' && (
                <>
                  <button
                    className={styles.dropdownBack}
                    onClick={() => setMenuView('main')}
                  >
                    Back
                  </button>
                  <p className={styles.dropdownLabel}>Add a member</p>
                  {nonMembers.length === 0 ? (
                    <p className={styles.dropdownEmpty}>No users to add</p>
                  ) : (
                    nonMembers.map(u => (
                      <button
                        key={u.id}
                        className={styles.dropdownItem}
                        onClick={() => handleAddMember(u.id)}
                      >
                        {u.username}
                      </button>
                    ))
                  )}
                </>
              )}
              {menuView === 'removeMember' && (
                <>
                  <button
                    className={styles.dropdownBack}
                    onClick={() => setMenuView('main')}
                  >
                    Back
                  </button>
                  <p className={styles.dropdownLabel}>Remove a member</p>
                  {removableMembers.length === 0 ? (
                    <p className={styles.dropdownEmpty}>No members to remove</p>
                  ) : (
                    removableMembers.map(m => (
                      <button
                        key={m.id}
                        className={styles.dropdownItem}
                        onClick={() => handleRemoveMember(m.id)}
                      >
                        {m.username}
                      </button>
                    ))
                  )}
                </>
              )}
              {menuView === 'confirmDelete' && (
                <>
                  <p className={styles.dropdownLabel}>Delete this group?</p>
                  <p className={styles.dropdownEmpty}>This can't be undone.</p>
                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                    onClick={() => { onDeleteChat(); closeMenu() }}
                  >
                    Delete
                  </button>
                  <button
                    className={styles.dropdownItem} onClick={() => setMenuView('main')}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ChatHeader
