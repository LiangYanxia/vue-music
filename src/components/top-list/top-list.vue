<template>
    <transition appear name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import { createSong, processSongsUrl } from 'common/js/song'

export default {
    data() {
        return {
            songs: [],
            rank: true
        }
    },
    created() {
        this._getMusicList()
    },
    methods: {
        _getMusicList() {
            if(!this.topList.id) {
                this.$router.push('/rank')
                return
            }
            getMusicList(this.topList.id).then(res => {
                if(res.code === ERR_OK){
                    processSongsUrl(this._normalizeSongs(res.songlist)).then(res => {
                        this.songs = res
                    })
                }
            })
        },
        _normalizeSongs(list) {
            const ret = []
            list.forEach(item => {
                const musicData = item.data
                if(musicData.songid && musicData.albumid) {
                    ret.push(createSong(musicData))
                }
            })
            return ret
        }
    },
    computed: {
        title() {
            return this.topList.topTitle
        },
        bgImage() {
            return this.topList.picUrl
        },
        ...mapGetters([
            'topList'
        ])
    },
    components: {
        MusicList
    }
}
</script>

<style lang="stylus" scoped>
    .slide-enter-active, .slide-leave-active
        transition: all 0.5s
    .slide-enter, .slide-leave-to
        transform translate3d(100%, 0, 0)
</style>