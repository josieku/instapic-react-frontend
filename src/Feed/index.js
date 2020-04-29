import React, { Component } from "react";
import { Button, Card, CardBody, CardImg, CardSubtitle, FormInput } from "shards-react";
import { Redirect } from "react-router-dom";
import { SERVER_URL } from "../Constants/links";
import { Spinner } from "react-bootstrap"


import NavBar from "./components/NavBar";
import PostModal from "./components/PostModal";

import "./index.css";

/**
 * The Feed page that shows all the uploaded pics
 * 
 * Handles fetching posts from backend, including pagination
 * 
 * TO DOs:
 * - fix loading state
 * - sort and filter features
 * - deleting posts
 * - like and comment features
 */
export default class Feed extends Component {
    constructor(props){
        super(props);
        this.state = {
            "posts": [],
            "postModalOpen": false,
            "errorMessage": "",
            "loading": true,
            "page": 1,
            "pagesize": 3,
            "errorLog": ""
        };
    }

    async componentDidMount(){
        await this.fetchPosts();

        this.setState({
            loading: false,
        })

    }

    handleError = (err) => {
        console.log("err", err)
        this.setState({ 
            loading: false, 
            errorMessage: "There was an error.  Refresh.",
            errorLog: err
        });
        this.props.history.push("/login");
    }

    fetchPosts = async () => {
        await this.setState({
            loading: true
        })

        const auth = await localStorage.getItem("auth") || undefined
        if (!auth) {
            this.props.setUserLogin(false);
            this.props.history.push("/login");
        }

        const response = await fetch(SERVER_URL + `post/?pagesize=${this.state.pagesize}&page=${this.state.page}`, {
            method: "GET",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth
            }
        })
        .then((response)=>response.json())
        .catch((err)=>this.handleError(err))
        
        if (!response || (response.status === "fail" && !response.data)){
            this.props.setUserLogin(false);
            this.props.history.push("/login");
        } else if ( response.message && !response.data){
            this.setState({
                errorMessage: response.message + ". Refresh."
            });
            this.props.history.push("/login");
        } else {
            this.props.setUserLogin(true);
            this.setState({
                posts: response.data
            });
        }

        await this.setState({
            loading: false
        })
    }

    addNewPost = async (post) => {
        const posts = this.state.posts;
        posts.unshift(post);
        posts.pop();
        await this.setState({
            posts
        })
    }

    togglePostModal = (bool) => {
        this.setState({
            postModalOpen: bool || !this.state.postModalOpen
        })
    }

    previousPage = async () => {
        await this.setState({
            page: this.state.page-1
        });
        await this.fetchPosts();
    }

    nextPage = async () => {
        await this.setState({
            page: this.state.page+1
        });
        await this.fetchPosts();
    }

    mapPosts = () => {
        return this.state.posts.map((post, id)=>(
            <Post key={`post_${id}`} {...post}/>
        ))
    }

    render(){
        // if (this.state.loading) {
        //     return <Spinner animation="border" role="status"/>
        // }

        if (!this.props.loggedIn) {
            return <Redirect to="/login"/>
        }

        return(
            <div className="FeedContainer">
                <NavBar newPost={()=>this.togglePostModal(true)} history={this.props.history}/>
                <PostModal 
                    open={this.state.postModalOpen} 
                    toggle={this.togglePostModal} 
                    upload={this.addNewPost}/>
                {
                    this.state.errorMessage.length > 0
                        ? <Button outline theme="danger" id="error-button" disabled>Error: {this.state.errorMessage}</Button>
                        : null
                }
                <div className="posts-container">
                    {
                        this.state.loading
                            ? <Spinner animation="border" role="status"/>
                            : this.mapPosts()
                    }
                </div>
                <div className="page-controls">
                    {
                        this.state.page !== 1
                            ? <Button pill onClick={this.previousPage}>Prev</Button>
                            : <Button pill disabled>Prev</Button>
                    }
                    Page {this.state.page}
                    {
                        this.state.posts.length === this.state.pagesize
                            ? <Button pill onClick={this.nextPage}>Next</Button>
                            : <Button pill disabled>Next</Button>
                    }
                </div>
            </div>
        )
    }
}

class Post extends Component {
    render(){
        const { description, image, username, posted_on } = this.props;
        const date = new Date(posted_on)
        return(
            <Card>
                <CardImg top src={`data:image/png;base64,${image}`} />
                <CardBody>
                    <CardSubtitle>{description}</CardSubtitle>
                    <p>{username} on {date.toDateString()}</p>
                </CardBody>
            </Card>
        )
    }
}