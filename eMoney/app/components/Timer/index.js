// @flow
import {useState, useRef, useEffect} from 'react';

export type Props = {
    children: (left: number) => any,
    duration: number,
    from: number,
};

function Timer({from, duration, children}: Props) {
    const [time, setTime] = useState(Math.floor(new Date() / 1000));
    const timerRef = useRef({id: null});
    const left = duration > 0 ? Math.max(0, from + duration - time) : 0;
    const ticker = () => {
        left > 0 && setTime(Math.floor(new Date() / 1000));
    };
    useEffect(() => {
        timerRef.current = {id: setInterval(ticker, 1000)};
        return () => {
            const {id} = timerRef.current;
            if (id !== null) {
                clearInterval(id);
                timerRef.current = {id: null};
            }
        };
    });
    return children(left);
}

export default Timer;
