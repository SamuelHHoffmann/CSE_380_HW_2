import {Vector3} from '../../math/Vector3'

export class GradientCircleSpriteType {
    private spriteWidth : number;
    private spriteHeight : number;
    

    public constructor(initSpriteWidth : number, initSpriteHeight : number) {
        this.spriteWidth = initSpriteWidth;
        this.spriteHeight = initSpriteHeight;
        
    }

    public getSpriteWidth() : number {
        return this.spriteWidth;
    }

    public getSpriteHeight() : number {
        return this.spriteHeight;
    }

}