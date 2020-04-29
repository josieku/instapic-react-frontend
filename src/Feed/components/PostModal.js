import React, { Component } from "react";
import { Button, FormInput, Modal, ModalHeader } from "shards-react";
import Files from "react-butterfiles";
import { Spinner } from "react-bootstrap"
import { SERVER_URL } from "../../Constants/links";

import "./PostModal.css";

/**
 * The Modal component for uploading new posts
 * 
 * Handles file upload new post request
 * 
 * TO DOs:
 * - improve image storage in backend and increase upload size
 * - compress images before sending to backend
 */
export default class PostModal extends Component {
    state = {
        pictures: [],
        errors: [],
        caption: "",
        loading: false,
    }

    uploadImage = (pictures) => {
        this.setState({
            pictures,
            errors: [] // reset errors when an image successfully uploads
        })
    }

    removeImage = () => {
        this.setState({
            pictures: [],
            errors: []
        })
    }

    onChangeCaption = (e) => {
        this.setState({
            caption: e.target.value
        })
    }

    postImage = async () => {
        const auth = await localStorage.getItem("auth") || undefined
        if (!auth) {
            this.setState({
                errors: [ "There is an error.  Please refresh "]
            })
        }
        
        await this.setState({
            loading: true
        });

        const response = await fetch(SERVER_URL + "post/", {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth
            },
            body: JSON.stringify({
                image: this.state.pictures[0].src.base64.split(",")[1],
                description: this.state.caption
            })
        })
        .catch((error)=>console.log("error", error))

        // console.log("response", response);

        if (response.status === 200){
            this.setState({ // clear state
                pictures: [],
                errors: [],
                caption: "",
                loading: false
            });
            const post = await response.json();
            this.props.upload(post);
            this.props.toggle(false);
        } else {
            this.setState({
                errors: [ "There was an error.  Try again later..." ],
                loading: false,
            })
        }
    }

    renderModalBody = () => (
        <div id="modal-body">
            {
                this.state.pictures.length > 0
                    ? (
                        <div id="preview-container">
                            <img id="preview" src={this.state.pictures[0].src.base64}/>
                            <Button outline pill theme="danger" onClick={this.removeImage}>
                                Remove
                            </Button>
                            <div id="description-container">
                                <p>Post caption:</p>
                                <FormInput 
                                    placeholder="eg. 'What a beautiful sight!'" 
                                    maxLength={200} 
                                    value={this.state.caption}
                                    onChange={this.onChangeCaption}/>
                            </div>
                            <Button theme="info" id="post-button" onClick={this.postImage}>Post</Button>
                        </div>
                    )
                    : (
                        <Files
                            maxSize="500kb"
                            convertToBase64
                            accept={["image/png","image/jpg","image/jpeg"]}
                            onSuccess={this.uploadImage}
                            onError={errors => this.setState({ errors: this.state.errors.concat(errors[0].type) })}
                        >
                            {({ browseFiles}) => (
                                <div id="file-upload">
                                    <Button id="image-select" outline pill onClick={browseFiles}>
                                        Upload Image
                                    </Button>
                                </div>
                            )}
                        </Files>
                    )
            }
            {
                this.state.errors.map((error)=>(
                    <p id="error">{error}</p>
                ))
            }
        </div>
    )

    render(){
        return(
            <Modal open={this.props.open} toggle={this.props.toggle} id="post-modal">
                <ModalHeader>New Post</ModalHeader>
                {
                    this.state.loading
                        ? <Spinner animation="border" role="status"/>
                        : this.renderModalBody()
                }
            </Modal>
        )
    }
}
