import React from "react"
import { useParams } from "react-router-dom"

export const withRouter = (Children) => {
  return(props) => {
    const match  = {params: useParams()};
    return <Children {...props}  match = {match}/>
  }
}
