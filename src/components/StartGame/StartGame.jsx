import { useEffect, useState } from "react";
import "./StartGame.css";
import song from "../../assets/startbtn.mp3"

function StartGame() {
    const [start, setStart] = useState(false);

    useEffect(() => {
        if (start) {
            const audio = new window.Audio(song);
            audio.volume = 1.0; 
            audio.play().catch(error => {
                console.error("Failed to play audio:", error);
            });
        }
    }, [start]);

    return (
        <div className={`startgame ${start ? 'hide-startgame' : '' }`}>
            <button className="btn" onClick={() => setStart(true)}>Start Game!</button>
        </div>
    )
}

export default StartGame;
