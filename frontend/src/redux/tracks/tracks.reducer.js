import tracksActionTypes from './tracks.types';
import isEmpty from 'lodash.isempty';

import { getNextTrack, getPreviousTrack, checkCollapsed } from './tracks.utils';
import status from './tracks.status';

const INITIAL_STATE = {
  playlists: null,
  selectedTrack: {},
  showArrangementView: false,
  currentSongPart: null,
  arrangementClipBoard: null,
  isLoading: false,
  error: null,
  message: '',
  fetchStatus: status.ON_HOLD,
  uploadProgress: 0,
  showProgbar: false,
};

const tracksReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case tracksActionTypes.FETCH_PLAYLISTS_START:
    case tracksActionTypes.CREATE_PLAYLIST_START:
    case tracksActionTypes.REMOVE_PLAYLIST_START:
    case tracksActionTypes.FETCH_TRACK_START:
    case tracksActionTypes.UPDATE_TRACK_START:
    case tracksActionTypes.DOWNLOAD_TRACK_START:
    case tracksActionTypes.REMOVE_TRACK_START:
      return {
        ...state,
        isLoading: true,
        fetchStatus: status.FETCHING,
      };
    case tracksActionTypes.UPLOAD_TRACK_START:
      return {
        ...state,
        isLoading: true,
        fetchStatus: status.UPLOADING,
      };
    case tracksActionTypes.CREATE_PLAYLIST_SUCCESS:
    case tracksActionTypes.REMOVE_PLAYLIST_SUCCESS:
    case tracksActionTypes.FETCH_PLAYLISTS_SUCCESS:
    case tracksActionTypes.UPLOAD_TRACK_SUCCESS:
    case tracksActionTypes.UPDATE_TRACK_SUCCESS:
    case tracksActionTypes.REMOVE_TRACK_SUCCESS:
      return {
        ...state,
        playlists: action.payload.map((playlist) => ({
          ...playlist,
          isCollapsed: checkCollapsed(state.playlists, playlist),
        })),
        isLoading: false,
        error: null,
        message: 'Lyckades!',
        fetchStatus: status.SUCCESS,
      };
    case tracksActionTypes.FETCH_TRACK_SUCCESS:
      return {
        ...state,
        selectedTrack: { ...action.payload, playing: false },
      };
    case tracksActionTypes.DOWNLOAD_TRACK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        fetchStatus: status.SUCCESS,
      };
    case tracksActionTypes.FETCH_PLAYLISTS_FAILURE:
    case tracksActionTypes.CREATE_PLAYLIST_FAILURE:
    case tracksActionTypes.REMOVE_PLAYLIST_FAILURE:
    case tracksActionTypes.UPLOAD_TRACK_FAILURE:
    case tracksActionTypes.FETCH_TRACK_FAILURE:
    case tracksActionTypes.UPDATE_TRACK_FAILURE:
    case tracksActionTypes.DOWNLOAD_TRACK_FAILURE:
    case tracksActionTypes.REMOVE_TRACK_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        message: 'Misslyckades!',
        fetchStatus: status.FAILURE,
      };
    case tracksActionTypes.CLEAR_ERROR_AND_STATUS:
      return {
        ...state,
        message: '',
        error: null,
        fetchStatus: status.ON_HOLD,
      };
    case tracksActionTypes.SET_FETCH_STATUS:
      return {
        ...state,
        fetchStatus: action.payload,
      };
    case tracksActionTypes.SET_UPLOAD_PROGRESS:
      return {
        ...state,
        uploadProgress: action.payload,
      };
    case tracksActionTypes.SELECT_NEXT_TRACK:
      return {
        ...state,
        selectedTrack: {
          ...getNextTrack(state.playlists, action.payload),
          playing: false,
        },
      };
    case tracksActionTypes.SELECT_PREVIOUS_TRACK:
      return {
        ...state,
        selectedTrack: {
          ...getPreviousTrack(state.playlists, action.payload),
          playing: false,
        },
      };
    case tracksActionTypes.UNSELECT_TRACK:
      return {
        ...state,
        selectedTrack: {},
      };
    case tracksActionTypes.TOGGLE_PLAYING:
      return {
        ...state,
        // Toggle only if there is a selected track
        selectedTrack: isEmpty(state.selectedTrack)
          ? {}
          : {
              ...state.selectedTrack,
              playing: !state.selectedTrack.playing,
            },
      };
    case tracksActionTypes.SET_PLAYING:
      return {
        ...state,
        selectedTrack: {
          ...state.selectedTrack,
          playing: action.payload,
        },
      };
    case tracksActionTypes.TOGGLE_IS_PLAYLIST_COLLAPSED:
      return {
        ...state,
        playlists: state.playlists.map((playlist) =>
          playlist.id === action.payload.id
            ? { ...playlist, isCollapsed: playlist.isCollapsed ? false : true }
            : playlist
        ),
      };
    case tracksActionTypes.SET_PLAYLIST_IS_COLLAPSED:
      return {
        ...state,
        playlists: state.playlists.map((playlist) =>
          playlist.id === action.payload.playlist.id
            ? { ...playlist, isCollapsed: action.payload.boolean }
            : playlist
        ),
      };

    // REDUCERS RELATED TO ARRANGMENT
    case tracksActionTypes.TOGGLE_SHOW_ARRANGEMENT_VIEW:
      return {
        ...state,
        showArrangementView:
          !isEmpty(state.selectedTrack) && !state.showArrangementView,
      };
    case tracksActionTypes.PASTE_ARRANGEMENT_START:
    case tracksActionTypes.CREATE_SONGPART_START:
    case tracksActionTypes.UPDATE_SONGPART_START:
    case tracksActionTypes.REMOVE_SONGPART_START:
    case tracksActionTypes.MOVE_SONGPART_UP_START:
    case tracksActionTypes.MOVE_SONGPART_DOWN_START:
      return {
        ...state,
        isLoading: true,
        fetchStatus: status.FETCHING,
      };
    case tracksActionTypes.PASTE_ARRANGEMENT_SUCCESS:
    case tracksActionTypes.CREATE_SONGPART_SUCCESS:
    case tracksActionTypes.UPDATE_SONGPART_SUCCESS:
    case tracksActionTypes.REMOVE_SONGPART_SUCCESS:
    case tracksActionTypes.MOVE_SONGPART_UP_SUCCESS:
    case tracksActionTypes.MOVE_SONGPART_DOWN_SUCCESS:
      return {
        ...state,
        error: null,
        selectedTrack: {
          ...state.selectedTrack,
          arrangement: action.payload,
        },
      };
    case tracksActionTypes.PASTE_ARRANGEMENT_FAILURE:
    case tracksActionTypes.CREATE_SONGPART_FAILURE:
    case tracksActionTypes.UPDATE_SONGPART_FAILURE:
    case tracksActionTypes.REMOVE_SONGPART_FAILURE:
    case tracksActionTypes.MOVE_SONGPART_UP_FAILURE:
    case tracksActionTypes.MOVE_SONGPART_DOWN_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case tracksActionTypes.SET_ARRANGEMENT_CLIPBOARD:
      return {
        ...state,
        arrangementClipBoard: action.payload,
      };
    case tracksActionTypes.SET_CURRENT_SONGPART:
      return {
        ...state,
        currentSongPart: action.payload,
      };
    default:
      return state;
  }
};

export default tracksReducer;
