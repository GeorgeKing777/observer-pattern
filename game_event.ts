import GameEventListener from './game_event_listener';

export default class GameEventDispatcher {
    private m_type2Callbacks : Map<GameEventType,Map<bigint,Map<number,GameEventListener>>> = new Map<GameEventType,Map<bigint,Map<number,GameEventListener>>>(); // {消息类型,{target_id,{callback_id,callback}}}
    private m_globalType2Callbacks : Map<GameEventType,Map<number,GameEventListener>> = new Map<GameEventType,Map<number,GameEventListener>>(); // 全局关注 {消息类型,{callback_id,callback}}

    // target_id 监听发给指定id的事件；如果为nil，则表示（发给所有id的事件）全部监听
    AddListener(gameEventType : GameEventType, fun: Function, thisArg?: any, target_id? : bigint) : GameEventListener {
        let listener = new GameEventListener(gameEventType, target_id, fun, thisArg);
        if (target_id) {            
            if (!this.m_type2Callbacks.has(gameEventType)) {
                this.m_type2Callbacks.set(gameEventType, new Map<bigint,Map<number,GameEventListener>>());
            }
            let type_listeners = this.m_type2Callbacks.get(gameEventType);
            if (!type_listeners.has(target_id)) {
                type_listeners.set(target_id,new Map<number,GameEventListener>());
            }
            let target_listeners = type_listeners.get(target_id);
            target_listeners.set(listener.callback.ID,listener);
        } else {
            if (!this.m_globalType2Callbacks.has(gameEventType)) {
                this.m_globalType2Callbacks.set(gameEventType, new Map<number,GameEventListener>());
            }
            let type_listeners = this.m_globalType2Callbacks.get(gameEventType);
            type_listeners.set(listener.callback.ID,listener);
        }
        return listener;
    }

    HasListener(gameEventType : GameEventType, target_id? : bigint) : boolean{
        if (target_id) {
            if (!this.m_type2Callbacks.has(gameEventType)) {
                return false;
            }
        } else {
            if (!this.m_globalType2Callbacks.has(gameEventType)) {
                return false;
            }
        }
        return true;
    }

    RemoveListener(listener : GameEventListener) : void {
        if (!listener) {
            return;
        }
        if (listener.target_id) {
            let type_listeners = this.m_type2Callbacks.get(listener.gameEventType); 
            if (!type_listeners) {
                return;
            }
            let target_listeners = type_listeners.get(listener.target_id);
            if (!target_listeners) {
                return;
            }
            target_listeners.delete(listener.callback.ID);
        } else {
            let type_listeners = this.m_globalType2Callbacks.get(listener.gameEventType);
            if (!type_listeners) {
                return;
            }
            type_listeners.delete(listener.callback.ID);
        }
    }

    DispatchGlobal(gameEventType : GameEventType, ...argArray: any[]) : void {
        this.Dispatch(gameEventType,null,...argArray);
    }

    DispatchTarget(gameEventType : GameEventType, target_id : bigint, ...argArray: any[]) : void {
        if (target_id) {
            this.Dispatch(gameEventType,target_id,...argArray);
        } else {
            console.error("DispatchTarget target_id can not null");
        }
    }

    RemoveAllListeners() : void {
        this.m_type2Callbacks.clear();
        this.m_globalType2Callbacks.clear();
    }

    // target_id 消息会发给关注此target_id（AddListener时的target_id参数）的listener，如果是全局消息，传null
    private Dispatch(gameEventType : GameEventType, target_id? : bigint, ...argArray: any[]) : void {
        if (target_id && this.m_type2Callbacks.has(gameEventType)) {
            let type_listeners = this.m_type2Callbacks.get(gameEventType);
            if (type_listeners.has(target_id)) {
                let target_listeners = type_listeners.get(target_id);
                if (target_listeners) {
                    for (const listener of target_listeners.values()) {
                        listener.callback.Call(target_id, ...argArray);
                    }
                }
            }
        }
        if (this.m_globalType2Callbacks.has(gameEventType)) {
            let type_listeners = this.m_globalType2Callbacks.get(gameEventType);
            if (type_listeners) {
                if (target_id) {
                    for (const listener of type_listeners.values()) {
                        listener.callback.Call(target_id, ...argArray);
                    }
                } else {
                    for (const listener of type_listeners.values()) {
                        listener.callback.Call(...argArray);
                    }
                }
            }
        }
    }
}