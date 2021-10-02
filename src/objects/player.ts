import { IPlayerSpriteConstructor } from "../interfaces/sprite.interface";
import handlerOverlap from "../utils/overlap";
import MultiKey from "../utils/multi-key";
import Character from "./character";
import DialogBox from "./dialogBox";

export default class Player {
    sprite: Phaser.Physics.Matter.Sprite;
    scene: Phaser.Scene;

    x: number;
    y: number;

    // Keys
    private leftInput: MultiKey;
    private rightInput: MultiKey;
    private jumpInput: MultiKey;
    private actionInput: MultiKey;
    private passDialogInput: MultiKey;

    // Movement
    private xAxisForce: number = 0.015;
    private jumpVelocity: number = 11;

    anims: Phaser.Animations.AnimationManager;

    public canTalk: boolean = false;
    public canMove: boolean = true;

    // TODO: Move Talk notification
    private talkKeyImage: Phaser.GameObjects.Image;
    private talkNotificationText: Phaser.GameObjects.Text;

    // Dialog
    private dialogBox: DialogBox;
    private activeDialog: boolean = false;


    constructor({ scene, x, y, sprite }: IPlayerSpriteConstructor) {
        this.scene = scene
        this.x = x;
        this.y = y;

        // TODO: Move
        this.scene.load.image("keyTalk", 'assets/images/keyE.png');
        this.scene.events.on('dialogEnd', () => this.activeDialog = false, this);

        this.scene.load.spritesheet("player", sprite.path, {
            frameWidth: sprite.width,
            frameHeight: sprite.height,
            margin: sprite.margin,
            spacing: sprite.spacing,
        });

        this.anims = this.scene.anims;
        this.anims.create({
            key: "player-idle",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: "player-run",
            frames: this.anims.generateFrameNumbers("player", { start: 8, end: 15 }),
            frameRate: 12,
            repeat: -1
        });

        // Track the keys
        const { LEFT, RIGHT, UP, A, D, W, E, SPACE } = Phaser.Input.Keyboard.KeyCodes;
        this.leftInput = new MultiKey(this.scene, [LEFT, A]);
        this.rightInput = new MultiKey(this.scene, [RIGHT, D]);
        this.jumpInput = new MultiKey(this.scene, [UP, W]);
        this.actionInput = new MultiKey(this.scene, [E]);
        this.passDialogInput = new MultiKey(this.scene, [SPACE]);
    }

    add() {
        this.sprite = this.scene.matter.add.sprite(0, 0, "player", 0);
        this.sprite
            .setScale(2)
            .setFixedRotation() // Sets inertia to infinity so the player can't rotate
            .setPosition(this.x, this.y)
            .setDepth(20);
    }

    collideWith(group: number) {
        this.sprite.setCollisionGroup(group)
    }

    destroy() {
        this.sprite.destroy();
    }

    handleDialogWith(characters: Character[]) {
        characters.forEach((character: Character) => {
            handlerOverlap(this, character, 100, {
                startCallback: () => this.createTalkNotification(character),
                endCallback: () => this.destroyTalkNotification()
            })
        })
    }

    handleOverlapWith(characters: Character[]) {
        characters.forEach((character: Character) => {
            handlerOverlap(this, character, 100, {
                startCallback: () => this.createTalkNotification(character),
                endCallback: () => this.destroyTalkNotification()
            })
        })
    }

    private createTalkNotification(character: Character) {
        this.canTalk = true;
        this.talkKeyImage = this.scene.add.image(character.sprite.x - 30, character.sprite.y - 85, "keyTalk", 0);
        this.talkNotificationText = this.scene.add.text(character.sprite.x, character.sprite.y - 100, 'Parler', {
            font: "32px Arial",
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.5)'
        });
    }

    private destroyTalkNotification() {
        this.canTalk = false;
        this.talkKeyImage.destroy();
        this.talkNotificationText.destroy();
    }

    handleInputs(): void {
        const velocity = this.sprite.body.velocity;

        const isRightKeyDown = this.rightInput.isDown();
        const isLeftKeyDown = this.leftInput.isDown();
        const isJumpKeyDown = this.jumpInput.isDown();
        const isActionKeyDown = this.actionInput.justDown();
        const isSkipDialogDown = this.passDialogInput.justDown();

        if (isLeftKeyDown) {
            this.sprite.setFlipX(true);
            this.sprite.applyForce(new Phaser.Math.Vector2(-this.xAxisForce, 0));
        } else if (isRightKeyDown) {
            this.sprite.setFlipX(false);
            this.sprite.applyForce(new Phaser.Math.Vector2(this.xAxisForce, 0));
        }

        /** Dialog handle */
        if (this.activeDialog && isSkipDialogDown) {
            this.dialogBox.handleSkip();
        }
        if (this.canTalk && isActionKeyDown && !this.activeDialog) {
            this.dialogBox = new DialogBox({
                scene: this.scene, dialogs: [
                    'test',
                    'Salut à toi joueur, je suis une boite de dialogue avec du texte à l\'inérieur. J\'essaye d\'écrire un très très long texte pour voir comment se comporte les retours à la ligne dans cette boite. Esperons que cela marche bien',
                    'Profite de pouvoir ta baller sur la carte. A plus'
                ]
            })
            this.dialogBox.display();
            this.activeDialog = true;
        }
        /** Dialog handle END */

        if (isJumpKeyDown) {
            this.sprite.setVelocityY(-this.jumpVelocity);
        }

        if (velocity.x > 7) this.sprite.setVelocityX(7);
        else if (velocity.x < -7) this.sprite.setVelocityX(-7);
    }
}