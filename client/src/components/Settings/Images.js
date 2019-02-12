import React, {Component} from 'react';
import {uploadCoverImage, uploadProfileImage} from '../../actions'
import {connect} from 'react-redux'

class Images extends Component {
    constructor(props) {
        super(props);
        this.state = {
            me: props.me,
            selectedFile: '',
            isUploading: false,
            isUploadingCover: false,
            isUploadingProfile: false
        };
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    componentWillReceiveProps(props) {
        if (this.props.me !== props.me)
            this.setState({
                me: props.me,
                isDone: true,
                isUploadingCover: false,
                isUploadingProfile: false,
            })
    }

    static handleBrowseFile(e) {
        e.stopPropagation();
        document.getElementById(e.currentTarget.dataset.input).click();
    }

    handleFileChange(e) {
        this.handleImageUpload(e.target.id, e.target.files[0])
    }

    async handleImageUpload(id, file) {
        this.setState({status: '', isUploadingCover: id === 'cover', isUploadingProfile: id === 'profile'});
        const formData = new FormData();
        formData.append('file', file, file.name);
        if (id === 'cover')
            this.props.uploadCoverImage(formData);
        else
            this.props.uploadProfileImage(formData)
    }

    render() {
        return <div>

            <figure className={this.state.isUploadingCover ? 'CoverImage uploading' : 'CoverImage'}
                    data-input="cover"
                    onClick={Images.handleBrowseFile}>
                <span className="loader"><i className="fa fa-spinner fa-spin fa-3x"/></span>
                {this.state.me.cover && this.state.me.cover.normal &&
                <img src={this.state.me.cover.normal} alt={this.state.me.name}/>
                }
                <div className="image-input">
                    <input type="file" id="cover" name="image" onChange={this.handleFileChange}/>
                </div>
                <figure className={this.state.isUploadingProfile ? 'ProfileImage uploading' : 'ProfileImage'}
                        data-input="profile"
                        onClick={Images.handleBrowseFile}>
                    <span className="loader"><i className="fa fa-spinner fa-spin fa-3x"/></span>
                    {this.state.me.image && this.state.me.image.normal &&
                    <img src={this.state.me.image.normal} alt={this.state.me.name}/>
                    }
                    <div className="image-input">
                        <input type="file" id="profile" name="image" onChange={this.handleFileChange}/>
                    </div>
                </figure>
            </figure>
            <pre>{JSON.stringify(this.state.me, null, 2)}</pre>
        </div>
    }
}


const mapStateToProps = (state) => {
    return {me: state.auth.me}
};

const mapDispatchToProps = (dispatch) => {
    return {
        uploadCoverImage: (values) => {
            dispatch(uploadCoverImage(values));
        },
        uploadProfileImage: (values) => {
            dispatch(uploadProfileImage(values));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Images);
