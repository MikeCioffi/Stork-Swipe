import axios from "axios";
export default axios.create({
    baseURL: "https://0a56-54-82-84-176.ngrok.io/api",
    headers: {
        "Content-type": "application/json"
    }
});