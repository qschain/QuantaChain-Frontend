type Handler = (data:any)=>void

export const stream = {
    subscribe(topic:string, handler:Handler) {
        const id = setInterval(()=>handler({ topic, ts: Date.now(), price: 3150 + Math.random()*50 }), 1500)
        return () => clearInterval(id)
    }
}
