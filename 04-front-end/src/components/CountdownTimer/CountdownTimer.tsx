import React from "react";
import Countdown, { zeroPad } from "react-countdown";

export interface ICountdownTimerProperties {
    delay: number;
    onComplete: () => void;
}

const countdownRenderer = ({ minutes, seconds, completed }: any) => {
    if (completed) {
        return <span>Time's up!</span>;
    } else {
        return <span>{zeroPad(minutes)}:{zeroPad(seconds)}</span>
    }
};

export const CountdownTimer = React.memo((props: ICountdownTimerProperties) => {
    return (
        <h2><Countdown date={Date.now() + props.delay} renderer={countdownRenderer} onComplete={props.onComplete}></Countdown></h2>
    );
}, () => true)