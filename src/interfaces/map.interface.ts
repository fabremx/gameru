export interface IMapConstructor {
    scene: Phaser.Scene;
    mapPath: string;
    tilesPath: string;
}

export interface IMapLayer {
    name: string;
    options: {
        depth: number;
        collision: boolean;
    }
}