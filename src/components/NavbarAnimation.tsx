import { useState, useEffect } from 'react'
import RabbitIcon from './RabbitIcon'
import styles from '../assets/components/NavbarAnimation.module.css'

function NavbarAnimation() {
  const [phase, setPhase] = useState<'fadein' | 'running' | 'condensing' | 'settled'>('fadein')

  useEffect(() => {
    const runTimer = setTimeout(() => setPhase('running'), 800)
    const condenseTimer = setTimeout(() => setPhase('condensing'), 4000)
    const settleTimer = setTimeout(() => setPhase('settled'), 5200)
    return () => {
      clearTimeout(runTimer)
      clearTimeout(condenseTimer)
      clearTimeout(settleTimer)
    }
  }, [])

  return (
    <div className={styles.animationWrapper}>
      {phase === 'fadein' && (
        <div className={styles.fadeIn}>
          <RabbitIcon size={40} />
        </div>
      )}
      {phase === 'running' && (
        <div className={styles.scene}>
          <div className={styles.rabbitRunner}>
            <RabbitIcon size={40} className={styles.rabbitIcon} />
          </div>
          <span className={`${styles.titleText} ${styles.titleTextTemp}`}>Rabbit, rabbit, rabbit on</span>
        </div>
      )}
      {(phase === 'condensing' || phase === 'settled') && (
        <div className={phase === 'condensing' ? styles.condensing : styles.settled}>
          <span className={styles.titleText}>Rabbit on</span>
          <RabbitIcon size={40} />
        </div>
      )}
    </div>
  )
}

export default NavbarAnimation
