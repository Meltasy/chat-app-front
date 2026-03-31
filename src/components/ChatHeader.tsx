import { useState, useRef } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'
import { Check, X, Menu, PencilLine, UserRoundPlus, UserRoundX, 
  Trash2, Undo2 } from 'lucide-react'
import styles from '../assets/components/Chat.module.css'

// When rename is opened for one group and you move to a different group, rename remains open with the new group's name

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

  const closeMenu = () => {
    setMenuOpen(false)
    setMenuView('main')
  }

  useClickOutside(menuRef, closeMenu, menuOpen)

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
            aria-label='Save name'
          >
            <Check />
          </button>
          <button
            onClick={onRenameCancel}
            className={styles.button}
            aria-label='Cancel rename'
          >
            <X />
          </button>
        </div>
      ) : (
        <h4 className={styles.groupName}>{chatName}</h4>
      )}
      {isGroup && isAdmin && !renaming && (
        <div className={styles.menuContainer} ref={menuRef}>
          <button
            className={styles.button}
            onClick={() => { setMenuOpen(o => !o); setMenuView('main') }}
            aria-label='Chat options'
          >
            <Menu />
          </button>
          {menuOpen && (
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
                    className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                    onClick={() => setMenuView('confirmDelete')}
                  >
                    <Trash2 size={16} />
                    <span>Delete Group</span>
                  </button>
                </>
              )}
              {menuView === 'addMember' && (
                <>
                  <button
                    className={styles.dropdownBack}
                    onClick={() => setMenuView('main')}
                    aria-label='Back to menu'
                  >
                    <Undo2 size={16} />
                  </button>
                  <p className={styles.dropdownLabel}>Add members</p>
                  {nonMembers.length === 0 ? (
                    <p className={styles.dropdownEmpty}>No users to add.</p>
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
                    aria-label='Back to menu'
                  >
                    <Undo2 size={16} />
                  </button>
                  <p className={styles.dropdownLabel}>Remove members</p>
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
              {menuView === 'confirmDelete' && (
                <>
                  <p className={styles.dropdownLabel}>This can't be undone</p>
                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                    onClick={() => { onDeleteChat(); closeMenu() }}
                  >
                    <Trash2 size={16} />
                    <span>Delete Group</span>
                  </button>
                  <button
                    className={styles.dropdownItem} onClick={() => setMenuView('main')}
                  >
                    <X size={16} />
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
