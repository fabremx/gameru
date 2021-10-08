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
    private canMove: boolean = true;

    anims: Phaser.Animations.AnimationManager;

    public canTalk: boolean = false;

    // Dialog
    private dialogBox: DialogBox;
    private activeDialog: boolean = false;

    private overlappedCharacter: Character;

    constructor({ scene, x, y, sprite }: IPlayerSpriteConstructor) {
        this.scene = scene
        this.x = x;
        this.y = y;

        this.scene.load.spritesheet("player", sprite.path, {
            frameWidth: sprite.width,
            frameHeight: sprite.height,
            margin: sprite.margin,
            spacing: sprite.spacing,
        });
        this.scene.events.on('END_DIALOG', () => this.endDialog());

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

    handleOverlapWith(characters: Character[]) {
        characters.forEach((character: Character) => {
            handlerOverlap(this, character, 100, {
                startCallback: () => {
                    this.canTalk = true;
                    this.overlappedCharacter = character;
                    this.scene.events.emit(`OVERLAP_START_${character.name}`);
                },
                endCallback: () => {
                    this.canTalk = false;
                    this.overlappedCharacter = null;
                    this.scene.events.emit(`OVERLAP_END_${character.name}`);
                }
            })
        })
    }

    private startDialog() {
        if (!this.overlappedCharacter.isSpeakableCharacter) {
            return
        }

        const characterDialogs = this.overlappedCharacter.getDialogs()
        this.canMove = false;
        this.dialogBox = new DialogBox({
            scene: this.scene, dialogs: characterDialogs
        })
        this.dialogBox.display();
        this.activeDialog = true;

    }
    private endDialog() {
        this.canMove = true;
        this.activeDialog = false
        this.overlappedCharacter.prepareNextDialog()
    }

    handleDialogs(): void {
        const isActionKeyDown = this.actionInput.justDown();
        const isSkipDialogDown = this.passDialogInput.justDown();

        if (this.activeDialog && isSkipDialogDown) {
            this.dialogBox.handleSkip();
        }
        if (this.canTalk && isActionKeyDown && !this.activeDialog) {
            this.startDialog();
        }
    }

    handleMovements(): void {
        if (!this.canMove) {
            return;
        }

        const velocity = this.sprite.body.velocity;

        const isRightKeyDown = this.rightInput.isDown();
        const isLeftKeyDown = this.leftInput.isDown();
        const isJumpKeyDown = this.jumpInput.isDown();

        if (isLeftKeyDown) {
            this.sprite.setFlipX(true);
            this.sprite.applyForce(new Phaser.Math.Vector2(-this.xAxisForce, 0));
        } else if (isRightKeyDown) {
            this.sprite.setFlipX(false);
            this.sprite.applyForce(new Phaser.Math.Vector2(this.xAxisForce, 0));
        }

        if (isJumpKeyDown) {
            this.sprite.setVelocityY(-this.jumpVelocity);
        }

        if (velocity.x > 7) this.sprite.setVelocityX(7);
        else if (velocity.x < -7) this.sprite.setVelocityX(-7);
    }
}