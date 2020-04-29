import React, { Component } from "react";
import { Button, Card, CardBody, CardTitle, CardSubtitle, FormInput } from "shards-react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../Constants/links";

import "./index.css";

/**
 * Login Page
 * 
 * Handles login functions and stores auth token in localStorage
 * 
 * TO DO:
 * - save auth token in cookies/something more secure
 * - redirects based on token validity/expiry
 */
export default class LoginForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            "loading": false,
            "username": "",
            "password": "",
            "errorMessage": "",
        };
    }

    onChangeUsername = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    onChangePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    disableButton = () => {
        return this.state.username.length === 0 && this.state.password.length === 0
    }

    onClickLogIn = async () => {
        await this.setState({
            loading: true,
        })

        await fetch(SERVER_URL + "auth/login", {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })
        .then((response)=>response.json())
        .then(async (data) => {
            if (data.status === "fail") {
                await this.setState({ errorMessage: data.message })
            } else {
                await localStorage.setItem("auth", data.Authorization);
                this.props.logIn(true)
                this.props.history.push("/")
            }
        })
        .catch((error)=>{
            console.log("error", error);
            this.setState({
                errorMessage: "Something's wrong.  Try again."
            })
        });

        await this.setState({
            loading: false,
        })
    }

    renderCardBody = () => (
        <CardBody>
            <CardTitle>Login now!</CardTitle>
            <CardSubtitle className="subtitle">Lots of cool pics await inside...</CardSubtitle>
            <FormInput 
                placeholder="Username" 
                className="shard-input" 
                value={this.state.username}
                onChange={this.onChangeUsername}/>
            <FormInput 
                placeholder="Password" 
                className="shard-input" 
                type="password" 
                value={this.state.password}
                onChange={this.onChangePassword}/>
            {
                this.state.errorMessage.length > 0
                    ? <p id="error">{this.state.errorMessage}</p>
                    : null
            }
            <Button block disabled={this.disableButton()} onClick={this.onClickLogIn}>
                Log In
            </Button>
            <Link to="/register">
                <Button block outline theme="secondary">
                    No account?  Sign up now!
                </Button>
            </Link>
        </CardBody>
    )

    render(){
        console.log("login loading", this.state.loading);
        return(
            <div className="LoginContainer">
                <Card className="login-modal">
                    {
                        this.state.loading
                            ? <Spinner animation="border" role="status"/>
                            : this.renderCardBody()
                    }
                </Card>
            </div>
        )
    }
}
