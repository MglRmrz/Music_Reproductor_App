import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackgroundLayout } from '../../components/BackgroundLayout';
import { IProps } from './interfaces/Props';
import { IState } from './interfaces/State';
import { getPlaylists, createPlaylist } from '../../redux/actions/playlistActions';
import Modal from 'react-native-modal';

import { Header } from '../../components/Header';
import { ListOfPlaylists } from './components/ListOfPlaylists';
import { ModalPlaylist } from '../../components/ModalPlaylist';
import { DocumentPickerResponse } from 'react-native-document-picker';

class PlaylistsScreen extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isModalVisible: false
        }
    }

    componentDidMount() {
        this.props.getPlaylists();
    }

    closeModal = () => this.setState({isModalVisible: false});

    _oncreate = () => {
        this.setState({isModalVisible: true});
    }

    createPlaylist = (image: DocumentPickerResponse | null, playlistName: string) => {
        this.props.createPlaylist(image, playlistName);
    }

    render() {
        return(
            <BackgroundLayout>
                <Header 
                    title="Listas de reproducción" 
                    navigation={this.props.navigation} 
                />

                <ListOfPlaylists 
                    navigation={this.props.navigation}
                    playlists={this.props.playlistReducer.playlists}
                    onCreate={this._oncreate}
                />

                <ModalPlaylist 
                    isVisible={this.state.isModalVisible}
                    onClose={this.closeModal}
                    onCreate={this.createPlaylist}
                />
            </BackgroundLayout>
        )
    }
}

const mapStateToProps = ({playlistReducer}: any) => {
    return {
        playlistReducer
    }
}

const mapDispatchToProps = {
    getPlaylists,
    createPlaylist
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistsScreen);
