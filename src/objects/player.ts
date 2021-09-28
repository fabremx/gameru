import { IPlayerSpriteConstructor } from "../interfaces/sprite.interface";
import MultiKey from "../utils/multi-key";

export default class Player {
    public sprite: Phaser.Physics.Matter.Sprite;
    public scene: Phaser.Scene;

    private x: number;
    private y: number;

    // Keys
    private leftInput: MultiKey;
    private rightInput: MultiKey;
    private jumpInput: MultiKey;

    // Movement
    private xAxisForce: number = 0.015;
    private jumpVelocity: number = 11;

    constructor({ scene, x, y, sprite }: IPlayerSpriteConstructor) {
        this.scene = scene
        this.x = x;
        this.y = y;

        this.scene.load.spritesheet("player", sprite.path, {
            frameWidth: sprite.size,
            frameHeight: sprite.size,
            margin: sprite.margin,
            spacing: sprite.spacing,
        });

        const anims: Phaser.Animations.AnimationManager = this.scene.anims;
        anims.create({
            key: "player-idle",
            frames: anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
        anims.create({
            key: "player-run",
            frames: anims.generateFrameNumbers("player", { start: 8, end: 15 }),
            frameRate: 12,
            repeat: -1
        });

        // Track the keys
        const { LEFT, RIGHT, UP, A, D, W } = Phaser.Input.Keyboard.KeyCodes;
        this.leftInput = new MultiKey(this.scene, [LEFT, A]);
        this.rightInput = new MultiKey(this.scene, [RIGHT, D]);
        this.jumpInput = new MultiKey(this.scene, [UP, W]);
    }

    add() {
        this.sprite = this.scene.matter.add.sprite(0, 0, "player", 0);
        this.sprite
            .setScale(2)
            .setFixedRotation() // Sets inertia to infinity so the player can't rotate
            .setPosition(this.x, this.y)
            .setDepth(20);
    }

    destroy() {
        this.sprite.destroy();
    }

    handleInputs(): void {
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