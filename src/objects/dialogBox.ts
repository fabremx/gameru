import { IDialogConstructor } from "../interfaces/text.interface";

export default class DialogBox {
    private box: Phaser.GameObjects.Rectangle;
    private scene: Phaser.Scene;

    private dialogs: string[];
    private currentText: Phaser.GameObjects.Text;

    /** Variables when reading dialogs */
    private letterCounter: number = 0;
    private currentDialogIndex: number = 0;

    /** Interval for writing text effect */
    private textInterval: any;

    constructor({ scene, dialogs }: IDialogConstructor) {
        this.scene = scene
        this.dialogs = dialogs;
    }

    async display() {
        const MARGIN_LEFT = 50;
        const MARGIN_TOP = this.scene.scale.height - 250

        const WIDTH = (this.scene.cameras.main.width - (MARGIN_LEFT * 2));
        const HEIGHT = 230;

        const PADDING_LEFT = 50;
        const PADDING_TOP = 30;


        this.box = this.scene.add.rectangle(
            (this.scene.cameras.main.scrollX + MARGIN_LEFT),
            (this.scene.cameras.main.scrollY + MARGIN_TOP),
            WIDTH,
            HEIGHT,
            0xff0000
        ).setOrigin(0).setDepth(10)

        this.currentText = this.scene.add.text(this.box.x + PADDING_LEFT, this.box.y + PADDING_TOP, '', {
            color: 'White',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: '32px'
        }).setWordWrapWidth(WIDTH - (PADDING_LEFT * 2))

        this.currentText.setDepth(11)

        // Begin with first line, other line will be triggered by handleSkip method
        this.readLine(this.dialogs[0]);
    }

    async readLine(dialog: string) {
        this.letterCounter = 0;

        this.textInterval = setInterval((() => {
            const isAllLineRendered = (this.letterCounter >= dialog.length);

            // When text is entierely rendered, waiting for user action
            if (isAllLineRendered) {
                clearInterval(this.textInterval);
                return;
            }

            this.currentText.text += dialog[this.letterCounter]
            this.letterCounter += 1;
        }).bind(this), 80);
    }

    handleSkip() {
        const currentDialog: string = this.dialogs[this.currentDialogIndex];
        const isAllLineRendered: boolean = (this.letterCounter === currentDialog.length);

        if (!isAllLineRendered) {
            return this.renderAllDialog();
        }

        if (isAllLineRendered) {
            const isLastDialogEnded = this.currentDialogIndex >= this.dialogs.length - 1;

            return isLastDialogEnded
                ? this.endDialog()
                : this.readNextDialog();
        }
    }

    private renderAllDialog() {
        clearInterval(this.textInterval);
        const currentDialog: string = this.dialogs[this.currentDialogIndex];

        this.currentText.text = currentDialog;
        this.letterCounter = currentDialog.length;
    }
    private endDialog() {
        this.scene.events.emit('dialogEnd');
        this.destroy();
    }
    private readNextDialog() {
        this.currentDialogIndex += 1;
        this.currentText.text = '';
        this.readLine(this.dialogs[this.currentDialogIndex]);
    }

    destroy() {
        this.box.destroy()
        this.currentText.destroy();
    }
}
