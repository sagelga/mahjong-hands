const MahjongRules = () => {
    return (
        <main className="rules-container">
            <h1 className="rules-title">How to Play Mahjong</h1>

            <section className="rules-section">
                <h2 className="rules-subtitle">Objective</h2>
                <p>The objective of Mahjong is to be the first player to complete a legal hand of 14 tiles consisting of four sets and a pair.</p>
            </section>

            <section className="rules-section">
                <h2 className="rules-subtitle">Tiles</h2>
                <p>A standard Mahjong set contains 144 tiles, divided into:</p>
                <ul className="rules-list">
                    <li><strong>Suits:</strong> Characters (Thousand), Dots (Bamboo), and Bamboo (Dots) - each with 36 tiles numbered 1-9</li>
                    <li><strong>Honors:</strong> Winds (East, South, West, North) and Dragons (Red, Green, White) - 4 tiles each</li>
                    <li><strong>Flowers and Seasons:</strong> 1 tile each (though often ignored in basic scoring)</li>
                </ul>
            </section>

            <section className="rules-section">
                <h2 className="rules-subtitle">Sets</h2>
                <p>A complete hand consists of four sets and a pair:</p>
                <ul className="rules-list">
                    <li><strong>Pung:</strong> Three identical tiles (same suit and number or same honor)</li>
                    <li><strong>Chow:</strong> Three consecutive numbers in the same suit (e.g., 4-5-6 of Circles)</li>
                    <li><strong>Kong:</strong> Four identical tiles (a special type of Pung)</li>
                    <li><strong>Pair:</strong> Two identical tiles that serve as the eyes of the hand</li>
                </ul>
            </section>

            <section className="rules-section">
                <h2 className="rules-subtitle">Gameplay</h2>
                <ol className="rules-ordered-list">
                    <li>Each player starts with 13 tiles</li>
                    <li>Players take turns drawing and discarding tiles until someone completes a legal hand</li>
                    <li>On your turn, draw a tile from the wall or pick up the discarded tile from another player</li>
                    <li>Discard one tile face-up in the center</li>
                    <li>Try to form sets (Pungs, Chows, Kongs) and a pair</li>
                    <li>Call "Mahjong!" when you complete a legal hand</li>
                </ol>
            </section>

            <section className="rules-section">
                <h2 className="rules-subtitle">Scoring</h2>
                <p>Scoring varies by regional variant, but typically awards points for:</p>
                <ul className="rules-list">
                    <li>Completing the hand</li>
                    <li>Special combinations</li>
                    <li>Winning from the wall or from a discard</li>
                    <li>Bonus tiles (Flowers and Seasons)</li>
                </ul>
            </section>

            <section className="rules-section">
                <h2 className="rules-subtitle">Tips for Beginners</h2>
                <ul className="rules-list">
                    <li>Focus on one suit early in the game to build coherent sets</li>
                    <li>Pay attention to what other players are discarding</li>
                    <li>Keep versatile tiles that could fit multiple potential sets</li>
                    <li>Remember that you can only win by completing a legal hand</li>
                    <li>Practice recognizing common patterns and combinations</li>
                </ul>
            </section>
        </main>
    );
};

export default MahjongRules;
