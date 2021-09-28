import { ISceneTitleConstructor } from "../interfaces/text.interface";

export default class SceneTitle {
    public title: Phaser.GameObjects.Text;
    public scene: Phaser.Scene;

    private x: number;
    private y: number;
    private text: string

    constructor({ scene, x, y, text }: ISceneTitleConstructor) {
        this.scene = scene
        this.x = x;
        this.y = y;
        this.text = text;
    }

    add() {
        this.title = this.scene.add.text(
            this.x,
            this.y,
            this.text,
            {
                color: 'green',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
                fontSize: '44px'
            }
        );
    }

    destroy() {
        this.title.destroy();
    }
}