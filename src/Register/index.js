import React, { Component } from "react";
import { Button, Card, CardBody, CardTitle, CardSubtitle, FormInput } from "shards-react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../Constants/links";

import "./index.css";

export default class RegisterForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            "loading": false,
            "username": "",
            "password": "",
            "errorMessage": ""
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

    onClickRegister = async () => {
        await this.setState({
            loading: true
        })

        await fetch(SERVER_URL + "user/", {
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
                this.props.register(true)
                this.props.history.push("/")
            }
        })
        .catch((error)=>{
            console.log("setting state")
            this.setState({ errorMessage: "Something's wrong.  Try again."})
        })

        await this.setState({
            loading: false
        })
    }

    renderCardBody = () => (
        <CardBody>
            <CardTitle>Register</CardTitle>
            <CardSubtitle className="subtitle">Contribute to a world of awesome pics!</CardSubtitle>
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
            <Button block disabled={this.disableButton()} onClick={this.onClickRegister}>
                Register
            </Button>
            <Link to="/login">
                <Button block outline theme="secondary">
                    Have an account?  Log in now!
                </Button>
            </Link>
        </CardBody>
    )

    render(){
        return(
            <div className="RegisterContainer">
                <Card className="register-modal">
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
