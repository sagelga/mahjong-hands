const MahjongRules = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', lineHeight: 1.6 }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-primary)' }}>How to Play Mahjong</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>Objective</h2>
                <p>The objective of Mahjong is to be the first player to complete a legal hand of 14 tiles consisting of four sets and a pair.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>Tiles</h2>
                <p>A standard Mahjong set contains 144 tiles, divided into:</p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li><strong>Suits:</strong> Characters (萬), Bamboo (條), and Circles (筒) - each with 36 tiles numbered 1-9</li>
                    <li><strong>Honors:</strong> Winds (East, South, West, North) and Dragons (Red, Green, White) - 4 tiles each</li>
                    <li><strong>Flowers and Seasons:</strong> 1 tile each (though often ignored in basic scoring)</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>Sets</h2>
                <p>A complete hand consists of four sets and a pair:</p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li><strong>Pung:</strong> Three identical tiles (same suit and number or same honor)</li>
                    <li><strong>Chow:</strong> Three consecutive numbers in the same suit (e.g., 4-5-6 of Circles)</li>
                    <li><strong>Kong:</strong> Four identical tiles (a special type of Pung)</li>
                    <li><strong>Pair:</strong> Two identical tiles that serve as the eyes of the hand</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>Gameplay</h2>
                <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li>Each player starts with 13 tiles</li>
                    <li>Players take turns drawing and discarding tiles until someone completes a legal hand</li>
                    <li>On your turn, draw a tile from the wall or pick up the discarded tile from another player</li>
                    <li>Discard one tile face-up in the center</li>
                    <li>Try to form sets (Pungs, Chows, Kongs) and a pair</li>
                    <li>Call "Mahjong!" when you complete a legal hand</li>
                </ol>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>Scoring</h2>
                <p>Scoring varies by regional variant, but typically awards points for:</p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li>Completing the hand</li>
                    <li>Special combinations</li>
                    <li>Winning from the wall or from a discard</li>
                    <li>Bonus tiles (Flowers and Seasons)</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>Tips for Beginners</h2>
                <ul style={{ paddingLeft: '1.5rem' }}>
                    <li>Focus on one suit early in the game to build coherent sets</li>
                    <li>Pay attention to what other players are discarding</li>
                    <li>Keep versatile tiles that could fit multiple potential sets</li>
                    <li>Remember that you can only win by completing a legal hand</li>
                    <li>Practice recognizing common patterns and combinations</li>
                </ul>
            </section>
        </div>
    );
};

export default MahjongRules;
