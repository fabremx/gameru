import Character from "../objects/character";
import Player from "../objects/player";

let alreadyOverlap: boolean = false;

export default function handlerOverlap(player: Player, character: Character, spacing: number, {
    startCallback,
    endCallback
}: { startCallback: Function, endCallback: Function }) {
    const isOverlaping: boolean =
        (
            (player.sprite.x + spacing >= character.sprite.x) &&
            (player.sprite.x <= character.sprite.x + spacing)
        );

    if (!alreadyOverlap && isOverlaping) {
        alreadyOverlap = true;
        return startCallback();
    }

    if (alreadyOverlap && !isOverlaping) {
        alreadyOverlap = false;
        return endCallback();
    }
}