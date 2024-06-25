import * as React from 'react'
import './App.module.scss'

enum Mask {
    Transparent,
    Fill, 
    Flag,
    Question,
}

const Mine = -1;

const mapMaskToView: Record<Mask, React.ReactNode> = {
    [Mask.Transparent]: null,
    [Mask.Fill]: "🍁", 
    [Mask.Flag]: "🚩",
    [Mask.Question]: "❔",
}
function createField(size: number): number[] {
    const field: number[] = new Array(size * size).fill(0);

    // увиличивает значение соседних ячеек 
    function inc(x: number, y:number) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
            if (field[y * size + x] === Mine) return;    
            
            field[y * size + x] += 1;
        }
    }

    for(let i = 0; i /* количество мин*/< size;) {
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

export default function App() {
    const size = 10;

    const [death, setDeath] = React.useState(false)
    const dimension = new Array(size).fill(null);
    const [field, setField] = React.useState<number[]>(() => createField(size));
    const [mask, setMask] = React.useState<Mask[]>(() => new Array(size * size).fill(Mask.Fill));
    
    const win = React.useMemo(() =>field.every((f, i) => f === Mine && mask[i] === Mask.Flag || mask[i] === Mask.Transparent), [field, mask]);
    
    return (
        <div>
            {dimension.map((_, y) => {
                return (<div 
                key={y} 
                style={{                         
                    display: 'flex',
                    }}>
                    {dimension.map((_, x) => {
                        return (<div
                        key={x}
                        style={{
                        width: 45,
                        height: 45,
                        margin: 1,
                        fontSize: 24,
                        backgroundColor: death ? "red" : win ? "green" : "blue",
                        }}
                        onClick={() => {
                            if ( win || death) return;

                            if (mask[y * size + x] === Mask.Transparent) return;
                            
                            const clearing: [number, number][] = [];

                            function clear(x: number, y:number) {
                                if (x >= 0 && x < size && y >= 0 && y < size) {
                                    if(mask[y * size + x] === Mask.Transparent) return;
                                    clearing.push([x, y]);
                                }
                            }

                            clear(x, y);

                            while(clearing.length) {
                                const [x, y] = clearing.pop()!!;

                                mask[y * size + x] = Mask.Transparent;

                                if  (field[y * size + x] !== 0) continue;

                                clear(x + 1, y);
                                clear(x - 1, y);
                                clear(x, y + 1);
                                clear(x, y - 1);
                            }
                            
                            if (field[y * size + x] === Mine) {
                                mask.forEach((_, i) => mask[i] = Mask.Transparent);
                            
                                setDeath(true);
                            }

                            setMask((prev) => [...prev]);
                        }}
                        onContextMenu={(e) =>  {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        if ( win || death) return;

                        if (mask[y * size + x] === Mask.Transparent) return;
                        
                        if (mask[y * size + x] === Mask.Fill) {
                            mask[y * size + x] = Mask.Flag;
                        } else if (mask[y * size + x] === Mask.Flag) {
                            mask[y * size + x] = Mask.Question;
                        } else if (mask[y * size + x] === Mask.Question) {
                            mask[y * size + x] = Mask.Fill;
                        }

                        setMask((prev) => [...prev]);
                        }}
                        >{
                        mask[y * size + x] !== Mask.Transparent
                        ? mapMaskToView[mask[y * size + x]]
                        : field[y * size + x] == Mine
                        ? "💣" 
                        : field[y * size + x]
                        
                        }</div>);
                    })}
        </div>);
})}
</div>
)
}