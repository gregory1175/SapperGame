import * as React from 'react';

export const Mine = -1;

export enum Mask {
    Transparent,
    Fill, 
    Flag,
    Question,
}

export const mapMaskToView: Record<Mask, React.ReactNode> = {
    [Mask.Transparent]: null,
    [Mask.Fill]: "🍁", 
    [Mask.Flag]: "🚩",
    [Mask.Question]: "❔",
};

export function createField(size: number): number[] {
    const field: number[] = new Array(size * size).fill(0);

    function inc(x: number, y: number) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
            if (field[y * size + x] === Mine) return;    
            field[y * size + x] += 1;
        }
    }

    for (let i = 0; i < size;) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
    
        if (field[y * size + x] === Mine) continue;

        field[y * size + x] = Mine;
        i += 1;

        inc(x + 1, y);
        inc(x - 1, y);
        inc(x, y + 1);
        inc(x, y - 1);
        inc(x + 1, y - 1);
        inc(x - 1, y - 1);
        inc(x + 1, y + 1);
        inc(x - 1, y + 1);
    }
    return field;
}

export function createCustomField(size: number, mines: number, firstX: number, firstY: number): number[] {
    const field: number[] = new Array(size * size).fill(0);

    function inc(x: number, y: number) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
            if (field[y * size + x] === Mine) return;    
            field[y * size + x] += 1;
        }
    }

    function isSafeZone(x: number, y: number): boolean {
        return Math.abs(x - firstX) <= 1 && Math.abs(y - firstY) <= 1;
    }

    for (let i = 0; i < mines;) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
    
        if (field[y * size + x] === Mine || isSafeZone(x, y)) continue;

        field[y * size + x] = Mine;
        i += 1;

        inc(x + 1, y);
        inc(x - 1, y);
        inc(x, y + 1);
        inc(x, y - 1);
        inc(x + 1, y - 1);
        inc(x - 1, y - 1);
        inc(x + 1, y + 1);
        inc(x - 1, y + 1);
    }
    return field;
}

export function handleClick(
    x: number, 
    y: number, 
    size: number, 
    field: number[], 
    setField: React.Dispatch<React.SetStateAction<number[]>>, 
    mask: Mask[], 
    setMask: React.Dispatch<React.SetStateAction<Mask[]>>, 
    setDeath: React.Dispatch<React.SetStateAction<boolean>>, 
    setWin: React.Dispatch<React.SetStateAction<boolean>>, 
    win: boolean, 
    death: boolean,
    firstClick: boolean,
    setFirstClick: React.Dispatch<React.SetStateAction<boolean>>,
    mines: number
) {
    if (win || death) return;

    if (mask[y * size + x] === Mask.Transparent) return;

    if (firstClick) {
        setFirstClick(false);
        const newField = createCustomField(size, mines, x, y);
        setField(newField);
        handleClick(x, y, size, newField, setField, mask, setMask, setDeath, setWin, win, death, false, setFirstClick, mines);
        return;
    }

    const clearing: [number, number][] = [];

    function clear(x: number, y: number) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
            if (mask[y * size + x] === Mask.Transparent) return;
            clearing.push([x, y]);
        }
    }

    function clearAround(x: number, y: number) {
        clear(x + 1, y);
        clear(x - 1, y);
        clear(x, y + 1);
        clear(x, y - 1);
        clear(x + 1, y - 1);
        clear(x - 1, y - 1);
        clear(x + 1, y + 1);
        clear(x - 1, y + 1);
    }

    clear(x, y);

    while (clearing.length) {
        const [cx, cy] = clearing.pop()!;
        mask[cy * size + cx] = Mask.Transparent;

        if (field[cy * size + cx] === 0) {
            clearAround(cx, cy);
        }
    }

    if (field[y * size + x] === Mine) {
        mask.forEach((_, i) => mask[i] = Mask.Transparent);
        setDeath(true);
    } else {
        const remainingCells = mask.filter(m => m !== Mask.Transparent).length;
        const totalMines = field.filter(f => f === Mine).length;
        if (remainingCells === totalMines) {
            setWin(true);
        }
    }

    setMask([...mask]);
}


export function handleContextMenu(
    e: React.MouseEvent, 
    x: number, 
    y: number, 
    size: number, 
    mask: Mask[], 
    setMask: React.Dispatch<React.SetStateAction<Mask[]>>, 
    win: boolean, 
    death: boolean
) {
    e.preventDefault();
    e.stopPropagation();
    
    if (win || death) return;

    if (mask[y * size + x] === Mask.Transparent) return;
    
    if (mask[y * size + x] === Mask.Fill) {
        mask[y * size + x] = Mask.Flag;
    } else if (mask[y * size + x] === Mask.Flag) {
        mask[y * size + x] = Mask.Question;
    } else if (mask[y * size + x] === Mask.Question) {
        mask[y * size + x] = Mask.Fill;
    }

    setMask([...mask]);
}