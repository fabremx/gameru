import { IDialogConstructor } from "../interfaces/text.interface";

export default class Character {
    private box: Phaser.Physics.Matter.Sprite;
    private currentText: Phaser.GameObjects.Text;
    private scene: Phaser.Scene;

    private x: number;
    private y: number;
    private characterName: string;
    private dialogs: string[];

    constructor({ scene, x, y, characterName, dialogs }: IDialogConstructor) {
        this.scene = scene
        this.x = x;
        this.y = y;
        this.characterName = characterName;
        this.dialogs = dialogs;
    }

    add() {
        this.currentText = this.scene.add.text(this.x, this.y, '')
            .setWordWrapWidth(100)

        this.typewriteTextWrapped(this.dialogs[0])
    }

    destroy() {
        this.currentText.destroy();
    }

    typewriteTextWrapped(text: string): void {
        const lines = this.currentText.getWrappedText(text)
        const wrappedText = lines.join('\n')

        this.typewriteText(wrappedText)
    }

    typewriteText(text: string): void {
        const length = text.length
        let i = 0
        this.scene.time.addEvent({
            callback: () => {
                this.currentText.text += text[i]
                ++i
            },
            repeat: length - 1,
            delay: 100
        })
    }
}
