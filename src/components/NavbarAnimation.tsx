import { useState, useEffect } from 'react'
import RabbitIcon from './RabbitIcon'
import styles from '../assets/components/NavbarAnimation.module.css'

type Phase = 'running' | 'changing' | 'final'

function NavbarAnimation() {
  const [phase, setPhase] = useState<Phase>('running')

  useEffect(() => {
    const changeTimer = setTimeout(() => setPhase('changing'), 4200)
    const finalTimer = setTimeout(() => setPhase('final'), 5600)
    return () => {
      clearTimeout(changeTimer)
      clearTimeout(finalTimer)
    }
  }, [])

  return (
    <div className={styles.animationWrapper}>
      {phase !== 'final' ? (
        <div className={styles.scene} style={{opacity: phase === 'changing' ? 0 : 1}}>
          <div className={styles.rabbitRunner}>
            <RabbitIcon size={40} className={styles.rabbitIcon} />
          </div>
          <div className={styles.wordTrail}>
            <span className={styles.word1}>Rabbit</span>
            <span className={styles.word2}>rabbit</span>
            <span className={styles.word3}>rabbit</span>
            <span className={styles.word4}>on</span>
          </div>
        </div>
      ) : (
        <div className={styles.finalLogo}>
          <span>Rabbit</span>
          <span>on</span>
          <RabbitIcon size={40} />
        </div>
      )}
    </div>
  )
}

export default NavbarAnimation
