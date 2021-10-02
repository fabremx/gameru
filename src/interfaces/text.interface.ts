export interface ISceneTitleConstructor {
    scene: Phaser.Scene;
    x: number;
    y: number;
    text: string;
}

export interface IDialogConstructor {
    scene: Phaser.Scene;
    dialogs: string[];
}