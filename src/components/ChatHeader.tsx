import { useState, useRef } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'
import { Check, X, Menu, PencilLine, UserRoundPlus, UserRoundX, 
  Trash2, Undo2 } from 'lucide-react'
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

type MenuView = 'main' | 'addMember' | 'removeMember'

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
  const [confirmDelete, setConfirmDelete] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const closeMenu = () => {
    setMenuOpen(false)
    setMenuView('main')
    setConfirmDelete(false)
  }

  useClickOutside(menuRef, closeMenu, menuOpen || confirmDelete)

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
            className={styles.inputChat}
            autoFocus
          />
          <div className={styles.buttonBox}>
            <button
              onClick={onRenameSubmit}
              disabled={!newName.trim()}
              className={styles.iconButton}
              aria-label='Save name'
            >
              <Check />
            </button>
            <button
              onClick={onRenameCancel}
              className={styles.iconButton}
              aria-label='Cancel rename'
            >
              <X />
            </button>
          </div>
        </div>
      ) : (
        <h4>{chatName}</h4>
      )}
      {((!isGroup) || (isGroup && isAdmin && !renaming)) && (
        <div className={styles.menuContainer} ref={menuRef}>
          {isGroup && isAdmin && !renaming && (
            <button
              className={styles.iconButton}
              onClick={() => { setMenuOpen(o => !o); setMenuView('main') }}
              aria-label='Chat options'
            >
              <Menu />
            </button>
          )}
          {!isGroup && (
            <button
              className={styles.iconButton}
              onClick={() => setConfirmDelete(o => !o)}
              aria-label='Delete Chat'
            >
              <Trash2 />
            </button>
          )}
          {isGroup && menuOpen && (
            <div className={styles.dropdown}>
              {menuView === 'main' && (
                <>
                  <button
                    className={styles.dropdownItem}
                    onClick={handleRenameClick}
                  >
                    <PencilLine size={16} />
                    <span>Rename group</span>
                  </button>
                  <hr className={styles.dropdownDivider} />
                  <button
                    className={styles.dropdownItem}
                    onClick={() => setMenuView('addMember')}
                  >
                    <UserRoundPlus size={16} />
                    <span>Add members</span>
                  </button>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => setMenuView('removeMember')}
                    aria-label='Remove members'
                    title='Remove members'
                  >
                    <UserRoundX size={16} />
                    <span>Remove members</span>
                  </button>
                  <hr className={styles.dropdownDivider} />
                  <button
                    className={styles.dropdownItem}
                    onClick={() => { closeMenu(); setConfirmDelete(true) }}
                  >
                    <Trash2 size={16} />
                    <span>Delete Group</span>
                  </button>
                </>
              )}
              {menuView === 'addMember' && (
                <>
                  <div className={styles.dropdownHeader}>
                    <button
                      className={styles.dropdownBack}
                      onClick={() => setMenuView('main')}
                      aria-label='Back to menu'
                    >
                      <Undo2 size={16} />
                    </button>
                    <p className={styles.dropdownLabel}>Add members</p>
                  </div>
                  <hr className={styles.dropdownDivider} />
                  {nonMembers.length === 0 ? (
                    <p className={styles.dropdownEmpty}>No members to add.</p>
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
                  <div className={styles.dropdownHeader}>
                    <button
                      className={styles.dropdownBack}
                      onClick={() => setMenuView('main')}
                      aria-label='Back to menu'
                    >
                      <Undo2 size={16} />
                    </button>
                    <p className={styles.dropdownLabel}>Remove members</p>
                  </div>
                  <hr className={styles.dropdownDivider} />
                  {removableMembers.length === 0 ? (
                    <p className={styles.dropdownEmpty}>No members to remove.</p>
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
            </div>
          )}
          {confirmDelete && (
            <div className={styles.dropdown}>
              <p className={`${styles.dropdownLabel} ${styles.labelDelete}`}>This can't be undone</p>
              <hr className={styles.dropdownDivider} />
              <button
               className={`${styles.dropdownItem}`}
                onClick={() => { onDeleteChat(); setConfirmDelete(false) }}
              >
                <Trash2 size={16} />
                <span>Delete {isGroup ? 'Group' : 'Chat'}</span>
              </button>
              <button
                className={styles.dropdownItem} onClick={() => setConfirmDelete(false)}
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ChatHeader
