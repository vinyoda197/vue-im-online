<style scoped>
.chat
{
    list-style: none;
    margin: 0;
    padding: 0;
}

.chat li
{
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px dotted #B3A9A9;
}

.chat li.left .chat-body
{
    margin-left: 60px;
}

.chat li.right .chat-body
{
    margin-right: 60px;
}


.chat li .chat-body p
{
    margin: 0;
    color: #777777;
}

.panel .slidedown .glyphicon, .chat .glyphicon
{
    margin-right: 5px;
}

.panel-body
{
    overflow-y: scroll;
    height: 250px;
}

::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #F5F5F5;
}

::-webkit-scrollbar
{
    width: 12px;
    background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb
{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #555;
}

</style>

<template>
	<div class="container">
    <div class="row">
        <div class="col-md-5">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    <slot name="im-online"><span class="glyphicon glyphicon-comment"></span> {{ user_status }}</slot>
                </div>
                <div class="panel-body">
                    <ul class="chat" id="messages" ref="messages">
                        
                    </ul>
                </div>
                <slot name="chatbox">
	                <div class="panel-footer">
	                    <div class="input-group">
	                        <input v-model="message" id="btn-input" type="text" class="form-control input-sm" placeholder="Type your message here..." />
	                        <span class="input-group-btn">
	                            <button class="btn btn-warning btn-sm" id="btn-chat" @click="send">
	                                Send</button>
	                        </span>
	                    </div>
	                </div>
                </slot>
            </div>
        </div>
    </div>
</div>
</template>

<script>
	import Socket from 'socket.io-client'
	import Vue from 'vue'
	
	var message_item = Vue.component('message-item', require('./message-item.vue'))

	export default {

		props: ['nick_', 'uid_', 'pid_', 'server_'],

		data: function() {
			return {
				user_status: 'offline',
				socket: null,
				message: '',
			}
		},

		mounted: function() {
			var _this = this

			this.socket = Socket.connect(this.server_, { query: 'nick='+this.nick_+'&uid='+this.uid_+'&pid='+this.pid_ });

			this.socket.on('user-online', function(resp) {
				_this.user_status = resp.status;
			})

			this.socket.on('message', function(message) {
				var mc = new message_item({
					data: function() {
						return {
							nick: message.nick,
							message: message.message,
						}	
					}
				})
				_this.$refs.messages.appendChild(mc.$mount().$el)
				_this.message = '';
			})
			
		},

		methods: {
			send: function() {
				this.socket.emit('message', { pid: this.pid_, message: this.message, nick: this.nick_ })	
			},
		},
	}
</script>