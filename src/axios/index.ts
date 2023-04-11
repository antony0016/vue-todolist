import axios, {AxiosRequestConfig} from "axios";

const config = {
    baseURL: "https://todo.sekixu.dev/todo/"
} as AxiosRequestConfig

let baseAxios = axios.create(config)
baseAxios.defaults.headers.post['Content-Type'] = 'application/json'

let token = sessionStorage.getItem('token')
if (token) {
    baseAxios.defaults.headers['authentication'] = 'bearer ' + token
}

export default baseAxios