import './MahjongRules.css';
import { memo } from 'react';



const RULES_SECTIONS = [
  {
    id: 'objective',
    title: 'Objective',
    content: [
      {
        type: 'paragraph',
        text: 'The objective of Mahjong is to be the first player to complete a legal hand of 14 tiles consisting of four sets and a pair.'
      }
    ]
  },
  {
    id: 'tiles',
    title: 'Tiles',
    content: [
      {
        type: 'paragraph',
        text: 'A standard Mahjong set contains 144 tiles, divided into:'
      },
      {
        type: 'list',
        items: [
          '<strong>Suits:</strong> Characters (Thousand), Dots (Bamboo), and Bamboo (Dots) - each with 36 tiles numbered 1-9',
          '<strong>Honors:</strong> Winds (East, South, West, North) and Dragons (Red, Green, White) - 4 tiles each',
          '<strong>Flowers and Seasons:</strong> 1 tile each (though often ignored in basic scoring)'
        ]
      }
    ]
  },
  {
    id: 'sets',
    title: 'Sets',
    content: [
      {
        type: 'paragraph',
        text: 'A complete hand consists of four sets and a pair:'
      },
      {
        type: 'list',
        items: [
          '<strong>Pung:</strong> Three identical tiles (same suit and number or same honor)',
          '<strong>Chow:</strong> Three consecutive numbers in the same suit (e.g., 4-5-6 of Circles)',
          '<strong>Kong:</strong> Four identical tiles (a special type of Pung)',
          '<strong>Pair:</strong> Two identical tiles that serve as the eyes of the hand'
        ]
      }
    ]
  },
  {
    id: 'gameplay',
    title: 'Gameplay',
    content: [
      {
        type: 'ordered-list',
        items: [
          'Each player starts with 13 tiles',
          'Players take turns drawing and discarding tiles until someone completes a legal hand',
          'On your turn, draw a tile from the wall or pick up the discarded tile from another player',
          'Discard one tile face-up in the center',
          'Try to form sets (Pungs, Chows, Kongs) and a pair',
          'Call "Mahjong!" when you complete a legal hand'
        ]
      }
    ]
  },
  {
    id: 'scoring',
    title: 'Scoring',
    content: [
      {
        type: 'paragraph',
        text: 'Scoring varies by regional variant, but typically awards points for:'
      },
      {
        type: 'list',
        items: [
          'Completing the hand',
          'Special combinations',
          'Winning from the wall or from a discard',
          'Bonus tiles (Flowers and Seasons)'
        ]
      }
    ]
  },
  {
    id: 'tips',
    title: 'Tips for Beginners',
    content: [
      {
        type: 'list',
        items: [
          'Focus on one suit early in the game to build coherent sets',
          'Pay attention to what other players are discarding',
          'Keep versatile tiles that could fit multiple potential sets',
          'Remember that you can only win by completing a legal hand',
          'Practice recognizing common patterns and combinations'
        ]
      }
    ]
  }
];

const RulesSection = ({ section }: { section: typeof RULES_SECTIONS[number] }) => {
  return (
    <section className="rules-section" data-testid="rules-section">
      <h2 className="rules-subtitle">{section.title}</h2>
      {section.content.map((item, index) => {
        switch (item.type) {
          case 'paragraph':
            return <p key={index}>{item.text}</p>;
          case 'list':
            return (
              <ul className="rules-list" key={index}>
                {item.items?.map((listItem, itemIndex) => (
                  <li key={itemIndex} dangerouslySetInnerHTML={{ __html: listItem }} />
                ))}
              </ul>
            );
          case 'ordered-list':
            return (
              <ol className="rules-ordered-list" key={index}>
                {item.items?.map((listItem, itemIndex) => (
                  <li key={itemIndex}>{listItem}</li>
                ))}
              </ol>
            );
          default:
            return null;
        }
      })}
    </section>
  );
};

const MahjongRules = () => {
  return (
    <main className="rules-container">
      <h1 className="rules-title">How to Play Mahjong</h1>
      {RULES_SECTIONS.map((section) => (
        <RulesSection key={section.id} section={section} />
      ))}
    </main>
  );
};

export default memo(MahjongRules);
