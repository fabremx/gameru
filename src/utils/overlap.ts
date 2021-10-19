import Character from "../objects/character";
import Item from "../objects/item";
import Player from "../objects/player";


export default function isOverlapping(player: Player, object: Character | Item, spacing: number) {
    if (!player.isTouching.ground) {
        return false;
    }

    return (
        (player.sprite.x + spacing >= object.sprite.x) &&
        (player.sprite.x <= object.sprite.x + spacing)
    );
}