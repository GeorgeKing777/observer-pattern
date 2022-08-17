import GameEventDispatcher from './game_event';
import GameEventListener from './game_event_listener';

export default class AutoEventBinder {    
    private m_gameEventDispatcher : GameEventDispatcher;
    private m_type2Callbacks : Map<GameEventType, GameEventListener>;

    constructor(gameEventDispatcher : GameEventDispatcher) {
        this.m_gameEventDispatcher = gameEventDispatcher;
    }

    BindEvent(gameEventType : GameEventType, fun: Function, thisArg?: any) : boolean {
        if (!this.m_type2Callbacks) {
            this.m_type2Callbacks = new Map<GameEventType, GameEventListener>();
        }
        if (this.m_type2Callbacks.has(gameEventType)) {
            console.error("AutoEventBinder:BindEvent same eventtype", gameEventType);
            return false;
        }
        this.m_type2Callbacks.set(gameEventType, this.m_gameEventDispatcher.AddListener(gameEventType, fun, thisArg));
        return true;
    }

    UnBindEvent(gameEventType : GameEventType) : boolean {
        if (this.m_type2Callbacks && this.m_type2Callbacks.has(gameEventType)) {
            let listener = this.m_type2Callbacks.get(gameEventType);
            this.m_gameEventDispatcher.RemoveListener(listener);
            this.m_type2Callbacks.delete(gameEventType);
            return true;
        }
        return false;
    }

    UnBindAllEvents() : void {
        if (this.m_type2Callbacks) {
            for (const listener of this.m_type2Callbacks.values()) {
                this.m_gameEventDispatcher.RemoveListener(listener);
            }
            this.m_type2Callbacks.clear();
        }
    }
}