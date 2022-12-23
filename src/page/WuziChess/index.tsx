import React from 'react'
import useHook from '../../utils/hooks/useChessHook'
import styles from './index.module.less'

const GobangHook = () => {
  const border = Array(20).fill(null)
  let { play, palyArr } = useHook()

  return (
    <div className={styles['chessboard-wrapper']}>
      <div className={styles['chessboard']}>
        {border.map((_, rowIndex) => (
          <div className={styles['chessboard-row']} key={`row + ${rowIndex}`}>
            {border.map((col, colIndex) => (
              <div
                className={styles['chessboard-col']}
                key={`col + ${colIndex}`}>
                <div className={styles['chessboard-cell']}>
                  {/* 这里三选一去渲染 */}
                  {palyArr.find(
                    (item) => item.row === rowIndex && item.col === colIndex,
                  ) ? (
                    palyArr.find(
                      (item) => item.row === rowIndex && item.col === colIndex,
                    ).chess === 1 ? (
                      <div className={styles['chessboard-cell-black']}></div>
                    ) : (
                      <div className={styles['chessboard-cell-white']}></div>
                    )
                  ) : (
                    <div
                      className={styles['chessboard-cell-click']}
                      onClick={() => play(rowIndex, colIndex)}></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GobangHook
