function show(map) {
    console.log('┌───────────────────────────────────────┐');
    for (var i = 0; i < map.length; i++) {
        var row = map[i];

        console.log('│' + row.map(function (cell) {
            switch(cell)
            {
                case '11':
                    return '▶';
                case '12':
                    return '◀';
                case '13':
                    return '▲';
                case '14':
                    return '▼';
                case '0':
                    return ' ';
                case '1':
                    return '■';
                case '2':
                    return '❤';
            }
            return typeof cell === 'undefined' ? ' ' : (cell == '0' ? ' ' : cell);
        }).join(' ')+'│');
        
    }
    console.log('└───────────────────────────────────────┘');
}

function getPlaceSnake(map){
    for(var i=0; i!=map.length; i++)
    {
        for(var j=0; j!=map[i].length; j++)
        {
            if(map[i][j].length == 2) return [i, j];
        }
    }
    return null;
}

function genItem(map)
{
    const lenVer = map.length;
    const lenHor = map[0].length;

    let ver = 0;
    let hor = 0;

    do{
        ver = Math.floor(Math.random() * (lenVer - 0)) + 0;
        hor = Math.floor(Math.random() * (lenHor - 0)) + 0;

    }while(map[ver][hor] != '0')
    
    return [ver, hor];
}

function initSnake(map, length = 3) {
    const rows = map.length;
    const cols = map[0].length;
    const r = Math.floor(rows / 2);
    const startC = Math.floor(cols / 2);

    const snake = [];
    for (let i = 0; i < length; i++) {
        const c = startC - i;
        snake.push([r, c]);
        map[r][c] = (i === 0) ? '11' : '1';
    }
    return snake;
}

function moveSnake(map, snake, dir) {
    if (!Array.isArray(snake) || snake.length === 0) return false;

    const deltas = {
        up: [-1, 0],
        down: [1, 0],
        left: [0, -1],
        right: [0, 1]
    };
    const headMap = { up: '13', down: '14', left: '12', right: '11' };

    const d = deltas[dir];
    if (!d) return false;

    const head = snake[0];
    const r = head[0], c = head[1];
    const nr = r + d[0], nc = c + d[1];

    if (nr < 0 || nr >= map.length || nc < 0 || nc >= map[0].length) return false;

    const dest = map[nr][nc];
    const tail = snake[snake.length - 1];

    if (dest === '1') {
        if (!(nr === tail[0] && nc === tail[1])) return false;
    }

    if (typeof dest === 'string' && dest.length === 2 && !(nr === tail[0] && nc === tail[1])) {
        return false;
    }

    const newHeadVal = headMap[dir] || map[r][c];

    if (dest === '2') {
        snake.unshift([nr, nc]);
        map[r][c] = '1';
        map[nr][nc] = newHeadVal;
        return 'eat';
    }

    const oldTail = snake.pop();
    map[oldTail[0]][oldTail[1]] = '0';
    snake.unshift([nr, nc]);

    map[r][c] = '1';
    map[nr][nc] = newHeadVal;

    return 'moved';
}

async function getMouv(map, handlers = {}) {
    // console.clear();
    // show(map);

    return await new Promise((resolve) => {
        const doHandler = async (dir) => {
            const fn = handlers && handlers[dir];
            if (typeof fn === 'function') {
                try {
                    await fn(dir);
                } catch (e) {
                    console.error('handler error:', e);
                }
            }
        };

        const onKey = async (key) => {
            if (key === '\u0003') {
                cleanup();
                await doHandler('quit');
                resolve(key);
                return;
            }

            let dir = null;
            if (key === '\u001B[A') dir = 'up';
            else if (key === '\u001B[B') dir = 'down';
            else if (key === '\u001B[D') dir = 'left';
            else if (key === '\u001B[C') dir = 'right';

            if (dir) {
                cleanup();
                await doHandler(dir);
                resolve(key);
                return;
            }
        };

        const cleanup = () => {
            try { process.stdin.setRawMode(false); } catch (e) {}
            process.stdin.removeListener('data', onKey);
            try { process.stdin.pause(); } catch (e) {}
        };

        process.stdin.setEncoding('utf8');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', onKey);
    });
}

module.exports = { show, genItem, getMouv, initSnake, moveSnake };