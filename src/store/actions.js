import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

function findIndex(list, song) {
    return list.findIndex(item => {
        return item.id === song.id
    })
}

// 解构context对象 点击歌曲后更改的vuex参数
export const selectPlay = function ({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    if(state.mode === playMode.random) {
        const randomList = shuffle(list)
        commit(types.SET_PLAYLIST, randomList)
        index = findIndex(randomList, list[index])
    } else {
        commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function({commit}, {list}) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    const randomlist = shuffle(list)
    commit(types.SET_PLAYLIST, randomlist)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({commit, state}, song) {
    const playlist = [...state.playList]
    const sequenceList = [...state.sequenceList]
    let currentIndex = state.currentIndex
    // 记录当前歌曲
    const currentSong = playlist[currentIndex]
    // 查找当前列表中是否有待插入的歌曲并返回其索引
    const fpIndex = findIndex(playlist, song)
    // 如果不包含这首歌，就添加，否则就跳转播放
    if(fpIndex === -1) {
        currentIndex++
        playlist.splice(currentIndex, 0, song)
    }else{
        currentIndex = fpIndex
    }

    let currentSIndex = findIndex(sequenceList, currentSong)
    const fsIndex = findIndex(sequenceList, song)
    // 如果不包含这首歌，就添加，否则啥都不干
    if(fsIndex === -1) {
        currentSIndex++
        sequenceList.splice(currentSIndex, 0, song)
    }
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}