<style>
	
</style>

<template>
	<li class="left clearfix">
        <div class="chat-body clearfix">
            <div class="header">
                <strong class="primary-font">{{ nick }}</strong> <small class="pull-right text-muted">
                    <span class="glyphicon glyphicon-time">{{ time_mounted }}</span></small>
            </div>
            <p>
                {{ message }}
            </p>
        </div>
    </li>
</template>

<script>
	export default {
		data: function() {
			return {
				message: '',
				nick: '',
				uid: '',
				time_mounted: null
			}
		},

		mounted: function() {
			var d = new Date()
			var h = d.getHours() > 12 ? d.getHours() - 12 : (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
			var m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()

			this.time_mounted = h + ':' + m
		}
	}
</script>