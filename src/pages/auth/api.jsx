import axios from 'axios';

const api = axios.create({
    // baseURL: "https://a4celebration.com/api/api/auth",
    baseURL: "http://2.25.73.204:3000/api/api/auth",
    // withCredentials: true,
});

export const googleAuth = (code) => api.get(`/google?code=${code}`, {
    headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpbmF5IiwiaWF0IjoxNzQ0OTY2MzI0fQ.bHVez4j2ksigzKlm7G3G7OlzrlkgAIwN6cPZySRvdCI"
    }
});