import { Dice, Dices } from './Redux Storage/Fetch Firebase/Dices/types';

export default function replaceTextWithImgTag(
    text: string,
    dices?: Dices
): string {
    return text
        .replace(/{Dice:\w*( \w*)*}/g, match => {
            const diceName = match.replace('{Dice:', '').replace('}', '');
            const { img, rarity } = dices?.find(
                dice => dice.name === diceName
            ) as Dice;
            const nullDiceUrl =
                'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/Dice%20Images%2FEmpty.png?alt=media&token=193f9435-4c38-4ef0-95cd-317d9fbe6efe';
            return `<figure class="dice"><img src="${img ||
                nullDiceUrl}" alt="${
                img ? `dice ${diceName}` : 'dice ?'
            }" data-dice-rarity=${rarity || '?'} /></figure>`;
        })
        .replace(
            /({Gold}|{Diamond}|{Common Dice}|{Rare Dice}|{Unique Dice}|{Legendary Dice})/g,
            match => {
                let src: string;
                const alt = match.replace(/{|}/g, '');
                switch (match) {
                    case '{Gold}':
                        src =
                            'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FGold.png?alt=media&token=28b9c744-31fd-4f1f-b640-a63d19c6f8d3';
                        break;
                    case '{Diamond}':
                        src =
                            'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FDiamond.png?alt=media&token=5d87897b-396a-46f5-9721-9431467ba1ad';
                        break;
                    case '{Common Dice}':
                        src =
                            'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FCommon%20Dice.png?alt=media&token=d1327589-1148-4135-986c-64351f5bcd5f';
                        break;
                    case '{Rare Dice}':
                        src =
                            'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FRare%20Dice.png?alt=media&token=c76c87f8-1e1c-495b-9b0c-e96cef16909c';
                        break;
                    case '{Unique Dice}':
                        src =
                            'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FUnique%20Dice.png?alt=media&token=ecbda29b-513d-4789-ac1a-73248202679c';
                        break;
                    case '{Legendary Dice}':
                        src =
                            'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FLegendary%20Dice.png?alt=media&token=7e5835d0-1d8f-416e-8ac1-c2b80d78e3b5';
                        break;
                    default:
                        src = '';
                }
                return `<img src="${src}" alt="${alt}" />`;
            }
        );
}
