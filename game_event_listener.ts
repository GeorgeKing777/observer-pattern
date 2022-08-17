import Callback from '../../../helper/callback';

export default class GameEventListener {
    gameEventType : GameEventType;
    target_id : bigint;
    callback : Callback;

    constructor(gameEventType : GameEventType, target_id : bigint, fun: Function, thisArg: any) {
        this.gameEventType = gameEventType;
        this.target_id = target_id;
        this.callback = Callback.Create(fun, thisArg);
    }
}