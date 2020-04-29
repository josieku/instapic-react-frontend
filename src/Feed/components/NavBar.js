import React, { Component } from "react";
import { Button, Navbar, NavbarBrand, Nav, NavItem, NavLink } from "shards-react";
import { SERVER_URL } from "../../Constants/links";

/***
 * The NavBar component in the Feed screen
 * 
 * Handles logout auth
 */
export default class NavBar extends Component {

    logout = async () => {
        const auth = await localStorage.getItem("auth") || undefined
        if (!auth) {
            this.props.history.push("/login");
        }

        fetch(SERVER_URL + "auth/logout", {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth
            }
        })
        .then((response)=>response.json())
        .then(async (data) => {
            if (data.status === "success" ){
                await localStorage.clear();
                this.props.history.push("/login")
            }
        })
        .catch((error)=>{
            console.log("error", error);
            this.props.history.push("/login")
        })
    }

    render(){
        return(
            <Navbar type="dark" theme="secondary" expand="md" style={{justifyContent: "space-between"}}>
                <NavbarBrand href="/">InstaPic by Josie</NavbarBrand>
                <Nav navbar>
                    <Button pill theme="light"onClick={this.props.newPost}>
                        New Post
                    </Button>
                    <NavItem>
                        <NavLink onClick={this.logout} style={{cursor: "pointer"}} >
                            Log Out
                        </NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
        )
    }
}
