import axios from 'axios'
export default function getUsers(){
    return(
        axios.create({
            baseURL: 'https://motherdb1.vercel.app/api/users/',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
    )
}

export function getWatchers(){
    return(
        axios.create({
            baseURL: "https://motherdb1.vercel.app/api/registerwatchers/",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
    )
}

export function getMakeRequest(){
    return(
        axios.create({
            baseURL: "https://motherdb1.vercel.app/api/makerequests/",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
    )
}

export function getSupport(){
    return(
        axios.create({
            baseURL: "https://motherdb1.vercel.app/api/supports/",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
    )
}

export function getChats(){
    return(
        axios.create({
            baseURL: "https://motherdb1.vercel.app/api/chats/",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
    )
}

export function getCards(){
    return(
        axios.create({
            baseURL: "https://motherdb1.vercel.app/api/cards/",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
    )
}

export function getNotifications(){
    return(
        axios.create({
            baseURL: "https://motherdb1.vercel.app/api/notifications/",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
    )
}

export function getPayments(){
    return(
        axios.create({
            baseURL: "https://motherdb1.vercel.app/api/payments/",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
    )
}


//export const STRIPE_SECRET_KEY = 'sk_test_REMOVED'; // Replace with your actual secret key

export const STRIPE_SECRET_KEY  = 'sk_test_REMOVED';
