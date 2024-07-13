import * as React from 'react';
import styles from './App.module.scss';
import { 
    createCustomField,
    handleClick,
    handleContextMenu,
    mapMaskToView,
    Mask, 
    Mine
} from '../../funcModule/create-field/createField';

export default function App() {
    const [size, setSize] = React.useState(10);
    const [mines, setMines] = React.useState(10);
    const [death, setDeath] = React.useState(false);
    const [field, setField] = React.useState<number[]>([]);
    const [mask, setMask] = React.useState<Mask[]>([]);
    const [gameStarted, setGameStarted] = React.useState(false);
    const [myWin, mySetWin] = React.useState(false);
    const [firstClick, setFirstClick] = React.useState(true);
    
    const dimension = new Array(size).fill(null);
    
    const win = React.useMemo(() => 
        field.length > 0 && field.every((f, i) => (f === Mine && mask[i] === Mask.Flag) || (f !== Mine && mask[i] === Mask.Transparent)), 
        [field, mask]   
    );

    const resetGame = (firstX: number, firstY: number) => {
        if (mines < 10) {
            alert("Количество мин должно быть не менее 10.");
            return;
        } else if (mines > Math.floor(size * size * 0.25)) {
            alert("Мин слишком много! Измените настройки");
            return; 
        }

        setField(createCustomField(size, mines, firstX, firstY));
        setMask(new Array(size * size).fill(Mask.Fill));
        setDeath(false);
        setGameStarted(true);
    };
    
    return (
        <div className={styles.main_sap}>
        <div>
            <div className={styles.main_menu}>
                <div className={styles.label_container}>
                <label className={styles.main_label}>
                    Размер поля:
                    <input 
                        className={styles.main_input}
                        type="number" 
                        value={size} 
                        onChange={(e) => {
                            const newSize = Number(e.target.value);
                            if (newSize <= 24) {
                                if (!gameStarted) setSize(newSize);
                            } else {
                                alert("Максимальный размер поля 24x24.");
                            }
                        }} 
                        disabled={gameStarted}
                    />
                </label>
                </div>
                <div className={styles.label_container}>
                <label className={styles.main_label}>
                    Количество мин:
                    <input 
                        className={styles.main_input}
                        type="number" 
                        value={mines} 
                        onChange={(e) => {
                            if (!gameStarted) setMines(Number(e.target.value));
                        }}
                        disabled={gameStarted} 
                    />
                </label>
                </div>
                <button 
                className={styles.button_start}
                    onClick={(e) => {
                        const firstX = 0;
                        const firstY = 0;
                        resetGame(firstX, firstY);
                    }} 
                    disabled={gameStarted}
                >
                    Создать игру
                </button>
                <button 
                className={styles.button_reload}
                onClick={() => {
                setGameStarted(false);
                setFirstClick(true);
                setField([]);
                setMask([]);
                setDeath(false);
                mySetWin(false);
                }}
                    >
                Настроить заново
                </button>
            </div>
           {gameStarted && <div className={styles.main_sup_container}>
            {gameStarted && dimension.map((_, y) => (
                <div key={y} className={styles.main_sap_background}>
                    {dimension.map((_, x) => (
                        <div
                            key={x}
                            style={{
                                width: 34,
                                height: 34,
                                margin: 1,
                                fontSize: 16,
                                backgroundColor: death ? "red" : win ? "green" : "blue",
                            }}
                            onClick={() => {
                                if (firstClick) {
                                    resetGame(x, y);
                                    setFirstClick(false);
                                } else {
                                    handleClick(x, y, size, field, setField, mask, setMask, setDeath, mySetWin, win, death, firstClick, setFirstClick, mines);
                                }
                            }}
                            onContextMenu={(e) => handleContextMenu(e, x, y, size, mask, setMask, win, death)}
                        >
                            {mask[y * size + x] !== Mask.Transparent
                                ? mapMaskToView[mask[y * size + x]]
                                : field[y * size + x] === Mine
                                ? "💣" 
                                : field[y * size + x]}
                        </div>
                    ))}
                </div> 
            ))}
            </div> }
            {win && !death && <div>Вы победили! <button onClick={() => resetGame(0, 0)}>Начать заново</button></div>}
            {!win && death && <div>Вы проиграли! <button onClick={() => resetGame(0, 0)}>Начать заново</button></div>}
        </div>
        </div>
    );
}
