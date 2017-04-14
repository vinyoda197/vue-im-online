
module.exports = class{

    constructor(sid, nick, socket) {
        this.id = sid
        this.nick = nick
        this.viewers = new Map()
        this.setSocket(socket)
    }

    sid() {
        return this.id
    }

    socket_() {
        return this.socket
    }

    nick_() {
        return this.nick
    }

    status() {
        return (this.socket)? 'online' : 'offline'
    }

    setSocket(socket) {
        this.socket = socket
        this.notifyViewers('user-online', {id: this.id, status: this.status()})
    }

    addViewer(vid, viewer) {
        this.viewers.set(vid, viewer)

    }

    removeViewer(vid) {
        this.viewers.delete(vid)
    }

    notifyViewers(m, data) {
        this.viewers.forEach(function(s, k) {
            var sock = s.socket_()
            if(sock) {
                sock.emit(m, data)
            }
        })
    }

    destroyThis() {
        var _this = this
        this.setSocket(null)
        this.viewers.forEach(function(s, k) {
            s.removeViewer(_this.id)
        })
    }
}
