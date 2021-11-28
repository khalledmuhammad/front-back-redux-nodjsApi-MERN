import cookie from "react-cookies"

export const getTokenCookie = ()=>  cookie.load("x-access-token")
export const RemoveCookie = () => cookie.remove("x-access-token")

export const getAuthedToken = {headers : {"x-access-token" : getTokenCookie()}}
